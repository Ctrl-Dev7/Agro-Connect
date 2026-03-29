import { NextResponse } from 'next/server';

const intents = [
  { pattern: /mandi|price|rate|भाव|दर/i, handler: 'get_mandi_price' },
  { pattern: /weather|rain|humidity|पाऊस|हवामान/i, handler: 'get_weather' },
  { pattern: /scheme|subsidy|योजना|अनुदान/i, handler: 'get_schemes' },
  { pattern: /disease|pest|रोग|कीड/i, handler: 'get_disease_info' },
  { pattern: /task|remind|irrigation|सिंचन/i, handler: 'get_tasks' },
];

export async function POST(request: Request) {
  try {
    const { transcript, language_code } = await request.json();
    
    if (!transcript) {
      return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
    }

    const lowerTranscript = transcript.toLowerCase();
    
    // 1. Resolve Intent via Regex Rules
    let resolvedIntent = 'unknown';
    
    for (const intent of intents) {
      if (intent.pattern.test(lowerTranscript)) {
        resolvedIntent = intent.handler;
        break;
      }
    }

    // 2. Mock Responses based on Intent matching (MVP phase)
    let textResponse = '';
    let dataPayload: any = null;

    if (resolvedIntent === 'get_mandi_price') {
      textResponse = "Pune mandi's onion rate is currently averaging 2257 rupees per quintal, which is stable since yesterday.";
      dataPayload = { crop: 'Onion', price: 2257, location: 'Pune Mandi', trend: 'stable' };
    } 
    else if (resolvedIntent === 'get_weather') {
      textResponse = "No rain is expected today. However, there is a moderate risk of frost tonight for your banana crops.";
      dataPayload = { temp: 31, rain_chance: 0, alert: "Frost risk tonight" };
    } 
    else if (resolvedIntent === 'get_schemes') {
      textResponse = "You are currently eligible for the PM-Kisan Samman Nidhi scheme. I have placed a link to apply in your dashboard.";
      dataPayload = { scheme: "PM-Kisan", status: "Eligible" };
    }
    else if (resolvedIntent === 'get_disease_info') {
      textResponse = "Please use the disease scanner tool in your Quick Actions to upload a photo of the affected leaf.";
      dataPayload = { action: "NAVIGATE_SCANNER" };
    }
    else if (resolvedIntent === 'get_tasks') {
      textResponse = "You have 2 tasks scheduled for today. First, applying fertilizer to the wheat plot. Second, irrigating the onion patch.";
      dataPayload = { task_count: 2 };
    }
    else {
      textResponse = "I'm sorry, I didn't quite catch that. Could you repeat it with a mention of weather, market prices, or schemes?";
      dataPayload = { recognized: false };
    }

    // If request passed language_code as Marathi (mr-IN), return Marathi mock fallback for purely demonstration context.
    if (language_code && language_code.includes('mr')) {
      if (resolvedIntent === 'get_mandi_price') {
        textResponse = "पुणे मार्केटमध्ये आज कांद्याचा दर अंदाजे 2257 रुपये प्रति क्विंटल आहे.";
      } else if (resolvedIntent === 'get_weather') {
        textResponse = "आज पावसाची शक्यता नाही, हवामान कोरडे राहील.";
      } else {
        textResponse = "क्षमस्व, मला समजले नाही. कृपया हवामान किंवा दर विचारून पुन्हा प्रयत्न करा.";
      }
    }

    return NextResponse.json({
      intent: resolvedIntent,
      transcript: transcript,
      text_response: textResponse,
      data: dataPayload
    }, { status: 200 });

  } catch (error) {
    console.error('Voice Assistant Query Error:', error);
    return NextResponse.json({ 
      intent: "error", 
      text_response: "There was a problem processing your voice request. Please try again." 
    }, { status: 500 });
  }
}
