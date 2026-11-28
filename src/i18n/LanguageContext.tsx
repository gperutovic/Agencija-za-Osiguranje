import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { storageKey } from '../config/brand';
import { Language } from '../types/domain';
import { UI_COPY } from './translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (hr: string, en: string) => string;
  copy: (typeof UI_COPY)[Language];
}

const LANG_STORAGE_KEY = storageKey('lang_v1');

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      return saved === 'en' ? 'en' : 'hr';
    } catch {
      return 'hr';
    }
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore storage errors in restricted browsing contexts
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'hr' ? 'en' : 'hr');
  }, [language, setLanguage]);

  const t = useCallback((hr: string, en: string) => (language === 'en' ? en : hr), [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        copy: UI_COPY[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};
