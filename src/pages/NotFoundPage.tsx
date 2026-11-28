import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, FileWarning, Home, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-canvas py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent tabular-nums">
            404 • {BRAND_CONFIG.brandName}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-ink leading-tight">
            {t('Stranica koju tražite ne postoji.', 'The page you are looking for was not found.')}
          </h1>
          <p className="text-base text-ink-secondary max-w-xl mx-auto leading-relaxed">
            {t(
              'Moguće je da je poveznica promijenjena ili uklonjena. Odaberite jedan od glavnih alata naše digitalne agencije ispod.',
              'The link may have moved or expired. Jump straight to one of our core digital agency tools below.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <Link
            to="/"
            className="group rounded-editorial border border-hairline bg-canvas-warm/60 hover:border-ink p-4 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-accent shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-sm font-semibold text-ink">{t('Naslovnica', 'Home')}</div>
                <div className="text-xs text-ink-secondary">
                  {t('Pregled svih 7 osiguranja i paketa', 'Browse all 7 lines & bundle discounts')}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink" />
          </Link>

          <Link
            to="/izracun"
            className="group rounded-editorial border border-hairline bg-canvas-warm/60 hover:border-ink p-4 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-accent shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-sm font-semibold text-ink">
                  {t('90-sekundni izračun', '90-Second Quote Engine')}
                </div>
                <div className="text-xs text-ink-secondary">
                  {t('Usporedi 7 hrvatskih osiguratelja', 'Compare 7 Croatian insurers live')}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink" />
          </Link>

          <Link
            to="/prijava-stete"
            className="group rounded-editorial border border-hairline bg-canvas-warm/60 hover:border-ink p-4 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileWarning className="w-5 h-5 text-accent shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-sm font-semibold text-ink">
                  {t('Prijava štete (FNOL)', 'File or Track a Claim')}
                </div>
                <div className="text-xs text-ink-secondary">
                  {t('Digitalna prijava ili provjera statusa', 'Digital 5-step FNOL & live tracking')}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink" />
          </Link>

          <Link
            to="/ai-savjetnik"
            className="group rounded-editorial border border-hairline bg-canvas-warm/60 hover:border-ink p-4 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-sm font-semibold text-ink">
                  {t('AI Savjetnik', 'AI Insurance Advisor')}
                </div>
                <div className="text-xs text-ink-secondary">
                  {t('Jasni odgovori bez sitnih slova', 'Plain-language answers & human handoff')}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink" />
          </Link>
        </div>

        <div>
          <Link to="/">
            <Button size="lg">{t('Povratak na naslovnicu', 'Back to homepage')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
