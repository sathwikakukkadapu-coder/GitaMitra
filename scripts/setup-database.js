import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "gita.db");
const db = new DatabaseSync(dbPath);

console.log("Setting up GitaMitra SQLite database at:", dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS chapters (
    chapter_number INTEGER PRIMARY KEY,
    name_sa TEXT NOT NULL,
    name_translit TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    name_te TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_hi TEXT NOT NULL,
    summary_te TEXT NOT NULL,
    verse_count INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gita_corpus (
    id TEXT PRIMARY KEY,
    chapter_number INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    sanskrit TEXT NOT NULL,
    transliteration TEXT NOT NULL DEFAULT '',
    translation_en TEXT NOT NULL DEFAULT '',
    translation_hi TEXT NOT NULL DEFAULT '',
    translation_te TEXT NOT NULL DEFAULT '',
    word_by_word TEXT NOT NULL DEFAULT '[]',
    source_notes TEXT NOT NULL DEFAULT '{}',
    UNIQUE(chapter_number, verse_number)
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id TEXT PRIMARY KEY,
    chapter_number INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    notes TEXT DEFAULT '',
    UNIQUE(chapter_number, verse_number)
  );

  CREATE TABLE IF NOT EXISTS reading_history (
    id TEXT PRIMARY KEY,
    chapter_number INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    read_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_preferences (
    pref_key TEXT PRIMARY KEY,
    pref_value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_corpus_chapter ON gita_corpus(chapter_number);
  CREATE INDEX IF NOT EXISTS idx_corpus_verse ON gita_corpus(chapter_number, verse_number);
  CREATE INDEX IF NOT EXISTS idx_history_time ON reading_history(read_at DESC);
`);

// 18 Chapters metadata with rich multilingual descriptions
const chaptersData = [
  {
    num: 1,
    sa: "अर्जुनविषादयोगः",
    translit: "Arjuna Viṣāda Yoga",
    en: "The Yoga of Arjuna's Despair",
    hi: "अर्जुन विषाद योग (अर्जुन का मोह और दुःख)",
    te: "అర్జున విషాద యోగము",
    sum_en: "On the battlefield of Kurukshetra, prince Arjuna is overwhelmed by grief and moral paralysis at the prospect of fighting his teachers, kinsmen, and friends.",
    sum_hi: "कुरुक्षेत्र के युद्धभूमि में अर्जुन अपने गुरुजनों, संबंधियों और मित्रों को देखकर मोह और विषाद से व्याकुल होकर शस्त्र त्याग देते हैं।",
    sum_te: "కురుక్షేత్ర రణరంగంలో తన గురువులు, బంధువులను చూసి అర్జునుడు దుఃఖముతో విచారగ్రస్తుడై ధనుస్సును విడిచిపెడతాడు.",
    count: 47
  },
  {
    num: 2,
    sa: "साङ्ख्ययोगः",
    translit: "Sāṅkhya Yoga",
    en: "The Yoga of Knowledge (Sankhya)",
    hi: "सांख्य योग (ज्ञान और निष्काम कर्म)",
    te: "సాంఖ్య యోగము",
    sum_en: "Krishna reveals the eternal nature of the soul (Atman), the illusion of death, duty (Svadharma), and introduces selfless action and the steady-minded sage (Sthitaprajna).",
    sum_hi: "श्रीकृष्ण आत्मा की अमरता, देह की नश्वरता, स्वधर्म का पालन और स्थितप्रज्ञ पुरुष के लक्षणों का उपदेश देते हैं।",
    sum_te: "శ్రీకృష్ణుడు ఆత్మ శాశ్వతత్వాన్ని, దేహ నశ్వరతను, స్వధర్మ ప్రాధాన్యతను మరియు స్థితప్రజ్ఞుని లక్షణాలను వివరిస్తాడు.",
    count: 72
  },
  {
    num: 3,
    sa: "कर्मयोगः",
    translit: "Karma Yoga",
    en: "The Yoga of Action",
    hi: "कर्म योग (कर्तव्य पालन और समर्पण)",
    te: "కర్మ యోగము",
    sum_en: "Krishna explains that inaction is impossible in this universe. True freedom is found through Nishkama Karma—performing one's duties dedicated to the Divine without selfish craving for results.",
    sum_hi: "कर्म त्यागने के बजाय निष्काम भाव से कर्तव्य कर्म करने का मार्ग समझाया गया है। कर्म ही जीवन की गति है।",
    sum_te: "కర్మలను వదిలివేయడం కంటే నిష్కామ భావంతో కర్తవ్య కర్మలను ఆచరించడం శ్రేష్ఠమని కృష్ణుడు బోధిస్తాడు.",
    count: 43
  },
  {
    num: 4,
    sa: "ज्ञानकर्मसंन्यासयोगः",
    translit: "Jñāna Karma Sannyāsa Yoga",
    en: "The Yoga of Knowledge and Renunciation of Action",
    hi: "ज्ञानकर्मसंन्यास योग (ज्ञान और दिव्य कर्म)",
    te: "జ్ఞాన కర్మ సన్న్యాస యోగము",
    sum_en: "The ancient lineage of spiritual wisdom, divine avatars (the descent of God for dharma), and how spiritual wisdom burns all karmic bondage like a blazing fire.",
    sum_hi: "परम्परागत दिव्य ज्ञान, ईश्वर के अवतार का रहस्य और ज्ञान रूपी अग्नि से समस्त कर्म-बन्धनों की भस्म का वर्णन।",
    sum_te: "దివ్య జ్ఞాన పరంపర, అవతార రహస్యాలు మరియు జ్ఞానాగ్ని ద్వారా కర్మబంధాలు దగ్ధమయ్యే విధానం వివరించబడింది.",
    count: 42
  },
  {
    num: 5,
    sa: "कर्मसंन्यासयोगः",
    translit: "Karma Sannyāsa Yoga",
    en: "The Yoga of Renunciation",
    hi: "कर्मसंन्यास योग (कर्मयोग और संन्यास का समन्वय)",
    te: "కర్మ సన్న్యాస యోగము",
    sum_en: "Krishna harmonizes outer action with inner renunciation. The enlightened soul acts in the world like a lotus leaf in water, untouched by sin or attachment.",
    sum_hi: "बाहरी कर्म त्याग और आंतरिक आसक्ति त्याग का सामंजस्य। जल में कमल पत्र की भांति संसार में निर्लिप्त रहना।",
    sum_te: "తామరాకుపై నీటి బిందువు వలె ప్రపంచంలో ఉంటూనే అంటిముట్టనట్లు జీవించే జీవన విధానం వివరించబడింది.",
    count: 29
  },
  {
    num: 6,
    sa: "आत्मसंयमयोगः (ध्यानयोगः)",
    translit: "Ātmasamyama Yoga (Dhyāna Yoga)",
    en: "The Yoga of Meditation and Self-Control",
    hi: "आत्मसंयम योग / ध्यान योग (मन का निग्रह)",
    te: "ఆత్మసంయమ యోగము (ధ్యాన యోగము)",
    sum_en: "Practical techniques for meditation, mastering the restless mind through practice (abhyasa) and detachment (vairagya), and becoming one's own greatest friend.",
    sum_hi: "मन के निग्रह की विधियाँ, ध्यान का अभ्यास, वैराग्य और स्वयं को अपना मित्र बनाने की प्रेरणा।",
    sum_te: "అభ్యాసం మరియు వైరాగ్యాల ద్వారా చంచలమైన మనస్సును ఎలా నియంత్రించాలో మరియు ధ్యాన పద్ధతులను వివరిస్తుంది.",
    count: 47
  },
  {
    num: 7,
    sa: "ज्ञानविज्ञानयोगः",
    translit: "Jñāna Vijñāna Yoga",
    en: "The Yoga of Knowledge and Realization",
    hi: "ज्ञान-विज्ञान योग (अनुभवजन्य ज्ञान)",
    te: "జ్ఞాన విజ్ఞాన యోగము",
    sum_en: "The higher and lower energies of the Divine (Para and Apara Prakriti), the three modes of material nature (Gunas), and the four kinds of seekers who turn to God.",
    sum_hi: "परा और अपरा प्रकृति का स्वरूप, त्रिगुणमयी माया और ईश्वर की शरण में आने वाले चार प्रकार के भक्त (आर्त, जिज्ञासु, अर्थार्थी, ज्ञानी)।",
    sum_te: "సృష్టి రహస్యాలు, మాయాతత్త్వము మరియు దైవాన్ని ఆశ్రయించే నాలుగు రకాల భక్తుల వివరణ.",
    count: 30
  },
  {
    num: 8,
    sa: "अक्षरब्रह्मयोगः",
    translit: "Akṣara Brahma Yoga",
    en: "The Yoga of the Imperishable Absolute",
    hi: "अक्षर ब्रह्म योग (परम गति और अविनाशी ब्रह्म)",
    te: "అక్షర పరబ్రహ్మ యోగము",
    sum_en: "Brahman, Adhyatma, Karma, and the art of remembering the Divine at the final moment of life, leading to the supreme imperishable realm.",
    sum_hi: "अविनाशी ब्रह्म का स्वरूप, जीवन के अंतिम क्षण में ईश्वर स्मरण का महत्त्व और आवागमन से मुक्ति का मार्ग।",
    sum_te: "అవసాన కాలంలో దైవాన్ని స్మరించడం మరియు పునర్జన్మ లేని పరమ పదాన్ని చేరుకునే మార్గము.",
    count: 28
  },
  {
    num: 9,
    sa: "राजविद्याराजगुह्ययोगः",
    translit: "Rāja Vidyā Rāja Guhya Yoga",
    en: "The Yoga of Royal Knowledge and Royal Secret",
    hi: "राजविद्या राजगुह्य योग (परम गोपनीय ज्ञान)",
    te: "రాజవిద్యా రాజగుహ్య యోగము",
    sum_en: "The most profound secret of divine immanence, unconditional devotion, and Krishna's famous assurance: 'To those who are constantly devoted, I preserve what they have and provide what they lack.'",
    sum_hi: "समस्त विद्याओं का राजा, परम गोपनीय ज्ञान, अनन्य भक्ति की शक्ति और श्रीकृष्ण का अभय वचन: 'योगक्षेमं वहाम्यहम्'।",
    sum_te: "అత్యంత రహస్యమైన దివ్య జ్ఞానము, భగవంతుని నిరంతర ఆశ్రయం మరియు భక్తుల యోగక్షేమాలను తానే వహిస్తాననే అభయ ప్రదానము.",
    count: 34
  },
  {
    num: 10,
    sa: "विभूतियोगः",
    translit: "Vibhūti Yoga",
    en: "The Yoga of Divine Manifestations",
    hi: "विभूति योग (ईश्वर के ऐश्वर्य और विस्तार)",
    te: "విభూతి యోగము",
    sum_en: "Krishna reveals His divine presence shining in the universe: among the radiant beings He is the Sun, among mantras He is Om, and in all things the indwelling seed.",
    sum_hi: "सृष्टि के समस्त वैभव, तेज और सौन्दर्य में परमात्मा की विभूतियों का साक्षात् दर्शन।",
    sum_te: "సకల చరాచర సృష్టిలోని శ్రేష్ఠమైన ప్రతి రూపంలోనూ భగవంతుని దివ్య విభూతుల దర్శనము.",
    count: 42
  },
  {
    num: 11,
    sa: "विश्वरूपदर्शनयोगः",
    translit: "Viśvarūpa Darśana Yoga",
    en: "The Yoga of the Vision of the Cosmic Form",
    hi: "विश्वरूप दर्शन योग (विराट् स्वरूप का साक्षात्कार)",
    te: "విశ్వరూప సందర్శన యోగము",
    sum_en: "Arjuna receives divine sight and witnesses Krishna's boundless Cosmic Form (Vishwarupa)—containing all universes, gods, stars, and time itself.",
    sum_hi: "अर्जुन को दिव्य दृष्टि की प्राप्ति और श्रीकृष्ण के अनन्त, कालजयी विराट् रूप का विस्मयकारी दर्शन।",
    sum_te: "అర్జునునికి దివ్యచక్షువుల ప్రాప్తి మరియు కాలస్వరూపుడైన శ్రీకృష్ణుని అద్భుత విశ్వరూప సందర్శనము.",
    count: 55
  },
  {
    num: 12,
    sa: "भक्तियोगः",
    translit: "Bhakti Yoga",
    en: "The Yoga of Devotion",
    hi: "भक्ति योग (प्रेम और समर्पण का मार्ग)",
    te: "భక్తి యోగము",
    sum_en: "The qualities of the beloved devotee: free from malice, compassionate, patient, content, balanced in joy and sorrow, and totally surrendered to the Divine.",
    sum_hi: "सगुण और निर्गुण भक्ति की तुलना, भगवान के प्रिय भक्त के सद्गुण (द्वेषहीनता, करुणा, समता, संतोष)।",
    sum_te: "భగవంతునికి ప్రీతిపాత్రుడైన భక్తుని లక్షణాలు: ద్వేషం లేకపోవడం, దయ, సుఖదుఃఖాలలో సమభావము.",
    count: 20
  },
  {
    num: 13,
    sa: "क्षेत्रक्षेत्रज्ञविभागयोगः",
    translit: "Kṣetra Kṣetrajña Vibhāga Yoga",
    en: "The Yoga of the Field and the Knower of the Field",
    hi: "क्षेत्र-क्षेत्रज्ञ विभाग योग (शरीर और आत्मा का भेद)",
    te: "క్షేత్ర క్షేత్రజ్ఞ విభాగ యోగము",
    sum_en: "The distinction between the physical body/mind complex (the Field, Kshetra) and the conscious witness/soul within (the Knower, Kshetrajna).",
    sum_hi: "शरीर (क्षेत्र) और आत्मा (क्षेत्रज्ञ) का तात्त्विक भेद। ज्ञान, अज्ञान और ज्ञेय (परमात्मा) का विस्तृत निरूपण।",
    sum_te: "శరీరము (క్షేత్రము) మరియు ఆత్మ (క్షేత్రజ్ఞుడు) మధ్య గల భేదము మరియు నిజమైన జ్ఞాన స్వరూపం.",
    count: 35
  },
  {
    num: 14,
    sa: "गुणत्रयविभागयोगः",
    translit: "Guṇatraya Vibhāga Yoga",
    en: "The Yoga of the Three Modes of Nature",
    hi: "गुणत्रय विभाग योग (सत्त्व, रज और तम गुण)",
    te: "గుణత్రయ విభాగ యోగము",
    sum_en: "The analysis of the three cosmic qualities—Sattva (purity/harmony), Rajas (passion/craving), and Tamas (inertia/delusion)—and how to transcend them (Gunatita).",
    sum_hi: "प्रकृति के तीन गुणों (सत्त्व, रज, तम) का प्रभाव, उनका बंधन और गुणातीत होने का मार्ग।",
    sum_te: "ప్రకృతి యొక్క త్రిగుణాలు (సత్వ, రజో, తమో గుణాలు), వాటి బంధాలు మరియు గుణాతీతుని స్థితినందించే మార్గం.",
    count: 27
  },
  {
    num: 15,
    sa: "पुरुषोत्तमयोगः",
    translit: "Puruṣottama Yoga",
    en: "The Yoga of the Supreme Person",
    hi: "पुरुषोत्तम योग (अश्वत्थ वृक्ष और परम पुरुष)",
    te: "పురుషోత్తమ ప్రాప్తి యోగము",
    sum_en: "The inverted cosmic Ashvattha tree of samsara, severed by the weapon of detachment, and the glory of the Supreme Divinity beyond the perishable and imperishable.",
    sum_hi: "उलटे संसार रूपी अश्वत्थ वृक्ष का छेदन, क्षर और अक्षर से परे पुरुषोत्तम तत्त्व का परम रहस्य।",
    sum_te: "సంసార వృక్షం, వైరాగ్యమనే గొడ్డలితో దానిని ఛేదించడం మరియు క్షర-అక్షరాలకు అతీతమైన పురుషోత్తమ తత్త్వము.",
    count: 20
  },
  {
    num: 16,
    sa: "दैवासुरसम्पद्विभागयोगः",
    translit: "Daivāsura Sampad Vibhāga Yoga",
    en: "The Yoga of Divine and Demonic Natures",
    hi: "दैवासुर सम्पद् विभाग योग (दैवी और आसुरी प्रवृत्तियाँ)",
    te: "దైవాసుర సంపద్విభాగ యోగము",
    sum_en: "The contrasting psychological forces: divine qualities (fearlessness, compassion, truth) that liberate vs. demonic tendencies (ego, arrogance, anger, lust, greed) that bind.",
    sum_hi: "मुक्तिदायक दैवी संपदा (अभय, सत्य, अहिंसा) और बन्धनकारी आसुरी प्रवृत्तियों (दम्भ, दर्प, क्रोध, लोभ) का विवेचन।",
    sum_te: "మోక్షమును ప్రసాదించే దైవీ గుణాలు మరియు బంధాన్ని కలిగించే ఆసురీ గుణాల విశ్లేషణ.",
    count: 24
  },
  {
    num: 17,
    sa: "श्रद्धात्रयविभागयोगः",
    translit: "Śraddhātraya Vibhāga Yoga",
    en: "The Yoga of the Threefold Faith",
    hi: "श्रद्धात्रय विभाग योग (श्रद्धा, आहार और तप के प्रकार)",
    te: "శ్రద్ధాత్రయ విభాగ యోగము",
    sum_en: "How an individual's innate temperament shapes their faith, diet, sacrifice (yajna), discipline (tapas), and charity (dana), culminating in the sacred syllable OM TAT SAT.",
    sum_hi: "मानव स्वभाव के अनुरूप सात्त्विक, राजसिक और तामसिक श्रद्धा, आहार, यज्ञ, तप और दान का स्वरूप, तथा ॐ तत् सत् का मर्म।",
    sum_te: "సాత్త్విక, రాజస, తామస శ్రద్ధలు, ఆహార నియమాలు, యజ్ఞ-తపస్-దానాలు మరియు 'ఓం తత్ సత్' ప్రాముఖ్యత.",
    count: 28
  },
  {
    num: 18,
    sa: "मोक्षसंन्यासयोगः",
    translit: "Mokṣa Sannyāsa Yoga",
    en: "The Yoga of Liberation through Renunciation",
    hi: "मोक्ष संन्यास योग (त्याग, संन्यास और परम शरणागति)",
    te: "మోక్ష సన్న్యాస యోగము",
    sum_en: "The comprehensive culmination of the Gita: the true meaning of Tyaga (abandoning fruit of action), the five causes of all actions, the three kinds of knowledge, and Krishna's ultimate call to complete surrender.",
    sum_hi: "सम्पूर्ण गीता का सार: त्याग और संन्यास का मर्म, कर्म के पाँच हेतु, बुद्धि और धृति के भेद, तथा श्रीकृष्ण का अंतिम सन्देश: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज'।",
    sum_te: "సంపూర్ణ గీతాసారము: త్యాగము, పంచకర్మ హేతువులు, బుద్ధి భేదాలు మరియు శ్రీకృష్ణుని చరమ శ్లోకమైన సర్వధర్మ పరిత్యాగము.",
    count: 78
  }
];

// Seed chapters
const insertChapter = db.prepare(`
  INSERT OR REPLACE INTO chapters (
    chapter_number, name_sa, name_translit, name_en, name_hi, name_te, summary_en, summary_hi, summary_te, verse_count
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const c of chaptersData) {
  insertChapter.run(
    c.num, c.sa, c.translit, c.en, c.hi, c.te, c.sum_en, c.sum_hi, c.sum_te, c.count
  );
}
console.log("Seeded 18 chapters successfully.");

// Helper to parse word_by_word
function parseWordByWord(wbwList) {
  if (!Array.isArray(wbwList)) return [];
  return wbwList.map(item => {
    if (typeof item !== "string") return { word: "", transliteration: "", meaning: "" };
    const parts = item.split(":");
    if (parts.length >= 2) {
      const translit = parts[0].trim();
      const meaning = parts.slice(1).join(":").trim();
      return {
        word: translit,
        transliteration: translit,
        meaning: meaning
      };
    }
    return { word: item.trim(), transliteration: item.trim(), meaning: "" };
  });
}

// Load gita-multilingual.js
const dataPath = path.resolve(__dirname, "../public/data/gita-multilingual.js");
const code = fs.readFileSync(dataPath, "utf8");
const fn = new Function("module", "exports", code + "\nreturn typeof GITA !== 'undefined' ? GITA : (typeof module !== 'undefined' && module.exports ? module.exports : []);");
const moduleObj = { exports: [] };
const data = fn(moduleObj, moduleObj.exports);

const insertVerse = db.prepare(`
  INSERT OR REPLACE INTO gita_corpus (
    id, chapter_number, verse_number, sanskrit, transliteration,
    translation_en, translation_hi, translation_te, word_by_word, source_notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let inserted = 0;
for (const v of data) {
  const id = `BG_${v.chapter}_${v.verse}`;
  const structuredWbw = parseWordByWord(v.word_by_word);
  const sourceNotes = {
    source: "Gita Initiative / VedicScriptures / prasadkuruma",
    tags: v.tags || []
  };

  insertVerse.run(
    id,
    v.chapter,
    v.verse,
    v.sanskrit || "",
    v.transliteration || "",
    v.translation || "",
    v.hindi || "",
    v.telugu || "",
    JSON.stringify(structuredWbw),
    JSON.stringify(sourceNotes)
  );
  inserted++;
}

console.log(`Seeded ${inserted} verses into SQLite gita_corpus.`);

// Verify record count
const countRow = db.prepare("SELECT count(*) as count FROM gita_corpus").get();
console.log("Verified total records in SQLite database:", countRow.count);
db.close();
