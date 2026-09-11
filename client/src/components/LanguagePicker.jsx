import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
];

function LanguagePicker({ compact = false }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = `${i18n.language}-IN`;
  }, [i18n.language]);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('schemesetu_language', code);
  };

  return (
    <div className={`language-picker ${compact ? 'language-picker-compact' : ''}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`language-pill ${i18n.language === lang.code ? 'active' : ''}`}
          onClick={() => changeLanguage(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export default LanguagePicker;