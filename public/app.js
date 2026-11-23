// GitaMitra — Complete Multilingual Bhagavad Gita Learning Platform
// Client-side Application Logic

(function () {
  "use strict";

  // --- 1. CHAPTERS METADATA (18 Chapters) ---
  const CHAPTERS_META = [
    {
      num: 1,
      sa: "अर्जुनविषादयोगः",
      translit: "Arjuna Viṣāda Yoga",
      en: "The Yoga of Arjuna's Despair",
      hi: "अर्जुन विषाद योग (अर्जुन का मोह और दुःख)",
      te: "అర్జున విషాద యోగము",
      sum_en: "On the battlefield of Kurukshetra, Arjuna is overwhelmed by sorrow and moral conflict upon seeing his kin and teachers assembled for war.",
      sum_hi: "कुरुक्षेत्र के युद्धभूमि में अर्जुन अपने गुरुजनों, संबंधियों और मित्रों को देखकर मोह और विषाद से व्याकुल होकर शस्त्र त्याग देते हैं।",
      sum_te: "కురుక్షేత్ర రణరంగంలో తన గురువులు, బంధువులను చూసి అర్జునుడు దుఃఖముతో విచారగ్రస్తుడై ధనుస్సును విడిచిపెడతాడు.",
      count: 47,
      section: "karma"
    },
    {
      num: 2,
      sa: "साङ्ख्ययोगः",
      translit: "Sāṅkhya Yoga",
      en: "The Yoga of Knowledge (Sankhya)",
      hi: "सांख्य योग (ज्ञान और निष्काम कर्म)",
      te: "సాంఖ్య యోగము",
      sum_en: "Krishna reveals the immortality of the soul (Atman), the illusion of death, duty (Svadharma), selfless action (Nishkama Karma), and the steady mind (Sthitaprajna).",
      sum_hi: "श्रीकृष्ण आत्मा की अमरता, देह की नश्वरता, स्वधर्म का पालन और स्थितप्रज्ञ पुरुष के लक्षणों का उपदेश देते हैं।",
      sum_te: "శ్రీకృష్ణుడు ఆత్మ శాశ్వతత్వాన్ని, దేహ నశ్వరతను, స్వధర్మ ప్రాధాన్యతను మరియు స్థితప్రజ్ఞుని లక్షణాలను వివరిస్తాడు.",
      count: 72,
      section: "karma"
    },
    {
      num: 3,
      sa: "कर्मयोगः",
      translit: "Karma Yoga",
      en: "The Yoga of Action",
      hi: "कर्म योग (कर्तव्य पालन और समर्पण)",
      te: "కర్మ యోగము",
      sum_en: "Krishna explains why inaction is impossible. True liberation is found through Nishkama Karma—performing one's duties without selfish attachment to fruits.",
      sum_hi: "कर्म त्यागने के बजाय निष्काम भाव से कर्तव्य कर्म करने का मार्ग समझाया गया है। कर्म ही जीवन की गति है।",
      sum_te: "కర్మలను వదిలివేయడం కంటే నిష్కామ భావంతో కర్తవ్య కర్మలను ఆచరించడం శ్రేష్ఠమని కృష్ణుడు బోధిస్తాడు.",
      count: 43,
      section: "karma"
    },
    {
      num: 4,
      sa: "ज्ञानकर्मसंन्यासयोगः",
      translit: "Jñāna Karma Sannyāsa Yoga",
      en: "The Yoga of Knowledge and Renunciation of Action",
      hi: "ज्ञानकर्मसंन्यास योग (ज्ञान और दिव्य कर्म)",
      te: "జ్ఞాన కర్మ సన్న్యాస యోగము",
      sum_en: "The sacred lineage of wisdom, divine descent (Avatara), and how the blazing fire of spiritual knowledge burns all karmic bondage into ashes.",
      sum_hi: "परम्परागत दिव्य ज्ञान, ईश्वर के अवतार का रहस्य और ज्ञान रूपी अग्नि से समस्त कर्म-बन्धनों की भस्म का वर्णन।",
      sum_te: "దివ్య జ్ఞాన పరంపర, అవతార రహస్యాలు మరియు జ్ఞానాగ్ని ద్వారా కర్మబంధాలు దగ్ధమయ్యే విధానం వివరించబడింది.",
      count: 42,
      section: "karma"
    },
    {
      num: 5,
      sa: "कर्मसंन्यासयोगः",
      translit: "Karma Sannyāsa Yoga",
      en: "The Yoga of Renunciation",
      hi: "कर्मसंन्यास योग (कर्मयोग और संन्यास का समन्वय)",
      te: "కర్మ సన్న్యాస యోగము",
      sum_en: "Harmonizing external action with inner renunciation. The wise person lives in the world untouched by attachment, like a lotus leaf in water.",
      sum_hi: "बाहरी कर्म त्याग और आंतरिक आसक्ति त्याग का सामंजस्य। जल में कमल पत्र की भांति संसार में निर्लिप्त रहना।",
      sum_te: "తామరాకుపై నీటి బిందువు వలె ప్రపంచంలో ఉంటూనే అంటిముట్టనట్లు జీవించే జీవన విధానం వివరించబడింది.",
      count: 29,
      section: "karma"
    },
    {
      num: 6,
      sa: "आत्मसंयमयोगः (ध्यानयोगः)",
      translit: "Ātmasamyama Yoga (Dhyāna Yoga)",
      en: "The Yoga of Meditation and Self-Control",
      hi: "आत्मसंयम योग / ध्यान योग (मन का निग्रह)",
      te: "ఆత్మసంయమ యోగము (ధ్యాన యోగము)",
      sum_en: "Mastering the restless mind through practice (Abhyasa) and detachment (Vairagya), practical posture and meditation techniques, and self-elevation.",
      sum_hi: "मन के निग्रह की विधियाँ, ध्यान का अभ्यास, वैराग्य और स्वयं को अपना मित्र बनाने की प्रेरणा।",
      sum_te: "అభ్యాసం మరియు వైరాగ్యాల ద్వారా చంచలమైన మనస్సును ఎలా నియంత్రించాలో మరియు ధ్యాన పద్ధతులను వివరిస్తుంది.",
      count: 47,
      section: "karma"
    },
    {
      num: 7,
      sa: "ज्ञानविज्ञानयोगः",
      translit: "Jñāna Vijñāna Yoga",
      en: "The Yoga of Knowledge and Realization",
      hi: "ज्ञान-विज्ञान योग (अनुभवजन्य ज्ञान)",
      te: "జ్ఞాన విజ్ఞాన యోగము",
      sum_en: "Krishna reveals His manifest and unmanifest energies (Prakriti), the three Gunas, and the four types of seekers who turn to the Divine.",
      sum_hi: "परा और अपरा प्रकृति का स्वरूप, त्रिगुणमयी माया और ईश्वर की शरण में आने वाले चार प्रकार के भक्त।",
      sum_te: "సృష్టి రహస్యాలు, మాయాతత్త్వము మరియు దైవాన్ని ఆశ్రయించే నాలుగు రకాల భక్తుల వివరణ.",
      count: 30,
      section: "bhakti"
    },
    {
      num: 8,
      sa: "अक्षरब्रह्मयोगः",
      translit: "Akṣara Brahma Yoga",
      en: "The Yoga of the Imperishable Absolute",
      hi: "अक्षर ब्रह्म योग (परम गति और अविनाशी ब्रह्म)",
      te: "అక్షర పరబ్రహ్మ యోగము",
      sum_en: "The eternal imperishable Brahman, understanding creation and cosmic cycles, and the spiritual art of remembrance at life's final moment.",
      sum_hi: "अविनाशी ब्रह्म का स्वरूप, जीवन के अंतिम क्षण में ईश्वर स्मरण का महत्त्व और आवागमन से मुक्ति का मार्ग।",
      sum_te: "అవసాన కాలంలో దైవాన్ని స్మరించడం మరియు పునర్జన్మ లేని పరమ పదాన్ని చేరుకునే మార్గము.",
      count: 28,
      section: "bhakti"
    },
    {
      num: 9,
      sa: "राजविद्याराजगुह्ययोगः",
      translit: "Rāja Vidyā Rāja Guhya Yoga",
      en: "The Yoga of Royal Knowledge and Royal Secret",
      hi: "राजविद्या राजगुह्य योग (परम गोपनीय ज्ञान)",
      te: "రాజవిద్యా రాజగుహ్య యోగము",
      sum_en: "The sovereign spiritual secret: unconditional divine love, the simplicity of heartfelt offerings, and Krishna's promise to protect the devoted.",
      sum_hi: "समस्त विद्याओं का राजा, अनन्य भक्ति की शक्ति और श्रीकृष्ण का अभय वचन: 'योगक्षेमं वहाम्यहम्'।",
      sum_te: "అత్యంత రహస్యమైన దివ్య జ్ఞానము, భక్తుల యోగక్షేమాలను తానే వహిస్తాననే అభయ ప్రదానము.",
      count: 34,
      section: "bhakti"
    },
    {
      num: 10,
      sa: "विभूतियोगः",
      translit: "Vibhūti Yoga",
      en: "The Yoga of Divine Manifestations",
      hi: "विभूति योग (ईश्वर के ऐश्वर्य और विस्तार)",
      te: "విభూతి యోగము",
      sum_en: "Krishna reveals His divine splendour across creation: radiant among the suns, silence among secrets, wisdom among knowers, and courage in the brave.",
      sum_hi: "सृष्टि के समस्त वैभव, तेज और सौन्दर्य में परमात्मा की विभूतियों का साक्षात् दर्शन।",
      sum_te: "సకల చరాచర సృష్టిలోని శ్రేష్ఠమైన ప్రతి రూపంలోనూ భగవంతుని దివ్య విభూతుల దర్శనము.",
      count: 42,
      section: "bhakti"
    },
    {
      num: 11,
      sa: "विश्वरूपदर्शनयोगः",
      translit: "Viśvarūpa Darśana Yoga",
      en: "The Yoga of the Vision of the Cosmic Form",
      hi: "विश्वरूप दर्शन योग (विराट् स्वरूप का साक्षात्कार)",
      te: "విశ్వరూప సందర్శన యోగము",
      sum_en: "Arjuna is granted divine sight to behold Krishna's awe-inspiring Cosmic Form, encompassing all worlds, stars, cosmic time, and the destinies of all beings.",
      sum_hi: "अर्जुन को दिव्य दृष्टि की प्राप्ति और श्रीकृष्ण के अनन्त, कालजयी विराट् रूप का विस्मयकारी दर्शन।",
      sum_te: "అర్జునునికి దివ్యచక్షువుల ప్రాప్తి మరియు కాలస్వరూపుడైన శ్రీకృష్ణుని అద్భుత విశ్వరూప సందర్శనము.",
      count: 55,
      section: "bhakti"
    },
    {
      num: 12,
      sa: "भक्तियोगः",
      translit: "Bhakti Yoga",
      en: "The Yoga of Devotion",
      hi: "भक्ति योग (प्रेम और समर्पण का मार्ग)",
      te: "భక్తి యోగము",
      sum_en: "The attributes of the beloved seeker: free from malice, compassionate, patient, content, equanimous in praise and blame, and centered in loving devotion.",
      sum_hi: "सगुण और निर्गुण भक्ति की तुलना, भगवान के प्रिय भक्त के सद्गुण (द्वेषहीनता, करुणा, समता, संतोष)।",
      sum_te: "భగవంతునికి ప్రీతిపాత్రుడైన భక్తుని లక్షణాలు: ద్వేషం లేకపోవడం, దయ, సుఖదుఃఖాలలో సమభావము.",
      count: 20,
      section: "bhakti"
    },
    {
      num: 13,
      sa: "क्षेत्रक्षेत्रज्ञविभागयोगः",
      translit: "Kṣetra Kṣetrajña Vibhāga Yoga",
      en: "The Yoga of the Field and the Knower",
      hi: "क्षेत्र-क्षेत्रज्ञ विभाग योग (शरीर और आत्मा का भेद)",
      te: "క్షేత్ర క్షేత్రజ్ఞ విభాగ యోగము",
      sum_en: "Distinguishing between the physical body/mind complex (the Field) and the indwelling conscious witness (the Knower). Contains 35 verses in this corpus.",
      sum_hi: "शरीर (क्षेत्र) और आत्मा (क्षेत्रज्ञ) का तात्त्विक भेद। ज्ञान, अज्ञान और ज्ञेय (परमात्मा) का विस्तृत निरूपण।",
      sum_te: "శరీరము (క్షేత్రము) మరియు ఆత్మ (క్షేత్రజ్ఞుడు) మధ్య గల భేదము మరియు నిజమైన జ్ఞాన స్వరూపం.",
      count: 35,
      section: "jnana"
    },
    {
      num: 14,
      sa: "गुणत्रयविभागयोगः",
      translit: "Guṇatraya Vibhāga Yoga",
      en: "The Yoga of the Three Modes of Nature",
      hi: "गुणत्रय विभाग योग (सत्त्व, रज और तम गुण)",
      te: "గుణత్రయ విభాగ యోగము",
      sum_en: "Anatomy of the three Gunas: Sattva (clarity/harmony), Rajas (passion/craving), and Tamas (inertia/delusion), and how the illumined soul transcends them.",
      sum_hi: "प्रकृति के तीन गुणों (सत्त्व, रज, तम) का प्रभाव, उनका बंधन और गुणातीत होने का मार्ग।",
      sum_te: "ప్రకృతి యొక్క త్రిగుణాలు (సత్వ, రజో, తమో గుణాలు), వాటి బంధాలు మరియు గుణాతీతుని స్థితి.",
      count: 27,
      section: "jnana"
    },
    {
      num: 15,
      sa: "पुरुषोत्तमयोगः",
      translit: "Puruṣottama Yoga",
      en: "The Yoga of the Supreme Person",
      hi: "पुरुषोत्तम योग (अश्वत्थ वृक्ष और परम पुरुष)",
      te: "పురుషోత్తమ ప్రాప్తి యోగము",
      sum_en: "The inverted Ashvattha tree of material existence severed with detachment, and the glory of the Supreme Divine beyond the perishable and imperishable.",
      sum_hi: "उलटे संसार रूपी अश्वत्थ वृक्ष का छेदन, क्षर और अक्षर से परे पुरुषोत्तम तत्त्व का परम रहस्य।",
      sum_te: "సంసార వృక్షం, వైరాగ్యంతో దానిని ఛేదించడం మరియు పురుషోత్తమ తత్త్వము.",
      count: 20,
      section: "jnana"
    },
    {
      num: 16,
      sa: "दैवासुरसम्पद्विभागयोगः",
      translit: "Daivāsura Sampad Vibhāga Yoga",
      en: "The Yoga of Divine and Demonic Natures",
      hi: "दैवासुर सम्पद् विभाग योग (दैवी और आसुरी प्रवृत्तियाँ)",
      te: "దైవాసుర సంపద్విభాగ యోగము",
      sum_en: "Contrasting the liberating divine virtues (truthfulness, fearlessness, compassion) against the binding demonic tendencies (arrogance, greed, lust, and wrath).",
      sum_hi: "मुक्तिदायक दैवी संपदा और बन्धनकारी आसुरी प्रवृत्तियों का गहन मनोवैज्ञानिक विवेचन।",
      sum_te: "మోక్షమును ప్రసాదించే దైవీ గుణాలు మరియు బంధాన్ని కలిగించే ఆసురీ గుణాల విశ్లేషణ.",
      count: 24,
      section: "jnana"
    },
    {
      num: 17,
      sa: "श्रद्धात्रयविभागयोगः",
      translit: "Śraddhātraya Vibhāga Yoga",
      en: "The Yoga of the Threefold Faith",
      hi: "श्रद्धात्रय विभाग योग (श्रद्धा, आहार और तप के प्रकार)",
      te: "శ్రద్ధాత్రయ విభాగ యోగము",
      sum_en: "How human temperament shapes faith, diet, discipline (Tapas), and charity (Dana), and the transcendent purifying mantra OM TAT SAT.",
      sum_hi: "मानव स्वभाव के अनुरूप सात्त्विक, राजसिक और तामसिक श्रद्धा, आहार, तप और दान का स्वरूप।",
      sum_te: "సాత్త్విక, రాజస, తామస శ్రద్ధలు, ఆహార నియమాలు మరియు 'ఓం తత్ సత్' ప్రాముఖ్యత.",
      count: 28,
      section: "jnana"
    },
    {
      num: 18,
      sa: "मोक्षसंन्यासयोगः",
      translit: "Mokṣa Sannyāsa Yoga",
      en: "The Yoga of Liberation through Renunciation",
      hi: "मोक्ष संन्यास योग (त्याग, संन्यास और परम शरणागति)",
      te: "మోక్ష సన్న్యాస యోగము",
      sum_en: "The grand culmination: the true meaning of renunciation (Tyaga), five causes of action, intellect, fortitude, and Krishna's final call to complete surrender.",
      sum_hi: "सम्पूर्ण गीता का सार: त्याग का मर्म, कर्म के हेतु, तथा श्रीकृष्ण का अंतिम सन्देश: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज'।",
      sum_te: "సంపూర్ణ గీతాసారము: త్యాగము, పంచకర్మ హేతువులు మరియు శ్రీకృష్ణుని చరమ శ్లోకమైన సర్వధర్మ పరిత్యాగము.",
      count: 78,
      section: "jnana"
    }
  ];

  // --- 2. I18N DICTIONARY ---
  const I18N = {
    en: {
      tagline: "ANCIENT WISDOM · MODERN LIFE",
      nav_home: "Home",
      nav_chapters: "18 Chapters",
      nav_reader: "Verse Reader",
      nav_ask: "Ask Krishna",
      nav_library: "Saved & History",
      nav_daily: "Daily Wisdom",
      search_btn: "Search",
      topics_label: "Topics:",
      search_prompt: "Search all 701 verses by reference (e.g. 2.47), Sanskrit word, or concept.",
      hero_eyebrow: "TIMELESS WISDOM · AUTHENTIC LEARNING",
      hero_title: "Discover the Song Divine.<br><em>Illumine Your Journey.</em>",
      hero_desc: "A research-conscious, beginner-friendly companion to all 18 chapters and 701 verses of the Bhagavad Gita. Explore original Sanskrit verses, authentic word-by-word meanings, and structured philosophical guidance in four languages.",
      hero_btn_ask: "Ask Krishna Guidance",
      hero_btn_chapters: "Explore 18 Chapters",
      continue_reading: "Continue Your Reading Journey",
      resume_btn: "Resume Reading →",
      pillars_eyebrow: "FOUR PILLARS OF GITAMITRA",
      pillars_title: "Rooted in Authenticity, Crafted for Clarity",
      pillars_desc: "Balancing profound scriptural precision with accessible daily application.",
      card_ask_kicker: "AI SITUATION GUIDANCE",
      card_ask_title: "Ask Krishna",
      card_ask_desc: "Share a life challenge, anxiety, or question. Receive grounded guidance matched directly to authentic Gita verses.",
      card_ask_cta: "Seek guidance",
      card_chapters_kicker: "THE 18 YOGAS",
      card_chapters_title: "All 18 Chapters",
      card_chapters_desc: "From Arjuna's moral dilemma in Chapter 1 to Moksha in Chapter 18, journey through every chapter's unique teaching.",
      card_chapters_cta: "Browse catalogue",
      card_reader_kicker: "DEEP VERSE STUDY",
      card_reader_title: "Verse Reader & Word Meanings",
      card_reader_desc: "Every verse formatted with Devanagari, transliteration, word-by-word Sanskrit glosses, and 6-point structured explanations.",
      card_reader_cta: "Open reader",
      card_daily_kicker: "MOMENT OF PAUSE",
      card_daily_title: "Daily Shloka",
      card_daily_desc: "Reflect upon one carefully chosen verse each day with practical everyday mindfulness takeaways.",
      card_daily_cta: "Read today's shloka",
      overview_eyebrow: "THE EIGHTEEN CHAPTERS",
      overview_title: "Explore the Chapters",
      view_all_chapters: "View All 18 Chapters →",
      catalogue_eyebrow: "THE COMPLETE DIALOGUE",
      catalogue_title: "The 18 Chapters of the <em>Bhagavad Gita.</em>",
      catalogue_desc: "Structured in three classic sections: Karma Yoga (Chapters 1–6), Bhakti Yoga (Chapters 7–12), and Jnana Yoga (Chapters 13–18). Select any chapter to begin reading its verses.",
      btn_bookmark: "Bookmark",
      btn_copy: "Copy",
      ask_eyebrow: "SPIRITUAL REFLECTION & DISCOVERY",
      ask_title: "Ask <em>Krishna.</em>",
      ask_desc: "Share a challenge, decision, or question on your mind. GitaMitra searches the verified 701-verse Bhagavad Gita corpus to retrieve relevant teachings and provides structured educational reflections.",
      reflection_space: "Your Reflection Space",
      reflection_sub: "Grounded in authentic Gita verses",
      ask_input_label: "What situation or question is on your heart?",
      common_questions: "Frequently explored questions:",
      find_teaching_btn: "Find Gita Teaching",
      ask_disclaimer: "Respectful educational study companion. Scripture verses are authentic source text; practical reflections are study interpretations, not direct quotations from Krishna or a substitute for medical/professional care.",
      ask_placeholder_title: "Timeless wisdom awaits your question.",
      ask_placeholder_desc: "Type your inquiry or choose a topic above. GitaMitra will search the corpus and provide relevant teachings with original Sanskrit shlokas and practical applications.",
      library_eyebrow: "YOUR PERSONAL STUDY",
      library_title: "Saved & <em>Reading Progress.</em>",
      library_desc: "Track your journey through the 701 verses of the Bhagavad Gita and revisit your bookmarked passages.",
      verses_read: "Verses Read",
      chapters_explored: "Chapters Explored",
      bookmarks_saved: "Saved Bookmarks",
      daily_eyebrow: "A MOMENT OF STILLNESS",
      daily_title: "Daily <em>Shloka.</em>",
      daily_desc: "One timeless verse to read slowly, meditate upon, and carry into your actions today."
    },
    hi: {
      tagline: "शाश्वत ज्ञान · आधुनिक जीवन",
      nav_home: "मुखपृष्ठ",
      nav_chapters: "१८ अध्याय",
      nav_reader: "श्लोक पठन",
      nav_ask: "कृष्ण से पूछें",
      nav_library: "सहेजे गए श्लोक",
      nav_daily: "दैनिक श्लोक",
      search_btn: "खोजें",
      topics_label: "विषय:",
      search_prompt: "अध्याय.श्लोक (उदा. 2.47), संस्कृत शब्द या जीवन विषय से ७०१ श्लोकों में खोजें।",
      hero_eyebrow: "शाश्वत ज्ञान · प्रामाणिक अध्ययन",
      hero_title: "श्रीमद्भगवद्गीता के दिव्य स्वर。<br><em>जीवन को आलोकित करें।</em>",
      hero_desc: "श्रीमद्भगवद्गीता के सभी १८ अध्यायों और ७०१ श्लोकों का प्रामाणिक, सरल और शोध-सम्मत डिजिटल मंच। मूल संस्कृत श्लोक, पदच्छेद (शब्दार्थ), और विस्तृत व्याख्या चार भाषाओं में उपलब्ध।",
      hero_btn_ask: "कृष्ण से मार्गदर्शन पूछें",
      hero_btn_chapters: "१८ अध्यायों का अन्वेषण करें",
      continue_reading: "अपनी पठन यात्रा जारी रखें",
      resume_btn: "आगे पढ़ें →",
      pillars_eyebrow: "गीतामित्र के चार प्रमुख आधार",
      pillars_title: "शास्त्र की प्रामाणिकता, ज्ञान की सरलता",
      pillars_desc: "पारंपरिक शास्त्रों की शुद्धता और व्यावहारिक जीवन का सुगम समन्वय।",
      card_ask_kicker: "जीवन स्थिति मार्गदर्शन",
      card_ask_title: "कृष्ण से पूछें",
      card_ask_desc: "अपने जीवन की दुविधा, क्रोध, भय या असमंजस साझा करें। वास्तविक गीता श्लोकों पर आधारित विचारशील मार्गदर्शन पाएं।",
      card_ask_cta: "मार्गदर्शन पाएं",
      card_chapters_kicker: "अठारह योग",
      card_chapters_title: "समस्त १८ अध्याय",
      card_chapters_desc: "अध्याय १ के अर्जुन विषाद से लेकर अध्याय १८ के मोक्ष संन्यास तक, प्रत्येक अध्याय के विशिष्ट ज्ञान को समझें।",
      card_chapters_cta: "अध्याय सूची देखें",
      card_reader_kicker: "गहन श्लोक अध्ययन",
      card_reader_title: "श्लोक पठन व शब्दार्थ",
      card_reader_desc: "प्रत्येक श्लोक का देवनागरी पाठ, लिप्यंतरण, प्रत्येक संस्कृत शब्द का अर्थ और ६-स्तरीय विस्तृत व्याख्या।",
      card_reader_cta: "रीडर खोलें",
      card_daily_kicker: "आत्म-चिंतन का क्षण",
      card_daily_title: "दैनिक श्लोक",
      card_daily_desc: "प्रतिदिन एक प्रेरणादायक श्लोक का पाठ करें और उसके व्यावहारिक संदेश को अपने दिन में अपनाएं।",
      card_daily_cta: "आज का श्लोक पढ़ें",
      overview_eyebrow: "अठारह अध्याय",
      overview_title: "अध्यायों का अवलोकन",
      view_all_chapters: "सभी १८ अध्याय देखें →",
      catalogue_eyebrow: "सम्पूर्ण दिव्य संवाद",
      catalogue_title: "श्रीमद्भगवद्गीता के <em>१८ अध्याय</em>",
      catalogue_desc: "तीन मुख्य खंड: कर्म योग (अध्याय १-६), भक्ति योग (अध्याय ७-१२), और ज्ञान योग (अध्याय १३-१८)। श्लोक पढ़ने के लिए किसी भी अध्याय का चयन करें।",
      btn_bookmark: "सहेजें",
      btn_copy: "कॉपी करें",
      ask_eyebrow: "आध्यात्मिक चिंतन एवं मार्गदर्शन",
      ask_title: "कृष्ण से <em>पूछें।</em>",
      ask_desc: "अपने मन की बात, प्रश्न या जीवन की कठिन परिस्थिति साझा करें। गीतामित्र ७०१ प्रामाणिक श्लोकों में से सबसे प्रासंगिक उपदेश खोजकर उसका मर्म समझाता है।",
      reflection_space: "आपका चिंतन स्थल",
      reflection_sub: "प्रामाणिक गीता श्लोकों पर आधारित",
      ask_input_label: "आपके हृदय में क्या प्रश्न या परिस्थिति है?",
      common_questions: "प्रायः पूछे जाने वाले प्रश्न:",
      find_teaching_btn: "गीता का उपदेश खोजें",
      ask_disclaimer: "यह अध्ययन-साथी साधन है। श्लोक प्रामाणिक हैं; व्यावहारिक व्याख्या शैक्षिक अध्ययन है, सीधे श्रीकृष्ण के मुख का उद्धरण नहीं।",
      ask_placeholder_title: "शाश्वत ज्ञान आपके प्रश्न की प्रतीक्षा में है।",
      ask_placeholder_desc: "ऊपर अपना प्रश्न लिखें या कोई विषय चुनें। गीतामित्र मूल श्लोक और व्यावहारिक अर्थ के साथ मार्गदर्शन प्रस्तुत करेगा।",
      library_eyebrow: "आपका व्यक्तिगत स्वाध्याय",
      library_title: "सहेजे गए श्लोक एवं <em>पठन प्रगति।</em>",
      library_desc: "भगवद्गीता के ७०१ श्लोकों में अपनी अध्ययन प्रगति देखें और अपने पसंदीदा श्लोकों को पुनः पढ़ें।",
      verses_read: "पढ़े गए श्लोक",
      chapters_explored: "आरंभ किए गए अध्याय",
      bookmarks_saved: "सहेजे गए श्लोक",
      daily_eyebrow: "शांति का एक क्षण",
      daily_title: "दैनिक <em>श्लोक।</em>",
      daily_desc: "एक श्लोक धीरे-धीरे पढ़ने, मनन करने और अपने आचरण में उतारने के लिए।"
    },
    te: {
      tagline: "సనాతన జ్ఞానము · ఆధునిక జీవనము",
      nav_home: "హోమ్",
      nav_chapters: "18 అధ్యాయాలు",
      nav_reader: "శ్లోక పఠనం",
      nav_ask: "కృష్ణుని అడగండి",
      nav_library: "సేవ్ చేసినవి",
      nav_daily: "దైనిక శ్లోకం",
      search_btn: "వెతకండి",
      topics_label: "విషయాలు:",
      search_prompt: "అధ్యాయం.శ్లోకం (ఉదా. 2.47), సంస్కృత పదం లేదా భావన ద్వారా 701 శ్లోకాలలో వెతకండి.",
      hero_eyebrow: "సనాతన జ్ఞానం · ప్రామాణిక అధ్యయనం",
      hero_title: "భగవద్గీతా దివ్య ప్రబోధం.<br><em>మీ జీవనానికి మార్గదర్శి.</em>",
      hero_desc: "భగవద్గీతలోని మొత్తం 18 అధ్యాయాలు మరియు 701 శ్లోకాల సమగ్ర అధ్యయన వేదిక. సంస్కృత మూల శ్లోకాలు, ప్రతిపదార్థాలు, మరియు సమగ్ర తాత్త్విక వివరణలు నాలుగు భాషలలో లభ్యం.",
      hero_btn_ask: "కృష్ణుని మార్గదర్శకత్వం",
      hero_btn_chapters: "18 అధ్యాయాలు వీక్షించండి",
      continue_reading: "మీ పఠనాన్ని కొనసాగించండి",
      resume_btn: "చదవడం కొనసాగించండి →",
      pillars_eyebrow: "గీతామిత్ర నాలుగు స్తంభాలు",
      pillars_title: "శాస్త్ర ప్రామాణికత, సరళ సుబోధకత",
      pillars_desc: "శాస్త్రాల పవిత్రత మరియు నిత్య జీవనానికి అవసరమైన సమన్వయము.",
      card_ask_kicker: "సమస్యలకు పరిష్కారం",
      card_ask_title: "కృష్ణుని అడగండి",
      card_ask_desc: "మీ జీవన సవాళ్లు, ఆందోళనలను తెలపండి. ప్రామాణిక గీతా శ్లోకాల ఆధారంగా మార్గదర్శకత్వాన్ని పొందండి.",
      card_ask_cta: "మార్గదర్శకత్వం పొందండి",
      card_chapters_kicker: "18 యోగములు",
      card_chapters_title: "మొత్తం 18 అధ్యాయాలు",
      card_chapters_desc: "అర్జున విషాద యోగం నుండి మోక్ష సన్న్యాస యోగం వరకు ప్రతి అధ్యాయం యొక్క విశేషాలను తెలుసుకోండి.",
      card_chapters_cta: "అధ్యాయాలు చూడండి",
      card_reader_kicker: "లోతైన శ్లోక పఠనం",
      card_reader_title: "శ్లోక రీడర్ & ప్రతిపదార్థాలు",
      card_reader_desc: "దేవనాగరి లిపి, ఆంగ్ల లిప్యంతరీకరణ, ప్రతిపదార్థాలు మరియు 6 అంచెల సమగ్ర వివరణ.",
      card_reader_cta: "రీడర్ తెరవండి",
      card_daily_kicker: "ప్రశాంత క్షణం",
      card_daily_title: "దైనిక శ్లోకం",
      card_daily_desc: "ప్రతిరోజూ ఒక అమూల్యమైన శ్లోకాన్ని ధ్యానించి, ఆచరణలో పెట్టండి.",
      card_daily_cta: "నేటి శ్లోకం చదవండి",
      overview_eyebrow: "పద్దెనిమిది అధ్యాయాలు",
      overview_title: "అధ్యాయాల సారాంశం",
      view_all_chapters: "అన్ని 18 అధ్యాయాలు →",
      catalogue_eyebrow: "సంపూర్ణ దివ్య సంభాషణ",
      catalogue_title: "భగవద్గీతలోని <em>18 అధ్యాయాలు</em>",
      catalogue_desc: "కర్మ యోగం (1-6), భక్తి యోగం (7-12), జ్ఞాన యోగం (13-18). శ్లోకాలు చదవడానికి అధ్యాయాన్ని ఎంచుకోండి.",
      btn_bookmark: "సేవ్ చేయండి",
      btn_copy: "కాపీ చేయండి",
      ask_eyebrow: "ఆధ్యాత్మిక ఆలోచన & అన్వేషణ",
      ask_title: "కృష్ణుని <em>అడగండి.</em>",
      ask_desc: "మీ సమస్యలను లేదా ప్రశ్నలను పంచుకోండి. గీతామిత్ర సరిపోయే శ్లోకాలను వెతికి సులభమైన వివరణను అందిస్తుంది.",
      reflection_space: "మీ ఆలోచనా వేదిక",
      reflection_sub: "ప్రామాణిక శ్లోకాల ఆధారంగా",
      ask_input_label: "మీ మనసులోని ప్రశ్న లేదా పరిస్థితి ఏమిటి?",
      common_questions: "తరచుగా అడిగే ప్రశ్నలు:",
      find_teaching_btn: "గీతా సందేశాన్ని వెతకండి",
      ask_disclaimer: "ఇది ఒక విద్యా అధ్యయన వేదిక. శ్లోకాలు ప్రామాణికమైనవి; వివరణలు అధ్యయన ప్రయోజనార్థం మాత్రమే.",
      ask_placeholder_title: "దివ్య జ్ఞానం మీ ప్రశ్న కొరకు వేచివుంది.",
      ask_placeholder_desc: "మీ ప్రశ్నను నమోదు చేయండి. గీతామిత్ర మూల శ్లోకము మరియు ఆచరణాత్మక వివరణతో సమాధానమిస్తుంది.",
      library_eyebrow: "మీ వ్యక్తిగత స్వాధ్యాయం",
      library_title: "సేవ్ చేసినవి & <em>పఠన ప్రగతి.</em>",
      library_desc: "701 శ్లోకాలలో మీరు చదివిన శ్లోకాలను మరియు సేవ్ చేసుకున్న శ్లోకాలను ఇక్కడ వీక్షించండి.",
      verses_read: "చదివిన శ్లోకాలు",
      chapters_explored: "ప్రారంభించిన అధ్యాయాలు",
      bookmarks_saved: "సేవ్ చేసిన శ్లోకాలు",
      daily_eyebrow: "ప్రశాంత క్షణం",
      daily_title: "దైనిక <em>శ్లోకం.</em>",
      daily_desc: "శ్రద్ధతో చదివి, మననం చేసుకొని, రోజువారీ పనులలో ఆచరించాల్సిన దివ్య శ్లోకం."
    },
    sa: {
      tagline: "शाश्वतं ज्ञानम् · आधुनिकोपयोगाय",
      nav_home: "गृहम्",
      nav_chapters: "अष्टादशाध्यायाः",
      nav_reader: "श्लोकपठनम्",
      nav_ask: "कृष्णं पृच्छतु",
      nav_library: "रक्षिताः श्लोकाः",
      nav_daily: "दैनिकश्लोकः",
      search_btn: "अन्विष्यताम्",
      topics_label: "विषयाः:",
      search_prompt: "अध्याय.श्लोक (उदा. २.४७), संस्कृतपदं वा अन्विष्यताम्।",
      hero_eyebrow: "सनातनं ज्ञानम् · प्रामाणिकमध्ययनम्",
      hero_title: "श्रीमद्भगवद्गीतायाः दिव्यस्वराः।<br><em>जीवनं प्रकाशयन्तु।</em>",
      hero_desc: "समग्र श्रीमद्भगवद्गीतायाः अष्टादशाध्यायानां सप्तशतैक (७०१) श्लोकानां च प्रामाणिकं डिजिटल-स्थानम्। मूलसंस्कृतश्लोकाः, पदच्छेदाः, विशदव्याख्यानानि च।",
      hero_btn_ask: "कृष्णस्य मार्गदर्शनम्",
      hero_btn_chapters: "अष्टादशाध्यायाः",
      continue_reading: "पठनं निरन्तरं कुरुत",
      resume_btn: "पठतु →",
      pillars_eyebrow: "गीतामित्रस्य चत्वारः स्तम्भाः",
      pillars_title: "शास्त्रप्रामाण्यं सुगमबोधश्च",
      pillars_desc: "मूलशास्त्रसंरक्षणं दैनिकजीवने तस्यान्वयश्च।",
      card_ask_kicker: "जीवनमार्गदर्शनम्",
      card_ask_title: "कृष्णं पृच्छतु",
      card_ask_desc: "स्वसंशयं विषादं वा कथयन्तु। भगवद्गीतायाः श्लोकैः समाधानं लभध्वम्।",
      card_ask_cta: "मार्गदर्शनं लभताम्",
      card_chapters_kicker: "अष्टादशयोगाः",
      card_chapters_title: "समग्राः १८ अध्यायाः",
      card_chapters_desc: "प्रथमतो विषादयोगान्मोक्षसंन्यासयोगपर्यन्तं प्रत्येकस्याध्यायस्य ज्ञानम्।",
      card_chapters_cta: "अध्यायान् पश्यन्तु",
      card_reader_kicker: "गहनश्लोकाध्ययनम्",
      card_reader_title: "श्लोकपाठः पदच्छेदश्च",
      card_reader_desc: "देवनागरीपाठः, प्रतिपदार्थः, षडङ्गव्याख्या च।",
      card_reader_cta: "रीडर् उद्घाट्यताम्",
      card_daily_kicker: "शान्तिक्षणः",
      card_daily_title: "दैनिकश्लोकः",
      card_daily_desc: "प्रतिदिनमेकं श्लोकं ध्यात्वा तदनुसारं कर्म कुरुत।",
      card_daily_cta: "श्लोकं पठतु",
      overview_eyebrow: "अष्टादशाध्यायाः",
      overview_title: "अध्यायविवरणम्",
      view_all_chapters: "सर्वे अध्यायाः →",
      catalogue_eyebrow: "सम्पूर्णः संवादः",
      catalogue_title: "भगवद्गीतायाः <em>१८ अध्यायाः</em>",
      catalogue_desc: "कर्मयोगः (१-६), भक्तियोगः (७-१२), ज्ञानयोगः (१३-१८)। श्लोकपठनाय कंचिदध्यायं वृणुध्वम्।",
      btn_bookmark: "रक्ष्यताम्",
      btn_copy: "प्रतिलिप्यताम्",
      ask_eyebrow: "आध्यात्मिकं चिन्तनम्",
      ask_title: "कृष्णं <em>पृच्छतु।</em>",
      ask_desc: "स्वमनोगतं प्रश्नं प्रदर्शयतु। गीतामित्रं सप्तशतैकश्लोकेषु युक्ततमं श्लोकमुपस्थापयति।",
      reflection_space: "भवतां चिन्तनस्थानम्",
      reflection_sub: "प्रामाणिकश्लोकाधारितम्",
      ask_input_label: "किं चिन्तयति भवान्?",
      common_questions: "प्रायशः पृष्टाः प्रश्नाः:",
      find_teaching_btn: "उपदेशमन्विष्यताम्",
      ask_disclaimer: "इदं स्वाध्यायोपकरणं वर्तते। श्लोकाः प्रामाणिकाः, व्याख्यानं तु अध्ययनार्थम्।",
      ask_placeholder_title: "दिव्यं ज्ञानं भवतां प्रश्नं प्रतीक्षते।",
      ask_placeholder_desc: "ऊर्ध्वं प्रश्नं लिखन्तु। गीतामित्रं मूलश्लोकं व्यावहारिकं चार्थमुपस्थापयिष्यति।",
      library_eyebrow: "स्वाध्यायप्रगतिः",
      library_title: "रक्षिताः श्लोकाः <em>पठनप्रगतिश्च।</em>",
      library_desc: "७०१ श्लोकेषु स्वाध्यायप्रगतिं पश्यन्तु रक्षितान् श्लोकांश्च पुनरवलोकयन्तु।",
      verses_read: "पठिताः श्लोकाः",
      chapters_explored: "आरब्धाः अध्यायाः",
      bookmarks_saved: "रक्षिताः श्लोकाः",
      daily_eyebrow: "शान्तिक्षणः",
      daily_title: "दैनिक<em>श्लोकः।</em>",
      daily_desc: "ध्यानाय आचरणाय च एकः पावनः श्लोकः।"
    }
  };

  // --- 3. APPLICATION STATE ---
  const $ = selector => document.querySelector(selector);
  const $$ = selector => document.querySelectorAll(selector);

  const corpus = Array.isArray(window.GITA_DATA) ? window.GITA_DATA : [];
  const engine = window.GitaEngine || {};

  let currentChapter = Number(localStorage.getItem("gm_last_chapter")) || 1;
  let currentVerse = Number(localStorage.getItem("gm_last_verse")) || 1;
  let activeLang = localStorage.getItem("gm_language") || "en";

  // Local storage for bookmarks and history
  let bookmarks = [];
  try {
    bookmarks = JSON.parse(localStorage.getItem("gm_bookmarks") || "[]");
  } catch (_) { bookmarks = []; }

  let readingHistory = [];
  try {
    readingHistory = JSON.parse(localStorage.getItem("gm_history") || "[]");
  } catch (_) { readingHistory = []; }

  // Unique verses read tracking (Set of "ch.ve")
  const versesReadSet = new Set(readingHistory.map(h => `${h.chapter}.${h.verse}`));

  // --- 4. UTILITIES ---
  function showToast(msg) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("active");
    setTimeout(() => toast.classList.remove("active"), 2800);
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function getVersesForChapter(chNum) {
    return corpus
      .filter(v => Number(v.chapter) === chNum)
      .sort((a, b) => Number(a.verse) - Number(b.verse));
  }

  function getVerse(chNum, veNum) {
    return corpus.find(v => Number(v.chapter) === chNum && Number(v.verse) === veNum);
  }

  // --- 5. I18N UPDATE ---
  function applyLanguage(lang) {
    activeLang = lang;
    localStorage.setItem("gm_language", lang);

    // Update global dropdown
    const globalSelect = $("#global-language");
    if (globalSelect) globalSelect.value = lang;

    const dict = I18N[lang] || I18N.en;
    $$("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.innerHTML = dict[key];
    });

    // Re-render active view components
    renderHomeChapterPreview();
    renderChaptersCatalogue();
    renderCurrentVerse();
    renderProgressDashboard();
    renderDailyWisdom();
    renderTopicChips();
  }

  // --- 6. ROUTING & VIEW NAVIGATION ---
  function showView(viewId) {
    $$(".view").forEach(v => v.classList.toggle("active", v.id === viewId));
    $$("#main-nav .nav-link").forEach(b => b.classList.toggle("active", b.dataset.view === viewId));
    $("#main-nav")?.classList.remove("mobile-open");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (viewId === "reader") {
      renderCurrentVerse();
    } else if (viewId === "chapters") {
      renderChaptersCatalogue();
    } else if (viewId === "library") {
      renderProgressDashboard();
      renderLibraryContent("bookmarks");
    } else if (viewId === "home") {
      updateContinueBanner();
    }
  }

  // Global click listeners for [data-view] and [data-jump]
  document.addEventListener("click", e => {
    const viewBtn = e.target.closest("[data-view]");
    if (viewBtn) {
      e.preventDefault();
      const targetView = viewBtn.dataset.view;
      showView(targetView);
      return;
    }

    const jumpBtn = e.target.closest("[data-jump]");
    if (jumpBtn) {
      e.preventDefault();
      const parts = jumpBtn.dataset.jump.split(".");
      if (parts.length === 2) {
        openVerse(Number(parts[0]), Number(parts[1]));
        $("#search-modal").style.display = "none";
      }
      return;
    }
  });

  // Mobile menu toggle
  $("#mobile-menu-btn")?.addEventListener("click", () => {
    $("#main-nav")?.classList.toggle("mobile-open");
  });

  // Language selector change
  $("#global-language")?.addEventListener("change", e => {
    applyLanguage(e.target.value);
  });

  // --- 7. HOME VIEW HELPERS ---
  function updateContinueBanner() {
    const banner = $("#continue-reading-banner");
    const refSpan = $("#continue-verse-ref");
    if (!banner || !refSpan) return;

    if (readingHistory.length > 0) {
      const last = readingHistory[0];
      const chMeta = CHAPTERS_META[last.chapter - 1];
      refSpan.textContent = `Chapter ${last.chapter} (${chMeta?.en || ""}) · Verse ${last.verse}`;
      banner.style.display = "flex";
      $("#continue-verse-btn").onclick = () => openVerse(last.chapter, last.verse);
    } else {
      banner.style.display = "none";
    }
  }

  function renderHomeChapterPreview() {
    const grid = $("#home-chapter-preview");
    if (!grid) return;
    grid.innerHTML = "";

    // Show first 6 key chapters on home
    const previewChapters = [1, 2, 3, 6, 11, 18];
    previewChapters.forEach(n => {
      const c = CHAPTERS_META[n - 1];
      if (!c) return;
      const card = document.createElement("button");
      card.className = "mini-chapter-card";
      card.innerHTML = `
        <div class="mini-card-head">
          <span>CHAPTER ${String(n).padStart(2, "0")}</span>
          <span>${c.count} VERSES</span>
        </div>
        <div class="mini-card-title">${escapeHtml(activeLang === "hi" ? c.hi : activeLang === "te" ? c.te : c.en)}</div>
        <div class="mini-card-sa">${escapeHtml(c.sa)}</div>
        <div class="mini-card-desc">${escapeHtml(activeLang === "hi" ? c.sum_hi : activeLang === "te" ? c.sum_te : c.sum_en)}</div>
      `;
      card.addEventListener("click", () => openVerse(n, 1));
      grid.appendChild(card);
    });
  }

  // --- 8. CHAPTERS CATALOGUE VIEW ---
  let activeSectionFilter = "all";
  function renderChaptersCatalogue(searchFilter = "") {
    const container = $("#chapters-list-container");
    if (!container) return;
    container.innerHTML = "";

    const term = searchFilter.toLowerCase().trim();

    CHAPTERS_META.forEach(c => {
      // Filter by section
      if (activeSectionFilter !== "all" && c.section !== activeSectionFilter) return;

      // Filter by search term
      const searchable = `${c.num} ${c.sa} ${c.translit} ${c.en} ${c.hi} ${c.te} ${c.sum_en} ${c.sum_hi} ${c.sum_te}`.toLowerCase();
      if (term && !searchable.includes(term)) return;

      // Calculate verses read for this chapter
      const chapterVerses = getVersesForChapter(c.num);
      const readCount = chapterVerses.filter(v => versesReadSet.has(`${v.chapter}.${v.verse}`)).length;

      const card = document.createElement("button");
      card.className = "chapter-card";
      card.innerHTML = `
        <div class="chapter-badge-row">
          <span class="chapter-num-badge">CHAPTER ${String(c.num).padStart(2, "0")} · ${c.section.toUpperCase()} YOGA</span>
          <span class="chapter-verse-pill">${c.count} VERSES</span>
        </div>
        <div class="chapter-sa-title">${escapeHtml(c.sa)}</div>
        <div class="chapter-en-title">${escapeHtml(activeLang === "hi" ? c.hi : activeLang === "te" ? c.te : c.en)}</div>
        <div class="chapter-translit">${escapeHtml(c.translit)}</div>
        <div class="chapter-summary-text">${escapeHtml(activeLang === "hi" ? c.sum_hi : activeLang === "te" ? c.sum_te : c.sum_en)}</div>
        ${readCount > 0 ? `<div class="chapter-progress-pill">✓ ${readCount} of ${c.count} verses read (${Math.round(readCount / c.count * 100)}%)</div>` : ""}
      `;
      card.addEventListener("click", () => openVerse(c.num, 1));
      container.appendChild(card);
    });

    if (container.children.length === 0) {
      container.innerHTML = '<p class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted);">No matching chapters found. Try clearing your search filter.</p>';
    }
  }

  // Section filter tabs
  $$("#section-filter-tabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("#section-filter-tabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeSectionFilter = btn.dataset.section;
      renderChaptersCatalogue($("#chapter-filter-input")?.value || "");
    });
  });

  // Chapter filter input
  $("#chapter-filter-input")?.addEventListener("input", e => {
    renderChaptersCatalogue(e.target.value);
  });

  // --- 9. VERSE READER (CORE) ---
  function populateReaderDropdowns() {
    const chSelect = $("#reader-chapter-select");
    const veSelect = $("#reader-verse-select");
    if (!chSelect || !veSelect) return;

    chSelect.innerHTML = "";
    CHAPTERS_META.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.num;
      opt.textContent = `Ch ${c.num}: ${c.sa} (${c.en})`;
      chSelect.appendChild(opt);
    });
    chSelect.value = currentChapter;

    updateVerseSelectOptions();
  }

  function updateVerseSelectOptions() {
    const veSelect = $("#reader-verse-select");
    if (!veSelect) return;

    veSelect.innerHTML = "";
    const versesInCh = getVersesForChapter(currentChapter);
    versesInCh.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.verse;
      opt.textContent = `Verse ${v.verse}`;
      veSelect.appendChild(opt);
    });
    veSelect.value = currentVerse;
  }

  function openVerse(ch, ve) {
    currentChapter = ch;
    currentVerse = ve;
    localStorage.setItem("gm_last_chapter", ch);
    localStorage.setItem("gm_last_verse", ve);

    recordReadingHistory(ch, ve);
    populateReaderDropdowns();
    renderCurrentVerse();
    showView("reader");
  }

  function renderCurrentVerse() {
    const display = $("#current-verse-display");
    if (!display) return;

    const verse = getVerse(currentChapter, currentVerse);
    if (!verse) {
      display.innerHTML = `<div class="error-box"><p>Verse ${currentChapter}.${currentVerse} not found.</p></div>`;
      return;
    }

    const chMeta = CHAPTERS_META[currentChapter - 1];
    const versesInCh = getVersesForChapter(currentChapter);
    const totalInCh = versesInCh.length;

    // Prev / Next button states
    const prevBtn = $("#reader-prev-btn");
    const nextBtn = $("#reader-next-btn");
    if (prevBtn) {
      prevBtn.disabled = (currentChapter === 1 && currentVerse === 1);
    }
    if (nextBtn) {
      nextBtn.disabled = (currentChapter === 18 && currentVerse === totalInCh);
    }

    // Bookmark button state
    const isBookmarked = bookmarks.some(b => b.chapter === currentChapter && b.verse === currentVerse);
    const bmBtn = $("#bookmark-verse-btn");
    if (bmBtn) {
      bmBtn.classList.toggle("bookmarked", isBookmarked);
      bmBtn.querySelector(".bookmark-icon").textContent = isBookmarked ? "★" : "☆";
      bmBtn.querySelector(".util-label").textContent = isBookmarked ? "Saved" : (I18N[activeLang]?.btn_bookmark || "Bookmark");
    }

    // Speaker determination
    const speaker = engine.getSpeaker ? engine.getSpeaker(currentChapter, currentVerse, verse.sanskrit) : { sa: "श्रीभगवानुवाच", en: "Lord Krishna said", hi: "श्री भगवान बोले", te: "శ్రీ భగవానుడు పలికెను" };
    const speakerLabel = speaker[activeLang] || speaker.en;

    // Structured explanation
    const exp = engine.generateExplanation ? engine.generateExplanation(verse, activeLang) : {
      speaker: speakerLabel,
      simpleMeaning: verse.translation,
      detailedInterpretation: "Educational study interpretation.",
      context: "Dialogue on Kurukshetra.",
      philosophicalSignificance: "Vedantic core teaching.",
      practicalApplication: "Everyday mindfulness.",
      keyLesson: "Right action without attachment."
    };

    // Word by word formatted
    const wbwList = engine.formatWordByWord ? engine.formatWordByWord(verse.word_by_word) : [];

    // Translation according to tab selection or active language
    const currentTranslation = activeLang === "hi" ? verse.hindi : (activeLang === "te" ? verse.telugu : verse.translation);

    display.innerHTML = `
      <div class="verse-scripture-card">
        <div class="verse-meta-bar">
          <span class="verse-coordinate-badge">BHAGAVAD GITA · CHAPTER ${currentChapter}, VERSE ${currentVerse}</span>
          <span class="verse-speaker-badge">✦ ${escapeHtml(speakerLabel)}</span>
        </div>

        <!-- Devanagari Sanskrit Shloka -->
        <div class="verse-shloka-devanagari" lang="sa">
          ${escapeHtml(verse.sanskrit)}
        </div>

        <!-- Syllable IAST Transliteration -->
        <div class="verse-shloka-translit">
          ${escapeHtml(verse.transliteration)}
        </div>

        <!-- Translation Box with Language Tabs -->
        <div class="translation-box">
          <div class="translation-tabs">
            <button class="tr-tab ${activeLang === "en" ? "active" : ""}" data-trlang="en">English</button>
            <button class="tr-tab ${activeLang === "hi" ? "active" : ""}" data-trlang="hi">हिन्दी</button>
            <button class="tr-tab ${activeLang === "te" ? "active" : ""}" data-trlang="te">తెలుగు</button>
            <button class="tr-tab ${activeLang === "sa" ? "active" : ""}" data-trlang="sa">संस्कृतम्</button>
          </div>
          <div class="translation-rendered-text" id="verse-translation-target" lang="${activeLang === "hi" ? "hi" : (activeLang === "te" ? "te" : "en")}">
            ${activeLang === "sa" ? "<em>(संस्कृतमूलपाठः उपरि प्रदत्तः)</em>" : escapeHtml(currentTranslation)}
          </div>
        </div>
      </div>

      <!-- Word-by-Word Table (Requirement 2B) -->
      <section class="word-by-word-section">
        <div class="section-box-header">
          <div class="section-box-title">
            <span> पदच्छेदः</span>
            <strong>Word-by-Word Meaning</strong>
          </div>
          <span class="section-box-badge">${wbwList.length} Terms · Verified Source Gloss</span>
        </div>

        <div class="wbw-table-wrapper">
          <table class="wbw-table">
            <thead>
              <tr>
                <th>Sanskrit Word (संस्कृत शब्द)</th>
                <th>Transliteration (IAST)</th>
                <th>Meaning (अर्थ / అర్థము)</th>
              </tr>
            </thead>
            <tbody>
              ${wbwList.map(w => `
                <tr>
                  <td class="wbw-sa">${escapeHtml(w.sanskrit || w.word)}</td>
                  <td class="wbw-translit">${escapeHtml(w.transliteration || w.word)}</td>
                  <td class="wbw-meaning">${escapeHtml(w.meaning)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <p class="wbw-note">
          * Note: Word-by-word glosses are sourced from Gita Initiative unlicense source records. In keeping with research integrity, meanings are not artificially fabricated for missing grammatical fields.
        </p>
      </section>

      <!-- Detailed Explanation Card (Requirement 2C: 6 Structured Sections) -->
      <section class="detailed-explanation-card">
        <div class="section-box-header">
          <div class="section-box-title">
            <span>✧</span>
            <strong>Detailed Educational Explanation</strong>
          </div>
          <span class="section-box-badge">6 Structured Aspects</span>
        </div>

        <div class="explanation-grid">
          <!-- 1. Simple Meaning -->
          <div class="explain-block">
            <div class="block-header">
              <span class="block-icon">📖</span>
              <strong class="block-title">1. Simple Meaning</strong>
            </div>
            <p class="block-content">${escapeHtml(exp.simpleMeaning)}</p>
          </div>

          <!-- 2. Detailed Interpretation -->
          <div class="explain-block">
            <div class="block-header">
              <span class="block-icon">🔍</span>
              <strong class="block-title">2. Detailed Interpretation</strong>
            </div>
            <p class="block-content">${escapeHtml(exp.detailedInterpretation)}</p>
          </div>

          <!-- 3. Context in Dialogue -->
          <div class="explain-block">
            <div class="block-header">
              <span class="block-icon">🏹</span>
              <strong class="block-title">3. Dialogue Context (Krishna & Arjuna)</strong>
            </div>
            <p class="block-content">${escapeHtml(exp.context)}</p>
          </div>

          <!-- 4. Philosophical Significance -->
          <div class="explain-block">
            <div class="block-header">
              <span class="block-icon">☸</span>
              <strong class="block-title">4. Philosophical Significance</strong>
            </div>
            <p class="block-content">${escapeHtml(exp.philosophicalSignificance)}</p>
          </div>

          <!-- 5. Practical Application -->
          <div class="explain-block highlight-block full-width">
            <div class="block-header">
              <span class="block-icon">☼</span>
              <strong class="block-title">5. Practical Application in Everyday Life</strong>
            </div>
            <p class="block-content">${escapeHtml(exp.practicalApplication)}</p>
          </div>

          <!-- 6. Key Lesson to Remember -->
          <div class="explain-block highlight-block full-width">
            <div class="block-header">
              <span class="block-icon">💎</span>
              <strong class="block-title">6. Key Lesson to Remember</strong>
            </div>
            <p class="block-content key-lesson-text">“${escapeHtml(exp.keyLesson)}”</p>
          </div>
        </div>

        <div class="explanation-footer-note">
          Distinction note: The Sanskrit shloka and translations are traditional source texts. The structured 6-point explanation is an educational study guide designed to assist beginners in understanding scriptural themes.
        </div>
      </section>
    `;

    // Translation tab click handler
    display.querySelectorAll(".tr-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        display.querySelectorAll(".tr-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const chosen = tab.dataset.trlang;
        const target = $("#verse-translation-target");
        if (target) {
          if (chosen === "hi") {
            target.textContent = verse.hindi || "Hindi translation not available in this record.";
            target.lang = "hi";
          } else if (chosen === "te") {
            target.textContent = verse.telugu || "తెలుగు అనువాదం అందుబాటులో లేదు.";
            target.lang = "te";
          } else if (chosen === "sa") {
            target.innerHTML = "<em>(संस्कृतमूलपाठः उपरि प्रदत्तः)</em>";
            target.lang = "sa";
          } else {
            target.textContent = verse.translation || "English translation not available in this record.";
            target.lang = "en";
          }
        }
      });
    });

    renderRelatedVerses();
  }

  function renderRelatedVerses() {
    const container = $("#related-verses-container");
    if (!container) return;

    const related = engine.getRelatedVerses ? engine.getRelatedVerses(corpus, currentChapter, currentVerse) : [];
    if (!related.length) {
      container.style.display = "none";
      return;
    }

    container.style.display = "block";
    container.innerHTML = `
      <div class="section-box-header">
        <div class="section-box-title">
          <span>☸</span>
          <strong>Thematically Related Verses</strong>
        </div>
        <small style="color: var(--muted);">Explore connected teachings across chapters</small>
      </div>
      <div class="related-grid">
        ${related.map(r => `
          <button class="related-card" data-jump="${r.chapter}.${r.verse}">
            <span class="related-ref">BG ${r.chapter}.${r.verse}</span>
            <div class="related-sa">${escapeHtml(r.sanskrit.split("\n")[0] || "")}</div>
            <p class="related-snippet">${escapeHtml(activeLang === "hi" ? r.hindi : (activeLang === "te" ? r.telugu : r.translation))}</p>
          </button>
        `).join("")}
      </div>
    `;
  }

  // Navigation button listeners
  $("#reader-prev-btn")?.addEventListener("click", () => {
    if (currentVerse > 1) {
      openVerse(currentChapter, currentVerse - 1);
    } else if (currentChapter > 1) {
      const prevChVerses = getVersesForChapter(currentChapter - 1);
      openVerse(currentChapter - 1, prevChVerses.length);
    }
  });

  $("#reader-next-btn")?.addEventListener("click", () => {
    const curChVerses = getVersesForChapter(currentChapter);
    if (currentVerse < curChVerses.length) {
      openVerse(currentChapter, currentVerse + 1);
    } else if (currentChapter < 18) {
      openVerse(currentChapter + 1, 1);
    }
  });

  // Keyboard navigation (Left / Right Arrow)
  window.addEventListener("keydown", e => {
    if ($("#reader").classList.contains("active") && !["input", "textarea", "select"].includes(document.activeElement?.tagName?.toLowerCase())) {
      if (e.key === "ArrowLeft") {
        $("#reader-prev-btn")?.click();
      } else if (e.key === "ArrowRight") {
        $("#reader-next-btn")?.click();
      }
    }
  });

  // Dropdown listeners
  $("#reader-chapter-select")?.addEventListener("change", e => {
    openVerse(Number(e.target.value), 1);
  });

  $("#reader-verse-select")?.addEventListener("change", e => {
    openVerse(currentChapter, Number(e.target.value));
  });

  // Bookmark toggle button
  $("#bookmark-verse-btn")?.addEventListener("click", () => {
    const idx = bookmarks.findIndex(b => b.chapter === currentChapter && b.verse === currentVerse);
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
      showToast(`Removed Bhagavad Gita ${currentChapter}.${currentVerse} from bookmarks`);
      syncBookmarkToServer(currentChapter, currentVerse, "DELETE");
    } else {
      bookmarks.unshift({
        chapter: currentChapter,
        verse: currentVerse,
        time: new Date().toISOString()
      });
      showToast(`Saved Bhagavad Gita ${currentChapter}.${currentVerse} to bookmarks ★`);
      syncBookmarkToServer(currentChapter, currentVerse, "POST");
    }
    localStorage.setItem("gm_bookmarks", JSON.stringify(bookmarks));
    renderCurrentVerse();
  });

  // Copy verse button
  $("#copy-verse-btn")?.addEventListener("click", async () => {
    const verse = getVerse(currentChapter, currentVerse);
    if (!verse) return;
    const textToCopy = `Bhagavad Gita ${currentChapter}.${currentVerse}\n\n${verse.sanskrit}\n\n${verse.transliteration}\n\nTranslation: ${verse.translation}\n(Shared via GitaMitra)`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast("Verse copied to clipboard! 📋");
    } catch (_) {
      showToast(`Reference: Bhagavad Gita ${currentChapter}.${currentVerse}`);
    }
  });

  // Reading history recording
  function recordReadingHistory(ch, ve) {
    versesReadSet.add(`${ch}.${ve}`);
    // Put most recent at front
    readingHistory = readingHistory.filter(h => !(h.chapter === ch && h.verse === ve));
    readingHistory.unshift({ chapter: ch, verse: ve, time: new Date().toISOString() });
    if (readingHistory.length > 50) readingHistory.pop();
    localStorage.setItem("gm_history", JSON.stringify(readingHistory));

    // Optional server sync
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapter: ch, verse: ve })
    }).catch(() => {});
  }

  function syncBookmarkToServer(ch, ve, method) {
    fetch("/api/bookmarks", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapter: ch, verse: ve })
    }).catch(() => {});
  }

  // --- 10. ASK KRISHNA FEATURE ---
  $("#ask-situation-input")?.addEventListener("input", e => {
    $("#char-counter").textContent = `${e.target.value.length} / 1800`;
  });

  // Chips click handler
  $$(".prompt-chips-section .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const input = $("#ask-situation-input");
      if (input) {
        input.value = chip.dataset.prompt;
        $("#char-counter").textContent = `${input.value.length} / 1800`;
        input.focus();
      }
    });
  });

  $("#ask-submit-btn")?.addEventListener("click", async () => {
    const input = $("#ask-situation-input");
    const question = input?.value?.trim();
    if (!question || question.length < 5) {
      showToast("Please share a question of at least 5 characters.");
      input?.focus();
      return;
    }

    const btn = $("#ask-submit-btn");
    const panel = $("#ask-result-panel");
    btn.disabled = true;
    btn.innerHTML = '<span>✧ Searching Gita teachings…</span>';

    panel.innerHTML = `
      <div class="response-placeholder">
        <span class="placeholder-icon">✧</span>
        <h3>Consulting the Gita corpus…</h3>
        <p>Retrieving relevant verses and formulating a grounded reflection.</p>
      </div>
    `;

    try {
      // First try local backend API, then fallback to client engine
      let data = null;
      try {
        const resp = await fetch("/api/ask-krishna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, lang: activeLang })
        });
        if (resp.ok) {
          data = await resp.json();
        }
      } catch (_) {}

      // Fallback to client GitaEngine if server not reachable
      if (!data && engine.answerQuestion) {
        data = engine.answerQuestion(corpus, question, activeLang);
      }

      if (!data || data.notFound) {
        panel.innerHTML = `
          <div class="response-placeholder">
            <span class="placeholder-icon">ॐ</span>
            <h3>No Exact Scripture Match</h3>
            <p>${escapeHtml(data?.message || "I could not find an exact matching verse in the Bhagavad Gita for this phrase. Try rephrasing with words like anger, duty, fear, or work.")}</p>
          </div>
        `;
        return;
      }

      // Render answer card
      panel.innerHTML = `
        <article class="answer-card">
          <div class="answer-badge-row">
            <span class="answer-kicker">RELEVANT TEACHING FOUND</span>
            <button class="answer-ref-link" data-jump="${data.chapter}.${data.verse}">
              ${escapeHtml(data.reference)} →
            </button>
          </div>

          <h3 class="answer-title">${escapeHtml(data.title)}</h3>

          <div class="answer-sanskrit-box">
            <div class="answer-sa" lang="sa">${escapeHtml(data.sanskrit)}</div>
            <div class="answer-translit">${escapeHtml(data.transliteration)}</div>
          </div>

          <div class="answer-meaning-box">
            <strong>AUTHENTIC SCRIPTURE MEANING (${activeLang.toUpperCase()})</strong>
            <p>${escapeHtml(data.meaning || data.translation)}</p>
          </div>

          <div class="answer-application-box">
            <strong>HOW THIS TEACHING GUIDES YOUR SITUATION</strong>
            <p>${escapeHtml(data.application)}</p>
          </div>

          <div class="answer-actions">
            <button class="open-verse-btn" data-jump="${data.chapter}.${data.verse}">
              Read Full Verse & Word Meanings →
            </button>
          </div>

          <p class="privacy-note" style="margin: 0;">
            ${escapeHtml(data.disclaimer || "Source: Bhagavad Gita corpus. Explanations are educational study reflections, not quotations from Krishna.")}
          </p>
        </article>
      `;

      // Wire jump buttons in answer card
      panel.querySelectorAll("[data-jump]").forEach(b => {
        b.addEventListener("click", () => {
          const [c, v] = b.dataset.jump.split(".").map(Number);
          openVerse(c, v);
        });
      });

    } catch (err) {
      panel.innerHTML = `
        <div class="response-placeholder">
          <span class="placeholder-icon">⚠️</span>
          <h3>Guidance service temporarily unavailable</h3>
          <p>${escapeHtml(err.message)}</p>
        </div>
      `;
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span class="btn-icon">✧</span> <span>${I18N[activeLang]?.find_teaching_btn || "Find Gita Teaching"}</span> <span>→</span>`;
    }
  });

  // --- 11. LIBRARY VIEW (PROGRESS & BOOKMARKS) ---
  function renderProgressDashboard() {
    const versesReadEl = $("#progress-verses-read");
    const chaptersTouchedEl = $("#progress-chapters-touched");
    const bookmarksCountEl = $("#progress-bookmarks-count");
    const progressBar = $("#reading-progress-bar");
    const summaryText = $("#progress-summary-text");
    const bmBadge = $("#bookmark-badge-num");
    const histBadge = $("#history-badge-num");

    const totalRead = versesReadSet.size;
    const chaptersTouched = new Set(Array.from(versesReadSet).map(s => s.split(".")[0])).size;
    const pct = Math.min(100, Math.round((totalRead / 701) * 100));

    if (versesReadEl) versesReadEl.textContent = `${totalRead} / 701`;
    if (chaptersTouchedEl) chaptersTouchedEl.textContent = `${chaptersTouched} / 18`;
    if (bookmarksCountEl) bookmarksCountEl.textContent = bookmarks.length;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (summaryText) summaryText.textContent = `${pct}% of the complete 701-verse corpus explored. (${totalRead} verses completed across ${chaptersTouched} chapters)`;
    if (bmBadge) bmBadge.textContent = bookmarks.length;
    if (histBadge) histBadge.textContent = readingHistory.length;
  }

  function renderLibraryContent(tabType = "bookmarks") {
    const container = $("#library-content-container");
    if (!container) return;
    container.innerHTML = "";

    if (tabType === "bookmarks") {
      if (!bookmarks.length) {
        container.innerHTML = `
          <div class="empty-library-box">
            <span>☆</span>
            <p>You have not bookmarked any verses yet.</p>
            <small>While reading any verse, click the "Bookmark" button to save it here for future reflection.</small>
          </div>
        `;
        return;
      }

      const list = document.createElement("div");
      list.className = "library-items-list";

      bookmarks.forEach(bm => {
        const v = getVerse(bm.chapter, bm.verse);
        const card = document.createElement("div");
        card.className = "library-item-card";
        card.innerHTML = `
          <div class="lib-item-info">
            <span class="lib-item-ref">BHAGAVAD GITA · CHAPTER ${bm.chapter}, VERSE ${bm.verse}</span>
            <div class="lib-item-sa">${escapeHtml(v?.sanskrit.split("\n")[0] || "")}</div>
            <div class="lib-item-snippet">${escapeHtml((v?.translation || "").slice(0, 110))}...</div>
          </div>
          <div class="lib-item-actions">
            <button class="btn-secondary" data-jump="${bm.chapter}.${bm.verse}">Read →</button>
            <button class="lib-remove-btn" data-remove-bm="${bm.chapter}.${bm.verse}" title="Remove bookmark">✕</button>
          </div>
        `;
        list.appendChild(card);
      });
      container.appendChild(list);

      // Remove bookmark listener
      list.querySelectorAll("[data-remove-bm]").forEach(b => {
        b.addEventListener("click", () => {
          const [c, ve] = b.dataset.removeBm.split(".").map(Number);
          bookmarks = bookmarks.filter(item => !(item.chapter === c && item.verse === ve));
          localStorage.setItem("gm_bookmarks", JSON.stringify(bookmarks));
          syncBookmarkToServer(c, ve, "DELETE");
          renderProgressDashboard();
          renderLibraryContent("bookmarks");
          showToast(`Removed BG ${c}.${ve} from bookmarks`);
        });
      });

    } else {
      // Reading History
      if (!readingHistory.length) {
        container.innerHTML = `
          <div class="empty-library-box">
            <span>📖</span>
            <p>Your reading history is currently empty.</p>
            <small>As you explore verses, your recently visited verses will appear here.</small>
          </div>
        `;
        return;
      }

      const list = document.createElement("div");
      list.className = "library-items-list";

      readingHistory.forEach(h => {
        const v = getVerse(h.chapter, h.verse);
        const card = document.createElement("div");
        card.className = "library-item-card";
        const dateStr = new Date(h.time).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
        card.innerHTML = `
          <div class="lib-item-info">
            <span class="lib-item-ref">BG ${h.chapter}.${h.verse} · Read on ${dateStr}</span>
            <div class="lib-item-sa">${escapeHtml(v?.sanskrit.split("\n")[0] || "")}</div>
            <div class="lib-item-snippet">${escapeHtml((v?.translation || "").slice(0, 110))}...</div>
          </div>
          <div class="lib-item-actions">
            <button class="btn-secondary" data-jump="${h.chapter}.${h.verse}">Revisit →</button>
          </div>
        `;
        list.appendChild(card);
      });
      container.appendChild(list);
    }
  }

  // Library tab buttons
  $("#tab-btn-bookmarks")?.addEventListener("click", () => {
    $("#tab-btn-bookmarks").classList.add("active");
    $("#tab-btn-history").classList.remove("active");
    renderLibraryContent("bookmarks");
  });

  $("#tab-btn-history")?.addEventListener("click", () => {
    $("#tab-btn-history").classList.add("active");
    $("#tab-btn-bookmarks").classList.remove("active");
    renderLibraryContent("history");
  });

  // --- 12. DAILY WISDOM FEATURE ---
  function renderDailyWisdom() {
    const card = $("#daily-card-container");
    if (!card) return;

    // Daily key verses list
    const keyVerses = [
      { ch: 2, ve: 47 },
      { ch: 2, ve: 48 },
      { ch: 2, ve: 62 },
      { ch: 2, ve: 63 },
      { ch: 4, ve: 38 },
      { ch: 6, ve: 5 },
      { ch: 6, ve: 26 },
      { ch: 6, ve: 35 },
      { ch: 9, ve: 22 },
      { ch: 12, ve: 13 },
      { ch: 18, ve: 66 }
    ];

    // Pick verse based on day of year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const chosenRef = keyVerses[dayOfYear % keyVerses.length];
    const verse = getVerse(chosenRef.ch, chosenRef.ve);
    if (!verse) return;

    const trText = activeLang === "hi" ? verse.hindi : (activeLang === "te" ? verse.telugu : verse.translation);

    card.innerHTML = `
      <div class="daily-label">TODAY'S SACRED VERSE · BHAGAVAD GITA ${verse.chapter}.${verse.verse}</div>
      <div class="daily-sanskrit" lang="sa">${escapeHtml(verse.sanskrit)}</div>
      <div class="daily-translit">${escapeHtml(verse.transliteration)}</div>
      
      <div class="daily-meaning-box">
        <strong>MEANING (${activeLang.toUpperCase()})</strong>
        <p>${escapeHtml(trText)}</p>
      </div>

      <div class="daily-reflection-box">
        <strong>TAKE THIS INTO YOUR DAY</strong>
        <p>Give your full attention and love to the duties before you today. Let go of the anxious desire to micromanage every consequence, knowing that equanimity in action is the highest yoga.</p>
      </div>

      <button class="btn-primary" data-jump="${verse.chapter}.${verse.verse}">
        Explore Complete Shloka & Word Meanings →
      </button>
    `;
  }

  // --- 13. UNIVERSAL SEARCH MODAL ---
  function renderTopicChips() {
    const container = $("#search-topic-chips");
    if (!container || !engine.thematicTopics) return;
    container.innerHTML = `<span class="tag-label">${I18N[activeLang]?.topics_label || "Topics:"}</span>`;

    engine.thematicTopics.forEach(t => {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.textContent = t.label[activeLang] || t.label.en;
      chip.addEventListener("click", () => {
        $("#modal-search-input").value = t.keywords[0];
        executeModalSearch(t.keywords[0]);
      });
      container.appendChild(chip);
    });
  }

  function executeModalSearch(query) {
    const resultsContainer = $("#modal-search-results");
    if (!resultsContainer) return;

    const q = query.trim().toLowerCase();
    if (!q) {
      resultsContainer.innerHTML = `
        <div class="modal-empty-state">
          <span>ॐ</span>
          <p>${I18N[activeLang]?.search_prompt || "Search all 701 verses by reference, Sanskrit word, or concept."}</p>
        </div>
      `;
      return;
    }

    // Check if query is chapter.verse (e.g. "2.47", "18.66", "2 47", "ch 2 v 47")
    const numMatch = q.match(/(?:ch(?:apter)?\s*)?(\d{1,2})[\s.:v]+(\d{1,2})/i);
    if (numMatch) {
      const ch = Number(numMatch[1]);
      const ve = Number(numMatch[2]);
      const exact = getVerse(ch, ve);
      if (exact) {
        resultsContainer.innerHTML = `
          <div class="search-result-item" data-jump="${ch}.${ve}">
            <div class="search-res-top">
              <span class="search-res-ref">EXACT MATCH · BG ${ch}.${ve}</span>
              <span class="search-res-sa">${escapeHtml(exact.sanskrit.split("\n")[0] || "")}</span>
            </div>
            <p class="search-res-text">${escapeHtml(activeLang === "hi" ? exact.hindi : (activeLang === "te" ? exact.telugu : exact.translation))}</p>
          </div>
        `;
        return;
      }
    }

    // Text search across all fields
    const hits = corpus.filter(v => {
      const hay = [
        `${v.chapter}.${v.verse}`,
        v.sanskrit,
        v.transliteration,
        v.translation,
        v.hindi,
        v.telugu,
        (v.word_by_word || []).join(" ")
      ].join(" ").toLowerCase();
      return hay.includes(q);
    }).slice(0, 40);

    if (!hits.length) {
      resultsContainer.innerHTML = `
        <div class="modal-empty-state">
          <span>🔍</span>
          <p>No matching verses found for "${escapeHtml(query)}". Try using different Sanskrit or English terms.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = hits.map(v => `
      <div class="search-result-item" data-jump="${v.chapter}.${v.verse}">
        <div class="search-res-top">
          <span class="search-res-ref">BHAGAVAD GITA ${v.chapter}.${v.verse}</span>
          <span class="search-res-sa">${escapeHtml(v.sanskrit.split("\n")[0] || "")}</span>
        </div>
        <p class="search-res-text">${escapeHtml(activeLang === "hi" ? v.hindi : (activeLang === "te" ? v.telugu : v.translation))}</p>
      </div>
    `).join("");
  }

  // Open & Close Search Modal
  $("#open-search-btn")?.addEventListener("click", () => {
    const modal = $("#search-modal");
    modal.style.display = "flex";
    const input = $("#modal-search-input");
    input.value = "";
    input.focus();
    executeModalSearch("");
  });

  $("#close-search-btn")?.addEventListener("click", () => {
    $("#search-modal").style.display = "none";
  });

  $("#modal-clear-search")?.addEventListener("click", () => {
    const input = $("#modal-search-input");
    input.value = "";
    input.focus();
    executeModalSearch("");
  });

  $("#modal-search-input")?.addEventListener("input", e => {
    executeModalSearch(e.target.value);
  });

  // Close modal when clicking outside dialog
  $("#search-modal")?.addEventListener("click", e => {
    if (e.target.id === "search-modal") {
      $("#search-modal").style.display = "none";
    }
  });

  // Keyboard shortcut: Ctrl+K or Cmd+K
  window.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      $("#open-search-btn")?.click();
    }
    if (e.key === "Escape" && $("#search-modal").style.display === "flex") {
      $("#search-modal").style.display = "none";
    }
  });

  // --- 14. INITIALIZATION ---
  function init() {
    console.log(`GitaMitra initialized with ${corpus.length} verses.`);
    applyLanguage(activeLang);
    populateReaderDropdowns();
    updateContinueBanner();

    // Check URL hash for direct links (e.g. #2.47 or #ch2)
    const hash = window.location.hash;
    const matchVerse = hash.match(/#(\d{1,2})\.(\d{1,2})/);
    if (matchVerse) {
      openVerse(Number(matchVerse[1]), Number(matchVerse[2]));
      return;
    }

    const matchCh = hash.match(/#ch(\d{1,2})/i);
    if (matchCh) {
      openVerse(Number(matchCh[1]), 1);
      return;
    }
  }

  // Run on DOM load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
