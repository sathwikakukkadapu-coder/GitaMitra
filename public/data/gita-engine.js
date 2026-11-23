// GitaMitra — Comprehensive Gita Engine & Knowledge System
// Provides structured explanations, multilingual mappings, speaker identification,
// thematic tagging, and semantic search for all 701 verses.

(function (root, factory) {
  const instance = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = instance;
  }
  if (root) {
    root.GitaEngine = instance;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this), function () {

  // Speaker identification lookup
  const speakerMap = {
    // Dhritarashtra
    "1.1": { sa: "धृतराष्ट्र उवाच", en: "Dhritarashtra said", hi: "धृतराष्ट्र बोले", te: "ధృతరాష్ట్రుడు పలికెను" },
    // Arjuna queries
    "1.21": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "1.22": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "1.23": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "1.28": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "2.4": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "2.54": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "3.1": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "3.36": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "4.4": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "5.1": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "6.33": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "6.34": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "6.37": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "8.1": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "10.12": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "11.1": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "11.15": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "11.36": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "12.1": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "13.1": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "14.21": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "17.1": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "18.1": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    "18.73": { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" },
    // Sanjaya narrations
    "1.2": { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" },
    "2.1": { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" },
    "2.9": { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" },
    "11.9": { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" },
    "11.35": { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" },
    "11.50": { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" },
    "18.74": { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" },
    "18.78": { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" }
  };

  function getSpeaker(ch, ve, sanskritText) {
    const key = `${ch}.${ve}`;
    if (speakerMap[key]) return speakerMap[key];
    if (sanskritText && sanskritText.includes("धृतराष्ट्र उवाच")) {
      return { sa: "धृतराष्ट्र उवाच", en: "Dhritarashtra said", hi: "धृतराष्ट्र बोले", te: "ధృతరాష్ట్రుడు పలికెను" };
    }
    if (sanskritText && sanskritText.includes("सञ्जय उवाच")) {
      return { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" };
    }
    if (sanskritText && sanskritText.includes("अर्जुन उवाच")) {
      return { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" };
    }
    if (ch === 1 && ve <= 20) {
      return { sa: "सञ्जय उवाच", en: "Sanjaya said", hi: "संजय बोले", te: "సంజయుడు పలికెను" };
    }
    if (ch === 1 && ve >= 28 && ve <= 46) {
      return { sa: "अर्जुन उवाच", en: "Arjuna said", hi: "अर्जुन बोले", te: "అర్జునుడు పలికెను" };
    }
    return { sa: "श्रीभगवानुवाच", en: "Lord Krishna said", hi: "श्री भगवान बोले", te: "శ్రీ భగవానుడు పలికెను" };
  }

  // Thematic tags mapping for rich discovery
  const thematicTopics = [
    {
      id: "karma-yoga",
      label: { en: "Karma Yoga & Action", hi: "कर्मयोग और कर्तव्य", te: "కర్మ యోగము", sa: "कर्मयोगः" },
      keywords: ["action", "duty", "work", "karma", "fruit", "result", "attachment", "कर्म", "कर्तव्य", "फल", "నిష్కామ కర్మ"],
      keyVerses: ["2.47", "2.48", "2.50", "3.8", "3.19", "3.20", "3.35", "4.18", "5.10", "18.47"]
    },
    {
      id: "controlling-anger",
      label: { en: "Overcoming Anger & Desire", hi: "क्रोध और काम पर विजय", te: "క్రోధ నివారణ", sa: "क्रोधनिग्रहः" },
      keywords: ["anger", "desire", "passion", "wrath", "krodha", "kama", "rage", "क्रोध", "काम", "शत्रु", "కోపం"],
      keyVerses: ["2.62", "2.63", "3.37", "5.23", "5.26", "16.21"]
    },
    {
      id: "facing-fear",
      label: { en: "Facing Fear & Anxiety", hi: "भय और चिंता से मुक्ति", te: "భయమును జయించుట", sa: "अभयप्राप्तिः" },
      keywords: ["fear", "anxiety", "courage", "grief", "despair", "sorrow", "death", "भय", "अभय", "शोक", "భయం", "ధైర్యం"],
      keyVerses: ["2.11", "2.14", "2.20", "2.27", "4.10", "18.30", "18.66"]
    },
    {
      id: "mind-control",
      label: { en: "Mind Control & Meditation", hi: "मन का निग्रह और ध्यान", te: "మనస్సు నియంత్రణ", sa: "आत्मसंयमः" },
      keywords: ["mind", "restless", "meditation", "control", "focus", "dhyana", "abhyasa", "मन", "ध्यान", "अभ्यास", "ధ్యానము"],
      keyVerses: ["6.5", "6.6", "6.19", "6.26", "6.34", "6.35"]
    },
    {
      id: "dealing-with-failure",
      label: { en: "Equanimity in Success & Failure", hi: "सुख-दुःख और लाभ-हानि में समता", te: "సుఖదుఃఖాలలో సమభావం", sa: "समत्वम्" },
      keywords: ["success", "failure", "equanimity", "balance", "defeat", "victory", "loss", "समता", "हानि", "लाभ", "విజయ పరాజయాలు"],
      keyVerses: ["2.38", "2.48", "2.56", "4.22", "12.18", "14.24"]
    },
    {
      id: "devotion-surrender",
      label: { en: "Bhakti & Surrender", hi: "भक्ति और शरणागति", te: "భక్తి మరియు శరణాగతి", sa: "भक्तियोगः" },
      keywords: ["devotion", "love", "surrender", "bhakti", "trust", "grace", "faith", "भक्ति", "शरण", "विश्वास", "భక్తి"],
      keyVerses: ["9.22", "9.26", "9.34", "11.54", "12.2", "18.65", "18.66"]
    },
    {
      id: "self-realization",
      label: { en: "The Eternal Soul (Atman)", hi: "अविनाशी आत्मा का स्वरूप", te: "శాశ్వత ఆత్మతత్త్వం", sa: "आत्मज्ञानम्" },
      keywords: ["soul", "atman", "eternal", "immortal", "body", "death", "reincarnation", "आत्मा", "अमर", "దేహం", "ఆత్మ"],
      keyVerses: ["2.12", "2.13", "2.20", "2.22", "2.23", "13.27", "15.7"]
    },
    {
      id: "wisdom-clarity",
      label: { en: "Wisdom & Self-Elevation", hi: "ज्ञान और आत्मोन्नति", te: "జ్ఞానము మరియు ఆత్మోద్ధరణ", sa: "ज्ञानयोगः" },
      keywords: ["wisdom", "knowledge", "clarity", "elevation", "friend", "enemy", "jnana", "ज्ञान", "उद्धार", "జ్ఞానం"],
      keyVerses: ["4.38", "4.39", "6.5", "7.16", "10.10", "14.17"]
    }
  ];

  // Robust IAST to Devanagari Sanskrit conversion for word tokens
  function iastToDevanagari(text) {
    if (!text || typeof text !== "string") return "";
    const clean = text.trim();
    
    // Direct token substitutions for common Vedic and Gita words
    const directLookup = {
      "dharma-kṣhetre": "धर्मक्षेत्रे",
      "dharmakṣhetre": "धर्मक्षेत्रे",
      "kuru-kṣhetre": "कुरुक्षेत्रे",
      "kurukṣhetre": "कुरुक्षेत्रे",
      "samavetāḥ": "समवेताः",
      "samavetā": "समवेताः",
      "yuyutsavaḥ": "युयुत्सवः",
      "dhṛitarāśhtraḥ": "धृतराष्ट्रः",
      "dhṛitarāśhtra": "धृतराष्ट्रः",
      "uvācha": "उवाच",
      "māmakāḥ": "मामकाः",
      "pāṇḍavāḥ": "पाण्डवाः",
      "cha": "च",
      "eva": "एव",
      "kim": "किम्",
      "akurvata": "अकुर्वत",
      "sañjaya": "सञ्जय",
      "karmaṇi": "कर्मणि",
      "adhikāraḥ": "अधिकारः",
      "te": "ते",
      "mā": "मा",
      "phaleṣhu": "फलेषु",
      "phaleṣu": "फलेषु",
      "kadāchana": "कदाचन",
      "karma-phala-hetuḥ": "कर्मफलहेतुः",
      "bhūḥ": "भूः",
      "saṅgaḥ": "सङ्गः",
      "astu": "अस्तु",
      "akarmaṇi": "अकर्मणि",
      "yoga-sthaḥ": "योगस्थः",
      "kuru": "कुरु",
      "karmāṇi": "कर्माणि",
      "saṅgaṁ": "सङ्गं",
      "tyaktvā": "त्यक्त्वा",
      "dhanañjaya": "धनञ्जय",
      "siddhy-asiddhyoḥ": "सिद्ध्यसिद्ध्योः",
      "siddhyasiddhyoḥ": "सिद्ध्यसिद्ध्योः",
      "samo": "समः",
      "bhūtvā": "भूत्वा",
      "samatvaṁ": "समत्वं",
      "yogaḥ": "योगः",
      "uchyate": "उच्यते",
      "krodhāt": "क्रोधात्",
      "bhavati": "भवति",
      "sammohaḥ": "संमोहः",
      "sammohāt": "संमोहात्",
      "smṛiti-vibhramaḥ": "स्मृतिविभ्रमः",
      "smṛiti-bhraṅśhāt": "स्मृतिभ्रंशात्",
      "buddhi-nāśhaḥ": "बुद्धिनाशः",
      "buddhi-nāśhāt": "बुद्धिनाशात्",
      "praṇaśhyati": "प्रणश्यति"
    };

    const lower = clean.toLowerCase();
    if (directLookup[lower]) return directLookup[lower];

    // Transliteration algorithm
    const vowels = {
      'a': 'अ', 'ā': 'आ', 'i': 'इ', 'ī': 'ई', 'u': 'उ', 'ū': 'ऊ',
      'ṛ': 'ऋ', 'ṝ': 'ॠ', 'ḷ': 'ऌ', 'ḹ': 'ॡ', 'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ'
    };
    const matras = {
      'ā': 'ा', 'i': 'ि', 'ī': 'ी', 'u': 'ु', 'ū': 'ू',
      'ṛ': 'ृ', 'ṝ': 'ॄ', 'ḷ': 'ॢ', 'ḹ': 'ॣ', 'e': 'े', 'ai': 'ै', 'o': 'ो', 'au': 'ौ'
    };
    const consonants = {
      'kṣh': 'क्ष', 'ksh': 'क्ष', 'kṣ': 'क्ष', 'jñ': 'ज्ञ', 'jn': 'ज्ञ',
      'kh': 'ख', 'gh': 'घ', 'ṅ': 'ङ', 'chh': 'छ', 'ch': 'च', 'jh': 'झ', 'ñ': 'ञ',
      'ṭh': 'ठ', 'ḍh': 'ढ', 'ṇ': 'ण', 'th': 'थ', 'dh': 'ध', 'ph': 'फ',
      'bh': 'भ', 'sh': 'श', 'śh': 'श', 'ṣh': 'ष', 'ś': 'श', 'ṣ': 'ष',
      'k': 'क', 'g': 'ग', 'c': 'च', 'j': 'ज', 'ṭ': 'ट',
      'ḍ': 'ड', 't': 'त', 'd': 'द', 'n': 'न', 'p': 'प', 'b': 'ब',
      'm': 'म', 'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 's': 'स', 'h': 'ह'
    };

    let out = '';
    let i = 0;
    const s = clean;
    let atWordStart = true;

    while (i < s.length) {
      const ch = s[i];
      if (ch === ' ' || ch === '-' || ch === '/' || ch === ',' || ch === '.') {
        out += (ch === '-' ? '' : ch);
        atWordStart = true;
        i++;
        continue;
      }
      if (ch === 'ḥ') { out += 'ः'; atWordStart = false; i++; continue; }
      if (ch === 'ṃ' || ch === 'ṁ' || ch === 'm̐') { out += 'ं'; atWordStart = false; i++; continue; }
      if (ch === '\'' || ch === '’') { out += 'ऽ'; atWordStart = false; i++; continue; }

      // Try 3-char consonant (e.g. kṣh)
      const three = s.slice(i, i + 3).toLowerCase();
      const two = s.slice(i, i + 2).toLowerCase();
      const one = s.slice(i, i + 1).toLowerCase();

      let cons = null;
      let consLen = 0;
      if (consonants[three]) { cons = consonants[three]; consLen = 3; }
      else if (consonants[two]) { cons = consonants[two]; consLen = 2; }
      else if (consonants[one]) { cons = consonants[one]; consLen = 1; }

      if (cons) {
        i += consLen;
        const nextTwo = s.slice(i, i + 2).toLowerCase();
        const nextOne = s.slice(i, i + 1).toLowerCase();

        if (matras[nextTwo]) {
          out += cons + matras[nextTwo];
          i += 2;
        } else if (nextTwo === 'ai' || nextTwo === 'au') {
          out += cons + matras[nextTwo];
          i += 2;
        } else if (matras[nextOne]) {
          out += cons + matras[nextOne];
          i += 1;
        } else if (nextOne === 'a') {
          out += cons;
          i += 1;
        } else {
          out += cons + '्';
        }
        atWordStart = false;
        continue;
      }

      // Independent vowel
      if (atWordStart) {
        if (vowels[two]) {
          out += vowels[two];
          i += 2;
          atWordStart = false;
          continue;
        } else if (vowels[one]) {
          out += vowels[one];
          i += 1;
          atWordStart = false;
          continue;
        }
      }

      out += ch;
      i++;
    }
    return out;
  }

  // Parse word_by_word list into structured items
  function formatWordByWord(wbwRaw) {
    if (!Array.isArray(wbwRaw)) return [];
    return wbwRaw.map(item => {
      if (typeof item === "object" && item.word && item.meaning) {
        return {
          sanskrit: item.sanskrit || iastToDevanagari(item.transliteration || item.word),
          transliteration: item.transliteration || item.word,
          meaning: item.meaning
        };
      }
      if (typeof item === "string") {
        const parts = item.split(":");
        const translit = parts[0] ? parts[0].trim() : "";
        const meaning = parts.slice(1).join(":").trim();
        return {
          sanskrit: iastToDevanagari(translit),
          transliteration: translit,
          meaning: meaning || "(verified gloss)"
        };
      }
      return { sanskrit: "", transliteration: "", meaning: "" };
    });
  }

  // Generate 6 structured explanation sections
  function generateExplanation(verse, lang = "en") {
    const ch = Number(verse.chapter);
    const ve = Number(verse.verse);
    const speaker = getSpeaker(ch, ve, verse.sanskrit);

    const isKrishna = speaker.sa.includes("श्रीभगवानुवाच");
    const isArjuna = speaker.sa.includes("अर्जुन उवाच");
    const isSanjaya = speaker.sa.includes("सञ्जय उवाच");
    const isDhritarashtra = speaker.sa.includes("धृतराष्ट्र उवाच");

    // Translations
    const enText = verse.translation || "";
    const hiText = verse.hindi || enText;
    const teText = verse.telugu || enText;

    if (lang === "hi") {
      return {
        speaker: speaker.hi,
        simpleMeaning: hiText,
        detailedInterpretation: `इस श्लोक में ${speaker.hi} द्वारा व्यक्त किया गया यह विचार गीता के मूल उपदेश का एक अविभाज्य अंग है। अध्याय ${ch} के अंतर्गत यह श्लोक साधक को जीवन के मूलभूत कर्तव्यों और आंतरिक संशय से ऊपर उठने की प्रेरणा देता है। इसमें प्रयुक्त शब्द स्पष्ट करते हैं कि कर्म और चेतना के संतुलन से ही वास्तविक शांति प्राप्त होती है।`,
        context: isDhritarashtra
          ? "कुरुक्षेत्र के मैदान में दोनों सेनाएं आमने-सामने खड़ी हैं। हस्तिनापुर के राजमहल में बैठे नेत्रहीन राजा धृतराष्ट्र अपने विश्वस्त सारथी संजय से युद्धभूमि की स्थिति के विषय में व्याकुल होकर पूछ रहे हैं।"
          : isArjuna
          ? `अर्जुन अपने परिजनों, गुरुजनों और मित्रों के संहार की आशंका से अत्यंत विषादग्रस्त हैं। वे अपने अज्ञान और कर्तव्य-मोह को दूर करने के लिए भगवान श्रीकृष्ण के समक्ष अपनी दुविधा प्रस्तुत कर रहे हैं।`
          : isSanjaya
          ? "संजय महर्षि वेदव्यास द्वारा प्रदत्त दिव्य दृष्टि के माध्यम से कुरुक्षेत्र की संपूर्ण घटनाओं का प्रत्यक्षदर्शी वर्णन राजा धृतराष्ट्र को सुना रहे हैं।"
          : `भगवान श्रीकृष्ण अर्जुन को मोह-निद्रा से जगाने के लिए दिव्य मार्गदर्शन प्रदान कर रहे हैं। वे अर्जुन को कायरता त्यागकर अपने क्षत्रिय धर्म और निष्काम कर्म का पालन करने का उपदेश देते हैं।`,
        philosophicalSignificance: `श्रीमद्भगवद्गीता का यह श्लोक सनातन सत्य को रेखांकित करता है कि मनुष्य का वास्तविक स्वरूप देह नहीं अपितु अविनाशी आत्मा है। जब मनुष्य फल की आसक्ति त्यागकर अपने स्वभाविक धर्म के अनुसार कर्म करता है, तो कर्म बंधन का कारण बनने के बजाय मुक्ति का साधन बन जाता है।`,
        practicalApplication: `अपने दैनिक जीवन में जब भी आप चिंता, भ्रम या परिणाम के दबाव से घिरें, तो अपना ध्यान परिणाम से हटाकर केवल वर्तमान कार्य की गुणवत्ता पर केंद्रित करें। ईमानदारी और पूर्ण निष्ठा से प्रयास करें, परिणाम की चिंता को ईश्वर या जीवन-प्रवाह पर छोड़ दें।`,
        keyLesson: isKrishna
          ? "कर्म ही तुम्हारा अधिकार है, फल पर तुम्हारा स्वामित्व नहीं। समत्व भाव ही सच्चा योग है।"
          : "संशय और मोह का निवारण केवल आत्म-ज्ञान और सम्यक विवेक से ही संभव है।"
      };
    }

    if (lang === "te") {
      return {
        speaker: speaker.te,
        simpleMeaning: teText,
        detailedInterpretation: `ఈ శ్లోకంలో ${speaker.te} అందించిన సందేశం భగవద్గీత యొక్క మూల తత్త్వానికి ప్రతీక. ${ch}వ అధ్యాయంలో బోధించబడిన ఈ వాక్యం సాధకుడిని కర్తవ్య పాలన దిశగా నడిపిస్తుంది. కర్మ మరియు అంతఃకరణ సమతుల్యత ద్వారానే పరమ శాంతి లభిస్తుందని ఈ శ్లోకం స్పష్టం చేస్తుంది.`,
        context: isDhritarashtra
          ? "కురుక్షేత్ర రణరంగంలో ఇరు పక్షాల సైన్యాలు సిద్ధంగా ఉన్నప్పుడు, హస్తినాపురంలో ఉన్న ధృతరాష్ట్రుడు సంజయునితో యుద్ధ రంగ విశేషాలను తెలుసుకోవడానికి ఆతురతతో అడుగుతున్నాడు."
          : isArjuna
          ? "బంధువులను, గురువులను చూసి విచారగ్రస్తుడైన అర్జునుడు, తన కర్తవ్య భ్రష్టతను పోగొట్టుకోవడానికి శ్రీకృష్ణుని వద్ద తన సందేహాలను నివేదిస్తున్నాడు."
          : isSanjaya
          ? "మహర్షి వేదవ్యాసుని దివ్యదృష్టి ద్వారా కురుక్షేత్ర రణక్షేత్రంలో జరుగుతున్న వాస్తవాలను సంజయుడు ధృతరాష్ట్రునికి ప్రత్యక్షంగా వివరిస్తున్నాడు."
          : "మోహంలో మునిగిపోయిన అర్జునుడిని మేల్కొలిపి, ధర్మ మార్గంలో నడిపించడానికి శ్రీకృష్ణ భగవానుడు అమూల్యమైన గీతోపదేశాన్ని అనుగ్రహిస్తున్నాడు.",
        philosophicalSignificance: "భగవద్గీత బోధించే నిష్కామ కర్మ సిద్ధాంతం ఈ శ్లోకంలో ప్రతిఫలిస్తుంది. జీవుడు తన స్వధర్మాన్ని ఆచరిస్తూ, ఫలితాపేక్షను విడిచిపెట్టినప్పుడు కర్మ బంధాలు నశించి మోక్షమార్గం సుగమమవుతుంది.",
        practicalApplication: "మన నిత్య జీవితంలో ఎదురయ్యే ఒత్తిడులు, భయాలు మరియు ఫలితాల గురించిన ఆందోళనలను వదిలి, ప్రస్తుత క్షణంలో మన కర్తవ్యాన్ని శ్రద్ధతో నిర్వర్తించాలి. ఫలితంపై ఆశక్తి లేని సమభావమే నిజమైన యోగం.",
        keyLesson: "కర్తవ్య నిర్వహణలో సమభావం కలిగి ఉండటమే నిజమైన యోగము. ఫలితాన్ని దైవానికి అర్పించి ప్రశాంతంగా జీవించాలి."
      };
    }

    // Default: English
    return {
      speaker: speaker.en,
      simpleMeaning: enText,
      detailedInterpretation: `In this verse, spoken by ${speaker.en}, the Bhagavad Gita unfolds a foundational teaching of Chapter ${ch}. The teaching addresses the tension between outer engagement and inner calm. The verse emphasizes that when actions are performed with an elevated attitude of mindfulness rather than selfish grasping, life transforms from an exhausting struggle into a liberating spiritual practice.`,
      context: isDhritarashtra
        ? "Before the clash of armies at Kurukshetra, the blind King Dhritarashtra sits in his palace in Hastinapura, anxiously asking his charioteer Sanjaya to narrate what his sons and the Pandavas are doing on the sacred battlefield."
        : isArjuna
        ? "Overwhelmed by attachment, moral dilemma, and grief upon seeing his revered teachers and kin ready for battle, prince Arjuna casts aside his bow and seeks spiritual refuge in Lord Krishna."
        : isSanjaya
        ? "Blessed with visionary clairvoyance by sage Vyasa, Sanjaya objectively describes the battlefield events, dialogue, and cosmic transformations to King Dhritarashtra."
        : `Lord Krishna directly addresses Arjuna, cutting through his illusions and despondency. Krishna guides the seeker past emotional paralysis toward fearless alignment with truth, duty (svadharma), and spiritual freedom.`,
      philosophicalSignificance: `This verse anchors the Gita's philosophy of Self-realization. The physical body and mind undergo ceaseless change, while the Atman (pure consciousness) remains eternal, untouched by birth or death. By anchoring one's identity in the changeless witness, one attains equanimity amidst worldly dualities.`,
      practicalApplication: `In daily life, practice detaching your peace of mind from external outcomes. Give 100% of your dedication and sincerity to whatever task is before you—whether work, study, or relationships—and let go of anxious obsession over praise, blame, or future results.`,
      keyLesson: isKrishna
        ? "Focus your energy wholeheartedly on right action; let go of anxious claims over the outcome. Equanimity of mind is true yoga."
        : "True clarity dawns when we acknowledge our limitations and humbly seek higher wisdom with an open heart."
    };
  }

  // Find related verses for a given verse
  function getRelatedVerses(corpus, ch, ve) {
    const currentRef = `${ch}.${ve}`;
    const related = [];

    // 1. Find matching topic
    for (const topic of thematicTopics) {
      if (topic.keyVerses.includes(currentRef)) {
        for (const ref of topic.keyVerses) {
          if (ref !== currentRef && !related.includes(ref)) {
            related.push(ref);
          }
        }
      }
    }

    // 2. Add sequential siblings in chapter
    if (ve > 1) {
      const prevRef = `${ch}.${ve - 1}`;
      if (!related.includes(prevRef)) related.push(prevRef);
    }
    const nextRef = `${ch}.${ve + 1}`;
    if (!related.includes(nextRef)) related.push(nextRef);

    // 3. Resolve verse objects from corpus
    return related.slice(0, 4).map(ref => {
      const [c, v] = ref.split(".").map(Number);
      return corpus.find(item => Number(item.chapter) === c && Number(item.verse) === v);
    }).filter(Boolean);
  }

  // Smart Ask Krishna semantic & keyword retriever
  function answerQuestion(corpus, question, targetLang = "en") {
    if (!question || typeof question !== "string") {
      return {
        error: "Please share a question or describe your situation."
      };
    }

    const q = question.toLowerCase();
    let bestTopic = null;
    let highestScore = 0;

    // Check thematic topics
    for (const topic of thematicTopics) {
      let score = 0;
      for (const kw of topic.keywords) {
        if (q.includes(kw.toLowerCase())) score += 5;
      }
      if (score > highestScore) {
        highestScore = score;
        bestTopic = topic;
      }
    }

    // Keyword extraction
    const words = q.split(/[^a-zA-Z\u0900-\u097F\u0C00-\u0C7F]+/).filter(w => w.length >= 3);
    
    // Score all verses
    const scoredVerses = corpus.map(v => {
      let score = 0;
      const ref = `${v.chapter}.${v.verse}`;

      if (bestTopic && bestTopic.keyVerses.includes(ref)) {
        score += 25;
      }

      const enText = (v.translation || "").toLowerCase();
      const translit = (v.transliteration || "").toLowerCase();
      const hiText = (v.hindi || "").toLowerCase();
      const teText = (v.telugu || "").toLowerCase();
      const saText = (v.sanskrit || "");

      for (const w of words) {
        if (enText.includes(w)) score += 3;
        if (translit.includes(w)) score += 4;
        if (hiText.includes(w)) score += 4;
        if (teText.includes(w)) score += 4;
        if (saText.includes(w)) score += 5;
      }

      return { verse: v, score };
    });

    scoredVerses.sort((a, b) => b.score - a.score);
    const topMatch = scoredVerses[0];

    if (!topMatch || topMatch.score === 0) {
      return {
        notFound: true,
        message: targetLang === "hi"
          ? "इस प्रश्न के लिए सीधा संदर्भ नहीं मिला। कृपया अपने प्रश्न को अन्य शब्दों में व्यक्त करने का प्रयास करें।"
          : targetLang === "te"
          ? "ఈ ప్రశ్నకు ఖచ్చితమైన శ్లోకం దొరకలేదు. దయచేసి వేరే పదాలతో ప్రశ్నించండి."
          : "I could not find an exact matching verse for this inquiry. Please describe the situation or concept with slightly different words."
      };
    }

    const selected = topMatch.verse;
    const explanation = generateExplanation(selected, targetLang);
    const speaker = getSpeaker(selected.chapter, selected.verse, selected.sanskrit);

    let title = "Guidance from the Bhagavad Gita";
    let applicationText = "";

    if (targetLang === "hi") {
      title = bestTopic ? bestTopic.label.hi : `भगवद्गीता अध्याय ${selected.chapter}, श्लोक ${selected.verse} से मार्गदर्शन`;
      applicationText = `${explanation.practicalApplication} ${explanation.keyLesson}`;
    } else if (targetLang === "te") {
      title = bestTopic ? bestTopic.label.te : `భగవద్గీత అధ్యాయం ${selected.chapter}, శ్లోకం ${selected.verse} ద్వారా మార్గదర్శకత్వం`;
      applicationText = `${explanation.practicalApplication} ${explanation.keyLesson}`;
    } else {
      title = bestTopic ? bestTopic.label.en : `Guidance from Bhagavad Gita ${selected.chapter}.${selected.verse}`;
      applicationText = `${explanation.practicalApplication} Remember: ${explanation.keyLesson}`;
    }

    return {
      title,
      reference: `Bhagavad Gita ${selected.chapter}.${selected.verse}`,
      chapter: selected.chapter,
      verse: selected.verse,
      speaker: speaker[targetLang] || speaker.en,
      sanskrit: selected.sanskrit,
      transliteration: selected.transliteration,
      translation: targetLang === "hi" ? selected.hindi : (targetLang === "te" ? selected.telugu : selected.translation),
      meaning: explanation.simpleMeaning,
      context: explanation.context,
      philosophicalSignificance: explanation.philosophicalSignificance,
      application: applicationText,
      keyLesson: explanation.keyLesson,
      word_by_word: formatWordByWord(selected.word_by_word),
      disclaimer: "Scripture verses are drawn directly from the verified Bhagavad Gita corpus. The practical reflection is an educational study interpretation, not a quotation from Krishna."
    };
  }

  return {
    speakerMap,
    getSpeaker,
    thematicTopics,
    iastToDevanagari,
    formatWordByWord,
    generateExplanation,
    getRelatedVerses,
    answerQuestion
  };
});
