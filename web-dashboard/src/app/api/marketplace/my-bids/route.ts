import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Unauthenticated — return empty
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch this user's ACTIVE listings with crop name
    const { data: listings, error } = await supabase
      .from('m_listings')
      .select('listing_id, item_type, crop_id, equipment_details, quantity, unit_of_measure, listed_price, listing_status, created_at, c_crops(crop_name_en)')
      .eq('seller_user_id', user.id)
      .eq('listing_status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.warn('DB Fetch failed for active listings:', error);
      return NextResponse.json([], { status: 200 });
    }

    // Format for the dashboard panel
    const formatted = (listings || []).map((l: any) => {
      const cropName = l.c_crops?.crop_name_en || l.equipment_details || 'Farm Produce';
      const now = new Date();
      const created = new Date(l.created_at);
      const diffHrs = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
      const timeStr = diffHrs < 1 ? 'Just now' : diffHrs < 24 ? String(diffHrs) + ' hours ago' : String(Math.floor(diffHrs / 24)) + ' days ago';

      return {
        listing_id: l.listing_id,
        crop_name: cropName,
        quantity: l.quantity,
        unit: l.unit_of_measure,
        listed_price: l.listed_price,
        item_type: l.item_type,
        status: l.listing_status,
        time_ago: timeStr,
      };
    });

    return NextResponse.json(formatted, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch active listings:', error);
    return NextResponse.json([], { status: 200 });
  }
}
