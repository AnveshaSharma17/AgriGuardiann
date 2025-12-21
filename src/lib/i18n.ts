import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: "Home",
        dashboard: "Dashboard",
        identify: "Identify Pest",
        alerts: "Alerts",
        sprayLog: "Spray Log",
        community: "Community",
        chat: "AI Chatbot",
        login: "Login",
        register: "Register",
        logout: "Logout",
        settings: "Settings",
      },
      // Landing Page
      landing: {
        hero: {
          title: "Protect Your Crops with AI-Powered Pest Management",
          subtitle:
            "KrishiRakshak helps Indian farmers identify pests, get expert advice, and manage crops effectively using smart technology.",
          cta: "Get Started Free",
          login: "Already a member? Login",
        },
        features: {
          title: "Features",
          identify: {
            title: "AI Pest Identification",
            description:
              "Upload photos or describe symptoms to instantly identify pests affecting your crops.",
          },
          advisory: {
            title: "Expert Advisory",
            description:
              "Get IPM-based recommendations: prevention first, chemicals as last resort.",
          },
          alerts: {
            title: "Risk Alerts",
            description:
              "Receive location-based pest warnings and weather advisories.",
          },
          community: {
            title: "Farmer Community",
            description:
              "Connect with other farmers, share experiences, and get expert help.",
          },
        },
        selectLanguage: "Select Language",
      },
      // Auth
      auth: {
        login: "Login",
        register: "Register",
        email: "Email Address",
        password: "Password",
        name: "Full Name",
        phone: "Phone Number",
        confirmPassword: "Confirm Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?",
        noAccount: "Don't have an account?",
        hasAccount: "Already have an account?",
        loginButton: "Login to Dashboard",
        registerButton: "Create Account",
        welcomeBack: "Welcome Back",
        createAccount: "Create Your Account",
        loginDesc: "Login to access your farming dashboard",
        registerDesc: "Join thousands of farmers using smart pest management",
      },
      // Dashboard
      dashboard: {
        greeting: "Good Morning",
        overview: "Here's your farm overview",
        weather: "Today's Weather",
        humidity: "Humidity",
        alerts: "Active Alerts",
        viewAll: "View All",
        quickActions: "Quick Actions",
        myCrops: "My Crops",
        addCrop: "Add Crop",
        identifyPests: "Identify Pests",
        active: "Active",
        stage: "Stage",
        viewPests: "View Pests",
        identify: "Identify",
      },
      // Identify Page
      identify: {
        title: "Identify Pest",
        wizard: "Symptom Wizard",
        search: "Search Database",
        aiImage: "AI Image Analysis",
        wizardDesc: "Answer questions to identify pests",
        searchDesc: "Browse pests by crop",
        aiImageDesc: "Upload photo for AI analysis",
        selectCrop: "Select Your Crop",
        selectSymptoms: "Select Symptoms",
        severity: "Severity Level",
        mild: "Mild",
        moderate: "Moderate",
        severe: "Severe",
        analyze: "Analyze Symptoms",
        uploadImage: "Upload Image",
        dragDrop: "Drag and drop or click to upload",
        analyzing: "Analyzing...",
        results: "Results",
        confidence: "Confidence",
        viewAdvisory: "View Advisory",
      },
      // Chat
      chat: {
        title: "AI Farming Assistant",
        subtitle: "Get instant help with pest management and farming advice",
        placeholder: "Ask about pests, diseases, or farming advice...",
        inputPlaceholder: "Type your question here...",
        send: "Send",
        thinking: "Thinking...",
        welcome:
          "🌾 Namaste! I am your KrishiRakshak AI assistant. I can help you with:\n\n• Pest identification and management\n• Crop disease diagnosis\n• IPM recommendations\n• Farming best practices\n\nHow can I help you with your crops today?",
        followUp1: "How do I identify aphids in my wheat crop?",
        followUp2: "What are the best organic pest control methods?",
        followUp3: "My tomato leaves are yellowing, what should I do?",
        likelyPests: "Likely Pests",
        recommendedActions: "Recommended Actions",
        safetyWarnings: "Safety Warnings",
        suggestedQuestions: "You might also ask:",
        disclaimer:
          "AI-powered advice. Always consult local agricultural experts for critical decisions.",
      },
      // Alerts
      alerts: {
        title: "Pest Alerts & Warnings",
        high: "High Risk",
        medium: "Medium Risk",
        low: "Low Risk",
        noAlerts: "No active alerts in your area",
        weatherWarning: "Weather Warning",
      },
      // Spray Log
      sprayLog: {
        title: "Spray Log",
        addEntry: "Add Entry",
        pesticideName: "Pesticide Name",
        dose: "Dose",
        date: "Date",
        crop: "Crop",
        notes: "Notes",
        save: "Save Entry",
        warning: "Warning",
        recentEntries: "Recent Entries",
        noEntries: "No spray entries yet",
        overuseWarning:
          "Same pesticide used recently. Consider rotating to prevent resistance.",
        frequentWarning:
          "Frequent spraying detected. Follow recommended intervals.",
      },
      // Community
      community: {
        title: "Farmer Community",
        newPost: "New Post",
        askQuestion: "Ask a Question",
        postTitle: "Title",
        postDescription: "Description",
        selectCrop: "Select Crop",
        addImage: "Add Image (Optional)",
        submit: "Submit",
        replies: "Replies",
        upvote: "Upvote",
        solved: "Solved",
        markSolved: "Mark as Solved",
        noPosts: "No posts yet. Be the first to ask!",
      },
      // Common
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        back: "Back",
        next: "Next",
        previous: "Previous",
        submit: "Submit",
        search: "Search",
        filter: "Filter",
        sortBy: "Sort By",
        noData: "No data available",
      },
      // IPM
      ipm: {
        prevention: "Prevention",
        mechanical: "Mechanical Control",
        biological: "Biological Control",
        chemical: "Chemical Control (Last Resort)",
        safetyWarning: "Safety Warning",
        dosage: "Dosage",
        harvestInterval: "Pre-harvest Interval",
      },
    },
  },
  hi: {
    translation: {
      // Navigation
      nav: {
        home: "होम",
        dashboard: "डैशबोर्ड",
        identify: "कीट पहचान",
        alerts: "चेतावनी",
        sprayLog: "स्प्रे लॉग",
        community: "समुदाय",
        chat: "AI चैटबॉट",
        login: "लॉगिन",
        register: "रजिस्टर",
        logout: "लॉगआउट",
        settings: "सेटिंग्स",
      },
      // Landing Page
      landing: {
        hero: {
          title: "AI-पावर्ड कीट प्रबंधन से अपनी फसलों की रक्षा करें",
          subtitle:
            "कृषिरक्षक भारतीय किसानों को कीटों की पहचान करने, विशेषज्ञ सलाह प्राप्त करने और स्मार्ट तकनीक का उपयोग करके फसलों का प्रभावी ढंग से प्रबंधन करने में मदद करता है।",
          cta: "मुफ्त शुरू करें",
          login: "पहले से सदस्य हैं? लॉगिन करें",
        },
        features: {
          title: "विशेषताएं",
          identify: {
            title: "AI कीट पहचान",
            description:
              "अपनी फसलों को प्रभावित करने वाले कीटों की तुरंत पहचान के लिए फोटो अपलोड करें या लक्षणों का वर्णन करें।",
          },
          advisory: {
            title: "विशेषज्ञ सलाह",
            description:
              "IPM-आधारित सिफारिशें प्राप्त करें: पहले रोकथाम, रसायन अंतिम उपाय के रूप में।",
          },
          alerts: {
            title: "जोखिम चेतावनी",
            description: "स्थान-आधारित कीट चेतावनी और मौसम सलाह प्राप्त करें।",
          },
          community: {
            title: "किसान समुदाय",
            description:
              "अन्य किसानों से जुड़ें, अनुभव साझा करें और विशेषज्ञ सहायता प्राप्त करें।",
          },
        },
        selectLanguage: "भाषा चुनें",
      },
      // Auth
      auth: {
        login: "लॉगिन",
        register: "रजिस्टर",
        email: "ईमेल पता",
        password: "पासवर्ड",
        name: "पूरा नाम",
        phone: "फोन नंबर",
        confirmPassword: "पासवर्ड की पुष्टि करें",
        rememberMe: "मुझे याद रखें",
        forgotPassword: "पासवर्ड भूल गए?",
        noAccount: "खाता नहीं है?",
        hasAccount: "पहले से खाता है?",
        loginButton: "डैशबोर्ड में लॉगिन करें",
        registerButton: "खाता बनाएं",
        welcomeBack: "वापसी पर स्वागत है",
        createAccount: "अपना खाता बनाएं",
        loginDesc: "अपने कृषि डैशबोर्ड तक पहुंचने के लिए लॉगिन करें",
        registerDesc:
          "स्मार्ट कीट प्रबंधन का उपयोग करने वाले हजारों किसानों से जुड़ें",
      },
      // Dashboard
      dashboard: {
        greeting: "सुप्रभात",
        overview: "आपकी खेती का अवलोकन",
        weather: "आज का मौसम",
        humidity: "नमी",
        alerts: "सक्रिय चेतावनी",
        viewAll: "सभी देखें",
        quickActions: "त्वरित कार्य",
        myCrops: "मेरी फसलें",
        addCrop: "फसल जोड़ें",
        identifyPests: "कीट पहचानें",
        active: "सक्रिय",
        stage: "अवस्था",
        viewPests: "कीट देखें",
        identify: "पहचानें",
      },
      // Identify Page
      identify: {
        title: "कीट पहचान",
        wizard: "लक्षण विज़ार्ड",
        search: "डेटाबेस खोजें",
        aiImage: "AI छवि विश्लेषण",
        wizardDesc: "कीटों की पहचान के लिए सवालों के जवाब दें",
        searchDesc: "फसल के अनुसार कीट ब्राउज़ करें",
        aiImageDesc: "AI विश्लेषण के लिए फोटो अपलोड करें",
        selectCrop: "अपनी फसल चुनें",
        selectSymptoms: "लक्षण चुनें",
        severity: "गंभीरता स्तर",
        mild: "हल्का",
        moderate: "मध्यम",
        severe: "गंभीर",
        analyze: "लक्षणों का विश्लेषण करें",
        uploadImage: "छवि अपलोड करें",
        dragDrop: "खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें",
        analyzing: "विश्लेषण हो रहा है...",
        results: "परिणाम",
        confidence: "विश्वास",
        viewAdvisory: "सलाह देखें",
      },
      // Chat
      chat: {
        title: "AI कृषि सहायक",
        subtitle: "कीट प्रबंधन और खेती की सलाह के लिए तुरंत मदद पाएं",
        placeholder: "कीटों, बीमारियों या खेती की सलाह के बारे में पूछें...",
        inputPlaceholder: "यहां अपना सवाल लिखें...",
        send: "भेजें",
        thinking: "सोच रहा हूं...",
        welcome:
          "🌾 नमस्ते! मैं आपका कृषिरक्षक AI सहायक हूं। मैं इन विषयों में मदद कर सकता हूं:\n\n• कीट पहचान और प्रबंधन\n• फसल रोग निदान\n• IPM सिफारिशें\n• खेती की सर्वोत्तम प्रथाएं\n\nआज मैं आपकी फसलों में कैसे मदद कर सकता हूं?",
        followUp1: "मैं अपनी गेहूं की फसल में माहू की पहचान कैसे करूं?",
        followUp2: "जैविक कीट नियंत्रण के सबसे अच्छे तरीके क्या हैं?",
        followUp3: "मेरे टमाटर के पत्ते पीले हो रहे हैं, मुझे क्या करना चाहिए?",
        likelyPests: "संभावित कीट",
        recommendedActions: "अनुशंसित कार्रवाई",
        safetyWarnings: "सुरक्षा चेतावनी",
        suggestedQuestions: "आप यह भी पूछ सकते हैं:",
        disclaimer:
          "AI-संचालित सलाह। महत्वपूर्ण निर्णयों के लिए हमेशा स्थानीय कृषि विशेषज्ञों से परामर्श करें।",
      },
      // Alerts
      alerts: {
        title: "कीट चेतावनी और सूचनाएं",
        high: "उच्च जोखिम",
        medium: "मध्यम जोखिम",
        low: "कम जोखिम",
        noAlerts: "आपके क्षेत्र में कोई सक्रिय चेतावनी नहीं",
        weatherWarning: "मौसम चेतावनी",
      },
      // Spray Log
      sprayLog: {
        title: "स्प्रे लॉग",
        addEntry: "प्रविष्टि जोड़ें",
        pesticideName: "कीटनाशक का नाम",
        dose: "खुराक",
        date: "तारीख",
        crop: "फसल",
        notes: "नोट्स",
        save: "प्रविष्टि सहेजें",
        warning: "चेतावनी",
        recentEntries: "हाल की प्रविष्टियां",
        noEntries: "अभी तक कोई स्प्रे प्रविष्टि नहीं",
        overuseWarning:
          "हाल ही में समान कीटनाशक का उपयोग किया गया। प्रतिरोध रोकने के लिए बदलाव पर विचार करें।",
        frequentWarning:
          "बार-बार स्प्रे का पता चला। अनुशंसित अंतराल का पालन करें।",
      },
      // Community
      community: {
        title: "किसान समुदाय",
        newPost: "नई पोस्ट",
        askQuestion: "सवाल पूछें",
        postTitle: "शीर्षक",
        postDescription: "विवरण",
        selectCrop: "फसल चुनें",
        addImage: "छवि जोड़ें (वैकल्पिक)",
        submit: "जमा करें",
        replies: "जवाब",
        upvote: "अपवोट",
        solved: "हल हो गया",
        markSolved: "हल के रूप में चिह्नित करें",
        noPosts: "अभी तक कोई पोस्ट नहीं। पहले पूछने वाले बनें!",
      },
      // Common
      common: {
        loading: "लोड हो रहा है...",
        error: "त्रुटि",
        success: "सफलता",
        cancel: "रद्द करें",
        save: "सहेजें",
        delete: "हटाएं",
        edit: "संपादित करें",
        back: "वापस",
        next: "अगला",
        previous: "पिछला",
        submit: "जमा करें",
        search: "खोजें",
        filter: "फ़िल्टर",
        sortBy: "क्रमबद्ध करें",
        noData: "कोई डेटा उपलब्ध नहीं",
      },
      // IPM
      ipm: {
        prevention: "रोकथाम",
        mechanical: "यांत्रिक नियंत्रण",
        biological: "जैविक नियंत्रण",
        chemical: "रासायनिक नियंत्रण (अंतिम उपाय)",
        safetyWarning: "सुरक्षा चेतावनी",
        dosage: "खुराक",
        harvestInterval: "कटाई पूर्व अंतराल",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
