import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ variant?: 'light' | 'dark' }> = ({
  variant = 'light',
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('hr') ? 'hr' : 'en';

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const isLight = variant === 'light';

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl border text-xs font-bold transition-colors ${
        isLight
          ? 'bg-slate-100/90 border-slate-200 text-slate-700'
          : 'bg-navy-950/70 border-navy-700/60 text-slate-300'
      }`}
    >
      <div className="px-2 py-1 flex items-center gap-1 text-[11px] opacity-60">
        <Globe className="w-3.5 h-3.5" />
      </div>

      <button
        type="button"
        onClick={() => toggleLanguage('hr')}
        className={`px-2.5 py-1 rounded-lg transition-all text-xs font-bold ${
          currentLang === 'hr'
            ? isLight
              ? 'bg-white text-brand-900 shadow-2xs'
              : 'bg-brand-600 text-white shadow-2xs'
            : 'hover:text-brand-600'
        }`}
      >
        HR 🇭🇷
      </button>

      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all text-xs font-bold ${
          currentLang === 'en'
            ? isLight
              ? 'bg-white text-brand-900 shadow-2xs'
              : 'bg-brand-600 text-white shadow-2xs'
            : 'hover:text-brand-600'
        }`}
      >
        EN 🇬🇧
      </button>
    </div>
  );
};
