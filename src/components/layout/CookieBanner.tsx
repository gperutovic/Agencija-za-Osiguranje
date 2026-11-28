import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { storageKey } from '../../config/brand';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/Button';

export const COOKIE_CONSENT_KEY = storageKey('cookie_consent_v1');

export const CookieBanner: React.FC = () => {
  const { copy } = useLanguage();
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(COOKIE_CONSENT_KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    // Keep bottom-right toasts safely above the cookie banner while visible
    document.documentElement.style.setProperty(
      '--toast-bottom-offset',
      visible ? '6.5rem' : '1.25rem'
    );
    return () => {
      document.documentElement.style.setProperty('--toast-bottom-offset', '1.25rem');
    };
  }, [visible]);

  if (!visible) return null;

  const save = (level: 'essential' | 'all') => {
    try {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
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
      aria-label={copy.cookieBanner.ariaLabel}
      className="fixed bottom-0 inset-x-0 z-30 bg-canvas border-t border-hairline shadow-elevated"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-ink-secondary leading-relaxed">
          {copy.cookieBanner.message}{' '}
          <Link to="/kolacici" className="text-ink font-medium underline underline-offset-2">
            {copy.cookieBanner.policyLink}
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => save('essential')}>
            {copy.cookieBanner.essentialOnly}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => save('all')}>
            {copy.cookieBanner.acceptAll}
          </Button>
          <button
            type="button"
            onClick={() => save('essential')}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-warm"
            aria-label={copy.cookieBanner.closeAria}
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
