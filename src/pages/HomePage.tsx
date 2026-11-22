import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ShieldCheck, Star } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useLanguage } from '../i18n/LanguageContext';
import { PRODUCT_CATALOG } from '../i18n/translations';
import { ProductLine } from '../types/domain';
import { formatEurWhole } from '../utils/formatters';
import { computeBundleDiscountPercent } from '../utils/pricingEngine';
import {
  HeroLeftNeighborhood,
  HeroRightNeighborhood,
  InstantPhoneIllustration,
  ProductIllustration,
  SwitchDocumentIllustration,
} from '../components/illustrations/EditorialIllustrations';
import { Button } from '../components/ui/Button';

const HERO_PILLS: ProductLine[] = ['auto', 'imovina', 'zdravstveno', 'zivotno', 'putno', 'poslovno'];

const CLIENT_REVIEWS = [
  {
    name: 'Maja K.',
    city: 'Zagreb',
    product: 'Auto AO + Puni Kasko',
    quote:
      'Usporedila sam 7 osiguratelja u manje od dvije minute, bez ijednog neželjenog poziva. Polica i Zelena karta stigli su odmah u Moj Profil.',
  },
  {
    name: 'Ivan B.',
    city: 'Split',
    product: 'Prijava štete (FNOL)',
    quote:
      'Kad mi je kamenčić razbio vjetrobransko staklo, prijavio sam štetu preko mobitela s tri fotografije. Zastupnik je riješio sve s procjeniteljem.',
  },
  {
    name: 'Petra & Luka M.',
    city: 'Rijeka',
    product: 'Paket Auto + Dom (Potres)',
    quote:
      'Spojili smo osiguranje stana s potresom i auto kasko. Uštedjeli smo 12% i napokon nam je jasno napisano što polica pokriva, a što ne.',
  },
];

