import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

const CONSENT_KEY = 'jasno_cookie_consent_v1';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(CONSENT_KEY);
    } catch {
      return false;
    }
  });

  if (!visible) return null;

  const save = (level: 'essential' | 'all') => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ level, timestamp: new Date().toISOString() })
      );
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Obavijest o kolačićima"
      className="fixed bottom-0 inset-x-0 z-30 bg-canvas border-t border-hairline shadow-elevated"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-ink-secondary leading-relaxed">
          Koristimo nužne kolačiće za rad kalkulatora i sigurnost prijave te opcionalne analitičke
          kolačiće uz vašu privolu.{' '}
          <Link to="/kolacici" className="text-ink font-medium underline underline-offset-2">
            Politika kolačića
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => save('essential')}>
            Samo nužni
          </Button>
          <Button size="sm" variant="secondary" onClick={() => save('all')}>
            Prihvati sve
          </Button>
          <button
            type="button"
            onClick={() => save('essential')}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-warm"
            aria-label="Zatvori obavijest o kolačićima"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
