'use client';

import { useTranslation, SUPPORTED_LOCALES } from "@/config/i18n";
import styles from "./LanguageSelector.module.css";

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslation();
  
  const localeNames = {
    'es': 'ES',
    'en': 'EN',
    'it': 'IT'
  };
  
  return (
    <div className={styles.languageSelector}>
      {SUPPORTED_LOCALES.map(code => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`${styles.langButton} ${locale === code ? styles.active : ''}`}
          aria-pressed={locale === code}
          title={`Switch to ${code === 'es' ? 'Spanish' : code === 'en' ? 'English' : 'Italian'}`}
        >
          {localeNames[code] || code}
        </button>
      ))}
    </div>
  );
}
