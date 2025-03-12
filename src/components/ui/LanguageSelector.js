'use client';

import { useTranslation, SUPPORTED_LOCALES } from "@/config/i18n";
import styles from "./LanguageSelector.module.css";

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslation();
  
  const handleLanguageChange = (e) => {
    setLocale(e.target.value);
  };
  
  const localeNames = {
    'es': 'Español',
    'en': 'English',
    'it': 'Italiano'
  };
  
  return (
    <div className={styles.languageSelector}>
      <select 
        value={locale} 
        onChange={handleLanguageChange}
        className={styles.select}
      >
        {SUPPORTED_LOCALES.map(code => (
          <option key={code} value={code}>
            {localeNames[code] || code}
          </option>
        ))}
      </select>
    </div>
  );
}
