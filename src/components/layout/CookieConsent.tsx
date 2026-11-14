import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Settings2 } from 'lucide-react';
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
    <div
      role="dialog"
      aria-label="Postavke privatnosti i kolačića"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:max-w-md z-50 bg-white rounded-xl p-5 border border-slate-200 shadow-xl text-xs space-y-3.5 text-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
          <ShieldCheck className="w-4 h-4 text-[#0F2942] shrink-0" />
          <span>Zaštita privatnosti i kolačići</span>
        </div>
        <button
          type="button"
          onClick={handleDeclineOptional}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
          aria-label="Zatvori"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-slate-600 leading-relaxed text-xs">
        Koristimo nužne tehničke kolačiće za ispravan rad informativnih kalkulatora i sigurnost zahtjeva, a uz vaš
        pristanak i analitičke kolačiće sukladno Općoj uredbi o zaštiti podataka (GDPR) i smjernicama AZOP-a.
      </p>

      {showSettings && (
        <div className="p-3 bg-slate-50 rounded-lg space-y-2.5 border border-slate-200 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Nužni tehnički kolačići</span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Uvijek aktivni
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <label htmlFor="analytics-toggle" className="cursor-pointer pr-3">
              <span className="font-semibold text-slate-900 block">Analitički kolačići</span>
              <span className="text-[11px] text-slate-500">Mjerenje stabilnosti i brzine izračuna</span>
            </label>
            <input
              id="analytics-toggle"
              type="checkbox"
              checked={analyticsAllowed}
              onChange={(e) => setAnalyticsAllowed(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0F2942]"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <label htmlFor="marketing-toggle" className="cursor-pointer pr-3">
              <span className="font-semibold text-slate-900 block">Informativni kolačići</span>
              <span className="text-[11px] text-slate-500">Prikaz relevantnih akcija osiguratelja</span>
            </label>
            <input
              id="marketing-toggle"
              type="checkbox"
              checked={marketingAllowed}
              onChange={(e) => setMarketingAllowed(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0F2942]"
            />
          </div>

          <div className="pt-1">
            <Button variant="primary" size="sm" onClick={handleAcceptSelected} className="w-full text-xs">
              Spremi odabrane postavke
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        <Button variant="primary" size="sm" onClick={handleAcceptAll} className="flex-1 text-xs">
          Prihvati sve
        </Button>
        <Button variant="outline" size="sm" onClick={handleDeclineOptional} className="text-xs">
          Samo nužni
        </Button>
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-slate-500 hover:text-[#0F2942] rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          title="Postavke kolačića"
          aria-label="Prilagodi postavke kolačića"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
