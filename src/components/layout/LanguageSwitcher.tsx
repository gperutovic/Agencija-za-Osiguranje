import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ variant?: 'light' | 'dark' }> = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('hr') ? 'hr' : 'en';

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono transition-colors">
      <div className="px-2 py-0.5 flex items-center gap-1 text-[11px] text-slate-400">
        <Globe className="w-3.5 h-3.5 text-[#fb6504]" />
      </div>

      <button
        type="button"
        onClick={() => toggleLanguage('hr')}
        className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-bold ${
          currentLang === 'hr'
            ? 'bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white shadow-[0_0_12px_rgba(251,101,4,0.35)]'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        HR
      </button>

      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-bold ${
          currentLang === 'en'
            ? 'bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white shadow-[0_0_12px_rgba(251,101,4,0.35)]'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
};
