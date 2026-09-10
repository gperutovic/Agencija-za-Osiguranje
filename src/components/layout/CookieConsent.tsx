import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from '../common/Button';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('zivot_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('zivot_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('zivot_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:max-w-md z-50 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200 shadow-floating text-xs space-y-3 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Zaštita privatnosti i kolačići (GDPR)</span>
        </div>
        <button
          onClick={handleDecline}
          className="text-slate-400 hover:text-slate-600 p-1"
          aria-label="Zatvori"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-slate-600 leading-relaxed">
        Agencija Život koristi nužne tehničke i analitičke kolačiće kako bi osigurala optimalan rad kalkulatora premija i sigurnost klijentskog portala sukladno GDPR uredbi i Zakonu o osiguranju RH.
      </p>

      <div className="flex items-center gap-2 pt-1">
        <Button variant="teal" size="sm" onClick={handleAccept} className="w-full">
          Prihvati sve kolačiće
        </Button>
        <Button variant="outline" size="sm" onClick={handleDecline} className="w-full">
          Samo nužni
        </Button>
      </div>
    </div>
  );
};
