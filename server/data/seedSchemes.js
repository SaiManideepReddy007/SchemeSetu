// SchemeSetu - Multilingual Seed Data
// name/ministry/description/benefits.amount/documentsRequired are localized (en/hi/te)
// Everything else (eligibility fields, applyLink, benefits.type) stays language-neutral

const seedSchemes = [
  {
    name: {
      en: "Prime Minister's Employment Generation Programme (PMEGP)",
      hi: "प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)",
      te: "ప్రధానమంత్రి ఉపాధి కల్పన కార్యక్రమం (PMEGP)"
    },
    ministry: {
      en: "Ministry of Micro, Small and Medium Enterprises (MSME)",
      hi: "सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय (MSME)",
      te: "సూక్ష్మ, చిన్న మరియు మధ్యతరహా పరిశ్రమల మంత్రిత్వ శాఖ (MSME)"
    },
    description: {
      en: "Credit-linked subsidy scheme for setting up new micro-enterprises in manufacturing or service sectors, run by KVIC. Provides margin money subsidy of 15-35% depending on category and location.",
      hi: "KVIC द्वारा संचालित, विनिर्माण या सेवा क्षेत्रों में नई सूक्ष्म इकाइयां स्थापित करने के लिए ऋण-संबद्ध सब्सिडी योजना। श्रेणी और स्थान के आधार पर 15-35% मार्जिन मनी सब्सिडी प्रदान करती है।",
      te: "KVIC నిర్వహించే, తయారీ లేదా సేవా రంగాలలో కొత్త సూక్ష్మ యూనిట్లను స్థాపించడానికి క్రెడిట్-లింక్డ్ సబ్సిడీ పథకం. వర్గం మరియు ప్రాంతం ఆధారంగా 15-35% మార్జిన్ మనీ సబ్సిడీని అందిస్తుంది."
    },
    eligibility: {
      category: ["General", "SC", "ST", "OBC", "Women", "Disabled"],
      businessType: ["manufacturing", "service"],
      states: ["All"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "new"
    },
    benefits: {
      type: "credit-linked subsidy",
      amount: {
        en: "Up to ₹50 lakh (manufacturing) / ₹20 lakh (service); 15-35% margin money subsidy",
        hi: "₹50 लाख तक (विनिर्माण) / ₹20 लाख (सेवा); 15-35% मार्जिन मनी सब्सिडी",
        te: "₹50 లక్షల వరకు (తయారీ) / ₹20 లక్షలు (సేవ); 15-35% మార్జిన్ మనీ సబ్సిడీ"
      }
    },
    applyLink: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    documentsRequired: [
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" },
      { en: "Project Report", hi: "परियोजना रिपोर्ट", te: "ప్రాజెక్ట్ నివేదిక" },
      { en: "Educational Certificate", hi: "शैक्षणिक प्रमाण पत्र", te: "విద్యా ధృవీకరణ పత్రం" },
      { en: "Caste Certificate (if applicable)", hi: "जाति प्रमाण पत्र (यदि लागू हो)", te: "కుల ధృవీకరణ పత్రం (వర్తిస్తే)" }
    ]
  },
  {
    name: {
      en: "MUDRA Loan (Pradhan Mantri MUDRA Yojana)",
      hi: "मुद्रा ऋण (प्रधानमंत्री मुद्रा योजना)",
      te: "ముద్రా రుణం (ప్రధానమంత్రి ముద్రా యోజన)"
    },
    ministry: {
      en: "Ministry of Finance",
      hi: "वित्त मंत्रालय",
      te: "ఆర్థిక మంత్రిత్వ శాఖ"
    },
    description: {
      en: "Collateral-free loans up to ₹20 lakh for non-corporate, non-farm small/micro enterprises, split into Shishu, Kishor, Tarun, and Tarun Plus categories based on loan size.",
      hi: "गैर-कॉर्पोरेट, गैर-कृषि छोटे/सूक्ष्म उद्यमों के लिए ₹20 लाख तक का बिना गारंटी ऋण, ऋण के आकार के आधार पर शिशु, किशोर, तरुण और तरुण प्लस श्रेणियों में विभाजित।",
      te: "కార్పొరేట్ కాని, వ్యవసాయేతర చిన్న/సూక్ష్మ సంస్థల కోసం ₹20 లక్షల వరకు హామీ లేని రుణాలు, రుణ పరిమాణం ఆధారంగా శిశు, కిషోర్, తరుణ్ మరియు తరుణ్ ప్లస్ వర్గాలుగా విభజించబడింది."
    },
    eligibility: {
      category: ["General", "SC", "ST", "OBC", "Women", "Disabled"],
      businessType: ["manufacturing", "service", "retail", "agri"],
      states: ["All"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "both"
    },
    benefits: {
      type: "collateral-free loan",
      amount: {
        en: "Up to ₹20 lakh depending on category",
        hi: "श्रेणी के आधार पर ₹20 लाख तक",
        te: "వర్గాన్ని బట్టి ₹20 లక్షల వరకు"
      }
    },
    applyLink: "https://www.mudra.org.in/",
    documentsRequired: [
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" },
      { en: "PAN Card", hi: "पैन कार्ड", te: "పాన్ కార్డ్" },
      { en: "Business Plan", hi: "व्यवसाय योजना", te: "వ్యాపార ప్రణాళిక" },
      { en: "Bank Statements", hi: "बैंक स्टेटमेंट", te: "బ్యాంక్ స్టేట్‌మెంట్‌లు" }
    ]
  },
  {
    name: {
      en: "Stand-Up India Scheme",
      hi: "स्टैंड-अप इंडिया योजना",
      te: "స్టాండ్-అప్ ఇండియా పథకం"
    },
    ministry: {
      en: "Ministry of Finance / SIDBI",
      hi: "वित्त मंत्रालय / सिडबी",
      te: "ఆర్థిక మంత్రిత్వ శాఖ / సిడ్బి"
    },
    description: {
      en: "Bank loans for greenfield enterprises set up by SC/ST and women entrepreneurs in manufacturing, services, or trading sectors.",
      hi: "विनिर्माण, सेवा या व्यापार क्षेत्रों में SC/ST और महिला उद्यमियों द्वारा स्थापित नई इकाइयों के लिए बैंक ऋण।",
      te: "తయారీ, సేవలు లేదా వాణిజ్య రంగాలలో SC/ST మరియు మహిళా వ్యవస్థాపకులు స్థాపించిన కొత్త సంస్థల కోసం బ్యాంక్ రుణాలు."
    },
    eligibility: {
      category: ["SC", "ST", "Women"],
      businessType: ["manufacturing", "service", "retail"],
      states: ["All"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "new"
    },
    benefits: {
      type: "bank loan",
      amount: {
        en: "₹10 lakh to ₹1 crore",
        hi: "₹10 लाख से ₹1 करोड़ तक",
        te: "₹10 లక్షల నుండి ₹1 కోటి వరకు"
      }
    },
    applyLink: "https://www.standupmitra.in/",
    documentsRequired: [
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" },
      { en: "PAN Card", hi: "पैन कार्ड", te: "పాన్ కార్డ్" },
      { en: "Caste Certificate", hi: "जाति प्रमाण पत्र", te: "కుల ధృవీకరణ పత్రం" },
      { en: "Business Plan", hi: "व्यवसाय योजना", te: "వ్యాపార ప్రణాళిక" }
    ]
  },
  {
    name: {
      en: "PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana)",
      hi: "पीएम-अजय (प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना)",
      te: "PM-AJAY (ప్రధానమంత్రి అనుసూచిత జాతి అభ్యుదయ యోజన)"
    },
    ministry: {
      en: "Ministry of Social Justice and Empowerment",
      hi: "सामाजिक न्याय और अधिकारिता मंत्रालय",
      te: "సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ"
    },
    description: {
      en: "Umbrella scheme supporting SC communities through skill development, income-generation grants, and infrastructure development in SC-dominated villages.",
      hi: "SC-बहुल गांवों में कौशल विकास, आय-सृजन अनुदान और बुनियादी ढांचे के विकास के माध्यम से SC समुदायों का समर्थन करने वाली व्यापक योजना।",
      te: "SC ఆధిపత్య గ్రామాలలో నైపుణ్య అభివృద్ధి, ఆదాయ-సృష్టి గ్రాంట్లు మరియు మౌలిక సదుపాయాల అభివృద్ధి ద్వారా SC సంఘాలకు మద్దతు ఇచ్చే గొడుగు పథకం."
    },
    eligibility: {
      category: ["SC"],
      businessType: ["manufacturing", "service", "retail", "agri"],
      states: ["All"],
      minAge: 18,
      maxIncome: 300000,
      newOrExisting: "both"
    },
    benefits: {
      type: "grant",
      amount: {
        en: "Varies by component; income-generation support typically up to ₹1-2 lakh",
        hi: "घटक के अनुसार भिन्न; आय-सृजन सहायता आमतौर पर ₹1-2 लाख तक",
        te: "భాగం ఆధారంగా మారుతుంది; ఆదాయ-సృష్టి మద్దతు సాధారణంగా ₹1-2 లక్షల వరకు"
      }
    },
    applyLink: "https://socialjustice.gov.in/",
    documentsRequired: [
      { en: "Caste Certificate", hi: "जाति प्रमाण पत्र", te: "కుల ధృవీకరణ పత్రం" },
      { en: "Income Certificate", hi: "आय प्रमाण पत्र", te: "ఆదాయ ధృవీకరణ పత్రం" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" }
    ]
  },
  {
    name: {
      en: "National SC-ST Hub Scheme",
      hi: "राष्ट्रीय SC-ST हब योजना",
      te: "జాతీయ SC-ST హబ్ పథకం"
    },
    ministry: {
      en: "Ministry of MSME",
      hi: "MSME मंत्रालय",
      te: "MSME మంత్రిత్వ శాఖ"
    },
    description: {
      en: "Supports SC/ST entrepreneurs in accessing credit, capacity building, and market linkages, including handholding for tenders under GeM.",
      hi: "SC/ST उद्यमियों को ऋण, क्षमता निर्माण और बाजार संपर्क तक पहुंचने में सहायता, जिसमें GeM के तहत निविदाओं के लिए मार्गदर्शन शामिल है।",
      te: "GeM కింద టెండర్ల కోసం మార్గదర్శకత్వంతో సహా, క్రెడిట్, సామర్థ్య నిర్మాణం మరియు మార్కెట్ లింకేజీలను పొందడంలో SC/ST వ్యవస్థాపకులకు మద్దతు."
    },
    eligibility: {
      category: ["SC", "ST"],
      businessType: ["manufacturing", "service"],
      states: ["All"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "both"
    },
    benefits: {
      type: "support services + subsidy",
      amount: {
        en: "Varies (capital subsidy, skill training, marketing support)",
        hi: "भिन्न होता है (पूंजी सब्सिडी, कौशल प्रशिक्षण, विपणन सहायता)",
        te: "మారుతుంది (మూలధన సబ్సిడీ, నైపుణ్య శిక్షణ, మార్కెటింగ్ మద్దతు)"
      }
    },
    applyLink: "https://www.scsthub.in/",
    documentsRequired: [
      { en: "Caste Certificate", hi: "जाति प्रमाण पत्र", te: "కుల ధృవీకరణ పత్రం" },
      { en: "Udyam Registration", hi: "उद्यम पंजीकरण", te: "ఉద్యమ్ నమోదు" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" }
    ]
  },
  {
    name: {
      en: "Mahila e-Haat",
      hi: "महिला ई-हाट",
      te: "మహిళా ఇ-హాట్"
    },
    ministry: {
      en: "Ministry of Women and Child Development",
      hi: "महिला एवं बाल विकास मंत्रालय",
      te: "మహిళా మరియు శిశు అభివృద్ధి మంత్రిత్వ శాఖ"
    },
    description: {
      en: "Online marketing platform helping women entrepreneurs, SHGs, and NGOs showcase and sell products directly to buyers without intermediaries.",
      hi: "ऑनलाइन विपणन मंच जो महिला उद्यमियों, स्वयं सहायता समूहों और गैर सरकारी संगठनों को बिचौलियों के बिना सीधे खरीदारों को उत्पाद दिखाने और बेचने में मदद करता है।",
      te: "మధ్యవర్తులు లేకుండా నేరుగా కొనుగోలుదారులకు ఉత్పత్తులను ప్రదర్శించడానికి మరియు విక్రయించడానికి మహిళా వ్యవస్థాపకులు, SHGలు మరియు NGOలకు సహాయపడే ఆన్‌లైన్ మార్కెటింగ్ వేదిక."
    },
    eligibility: {
      category: ["Women"],
      businessType: ["retail", "manufacturing"],
      states: ["All"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "both"
    },
    benefits: {
      type: "market access platform",
      amount: {
        en: "Free listing, no subsidy amount",
        hi: "मुफ्त लिस्टिंग, कोई सब्सिडी राशि नहीं",
        te: "ఉచిత లిస్టింగ్, సబ్సిడీ మొత్తం లేదు"
      }
    },
    applyLink: "http://mahilaehaat-rmk.gov.in/",
    documentsRequired: [
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" },
      { en: "Bank Account Details", hi: "बैंक खाता विवरण", te: "బ్యాంక్ ఖాతా వివరాలు" }
    ]
  },
  {
    name: {
      en: "Pradhan Mantri Mudra Yojana - Mahila Samriddhi Yojana",
      hi: "प्रधानमंत्री मुद्रा योजना - महिला समृद्धि योजना",
      te: "ప్రధానమంత్రి ముద్రా యోజన - మహిళా సమృద్ధి యోజన"
    },
    ministry: {
      en: "Ministry of Social Justice and Empowerment / NBCFDC",
      hi: "सामाजिक न्याय और अधिकारिता मंत्रालय / NBCFDC",
      te: "సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ / NBCFDC"
    },
    description: {
      en: "Micro-financing scheme specifically for women from backward classes to start small businesses, offered through NBCFDC channel partners.",
      hi: "पिछड़ा वर्ग की महिलाओं के लिए विशेष रूप से छोटे व्यवसाय शुरू करने की सूक्ष्म-वित्तपोषण योजना, NBCFDC चैनल भागीदारों के माध्यम से उपलब्ध।",
      te: "వెనుకబడిన తరగతుల మహిళలు చిన్న వ్యాపారాలను ప్రారంభించడానికి ప్రత్యేకంగా NBCFDC ఛానల్ భాగస్వాముల ద్వారా అందించే మైక్రో-ఫైనాన్సింగ్ పథకం."
    },
    eligibility: {
      category: ["OBC", "Women"],
      businessType: ["manufacturing", "service", "retail"],
      states: ["All"],
      minAge: 18,
      maxIncome: 300000,
      newOrExisting: "new"
    },
    benefits: {
      type: "micro-loan",
      amount: {
        en: "Up to ₹1.4 lakh (varies by state channel partner)",
        hi: "₹1.4 लाख तक (राज्य चैनल भागीदार के अनुसार भिन्न)",
        te: "₹1.4 లక్షల వరకు (రాష్ట్ర ఛానల్ భాగస్వామిని బట్టి మారుతుంది)"
      }
    },
    applyLink: "https://nbcfdc.gov.in/",
    documentsRequired: [
      { en: "OBC Certificate", hi: "OBC प्रमाण पत्र", te: "OBC ధృవీకరణ పత్రం" },
      { en: "Income Certificate", hi: "आय प्रमाण पत्र", te: "ఆదాయ ధృవీకరణ పత్రం" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" }
    ]
  },
  {
    name: {
      en: "Venture Capital Fund for SC (VCF-SC)",
      hi: "SC के लिए वेंचर कैपिटल फंड (VCF-SC)",
      te: "SC కోసం వెంచర్ క్యాపిటల్ ఫండ్ (VCF-SC)"
    },
    ministry: {
      en: "Ministry of Social Justice and Empowerment / IFCI",
      hi: "सामाजिक न्याय और अधिकारिता मंत्रालय / IFCI",
      te: "సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ / IFCI"
    },
    description: {
      en: "Provides growth capital in the form of equity/quasi-equity to SC entrepreneurs running or starting viable businesses.",
      hi: "व्यवहार्य व्यवसाय चलाने या शुरू करने वाले SC उद्यमियों को इक्विटी/अर्ध-इक्विटी के रूप में विकास पूंजी प्रदान करता है।",
      te: "ఆచరణీయ వ్యాపారాలను నడుపుతున్న లేదా ప్రారంభిస్తున్న SC వ్యవస్థాపకులకు ఈక్విటీ/క్వాసీ-ఈక్విటీ రూపంలో వృద్ధి మూలధనాన్ని అందిస్తుంది."
    },
    eligibility: {
      category: ["SC"],
      businessType: ["manufacturing", "service"],
      states: ["All"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "both"
    },
    benefits: {
      type: "venture capital / equity support",
      amount: {
        en: "Varies by project viability",
        hi: "परियोजना व्यवहार्यता के अनुसार भिन्न",
        te: "ప్రాజెక్ట్ సాధ్యతను బట్టి మారుతుంది"
      }
    },
    applyLink: "https://www.ifciltd.com/",
    documentsRequired: [
      { en: "Caste Certificate", hi: "जाति प्रमाण पत्र", te: "కుల ధృవీకరణ పత్రం" },
      { en: "Detailed Project Report", hi: "विस्तृत परियोजना रिपोर्ट", te: "వివరణాత్మక ప్రాజెక్ట్ నివేదిక" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" }
    ]
  },
  {
    name: {
      en: "National Handicapped Finance and Development Corporation (NHFDC) Loan Scheme",
      hi: "राष्ट्रीय विकलांग वित्त एवं विकास निगम (NHFDC) ऋण योजना",
      te: "జాతీయ వికలాంగుల ఆర్థిక మరియు అభివృద్ధి సంస్థ (NHFDC) రుణ పథకం"
    },
    ministry: {
      en: "Ministry of Social Justice and Empowerment",
      hi: "सामाजिक न्याय और अधिकारिता मंत्रालय",
      te: "సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ"
    },
    description: {
      en: "Concessional loans to persons with disabilities for self-employment ventures across sectors.",
      hi: "विभिन्न क्षेत्रों में स्वरोजगार उद्यमों के लिए विकलांग व्यक्तियों को रियायती ऋण।",
      te: "వివిధ రంగాలలో స్వయం ఉపాధి వెంచర్ల కోసం వికలాంగులకు రాయితీ రుణాలు."
    },
    eligibility: {
      category: ["Disabled"],
      businessType: ["manufacturing", "service", "retail", "agri"],
      states: ["All"],
      minAge: 18,
      maxIncome: 300000,
      newOrExisting: "both"
    },
    benefits: {
      type: "concessional loan",
      amount: {
        en: "Up to ₹25 lakh depending on project",
        hi: "परियोजना के अनुसार ₹25 लाख तक",
        te: "ప్రాజెక్ట్‌ను బట్టి ₹25 లక్షల వరకు"
      }
    },
    applyLink: "https://www.nhfdc.nic.in/",
    documentsRequired: [
      { en: "Disability Certificate", hi: "विकलांगता प्रमाण पत्र", te: "వైకల్య ధృవీకరణ పత్రం" },
      { en: "Income Certificate", hi: "आय प्रमाण पत्र", te: "ఆదాయ ధృవీకరణ పత్రం" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" }
    ]
  },
  {
    name: {
      en: "Telangana State Priority Sector Lending for Minorities",
      hi: "तेलंगाना राज्य अल्पसंख्यकों के लिए प्राथमिकता क्षेत्र ऋण",
      te: "మైనారిటీల కోసం తెలంగాణ రాష్ట్ర ప్రాధాన్యతా రంగ రుణం"
    },
    ministry: {
      en: "Telangana Minorities Finance Corporation",
      hi: "तेलंगाना अल्पसंख्यक वित्त निगम",
      te: "తెలంగాణ మైనారిటీల ఆర్థిక సంస్థ"
    },
    description: {
      en: "Subsidized loans and margin money support for minority entrepreneurs in Telangana to set up small businesses.",
      hi: "तेलंगाना में अल्पसंख्यक उद्यमियों के लिए छोटे व्यवसाय स्थापित करने हेतु सब्सिडी युक्त ऋण और मार्जिन मनी सहायता।",
      te: "తెలంగాణలో మైనారిటీ వ్యవస్థాపకులు చిన్న వ్యాపారాలను స్థాపించడానికి రాయితీ రుణాలు మరియు మార్జిన్ మనీ మద్దతు."
    },
    eligibility: {
      category: ["General"],
      businessType: ["manufacturing", "service", "retail"],
      states: ["Telangana"],
      minAge: 18,
      maxIncome: 200000,
      newOrExisting: "new"
    },
    benefits: {
      type: "subsidized loan",
      amount: {
        en: "Varies by scheme component",
        hi: "योजना घटक के अनुसार भिन्न",
        te: "పథక భాగాన్ని బట్టి మారుతుంది"
      }
    },
    applyLink: "https://tsmfc.telangana.gov.in/",
    documentsRequired: [
      { en: "Income Certificate", hi: "आय प्रमाण पत्र", te: "ఆదాయ ధృవీకరణ పత్రం" },
      { en: "Minority Certificate", hi: "अल्पसंख्यक प्रमाण पत्र", te: "మైనారిటీ ధృవీకరణ పత్రం" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" }
    ]
  },
  {
    name: {
      en: "T-IDEA (Telangana Industrial Development and Entrepreneurship Advancement)",
      hi: "टी-आइडिया (तेलंगाना औद्योगिक विकास और उद्यमिता उन्नति)",
      te: "T-IDEA (తెలంగాణ పారిశ్రామిక అభివృద్ధి మరియు వ్యవస్థాపకత అభివృద్ధి)"
    },
    ministry: {
      en: "Government of Telangana / TSIIC",
      hi: "तेलंगाना सरकार / TSIIC",
      te: "తెలంగాణ ప్రభుత్వం / TSIIC"
    },
    description: {
      en: "State incentive scheme offering capital and interest subsidy to MSMEs setting up manufacturing units in Telangana.",
      hi: "तेलंगाना में विनिर्माण इकाइयां स्थापित करने वाले MSMEs को पूंजी और ब्याज सब्सिडी प्रदान करने वाली राज्य प्रोत्साहन योजना।",
      te: "తెలంగాణలో తయారీ యూనిట్లను స్థాపిస్తున్న MSMEలకు మూలధనం మరియు వడ్డీ సబ్సిడీని అందించే రాష్ట్ర ప్రోత్సాహక పథకం."
    },
    eligibility: {
      category: ["General", "SC", "ST", "OBC", "Women"],
      businessType: ["manufacturing"],
      states: ["Telangana"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "new"
    },
    benefits: {
      type: "capital + interest subsidy",
      amount: {
        en: "Varies by investment slab, higher for SC/ST/Women",
        hi: "निवेश स्लैब के अनुसार भिन्न, SC/ST/महिलाओं के लिए अधिक",
        te: "పెట్టుబడి శ్లాబ్‌ను బట్టి మారుతుంది, SC/ST/మహిళలకు ఎక్కువ"
      }
    },
    applyLink: "https://telanganaindustry.gov.in/",
    documentsRequired: [
      { en: "Udyam Registration", hi: "उद्यम पंजीकरण", te: "ఉద్యమ్ నమోదు" },
      { en: "Project Report", hi: "परियोजना रिपोर्ट", te: "ప్రాజెక్ట్ నివేదిక" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" }
    ]
  },
  {
    name: {
      en: "Telangana WE-HUB Incubation Support",
      hi: "तेलंगाना वी-हब इनक्यूबेशन सहायता",
      te: "తెలంగాణ WE-HUB ఇంక్యుబేషన్ మద్దతు"
    },
    ministry: {
      en: "Government of Telangana",
      hi: "तेलंगाना सरकार",
      te: "తెలంగాణ ప్రభుత్వం"
    },
    description: {
      en: "Incubation, mentorship, and seed funding support for women-led startups and small businesses in Telangana.",
      hi: "तेलंगाना में महिला-नेतृत्व वाले स्टार्टअप और छोटे व्यवसायों के लिए इनक्यूबेशन, मार्गदर्शन और सीड फंडिंग सहायता।",
      te: "తెలంగాణలో మహిళా-నేతృత్వంలోని స్టార్టప్‌లు మరియు చిన్న వ్యాపారాల కోసం ఇంక్యుబేషన్, మెంటర్‌షిప్ మరియు సీడ్ ఫండింగ్ మద్దతు."
    },
    eligibility: {
      category: ["Women"],
      businessType: ["manufacturing", "service", "retail"],
      states: ["Telangana"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "both"
    },
    benefits: {
      type: "incubation + seed grant",
      amount: {
        en: "Varies by cohort/program",
        hi: "समूह/कार्यक्रम के अनुसार भिन्न",
        te: "కోహోర్ట్/ప్రోగ్రామ్‌ను బట్టి మారుతుంది"
      }
    },
    applyLink: "https://wehub.telangana.gov.in/",
    documentsRequired: [
      { en: "Business Plan", hi: "व्यवसाय योजना", te: "వ్యాపార ప్రణాళిక" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" }
    ]
  },
  {
    name: {
      en: "Credit Guarantee Fund Scheme for Micro and Small Enterprises (CGTMSE)",
      hi: "सूक्ष्म और लघु उद्यमों के लिए ऋण गारंटी निधि योजना (CGTMSE)",
      te: "సూక్ష్మ మరియు చిన్న సంస్థల కోసం క్రెడిట్ గ్యారంటీ ఫండ్ పథకం (CGTMSE)"
    },
    ministry: {
      en: "Ministry of MSME",
      hi: "MSME मंत्रालय",
      te: "MSME మంత్రిత్వ శాఖ"
    },
    description: {
      en: "Provides collateral-free credit guarantee cover to banks/NBFCs lending to micro and small enterprises, indirectly enabling loans without collateral.",
      hi: "सूक्ष्म और लघु उद्यमों को ऋण देने वाले बैंकों/NBFCs को बिना गारंटी ऋण गारंटी कवर प्रदान करता है, जिससे बिना गारंटी के ऋण संभव होता है।",
      te: "సూక్ష్మ మరియు చిన్న సంస్థలకు రుణాలు ఇచ్చే బ్యాంకులు/NBFCలకు హామీ లేని క్రెడిట్ గ్యారంటీ కవర్‌ను అందిస్తుంది, పరోక్షంగా హామీ లేకుండా రుణాలను వీలు కల్పిస్తుంది."
    },
    eligibility: {
      category: ["General", "SC", "ST", "OBC", "Women", "Disabled"],
      businessType: ["manufacturing", "service"],
      states: ["All"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "both"
    },
    benefits: {
      type: "credit guarantee",
      amount: {
        en: "Cover up to ₹5 crore",
        hi: "₹5 करोड़ तक का कवर",
        te: "₹5 కోట్ల వరకు కవర్"
      }
    },
    applyLink: "https://www.cgtmse.in/",
    documentsRequired: [
      { en: "Udyam Registration", hi: "उद्यम पंजीकरण", te: "ఉద్యమ్ నమోదు" },
      { en: "Bank Loan Application", hi: "बैंक ऋण आवेदन", te: "బ్యాంక్ రుణ దరఖాస్తు" }
    ]
  },
  {
    name: {
      en: "Startup India Seed Fund Scheme (SISFS)",
      hi: "स्टार्टअप इंडिया सीड फंड योजना (SISFS)",
      te: "స్టార్టప్ ఇండియా సీడ్ ఫండ్ పథకం (SISFS)"
    },
    ministry: {
      en: "Ministry of Commerce and Industry (DPIIT)",
      hi: "वाणिज्य और उद्योग मंत्रालय (DPIIT)",
      te: "వాణిజ్యం మరియు పరిశ్రమల మంత్రిత్వ శాఖ (DPIIT)"
    },
    description: {
      en: "Provides financial assistance to early-stage startups for proof of concept, prototype development, product trials, and market entry.",
      hi: "प्रारंभिक चरण के स्टार्टअप को अवधारणा प्रमाण, प्रोटोटाइप विकास, उत्पाद परीक्षण और बाजार प्रवेश के लिए वित्तीय सहायता प्रदान करता है।",
      te: "ప్రారంభ దశ స్టార్టప్‌లకు కాన్సెప్ట్ రుజువు, ప్రోటోటైప్ అభివృద్ధి, ఉత్పత్తి పరీక్షలు మరియు మార్కెట్ ప్రవేశం కోసం ఆర్థిక సహాయాన్ని అందిస్తుంది."
    },
    eligibility: {
      category: ["General", "SC", "ST", "OBC", "Women"],
      businessType: ["manufacturing", "service"],
      states: ["All"],
      minAge: 18,
      maxIncome: null,
      newOrExisting: "new"
    },
    benefits: {
      type: "seed grant + debt/convertible debenture",
      amount: {
        en: "Up to ₹20 lakh (grant) + up to ₹50 lakh (investment)",
        hi: "₹20 लाख तक (अनुदान) + ₹50 लाख तक (निवेश)",
        te: "₹20 లక్షల వరకు (గ్రాంట్) + ₹50 లక్షల వరకు (పెట్టుబడి)"
      }
    },
    applyLink: "https://seedfund.startupindia.gov.in/",
    documentsRequired: [
      { en: "DPIIT Recognition Certificate", hi: "DPIIT मान्यता प्रमाण पत्र", te: "DPIIT గుర్తింపు ధృవీకరణ పత్రం" },
      { en: "Business Plan", hi: "व्यवसाय योजना", te: "వ్యాపార ప్రణాళిక" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" }
    ]
  },
  {
    name: {
      en: "Deendayal Antyodaya Yojana - National Rural Livelihood Mission (DAY-NRLM)",
      hi: "दीनदयाल अंत्योदय योजना - राष्ट्रीय ग्रामीण आजीविका मिशन (DAY-NRLM)",
      te: "దీన్‌దయాళ్ అంత్యోదయ యోజన - జాతీయ గ్రామీణ జీవనోపాధి మిషన్ (DAY-NRLM)"
    },
    ministry: {
      en: "Ministry of Rural Development",
      hi: "ग्रामीण विकास मंत्रालय",
      te: "గ్రామీణాభివృద్ధి మంత్రిత్వ శాఖ"
    },
    description: {
      en: "Promotes self-employment and organization of rural poor into Self Help Groups (SHGs), with access to bank credit and skill training.",
      hi: "ग्रामीण गरीबों को स्वयं सहायता समूहों (SHGs) में संगठित करने और स्वरोजगार को बढ़ावा देती है, बैंक ऋण और कौशल प्रशिक्षण तक पहुंच के साथ।",
      te: "బ్యాంక్ క్రెడిట్ మరియు నైపుణ్య శిక్షణకు ప్రాప్యతతో, గ్రామీణ పేదలను స్వయం సహాయక బృందాలుగా (SHGలు) నిర్వహించడాన్ని మరియు స్వయం ఉపాధిని ప్రోత్సహిస్తుంది."
    },
    eligibility: {
      category: ["General", "SC", "ST", "OBC", "Women"],
      businessType: ["manufacturing", "service", "retail", "agri"],
      states: ["All"],
      minAge: 18,
      maxIncome: 150000,
      newOrExisting: "both"
    },
    benefits: {
      type: "SHG bank credit + subsidy",
      amount: {
        en: "Revolving fund + community investment support",
        hi: "परिक्रामी निधि + सामुदायिक निवेश सहायता",
        te: "రివాల్వింగ్ ఫండ్ + కమ్యూనిటీ పెట్టుబడి మద్దతు"
      }
    },
    applyLink: "https://aajeevika.gov.in/",
    documentsRequired: [
      { en: "Income Certificate", hi: "आय प्रमाण पत्र", te: "ఆదాయ ధృవీకరణ పత్రం" },
      { en: "Aadhaar Card", hi: "आधार कार्ड", te: "ఆధార్ కార్డ్" },
      { en: "SHG Membership", hi: "SHG सदस्यता", te: "SHG సభ్యత్వం" }
    ]
  }
];

module.exports = seedSchemes;