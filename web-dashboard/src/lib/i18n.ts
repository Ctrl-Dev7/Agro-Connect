import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // ─── Greetings ───
      goodMorning: "Good Morning",
      goodAfternoon: "Good Afternoon",
      goodEvening: "Good Evening",
      dashboardSubtitle: "Here's what's happening with your farm today",

      // ─── Dashboard Section Headers ───
      immediateActions: "⚡ Immediate Actions",
      aiRecommendations: "AI Recommendations",
      farmAndInventory: "🌱 Farm & Inventory",
      quickActions: "Quick Actions",

      // ─── Farm Summary Strip ───
      cropsActive: "crops active",
      cropActive: "crop active",
      alerts: "alerts",
      alert: "alert",
      tasksDueToday: "tasks due today",
      taskDueToday: "task due today",
      marketplaceBids: "marketplace bids",
      marketplaceBid: "marketplace bid",

      // ─── Weather Alert Card ───
      hyperLocalWeather: "Hyper-Local Weather",
      details: "Details",
      loadingWeather: "Loading weather...",
      rain: "Rain",
      wind: "Wind",
      humidity: "Humidity",

      // ─── Priority Actions Card ───
      priorityActions: "Priority Actions",
      noPriorityActions: "All caught up! No urgent actions.",

      // ─── AI Recommendations (SellHoldIndicator) ───
      viewDetailedGraphs: "Detailed Graphs",
      confidence: "Confidence",
      sellDesc: "Prices are peaking at ₹{{price}}/qtl. Expected to drop by {{pct}}% over the next 7 days in {{mandi}}.",
      holdDesc: "Currently ₹{{price}}/qtl. Expected to rise by {{pct}}% to ₹{{future}}/qtl over the next week.",
      listOnMarketplace: "List on Marketplace",
      viewPredictionGraph: "View Prediction Graph",

      // ─── Crop Lifecycle Tracker ───
      cropLifecycleTracker: "Crop Lifecycle Tracker",
      manage: "Manage",
      noActiveCrops: "No Active Crops",
      noActiveCropsDesc: "Add your first crop to track its lifecycle and receive timely recommendations.",
      addCrop: "+ Add Crop",
      day: "Day",
      daysTotal: "Days Total",

      // ─── Active Listings Panel ───
      myActiveListings: "My Active Listings",
      active: "Active",
      noActiveListings: "No Active Listings",
      noActiveListingsDesc: "Start selling your produce on the marketplace!",
      sellYourProduce: "Sell Your Produce",
      per: "per",
      viewAllMarketplace: "View all marketplace listings",

      // ─── Quick Actions Row ───
      qaCrop: "+ Crop",
      qaMarket: "Market",
      qaScheme: "Scheme",
      qaDisease: "Disease",
      qaWeather: "Weather",
      qaExpert: "Expert",

      // ─── Weather Page ───
      weatherPageTitle: "Today's Weather Intelligence",
      currentTemp: "Current Temperature",
      soilMoisture: "Soil Moisture",
      tempMin: "Min Temperature",
      precipitation24h: "24h Precipitation",
      hourlyForecast: "24-Hour Temperature Forecast",
      viewDetailedHourly: "View Detailed Hourly Data",
      time: "Time",
      tempC: "Temp (°C)",
      humidityPct: "Humidity (%)",
      rainMm: "Rain (mm)",
      normal: "Normal",
      hotAbove35: "Hot (>35°C)",
      coolBelow15: "Cool (<15°C)",
      rainDetected: "Rain detected",
      cropSpecificWarnings: "Crop-Specific Warnings",

      // ─── Government Schemes Page ───
      govtSchemesTitle: "Government Schemes for Farmers",
      govtSchemesSubtitle: "Explore central and state government schemes to maximize your benefits.",
      eligibility: "Eligibility",
      benefit: "Benefit",
      visitPortal: "Visit Official Portal",

      // ─── Marketplace Page ───
      marketplace: "Marketplace",
      browseListings: "Browse Active Listings",
      myListings: "My Listings",
      publishListing: "Publish Listing",
      cropType: "Crop",
      equipmentType: "Equipment",
      quantity: "Quantity",
      pricePerUnit: "Price per Unit",
      selectCrop: "Select crop",
      equipmentDescription: "Equipment description",
      publishing: "Publishing...",
      publish: "Publish",
      soldOut: "Sold Out",
      markAsSold: "Mark Sold",

      // ─── Sidebar & Layout ───
      dashboard: "Dashboard",
      cropTracker: "Crop Tracker",
      priceForecasts: "Price Forecasts",
      weather: "Weather",
      govtSchemes: "Govt Schemes",
      diseaseScanner: "Disease Scanner",
      farmingTips: "Farming Tips",
      logout: "Logout",
      main: "Main",
      settings: "Settings",

      // ─── Voice Assistant ───
      listening: "Listening...",
      noSpeechDetected: "No speech detected. Please try again.",
      couldNotHear: "Could not hear you. Please try again.",
      talkToAssistant: "🗣️ Talk to Farm Assistant",

      // ─── Common ───
      loading: "Loading...",
      perQtl: "/qtl",

      // ─── Legacy keys ───
      dashboardTitle: "Agro-Connect Dashboard",
      smartFarming: "Smart Farming Platform",
      marketOverview: "Market Overview",
      totalMandis: "Total Regulated Mandis",
      activeMarkets: "Active Markets Nationwide",
      recentAdvisories: "Recent Advisories",
      priceHistoryWheat: "Price History (Wheat - Delhi)",
      latestPrices: "Latest Crop Prices",
      viewAll: "View All",
      fromLast: "from last recorded",
      changeLang: "हिंदी में बदलें",
      cropsTracked: "Crops Tracked",
      activePredictions: "Active predictions",
      wheatAvg: "Wheat (Avg)",
      marketsListed: "Markets Listed",
      acrossIndia: "Across India",
      activeAdvisories: "Active Advisories",
      updatedToday: "Updated today",
      urgency: {
        CRITICAL: "Critical",
        HIGH: "High",
        MEDIUM: "Medium",
        LOW: "Low"
      }
    }
  },
  hi: {
    translation: {
      // ─── Greetings ───
      goodMorning: "सुप्रभात",
      goodAfternoon: "नमस्कार",
      goodEvening: "शुभ संध्या",
      dashboardSubtitle: "आज आपकी खेती से जुड़ी अपडेट",

      // ─── Dashboard Section Headers ───
      immediateActions: "⚡ तत्काल कार्य",
      aiRecommendations: "AI सुझाव",
      farmAndInventory: "🌱 खेत और सूची",
      quickActions: "त्वरित कार्य",

      // ─── Farm Summary Strip ───
      cropsActive: "फसलें सक्रिय",
      cropActive: "फसल सक्रिय",
      alerts: "अलर्ट",
      alert: "अलर्ट",
      tasksDueToday: "आज के कार्य",
      taskDueToday: "आज का कार्य",
      marketplaceBids: "बाज़ार बोलियां",
      marketplaceBid: "बाज़ार बोली",

      // ─── Weather Alert Card ───
      hyperLocalWeather: "स्थानीय मौसम",
      details: "विवरण",
      loadingWeather: "मौसम लोड हो रहा है...",
      rain: "बारिश",
      wind: "हवा",
      humidity: "नमी",

      // ─── Priority Actions Card ───
      priorityActions: "प्राथमिक कार्य",
      noPriorityActions: "सब ठीक है! कोई तत्काल कार्य नहीं।",

      // ─── AI Recommendations ───
      viewDetailedGraphs: "विस्तृत ग्राफ",
      confidence: "विश्वास",
      sellDesc: "₹{{price}}/क्विंटल पर दाम चरम पर हैं। {{mandi}} में अगले 7 दिनों में {{pct}}% गिरावट की संभावना।",
      holdDesc: "वर्तमान में ₹{{price}}/क्विंटल। अगले हफ्ते ₹{{future}}/क्विंटल तक {{pct}}% बढ़ने की संभावना।",
      listOnMarketplace: "बाज़ार में सूचीबद्ध करें",
      viewPredictionGraph: "पूर्वानुमान ग्राफ देखें",

      // ─── Crop Lifecycle Tracker ───
      cropLifecycleTracker: "फसल जीवनचक्र ट्रैकर",
      manage: "प्रबंधित करें",
      noActiveCrops: "कोई सक्रिय फसल नहीं",
      noActiveCropsDesc: "जीवनचक्र ट्रैक करने और समय पर सुझाव पाने के लिए पहली फसल जोड़ें।",
      addCrop: "+ फसल जोड़ें",
      day: "दिन",
      daysTotal: "कुल दिन",

      // ─── Active Listings Panel ───
      myActiveListings: "मेरी सक्रिय सूचियां",
      active: "सक्रिय",
      noActiveListings: "कोई सक्रिय सूची नहीं",
      noActiveListingsDesc: "बाज़ार में अपनी उपज बेचना शुरू करें!",
      sellYourProduce: "अपनी उपज बेचें",
      per: "प्रति",
      viewAllMarketplace: "सभी बाज़ार सूची देखें",

      // ─── Quick Actions Row ───
      qaCrop: "+ फसल",
      qaMarket: "बाज़ार",
      qaScheme: "योजना",
      qaDisease: "रोग",
      qaWeather: "मौसम",
      qaExpert: "विशेषज्ञ",

      // ─── Weather Page ───
      weatherPageTitle: "आज की मौसम जानकारी",
      currentTemp: "वर्तमान तापमान",
      soilMoisture: "मिट्टी की नमी",
      tempMin: "न्यूनतम तापमान",
      precipitation24h: "24 घंटे वर्षा",
      hourlyForecast: "24 घंटे तापमान पूर्वानुमान",
      viewDetailedHourly: "विस्तृत प्रति घंटा डेटा देखें",
      time: "समय",
      tempC: "तापमान (°C)",
      humidityPct: "नमी (%)",
      rainMm: "बारिश (मिमी)",
      normal: "सामान्य",
      hotAbove35: "गर्म (>35°C)",
      coolBelow15: "ठंडा (<15°C)",
      rainDetected: "बारिश का पता चला",
      cropSpecificWarnings: "फसल संबंधी चेतावनियां",

      // ─── Government Schemes Page ───
      govtSchemesTitle: "किसानों के लिए सरकारी योजनाएं",
      govtSchemesSubtitle: "अपने लाभ अधिक करने के लिए केंद्र और राज्य सरकार की योजनाएं जानें।",
      eligibility: "पात्रता",
      benefit: "लाभ",
      visitPortal: "आधिकारिक पोर्टल पर जाएं",

      // ─── Marketplace Page ───
      marketplace: "बाज़ार",
      browseListings: "सक्रिय सूचियां ब्राउज़ करें",
      myListings: "मेरी सूचियां",
      publishListing: "सूची प्रकाशित करें",
      cropType: "फसल",
      equipmentType: "उपकरण",
      quantity: "मात्रा",
      pricePerUnit: "प्रति इकाई मूल्य",
      selectCrop: "फसल चुनें",
      equipmentDescription: "उपकरण विवरण",
      publishing: "प्रकाशित हो रहा है...",
      publish: "प्रकाशित करें",
      soldOut: "बिक गया",
      markAsSold: "बिका हुआ चिन्हित करें",

      // ─── Sidebar & Layout ───
      dashboard: "डैशबोर्ड",
      cropTracker: "फसल ट्रैकर",
      priceForecasts: "मूल्य पूर्वानुमान",
      weather: "मौसम",
      govtSchemes: "सरकारी योजनाएं",
      diseaseScanner: "रोग पहचान",
      farmingTips: "खेती की सलाह",
      logout: "लॉगआउट",
      main: "मुख्य",
      settings: "सेटिंग्स",

      // ─── Voice Assistant ───
      listening: "सुन रहा हूँ...",
      noSpeechDetected: "कुछ सुनाई नहीं दिया। कृपया फिर कहें।",
      couldNotHear: "सुन नहीं पाया। कृपया पुनः प्रयास करें।",
      talkToAssistant: "🗣️ खेत सहायक से बात करें",

      // ─── Common ───
      loading: "लोड हो रहा है...",
      perQtl: "/क्विंटल",

      // ─── Legacy keys ───
      dashboardTitle: "एग्रो-कनेक्ट डैशबोर्ड",
      smartFarming: "स्मार्ट खेती मंच",
      marketOverview: "बाजार अवलोकन",
      totalMandis: "कुल विनियमित मंडियां",
      activeMarkets: "देश भर में सक्रिय बाजार",
      recentAdvisories: "हाल की सलाह",
      priceHistoryWheat: "मूल्य इतिहास (गेहूं - दिल्ली)",
      latestPrices: "फसलों की नवीनतम कीमतें",
      viewAll: "सभी देखें",
      fromLast: "अंतिम रिकॉर्ड से",
      changeLang: "Switch to English",
      cropsTracked: "ट्रैक की गई फसलें",
      activePredictions: "सक्रिय भविष्यवाणियां",
      wheatAvg: "गेहूं (औसत)",
      marketsListed: "सूचीबद्ध बाजार",
      acrossIndia: "संपूर्ण भारत में",
      activeAdvisories: "सक्रिय सलाह",
      updatedToday: "आज अपडेट किया गया",
      urgency: {
        CRITICAL: "अति महत्वपूर्ण",
        HIGH: "महत्वपूर्ण",
        MEDIUM: "मध्यम",
        LOW: "कम"
      }
    }
  },
  mr: {
    translation: {
      // ─── Greetings ───
      goodMorning: "सुप्रभात",
      goodAfternoon: "नमस्कार",
      goodEvening: "शुभ संध्याकाळ",
      dashboardSubtitle: "आज आपल्या शेतीत काय चालू आहे ते पहा",

      // ─── Dashboard Section Headers ───
      immediateActions: "⚡ तात्काळ कृती",
      aiRecommendations: "AI शिफारसी",
      farmAndInventory: "🌱 शेत आणि यादी",
      quickActions: "जलद कृती",

      // ─── Farm Summary Strip ───
      cropsActive: "पिके सक्रिय",
      cropActive: "पीक सक्रिय",
      alerts: "इशारे",
      alert: "इशारा",
      tasksDueToday: "आजची कामे",
      taskDueToday: "आजचे काम",
      marketplaceBids: "बाजारपेठ बोली",
      marketplaceBid: "बाजारपेठ बोली",

      // ─── Weather Alert Card ───
      hyperLocalWeather: "स्थानिक हवामान",
      details: "तपशील",
      loadingWeather: "हवामान लोड होत आहे...",
      rain: "पाऊस",
      wind: "वारा",
      humidity: "आर्द्रता",

      // ─── Priority Actions Card ───
      priorityActions: "प्राधान्य कृती",
      noPriorityActions: "सर्व ठीक! तातडीचे काही नाही.",

      // ─── AI Recommendations ───
      viewDetailedGraphs: "विस्तृत आलेख",
      confidence: "विश्वास",
      sellDesc: "किंमत ₹{{price}}/क्विंटल वर शिखरावर आहे. {{mandi}} मध्ये पुढील 7 दिवसांत {{pct}}% घट अपेक्षित.",
      holdDesc: "सध्या ₹{{price}}/क्विंटल. पुढील आठवड्यात ₹{{future}}/क्विंटल पर्यंत {{pct}}% वाढ अपेक्षित.",
      listOnMarketplace: "बाजारपेठेत सूचीबद्ध करा",
      viewPredictionGraph: "अंदाज आलेख पहा",

      // ─── Crop Lifecycle Tracker ───
      cropLifecycleTracker: "पीक जीवनचक्र ट्रॅकर",
      manage: "व्यवस्थापन करा",
      noActiveCrops: "सक्रिय पिके नाहीत",
      noActiveCropsDesc: "जीवनचक्र ट्रॅक करण्यासाठी आणि वेळेत शिफारसी मिळवण्यासाठी पहिले पीक जोडा.",
      addCrop: "+ पीक जोडा",
      day: "दिवस",
      daysTotal: "एकूण दिवस",

      // ─── Active Listings Panel ───
      myActiveListings: "माझ्या सक्रिय सूचि",
      active: "सक्रिय",
      noActiveListings: "सक्रिय सूची नाहीत",
      noActiveListingsDesc: "बाजारपेठेत आपली उत्पादने विकायला सुरुवात करा!",
      sellYourProduce: "तुमचे उत्पादन विका",
      per: "प्रति",
      viewAllMarketplace: "सर्व बाजारपेठ सूची पहा",

      // ─── Quick Actions Row ───
      qaCrop: "+ पीक",
      qaMarket: "बाजार",
      qaScheme: "योजना",
      qaDisease: "रोग",
      qaWeather: "हवामान",
      qaExpert: "तज्ज्ञ",

      // ─── Weather Page ───
      weatherPageTitle: "आजची हवामान माहिती",
      currentTemp: "सध्याचे तापमान",
      soilMoisture: "मातीची आर्द्रता",
      tempMin: "किमान तापमान",
      precipitation24h: "24 तासांतील पाऊस",
      hourlyForecast: "24 तास तापमान अंदाज",
      viewDetailedHourly: "विस्तृत तासिक डेटा पहा",
      time: "वेळ",
      tempC: "तापमान (°C)",
      humidityPct: "आर्द्रता (%)",
      rainMm: "पाऊस (मिमी)",
      normal: "सामान्य",
      hotAbove35: "गरम (>35°C)",
      coolBelow15: "थंड (<15°C)",
      rainDetected: "पाऊस आढळला",
      cropSpecificWarnings: "पीक विशिष्ट इशारे",

      // ─── Government Schemes Page ───
      govtSchemesTitle: "शेतकऱ्यांसाठी सरकारी योजना",
      govtSchemesSubtitle: "तुमचा फायदा वाढवण्यासाठी केंद्र आणि राज्य सरकारच्या योजना पहा.",
      eligibility: "पात्रता",
      benefit: "फायदा",
      visitPortal: "अधिकृत पोर्टलला भेट द्या",

      // ─── Marketplace Page ───
      marketplace: "बाजारपेठ",
      browseListings: "सक्रिय सूची ब्राउझ करा",
      myListings: "माझ्या सूची",
      publishListing: "सूची प्रकाशित करा",
      cropType: "पीक",
      equipmentType: "उपकरण",
      quantity: "प्रमाण",
      pricePerUnit: "प्रति युनिट किंमत",
      selectCrop: "पीक निवडा",
      equipmentDescription: "उपकरण वर्णन",
      publishing: "प्रकाशित होत आहे...",
      publish: "प्रकाशित करा",
      soldOut: "विकले",
      markAsSold: "विकले म्हणून चिन्हांकित करा",

      // ─── Sidebar & Layout ───
      dashboard: "डॅशबोर्ड",
      cropTracker: "पीक ट्रॅकर",
      priceForecasts: "किंमत अंदाज",
      weather: "हवामान",
      govtSchemes: "सरकारी योजना",
      diseaseScanner: "रोग ओळख",
      farmingTips: "शेती टिप्स",
      logout: "लॉगआउट",
      main: "मुख्य",
      settings: "सेटिंग्ज",

      // ─── Voice Assistant ───
      listening: "ऐकत आहे...",
      noSpeechDetected: "काहीच ऐकू आले नाही. कृपया पुन्हा बोला.",
      couldNotHear: "ऐकता आले नाही. कृपया पुन्हा प्रयत्न करा.",
      talkToAssistant: "🗣️ शेत सहाय्यकाशी बोला",

      // ─── Common ───
      loading: "लोड होत आहे...",
      perQtl: "/क्विंटल",

      // ─── Legacy keys ───
      dashboardTitle: "Agro-Connect डॅशबोर्ड",
      smartFarming: "स्मार्ट शेती प्लॅटफॉर्म",
      marketOverview: "बाजार आढावा",
      totalMandis: "एकूण बाजार समित्या (मंडी)",
      activeMarkets: "देशभरातील सक्रिय बाजार",
      recentAdvisories: "अलीकडील कृषी सल्ले",
      priceHistoryWheat: "किंमतीचा इतिहास (गहू - दिल्ली)",
      latestPrices: "पिकांचे नवीनतम दर",
      viewAll: "सर्व पहा",
      fromLast: "शेवटच्या नोंदीवरून",
      changeLang: "हिंदी / English",
      cropsTracked: "ट्रॅक केलेली पिके",
      activePredictions: "सक्रिय अंदाज",
      wheatAvg: "गहू (सरासरी)",
      marketsListed: "नोंदणीकृत बाजार",
      acrossIndia: "संपूर्ण भारतात",
      activeAdvisories: "सक्रिय सल्ले",
      updatedToday: "आज अद्यतनित",
      urgency: {
        CRITICAL: "अत्यंत तातडीचे",
        HIGH: "तातडीचे",
        MEDIUM: "मध्यम",
        LOW: "कमी"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
