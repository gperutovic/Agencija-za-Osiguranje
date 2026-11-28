import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, User, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { useAuth } from '../../context/AuthContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useLanguage } from '../../i18n/LanguageContext';
import { PRODUCT_CATALOG } from '../../i18n/translations';
import { formatEurWhole } from '../../utils/formatters';
import { BrandWordmark, ProductIllustration } from '../illustrations/EditorialIllustrations';
import { Button } from '../ui/Button';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div
      role="group"
      aria-label={language === 'hr' ? 'Odabir jezika' : 'Language selector'}
      className="inline-flex items-center rounded-lg border border-hairline bg-canvas-warm p-0.5 text-[11px] font-semibold"
    >
      <button
        type="button"
        onClick={() => setLanguage('hr')}
        aria-pressed={language === 'hr'}
        className={`px-2 py-1 rounded-md transition-colors ${
          language === 'hr' ? 'bg-ink text-white shadow-subtle' : 'text-ink-muted hover:text-ink'
        }`}
      >
        HR
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-2 py-1 rounded-md transition-colors ${
          language === 'en' ? 'bg-ink text-white shadow-subtle' : 'text-ink-muted hover:text-ink'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export const Header: React.FC = () => {
  const { language, copy } = useLanguage();
  const { user, isAgent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(mobileOpen, mobileDrawerRef, () => setMobileOpen(false));

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 h-16 lg:h-[72px] bg-canvas border-b border-hairline">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <Link
          to="/"
          className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          aria-label={`${BRAND_CONFIG.brandName} ${copy.nav.homeAriaSuffix}`}
          aria-current={isActive('/') ? 'page' : undefined}
        >
          <BrandWordmark />
        </Link>

        {/* Center: Max 5 Clean Top-Level Items */}
        <nav aria-label={copy.nav.mainNavLabel} className="hidden lg:flex items-center gap-1">
          {/* 1. Osiguranja Mega-Menu */}
          <div ref={megaRef} className="relative">
            <button
              type="button"
              onClick={() => setMegaOpen((prev) => !prev)}
              aria-expanded={megaOpen}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                megaOpen || isActive('/izracun')
                  ? 'text-ink bg-canvas-warm'
                  : 'text-ink-secondary hover:text-ink hover:bg-canvas-warm'
              }`}
            >
              <span>{copy.nav.insurances}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${megaOpen ? 'rotate-180' : ''}`}
                strokeWidth={1.5}
              />
            </button>

            {megaOpen ? (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-[620px] rounded-editorial bg-canvas border border-hairline shadow-elevated p-5 animate-step"
              >
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCT_CATALOG.map((product) => (
                    <Link
                      key={product.id}
                      to={`/izracun/${product.id}`}
                      role="menuitem"
                      className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-canvas-warm transition-colors"
                    >
                      <ProductIllustration productLine={product.id} className="w-11 h-11 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                          {language === 'hr' ? product.nameHr : product.nameEn}
                        </div>
                        <div className="text-xs text-ink-muted tabular-nums">
                          {copy.units.from} {formatEurWhole(product.startingMonthlyEur)}{' '}
                          {product.isSingleTrip ? copy.units.perTripShort : copy.units.perMonthShort}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-3.5 border-t border-hairline flex items-center justify-between text-xs text-ink-secondary">
                  <span>
                    {language === 'hr'
                      ? 'Spoji 2+ police i ostvari do 15% paketnog popusta.'
                      : 'Bundle 2+ lines for up to 15% automatic savings.'}
                  </span>
                  <Link
                    to="/izracun"
                    className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                  >
                    <span>{copy.nav.getQuote}</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          {/* 2. Usporedi policu */}
          <Link
            to="/usporedi-policu"
            aria-current={isActive('/usporedi-policu') ? 'page' : undefined}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/usporedi-policu')
                ? 'text-ink bg-canvas-warm'
                : 'text-ink-secondary hover:text-ink hover:bg-canvas-warm'
            }`}
          >
            {copy.nav.switchPolicy}
          </Link>

          {/* 3. Prijava štete */}
          <Link
            to="/prijava-stete"
            aria-current={isActive('/prijava-stete') ? 'page' : undefined}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/prijava-stete')
                ? 'text-ink bg-canvas-warm'
                : 'text-ink-secondary hover:text-ink hover:bg-canvas-warm'
            }`}
          >
            {copy.nav.claims}
          </Link>

          {/* 4. AI Savjetnik */}
          <Link
            to="/ai-savjetnik"
            aria-current={isActive('/ai-savjetnik') ? 'page' : undefined}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/ai-savjetnik')
                ? 'text-ink bg-canvas-warm'
                : 'text-ink-secondary hover:text-ink hover:bg-canvas-warm'
            }`}
          >
            {copy.nav.aiAdvisor}
          </Link>

          {/* 5. O nama */}
          <Link
            to="/o-nama"
            aria-current={isActive('/o-nama') ? 'page' : undefined}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/o-nama')
                ? 'text-ink bg-canvas-warm'
                : 'text-ink-secondary hover:text-ink hover:bg-canvas-warm'
            }`}
          >
            {copy.nav.about}
          </Link>
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5">
          <LanguageSwitcher />

          {isAgent ? (
            <Link
              to="/admin"
              aria-current={isActive('/admin') ? 'page' : undefined}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-ink border border-hairline hover:bg-canvas-warm transition-colors"
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              <span>{copy.nav.adminOps}</span>
            </Link>
          ) : null}

          <Link
            to="/moj-profil"
            aria-current={isActive('/moj-profil') ? 'page' : undefined}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-ink-secondary hover:text-ink hover:bg-canvas-warm transition-colors"
          >
            <User className="w-4 h-4" strokeWidth={1.5} />
            <span>{user ? user.fullName.split(' ')[0] : copy.nav.myProfile}</span>
          </Link>

          <Button size="sm" onClick={() => navigate('/izracun')}>
            {copy.nav.getQuote}
          </Button>
        </div>

        {/* Mobile Actions (< 1024px) */}
        <div className="flex lg:hidden items-center gap-2">
          <Button size="sm" onClick={() => navigate('/izracun')}>
            {language === 'hr' ? 'Izračunaj' : 'Prices'}
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-ink hover:bg-canvas-warm transition-colors"
            aria-label={copy.nav.openMenu}
            aria-expanded={mobileOpen}
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Portaled Mobile Slide-Over Sheet — Real Dimmed Backdrop, Zero Double-Logo Bleed */}
      {mobileOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="fixed inset-0 z-50 lg:hidden bg-ink/50 backdrop-blur-[2px] flex justify-end"
              role="dialog"
              aria-modal="true"
              aria-label={copy.nav.mobileNavLabel}
              onClick={() => setMobileOpen(false)}
            >
              <div
                ref={mobileDrawerRef}
                tabIndex={-1}
                className="w-[86vw] max-w-sm h-full bg-canvas border-l border-hairline shadow-elevated flex flex-col animate-step focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-16 px-5 border-b border-hairline flex items-center justify-between shrink-0 bg-canvas">
                  <BrandWordmark />
                  <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <button
                      type="button"
                      onClick={() => setMobileOpen(false)}
                      className="p-2 rounded-lg text-ink hover:bg-canvas-warm"
                      aria-label={copy.nav.closeMenu}
                    >
                      <X className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 bg-canvas">
                  <div className="space-y-1">
                    <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-2">
                      {copy.nav.insurances}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PRODUCT_CATALOG.map((p) => (
                        <Link
                          key={p.id}
                          to={`/izracun/${p.id}`}
                          className="px-3 py-2.5 rounded-lg bg-canvas-warm text-sm font-medium text-ink hover:text-accent transition-colors"
                        >
                          {language === 'hr' ? p.nameHr : p.nameEn}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-hairline pt-4">
                    <Link
                      to="/usporedi-policu"
                      aria-current={isActive('/usporedi-policu') ? 'page' : undefined}
                      className={`block px-2 py-2.5 text-base font-medium rounded-lg ${
                        isActive('/usporedi-policu') ? 'text-accent bg-accent-soft/60' : 'text-ink hover:text-accent'
                      }`}
                    >
                      {copy.nav.switchPolicy}
                    </Link>
                    <Link
                      to="/prijava-stete"
                      aria-current={isActive('/prijava-stete') ? 'page' : undefined}
                      className={`block px-2 py-2.5 text-base font-medium rounded-lg ${
                        isActive('/prijava-stete') ? 'text-accent bg-accent-soft/60' : 'text-ink hover:text-accent'
                      }`}
                    >
                      {copy.nav.claims}
                    </Link>
                    <Link
                      to="/ai-savjetnik"
                      aria-current={isActive('/ai-savjetnik') ? 'page' : undefined}
                      className={`block px-2 py-2.5 text-base font-medium rounded-lg ${
                        isActive('/ai-savjetnik') ? 'text-accent bg-accent-soft/60' : 'text-ink hover:text-accent'
                      }`}
                    >
                      {copy.nav.aiAdvisor}
                    </Link>
                    <Link
                      to="/o-nama"
                      aria-current={isActive('/o-nama') ? 'page' : undefined}
                      className={`block px-2 py-2.5 text-base font-medium rounded-lg ${
                        isActive('/o-nama') ? 'text-accent bg-accent-soft/60' : 'text-ink hover:text-accent'
                      }`}
                    >
                      {copy.nav.about}
                    </Link>
                    <Link
                      to="/moj-profil"
                      aria-current={isActive('/moj-profil') ? 'page' : undefined}
                      className={`block px-2 py-2.5 text-base font-medium rounded-lg ${
                        isActive('/moj-profil') ? 'text-accent bg-accent-soft/60' : 'text-ink hover:text-accent'
                      }`}
                    >
                      {user ? user.fullName : copy.nav.myProfile}
                    </Link>
                    {isAgent ? (
                      <Link
                        to="/admin"
                        aria-current={isActive('/admin') ? 'page' : undefined}
                        className="flex items-center gap-2 px-2 py-2.5 text-sm font-semibold text-ink hover:text-accent"
                      >
                        <ShieldCheck className="w-4 h-4 text-accent" strokeWidth={1.75} />
                        <span>{copy.nav.adminOps}</span>
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="p-5 border-t border-hairline shrink-0 bg-canvas">
                  <Button fullWidth size="lg" onClick={() => navigate('/izracun')}>
                    {copy.nav.getQuote}
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </header>
  );
};
