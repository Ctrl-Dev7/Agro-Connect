import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Define the shape of our signals response
export interface AISignal {
  crop_id: number;
  crop_name: string;
  signal_type: 'SELL' | 'HOLD';
  change_pct: number;
  confidence_score: number;
  current_price: number;
  future_price: number;
  mandi_name: string;
}

export async function GET(request: Request) {
  try {
    // 1. We will default to Pune APMC (or Delhi) and a subset of major crops for this version
    // In a fully authenticated session, we'd query the user's specific location & crops.
    const defaultMandiId = 47; // Default to Delhi APMC for now
    const targetCropIds = [1, 2, 7, 8]; // Wheat, Maize/Rice, Onion, Tomato

    // Get Mandi Info
    const { data: mandi } = await supabase
      .from('c_mandis')
      .select('mandi_name')
      .eq('mandi_id', defaultMandiId)
      .single();

    const mandiName = mandi?.mandi_name || 'Nearest Market';

    const signals: AISignal[] = [];

    // Process each crop
    for (const cropId of targetCropIds) {
      // Find the latest prediction_date for this crop/mandi combination
      const { data: latestDateData } = await supabase
        .from('p_prediction_outputs')
        .select('prediction_date')
        .eq('crop_id', cropId)
        .eq('mandi_id', defaultMandiId)
        .order('prediction_date', { ascending: false })
        .limit(1)
        .single();
        
      if (!latestDateData) continue;
      
      const latestDate = latestDateData.prediction_date;

      // Get predictions for day 1 (current/immediate) and day 7 (forecast) for this batch
      const { data: predictions } = await supabase
        .from('p_prediction_outputs')
        .select(`
          forecast_day_index,
          predicted_price,
          confidence_lower,
          confidence_upper,
          c_crops(crop_name_en)
        `)
        .eq('crop_id', cropId)
        .eq('mandi_id', defaultMandiId)
        .eq('prediction_date', latestDate)
        .in('forecast_day_index', [1, 7])
        .order('forecast_day_index', { ascending: true });

      if (!predictions || predictions.length < 2) continue;

      const day1 = predictions.find(p => p.forecast_day_index === 1);
      const day7 = predictions.find(p => p.forecast_day_index === 7);

      if (!day1 || !day7) continue;

      const currentPrice = Number(day1.predicted_price);
      const futurePrice = Number(day7.predicted_price);
      const diff = futurePrice - currentPrice;
      const changePct = currentPrice > 0 ? (diff / currentPrice) * 100 : 0;

      // Logic: If prices are dropping by more than 1%, SELL now to avoid loss. 
      // If rising or stable, HOLD for better profits.
      const signalType = changePct <= -0.5 ? 'SELL' : 'HOLD';

      // Confidence Score Calculation:
      // The wider the confidence interval relative to the price, the lower the score.
      const lower = Number(day7.confidence_lower);
      const upper = Number(day7.confidence_upper);
      const margin = upper - lower;
      
      // Basic math: 1 - (margin / price). Cap it between 60% and 99%
      let rawConfidence = (1 - (margin / futurePrice)) * 100;
      
      // Adjust formula to yield more realistic 80-98% range instead of flat 95%
      // A tighter margin means higher confidence.
      rawConfidence = Math.max(60, Math.min(99, rawConfidence));

      // Cast relations properly
      const cropRef = day1.c_crops as any;
      const cropName = cropRef?.crop_name_en || 'Unknown Crop';

      signals.push({
        crop_id: cropId,
        crop_name: cropName,
        signal_type: signalType,
        change_pct: Math.round(Math.abs(changePct) * 10) / 10,
        confidence_score: Math.round(rawConfidence),
        current_price: Math.round(currentPrice),
        future_price: Math.round(futurePrice),
        mandi_name: mandiName
      });
    }

    // Cache the response since predictions only update daily
    return NextResponse.json(signals, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    console.error('Failed to fetch prediction signals:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
