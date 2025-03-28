'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Idiomas soportados
export const SUPPORTED_LOCALES = ['es', 'en', 'it'];
export const DEFAULT_LOCALE = 'it';

// Context para gestionar el idioma actual
export const LanguageContext = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (config, key) => "", // obtener texto traducido
  tForm: (formConfig, field, subField) => "", //  formularios
});

// obtener texto con mejor manejo de anidación
export const getText = (config, key, locale = DEFAULT_LOCALE) => {
  if (!config || !key) return "";
  
  // Si la clave ya contiene el idioma directamente (formato más simple)
  if (config[key] && config[key][locale]) {
    return config[key][locale];
  }
  
  const keys = key.split('.');
  let current = config;
  
  // Navegar por el objeto hasta llegar al valor deseado
  for (const k of keys) {
    if (!current[k]) return "";
    current = current[k];
  }
  
  // Obtener el texto para el idioma actual
  if (typeof current === 'string') return current;
  
  return current[locale] || current[DEFAULT_LOCALE] || "";
};

// Función especializada para formularios anidados
export const getFormText = (formConfig, field, subField = null, locale = DEFAULT_LOCALE) => {
  if (!formConfig || !formConfig[locale]) return "";
  
  const localeConfig = formConfig[locale];
  
  if (!field) return "";
  
  if (!subField) {
    return localeConfig[field] || "";
  }
  
  return localeConfig[field]?.[subField] || "";
};

// Hook para usar traducciones en componentes
export function useTranslation() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  
  // Función t para obtener texto traducido
  const t = (config, key) => {
    return getText(config, key, context.locale);
  };
  
  // Función especializada para formularios
  const tForm = (formConfig, field, subField = null) => {
    return getFormText(formConfig, field, subField, context.locale);
  };
  
  return {
    locale: context.locale,
    setLocale: context.setLocale,
    t,
    tForm
  };
}

// Provider para envolver la aplicación
export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  
  useEffect(() => {
    // Obtener idioma del localStorage (si existe)
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('language');
      if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
    }
  }, []);
  
  const setLocale = (newLocale) => {
    if (SUPPORTED_LOCALES.includes(newLocale)) {
      setLocaleState(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', newLocale);
      }
    }
  };
  
  // Proporcionar funciones mejoradas para acceder a textos
  const contextValue = {
    locale,
    setLocale,
    t: (config, key) => getText(config, key, locale),
    tForm: (formConfig, field, subField) => getFormText(formConfig, field, subField, locale)
  };
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
