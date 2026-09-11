// Picks the current-language version of a localized field, falling back to English
export function localize(field, currentLang) {
  if (!field) return '';
  if (typeof field === 'string') return field; // already a plain string, not localized
  return field[currentLang] || field.en || '';
}

const benefitTypeLabels = {
  en: {
    'credit-linked subsidy': 'Credit-linked subsidy',
    'collateral-free loan': 'Collateral-free loan',
    'bank loan': 'Bank loan',
    grant: 'Grant'
  },
  hi: {
    'credit-linked subsidy': 'ऋण-संबद्ध सब्सिडी',
    'collateral-free loan': 'बिना गारंटी ऋण',
    'bank loan': 'बैंक ऋण',
    grant: 'अनुदान'
  },
  te: {
    'credit-linked subsidy': 'క్రెడిట్-లింక్డ్ సబ్సిడీ',
    'collateral-free loan': 'హామీ లేని రుణం',
    'bank loan': 'బ్యాంకు రుణం',
    grant: 'గ్రాంట్'
  }
};

export function localizeBenefitType(type, currentLang) {
  return benefitTypeLabels[currentLang]?.[type] || benefitTypeLabels.en[type] || type || '';
}

const eligibilityLabels = {
  en: {
    general: 'General',
    sc: 'SC',
    st: 'ST',
    obc: 'OBC',
    women: 'Women',
    disabled: 'Disabled',
    manufacturing: 'Manufacturing',
    service: 'Service',
    retail: 'Retail',
    agri: 'Agriculture',
    new: 'new',
    existing: 'existing',
    both: 'new and existing'
  },
  hi: {
    general: 'सामान्य',
    sc: 'अनुसूचित जाति',
    st: 'अनुसूचित जनजाति',
    obc: 'अन्य पिछड़ा वर्ग',
    women: 'महिलाएं',
    disabled: 'दिव्यांगजन',
    manufacturing: 'विनिर्माण',
    service: 'सेवा',
    retail: 'खुदरा',
    agri: 'कृषि',
    new: 'नए',
    existing: 'मौजूदा',
    both: 'नए और मौजूदा'
  },
  te: {
    general: 'సాధారణ',
    sc: 'ఎస్సీ',
    st: 'ఎస్టీ',
    obc: 'ఓబీసీ',
    women: 'మహిళలు',
    disabled: 'దివ్యాంగులు',
    manufacturing: 'తయారీ',
    service: 'సేవలు',
    retail: 'రిటైల్',
    agri: 'వ్యవసాయం',
    new: 'కొత్త',
    existing: 'ప్రస్తుత',
    both: 'కొత్త మరియు ప్రస్తుత'
  }
};

export function localizeEligibility(value, currentLang) {
  if (!value) return '';
  const key = String(value).toLowerCase();
  return eligibilityLabels[currentLang]?.[key] || eligibilityLabels.en[key] || value;
}