export const HomePage: React.FC = () => {
  const { language, copy } = useLanguage();
  const navigate = useNavigate();

  const [heroProduct, setHeroProduct] = useState<ProductLine>('auto');
  const [selectedBundle, setSelectedBundle] = useState<ProductLine[]>(['auto', 'imovina']);

  const bundleDiscount = computeBundleDiscountPercent(selectedBundle);

  const toggleBundleProduct = (id: ProductLine) => {
    setSelectedBundle((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const launchQuoteFromHero = () => {
    navigate(`/izracun/${heroProduct}`);
  };

  const launchBundleQuote = () => {
    const primary = selectedBundle[0] ?? 'auto';
    const query =
      selectedBundle.length > 1 ? `?bundle=${encodeURIComponent(selectedBundle.join(','))}` : '';
    navigate(`/izracun/${primary}${query}`);
  };

  return (
    <div className="bg-canvas text-ink">
      {/* 1. EDITORIAL HERO SECTION — Pure White Canvas */}
      <section className="relative pt-14 sm:pt-20 pb-10 sm:pb-12 border-b border-hairline overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-[68px] leading-[1.05] text-ink">
              {copy.hero.headline}
            </h1>
            <p className="text-base sm:text-lg text-ink-secondary max-w-2xl mx-auto leading-relaxed">
              {copy.hero.subheadline}
            </p>

            {/* Quick Product Selector Pills */}
            <div
              className="flex flex-wrap items-center justify-center gap-2 pt-2"
              role="radiogroup"
              aria-label="Brzi odabir osiguranja"
            >
              {HERO_PILLS.map((id) => {
                const meta = PRODUCT_CATALOG.find((p) => p.id === id);
                if (!meta) return null;
                const active = heroProduct === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setHeroProduct(id)}
                    className={`px-4 py-2 rounded-pill text-xs sm:text-sm font-medium border transition-colors ${
                      active
                        ? 'border-ink bg-ink text-white'
                        : 'border-hairline-strong bg-canvas text-ink-secondary hover:border-ink hover:text-ink'
                    }`}
                  >
                    {language === 'hr' ? meta.nameHr : meta.nameEn}
                  </button>
                );
              })}
            </div>

            {/* Single Focused Primary CTA */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={launchQuoteFromHero} className="min-w-[220px]">
                <span>{copy.hero.cta}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Button>
              <Link
                to="/usporedi-policu"
                className="text-sm font-semibold text-ink-secondary hover:text-ink underline underline-offset-4 transition-colors"
              >
                {copy.hero.switchCta}
              </Link>
            </div>
          </div>

          {/* Flanking Minimalist Architectural Line-Art Scene */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-20 items-end">
            <div className="max-w-md mx-auto md:mx-0 w-full">
              <HeroLeftNeighborhood />
            </div>
            <div className="hidden md:block max-w-md ml-auto w-full">
              <HeroRightNeighborhood />
            </div>
          </div>

          {/* Immediate Monochrome Trust & Partner Strip */}
          <div className="mt-8 pt-6 border-t border-hairline flex flex-col lg:flex-row items-center justify-between gap-5 text-xs text-ink-muted">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-ink-secondary font-medium">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-ink" strokeWidth={1.5} />
                <span>
                  {copy.hero.trustHanfa} ({BRAND_CONFIG.hanfaRegistrationNumber})
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <Star className="w-4 h-4 text-accent fill-accent" strokeWidth={1.5} />
                <span>
                  {BRAND_CONFIG.verifiedRating.toFixed(1).replace('.', ',')} / 5 ({BRAND_CONFIG.verifiedReviewCount.toLocaleString('hr-HR')} {copy.hero.trustRating})
                </span>
              </span>
              <span>{copy.hero.trustFee}</span>
            </div>

            <div
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold tracking-wide text-ink-muted uppercase"
              aria-label="Partnerski osiguratelji"
            >
              {BRAND_CONFIG.partnerInsurers.map((insurer) => (
                <span key={insurer.id}>{insurer.shortName}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT & BUNDLE SHOWCASE — Warm Architectural Off-White */}
      <section className="bg-canvas-warm py-20 sm:py-24 border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <h2 className="font-display text-3xl sm:text-5xl text-ink leading-tight">
              {copy.bundle.title}
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary">{copy.bundle.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCT_CATALOG.map((product) => {
              const checked = selectedBundle.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleBundleProduct(product.id)}
                  aria-pressed={checked}
                  className={`group relative text-left rounded-editorial bg-canvas border p-6 transition-all flex flex-col justify-between ${
                    checked
                      ? 'border-accent ring-1 ring-accent shadow-card'
                      : 'border-hairline hover:border-hairline-strong shadow-subtle'
                  }`}
                >
                  {/* Top-left Lemonade-style checkbox + optional understated tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-accent border-accent text-white'
                          : 'bg-canvas border-hairline-strong group-hover:border-ink'
                      }`}
                    >
                      {checked ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : null}
                    </span>
                    {product.badgeHr ? (
                      <span className="text-[11px] font-semibold text-ink-muted">
                        {language === 'hr' ? product.badgeHr : product.badgeEn}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-center text-center space-y-3 my-2">
                    <ProductIllustration productLine={product.id} className="w-20 h-20" />
                    <div>
                      <h3 className="font-sans text-base font-semibold text-ink">
                        {language === 'hr' ? product.nameHr : product.nameEn}
                      </h3>
                      <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                        {language === 'hr' ? product.shortDescHr : product.shortDescEn}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-hairline flex items-baseline justify-between tabular-nums">
                    <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">
                      {copy.bundle.fromMonth} {formatEurWhole(product.startingMonthlyEur)} / mj.
                    </span>
                    <span className="text-xs text-ink-secondary font-medium">
                      {formatEurWhole(product.startingAnnualEur)} / god.
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Live Bundle Bar */}
          <div className="mt-8 rounded-editorial bg-canvas border border-hairline p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              {bundleDiscount > 0 ? (
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-ink">
                    {copy.bundle.discountActive}{' '}
                    <span className="text-accent tabular-nums">-{bundleDiscount}%</span>
                  </div>
                  <p className="text-xs text-ink-secondary">
                    {selectedBundle
                      .map((id) => {
                        const item = PRODUCT_CATALOG.find((p) => p.id === id);
                        return language === 'hr' ? item?.nameHr : item?.nameEn;
                      })
                      .join(' + ')}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-ink-secondary">{copy.bundle.selectPrompt}</p>
              )}
            </div>

            <Button size="lg" onClick={launchBundleQuote} className="shrink-0">
              <span>
                {selectedBundle.length > 1
                  ? `${copy.bundle.ctaSelected} (${selectedBundle.length})`
                  : copy.bundle.ctaDefault}
              </span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </section>

      {/* 3. HOW DIGITAL AGENCY WORKS — Pure White Canvas */}
      <section className="py-20 sm:py-24 border-b border-hairline bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {copy.howItWorks.eyebrow}
                </p>
                <h2 className="font-display text-3xl sm:text-5xl text-ink leading-tight">
                  {copy.howItWorks.title}
                </h2>
                <p className="text-base text-ink-secondary leading-relaxed">
                  {copy.howItWorks.subtitle}
                </p>
              </div>

              <div className="space-y-6">
                {copy.howItWorks.steps.map((step) => (
                  <div key={step.number} className="flex gap-4 items-start">
                    <span className="text-xs font-semibold text-accent tabular-nums pt-1 w-7 shrink-0">
                      {step.number}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-sans text-base font-semibold text-ink">{step.title}</h3>
                      <p className="text-sm text-ink-secondary leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button onClick={() => navigate('/izracun')}>
                  <span>{copy.hero.cta}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Button>
                <Button variant="outline" onClick={() => navigate('/prijava-stete')}>
                  {copy.nav.claims}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-editorial bg-canvas-warm border border-hairline p-8 sm:p-12">
                <InstantPhoneIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED SOCIAL PROOF & SWITCHING STRIP — Warm Off-White */}
      <section className="bg-canvas-warm py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Reviews */}
          <div className="space-y-10">
            <div className="max-w-2xl mx-auto text-center space-y-2">
              <div className="inline-flex items-center gap-1 text-accent" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent" strokeWidth={1.5} />
                ))}
              </div>
              <h2 className="font-display text-3xl sm:text-5xl text-ink">
                {language === 'hr'
                  ? 'Brzina kad ugovaraš. Podrška kad zatrebaš.'
                  : 'Fast when quoting. Present when you claim.'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CLIENT_REVIEWS.map((review) => (
                <article
                  key={review.name}
                  className="rounded-editorial bg-canvas border border-hairline p-6 flex flex-col justify-between space-y-5"
                >
                  <p className="text-sm text-ink leading-relaxed">“{review.quote}”</p>
                  <div className="pt-4 border-t border-hairline flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-ink">{review.name}</div>
                      <div className="text-ink-muted">{review.city}</div>
                    </div>
                    <span className="text-ink-secondary font-medium">{review.product}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Switch & Save Banner */}
          <div className="rounded-editorial bg-canvas border border-hairline p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                {copy.switchSection.eyebrow}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
                {copy.switchSection.title}
              </h2>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-2xl">
                {copy.switchSection.body}
              </p>
              <div className="pt-2">
                <Button size="lg" onClick={() => navigate('/usporedi-policu')}>
                  <span>{copy.switchSection.cta}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Button>
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-center">
              <SwitchDocumentIllustration />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
