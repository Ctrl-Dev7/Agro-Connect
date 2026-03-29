import { NextResponse } from 'next/server';

const intents = [
  { pattern: /mandi|price|rate|भाव|दर|कीमत|किंमत|बाज़ार|बाजार|मंडी|दाम/i, handler: 'get_mandi_price' },
  { pattern: /weather|rain|humidity|temperature|पाऊस|हवामान|बारिश|मौसम|तापमान|सिंचाई|irrigation/i, handler: 'get_weather' },
  { pattern: /scheme|subsidy|योजना|अनुदान|सरकारी|किसान|pm.?kisan|pmfby|kcc/i, handler: 'get_schemes' },
  { pattern: /disease|pest|रोग|कीड|बीमारी|पीक|rot|blight|wilt/i, handler: 'get_disease_info' },
  { pattern: /task|remind|irrigation|सिंचन|fertilizer|खाद|उर्वरक|spray/i, handler: 'get_tasks' },
  { pattern: /sell|marketplace|listing|बेचना|विक्री|बाजारपेठ|produce/i, handler: 'get_marketplace' },
  { pattern: /crop|tracker|फसल|पीक|lifecycle|grow/i, handler: 'get_crop_info' },
];

// Multilingual responses
const responses: Record<string, Record<string, { text: string; data: any }>> = {
  get_mandi_price: {
    en: {
      text: "Pune mandi's onion rate is currently averaging 2257 rupees per quintal, which is stable since yesterday. Wheat is at 2282 rupees per quintal with a rising trend.",
      data: { crop: 'Onion', price: 2257, location: 'Pune Mandi', trend: 'stable' },
    },
    hi: {
      text: "पुणे मंडी में प्याज का भाव लगभग 2257 रुपये प्रति क्विंटल है, जो कल से स्थिर है। गेहूं का भाव 2282 रुपये प्रति क्विंटल है और बढ़ रहा है।",
      data: { crop: 'Onion', price: 2257, location: 'Pune Mandi', trend: 'stable' },
    },
    mr: {
      text: "पुणे मार्केटमध्ये आज कांद्याचा दर अंदाजे 2257 रुपये प्रति क्विंटल आहे, जो काल सारखाच स्थिर आहे. गहू 2282 रुपये प्रति क्विंटल आहे.",
      data: { crop: 'Onion', price: 2257, location: 'Pune Mandi', trend: 'stable' },
    },
  },
  get_weather: {
    en: {
      text: "Today's temperature is around 32 degrees. No rain is expected. Humidity is at 34 percent. Wind speed is 8 kilometers per hour. Conditions are suitable for field work.",
      data: { temp: 32, rain_chance: 0, humidity: 34 },
    },
    hi: {
      text: "आज का तापमान लगभग 32 डिग्री है। बारिश की संभावना नहीं है। नमी 34 प्रतिशत है। हवा की गति 8 किलोमीटर प्रति घंटा है। खेत में काम के लिए मौसम अच्छा है।",
      data: { temp: 32, rain_chance: 0, humidity: 34 },
    },
    mr: {
      text: "आज तापमान सुमारे 32 अंश आहे. पावसाची शक्यता नाही. आर्द्रता 34 टक्के आहे. वारा 8 किमी प्रति तास आहे. शेतात काम करण्यासाठी हवामान योग्य आहे.",
      data: { temp: 32, rain_chance: 0, humidity: 34 },
    },
  },
  get_schemes: {
    en: {
      text: "You may be eligible for PM-Kisan Samman Nidhi which provides 6000 rupees per year, and the Kisan Credit Card for low-interest farm loans. Visit the Government Schemes page for details.",
      data: { scheme: 'PM-Kisan', status: 'Eligible' },
    },
    hi: {
      text: "आप पीएम-किसान सम्मान निधि के लिए पात्र हो सकते हैं जो प्रति वर्ष 6000 रुपये देता है, और किसान क्रेडिट कार्ड कम ब्याज पर कृषि ऋण देता है। विवरण के लिए सरकारी योजनाएं पेज देखें।",
      data: { scheme: 'PM-Kisan', status: 'Eligible' },
    },
    mr: {
      text: "तुम्ही पीएम-किसान सन्मान निधीसाठी पात्र असू शकता ज्यामध्ये दरवर्षी 6000 रुपये मिळतात. किसान क्रेडिट कार्ड कमी व्याजावर शेती कर्ज देते. अधिक माहितीसाठी सरकारी योजना पेज पहा.",
      data: { scheme: 'PM-Kisan', status: 'Eligible' },
    },
  },
  get_disease_info: {
    en: {
      text: "Please use the Disease Scanner tool from your Quick Actions to upload a photo of the affected leaf or crop. The AI will identify the issue and suggest treatment.",
      data: { action: 'NAVIGATE_SCANNER' },
    },
    hi: {
      text: "कृपया Quick Actions से रोग स्कैनर टूल का उपयोग करें और प्रभावित पत्ती या फसल की तस्वीर अपलोड करें। AI समस्या पहचानेगा और उपचार सुझाव देगा।",
      data: { action: 'NAVIGATE_SCANNER' },
    },
    mr: {
      text: "कृपया Quick Actions मधील रोग स्कॅनर टूल वापरा आणि प्रभावित पानावर किंवा पिकाचा फोटो अपलोड करा. AI समस्या ओळखेल आणि उपचार सुचवेल.",
      data: { action: 'NAVIGATE_SCANNER' },
    },
  },
  get_tasks: {
    en: {
      text: "You have 2 tasks scheduled for today. First, applying fertilizer to the wheat plot. Second, irrigating the onion patch. Check your Crop Tracker for details.",
      data: { task_count: 2 },
    },
    hi: {
      text: "आज आपके 2 कार्य निर्धारित हैं। पहला, गेहूं के खेत में खाद डालना। दूसरा, प्याज की क्यारी में सिंचाई करना। विवरण के लिए फसल ट्रैकर देखें।",
      data: { task_count: 2 },
    },
    mr: {
      text: "आज तुमची 2 कामे नियोजित आहेत. पहिले, गव्हाच्या प्लॉटमध्ये खत घालणे. दुसरे, कांद्याच्या वाफ्याला पाणी देणे. तपशीलांसाठी पीक ट्रॅकर पहा.",
      data: { task_count: 2 },
    },
  },
  get_marketplace: {
    en: {
      text: "You can sell your produce on the Marketplace page. Click 'Sell Your Produce' to create a new listing with crop type, quantity, and your asking price.",
      data: { action: 'NAVIGATE_MARKETPLACE' },
    },
    hi: {
      text: "आप Marketplace पेज पर अपनी उपज बेच सकते हैं। 'Sell Your Produce' पर क्लिक करें और फसल प्रकार, मात्रा और कीमत दर्ज करें।",
      data: { action: 'NAVIGATE_MARKETPLACE' },
    },
    mr: {
      text: "तुम्ही Marketplace पेजवर तुमचे उत्पादन विकू शकता. 'Sell Your Produce' वर क्लिक करा आणि पिकाचा प्रकार, प्रमाण आणि किंमत भरा.",
      data: { action: 'NAVIGATE_MARKETPLACE' },
    },
  },
  get_crop_info: {
    en: {
      text: "Your Crop Tracker shows your active crops and their lifecycle stages. Visit the Crop Tracker page to add new crops or check progress.",
      data: { action: 'NAVIGATE_FARM' },
    },
    hi: {
      text: "आपका फसल ट्रैकर सक्रिय फसलों और उनकी जीवन चक्र अवस्था दिखाता है। नई फसल जोड़ने या प्रगति देखने के लिए फसल ट्रैकर पेज पर जाएं।",
      data: { action: 'NAVIGATE_FARM' },
    },
    mr: {
      text: "तुमचा पीक ट्रॅकर सक्रिय पिके आणि त्यांचे जीवनचक्र टप्पे दर्शवतो. नवीन पिके जोडण्यासाठी किंवा प्रगती पाहण्यासाठी पीक ट्रॅकर पेजवर जा.",
      data: { action: 'NAVIGATE_FARM' },
    },
  },
  unknown: {
    en: {
      text: "I didn't quite understand that. You can ask me about weather, market prices, government schemes, crop diseases, or your farm tasks.",
      data: { recognized: false },
    },
    hi: {
      text: "मुझे समझ नहीं आया। आप मुझसे मौसम, मंडी के भाव, सरकारी योजनाएं, फसल के रोग, या खेती के कार्यों के बारे में पूछ सकते हैं।",
      data: { recognized: false },
    },
    mr: {
      text: "मला समजले नाही. तुम्ही मला हवामान, बाजारभाव, सरकारी योजना, पिकांचे रोग, किंवा शेतीच्या कामांबद्दल विचारू शकता.",
      data: { recognized: false },
    },
  },
};

function getLangKey(language_code: string | undefined): 'en' | 'hi' | 'mr' {
  if (!language_code) return 'en';
  if (language_code.includes('hi')) return 'hi';
  if (language_code.includes('mr')) return 'mr';
  return 'en';
}

export async function POST(request: Request) {
  try {
    const { transcript, language_code } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Missing transcript' }, { status: 400 });
    }

    const lowerTranscript = transcript.toLowerCase();
    const lang = getLangKey(language_code);

    // Resolve Intent via Regex
    let resolvedIntent = 'unknown';
    for (const intent of intents) {
      if (intent.pattern.test(lowerTranscript)) {
        resolvedIntent = intent.handler;
        break;
      }
    }

    const resp = responses[resolvedIntent]?.[lang] || responses['unknown'][lang];

    return NextResponse.json({
      intent: resolvedIntent,
      transcript: transcript,
      text_response: resp.text,
      data: resp.data,
    }, { status: 200 });

  } catch (error) {
    console.error('Voice Assistant Query Error:', error);
    return NextResponse.json({
      intent: 'error',
      text_response: 'There was a problem processing your voice request. Please try again.',
    }, { status: 500 });
  }
}
