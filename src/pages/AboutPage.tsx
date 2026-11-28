import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-canvas py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <section className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {t(`O agenciji ${BRAND_CONFIG.brandName}`, `About ${BRAND_CONFIG.brandName}`)}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-ink leading-tight">
            {t(
              'Digitalna agencija izgrađena oko jasnoće, brzine i stvarnog zastupanja.',
              'A digital insurance agency built around clarity, speed, and real advocacy.'
            )}
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            {t(
              `${BRAND_CONFIG.legalName} je HANFA-licencirano društvo za zastupanje u osiguranju. Vjerujemo da ugovaranje osiguranja u Hrvatskoj ne smije zahtijevati sate telefoniranja niti čitanje nečitljivih uvjeta.`,
              `${BRAND_CONFIG.legalName} is a HANFA-authorized Croatian insurance agency. We believe buying insurance in Croatia shouldn't require hours on the phone or deciphering impenetrable fine print.`
            )}
          </p>
        </section>

        {/* How Remuneration Works */}
        <section className="rounded-editorial bg-canvas-warm border border-hairline p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h2 className="font-sans text-base font-bold text-ink">
              {t('0 € dodatnog troška', '€0 client fee')}
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              {t(
                'Našu uslugu financiraju osiguravajuća društva putem ugovorene zastupničke provizije. Cijena police za vas jednaka je ili povoljnija nego izravno kod osiguratelja.',
                'Our service is funded exclusively via insurer commissions. Your policy costs the same or less than going direct to a carrier.'
              )}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="font-sans text-base font-bold text-ink">
              {t('7 partnerskih društava', '7 partner insurers')}
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              {t(
                'Ne nudimo samo jednu kuću — na jednom zaslonu uspoređujemo Allianz, Croatia, Generali, Wiener, Triglav, Savu i Groupamu.',
                'We never push a single carrier — compare Allianz, Croatia osiguranje, Generali, Wiener VIG, Triglav, Sava, and Groupama side-by-side.'
              )}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="font-sans text-base font-bold text-ink">
              {t('Ljudska podrška kod štete', 'Human claims advocacy')}
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              {t(
                'Digitalno ugovaranje štedi vrijeme, a kad nastupi štetni događaj naš licencirani tim vodi prijavu i praćenje isplate u vaše ime.',
                'Digital quoting saves your time, and when an incident happens our licensed advisors coordinate directly with the insurer until payout.'
              )}
            </p>
          </div>
        </section>

        {/* Licensed Advisors */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              {t('Licencirani zastupnici u osiguranju', 'HANFA-Licensed Insurance Advisors')}
            </h2>
            <p className="text-sm text-ink-secondary">
              {t(
                'Svi savjetnici upisani su u registar Hrvatske agencije za nadzor financijskih usluga (HANFA).',
                'Every advisor is registered with the Croatian Financial Services Supervisory Agency (HANFA).'
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BRAND_CONFIG.licensedAdvisors.map((adv) => (
              <div
                key={adv.id}
                className="rounded-editorial border border-hairline bg-canvas p-6 space-y-2"
              >
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-status-success">
                  <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
                  <span className="tabular-nums">HANFA {adv.hanfaLicense}</span>
                </div>
                <h3 className="font-sans text-base font-bold text-ink">{adv.name}</h3>
                <p className="text-xs text-ink-secondary">
                  {language === 'en' ? adv.titleEn : adv.titleHr}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Partner Insurers */}
        <section className="space-y-5">
          <h2 className="font-display text-3xl text-ink">
            {t('Osiguravajuća društva koja zastupamo', 'Insurance Carriers We Represent')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRAND_CONFIG.partnerInsurers.map((partner) => (
              <div
                key={partner.id}
                className="rounded-editorial border border-hairline bg-canvas p-5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans text-sm font-bold text-ink">{partner.name}</h3>
                  <span className="text-[11px] font-semibold text-ink-muted shrink-0">
                    {partner.rating}
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-ink-secondary">
                  {(language === 'en' ? partner.strengthsEn : partner.strengthsHr).map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA & Regulatory Link */}
        <section className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <a
            href={BRAND_CONFIG.hanfaRegistryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-accent transition-colors"
          >
            <span>
              {t('Provjeri upis u javnom Registru HANFA', 'Verify license in public HANFA Registry')}
            </span>
            <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
          </a>
          <Link to="/izracun">
            <Button size="lg">
              <span>{t('Izračunaj cijenu u 90 sekundi', 'Check prices in 90 seconds')}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};
