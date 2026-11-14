import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Settings2, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hr_insurance_cookie_consent');
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'hr_insurance_cookie_consent',
      JSON.stringify({ necessary: true, analytics: true, marketing: true, timestamp: Date.now() })
    );
    setVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem(
      'hr_insurance_cookie_consent',
      JSON.stringify({ necessary: true, analytics: analyticsAllowed, marketing: marketingAllowed, timestamp: Date.now() })
    );
    setVisible(false);
  };

  const handleDeclineOptional = () => {
    localStorage.setItem(
      'hr_insurance_cookie_consent',
      JSON.stringify({ necessary: true, analytics: false, marketing: false, timestamp: Date.now() })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:max-w-md z-50 bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/80 shadow-2xl text-xs space-y-3.5 animate-in slide-in-from-bottom-5 duration-300 text-slate-200 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-mono font-bold text-white text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zaštita privatnosti i kolačići (GDPR / AZOP)</span>
        </div>
        <button
          onClick={handleDeclineOptional}
          className="text-slate-400 hover:text-white p-1 transition-colors"
          aria-label="Zatvori"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-slate-300 leading-relaxed text-xs">
        Naša web platforma koristi nužne tehničke kolačiće za funkcioniranje kalkulatora premija i sigurnost
        ugovaranja polica. Uz vaš pristanak, koristimo i analitičke kolačiće za poboljšanje korisničkog iskustva sukladno
        smjernicama AZOP-a.
      </p>

      {showSettings ? (
        <div className="p-3 bg-slate-800/80 rounded-xl space-y-2 border border-slate-700 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Nužni kolačići</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
              Uvijek aktivni
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-700">
            <label htmlFor="analytics-toggle" className="cursor-pointer">
              <span className="font-semibold text-white block">Analitički kolačići</span>
              <span className="text-[10px] text-slate-400">Pomažu nam optimizirati brzinu izračuna</span>
            </label>
            <input
              id="analytics-toggle"
              type="checkbox"
              checked={analyticsAllowed}
              onChange={(e) => setAnalyticsAllowed(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0"
            />
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-700">
            <label htmlFor="marketing-toggle" className="cursor-pointer">
              <span className="font-semibold text-white block">Marketinški kolačići</span>
              <span className="text-[10px] text-slate-400">Prikaz relevantnih popusta i akcija</span>
            </label>
            <input
              id="marketing-toggle"
              type="checkbox"
              checked={marketingAllowed}
              onChange={(e) => setMarketingAllowed(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <Button variant="emerald" size="sm" onClick={handleAcceptSelected} className="flex-1 text-xs">
              Spremi odabir
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 font-mono text-xs">
        <Button variant="emerald" size="sm" onClick={handleAcceptAll} className="flex-1 font-bold">
          Prihvati sve
        </Button>
        <Button variant="outline" size="sm" onClick={handleDeclineOptional} className="text-slate-200 border-slate-700 hover:bg-slate-800">
          Samo nužni
        </Button>
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          title="Postavke kolačića"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
