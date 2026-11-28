import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { BRAND_CONFIG } from './config/brand';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageSkeleton } from './components/ui/Skeleton';
import { ToastProvider } from './components/ui/Toast';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy-load secondary routes for crisp initial FCP/LCP with editorial skeleton fallback
const QuoteEnginePage = lazy(() =>
  import('./pages/QuoteEnginePage').then((m) => ({ default: m.QuoteEnginePage }))
);
const SwitchAndSavePage = lazy(() =>
  import('./pages/SwitchAndSavePage').then((m) => ({ default: m.SwitchAndSavePage }))
);
const AiAdvisorPage = lazy(() =>
  import('./pages/AiAdvisorPage').then((m) => ({ default: m.AiAdvisorPage }))
);
const ClaimsFnolPage = lazy(() =>
  import('./pages/ClaimsFnolPage').then((m) => ({ default: m.ClaimsFnolPage }))
);
const ClientPortalPage = lazy(() =>
  import('./pages/ClientPortalPage').then((m) => ({ default: m.ClientPortalPage }))
);
const AdminOpsPage = lazy(() =>
  import('./pages/AdminOpsPage').then((m) => ({ default: m.AdminOpsPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const LegalDisclosuresPage = lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.LegalDisclosuresPage }))
);
const PrivacyPage = lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.PrivacyPage }))
);
const CookiesPage = lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.CookiesPage }))
);
const ComplaintsPage = lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.ComplaintsPage }))
);

const ROUTE_META: Array<{
  match: (pathname: string) => boolean;
  titleHr: string;
  titleEn: string;
  descHr: string;
  descEn: string;
}> = [
  {
    match: (p) => p === '/',
    titleHr: `${BRAND_CONFIG.brandName} — Digitalna agencija za osiguranje bez sitnih slova`,
    titleEn: `${BRAND_CONFIG.brandName} — Digital Croatian Insurance Agency`,
    descHr:
      'Usporedite ponude 7 vodećih hrvatskih osiguratelja u 90 sekundi bez dodatnih naknada. HANFA ovlašteno društvo za zastupanje u osiguranju.',
    descEn:
      'Compare 7 top Croatian insurance carriers in 90 seconds with €0 agency fee. HANFA-licensed digital insurance agency.',
  },
  {
    match: (p) => p.startsWith('/izracun'),
    titleHr: `90-sekundni izračun osiguranja | ${BRAND_CONFIG.brandName}`,
    titleEn: `90-Second Insurance Quote Engine | ${BRAND_CONFIG.brandName}`,
    descHr: 'Interaktivni kalkulator za Auto, Dom/Potres, Zdravstveno, Životno, Putno, Ljubimce i SME.',
    descEn: 'Interactive quote comparison for Car, Home/Earthquake, Health, Life, Travel, Pet, and SME.',
  },
  {
    match: (p) => p.startsWith('/usporedi-policu'),
    titleHr: `Usporedi i uštedi (Switch & Save) | ${BRAND_CONFIG.brandName}`,
    titleEn: `Switch & Save Policy Comparison | ${BRAND_CONFIG.brandName}`,
    descHr: 'Učitajte postojeću policu osiguranja i usporedite konkurentske ponude 7 hrvatskih osiguratelja.',
    descEn: 'Upload your current Croatian insurance policy to benchmark competing carriers and save.',
  },
  {
    match: (p) => p.startsWith('/ai-savjetnik'),
    titleHr: `AI Savjetnik za osiguranje | ${BRAND_CONFIG.brandName}`,
    titleEn: `AI Insurance Advisor | ${BRAND_CONFIG.brandName}`,
    descHr: 'Postavite pitanje o hrvatskim policama (AO, Kasko, potres, dopunsko) ili prebacite razgovor licenciranom zastupniku.',
    descEn: 'Plain-language answers on Croatian insurance policies with one-click licensed advisor handoff.',
  },
  {
    match: (p) => p.startsWith('/prijava-stete'),
    titleHr: `Digitalna prijava štete (FNOL) i praćenje | ${BRAND_CONFIG.brandName}`,
    titleEn: `Digital Claims (FNOL) & Status Tracker | ${BRAND_CONFIG.brandName}`,
    descHr: 'Prijavite štetu u 5 koraka ili pratite status obrade svoje prijave štete uživo.',
    descEn: 'Report an insurance claim in 5 guided steps or securely track claim status online.',
  },
  {
    match: (p) => p.startsWith('/moj-profil'),
    titleHr: `Moj Profil — Digitalni novčanik polica | ${BRAND_CONFIG.brandName}`,
    titleEn: `My Profile — Digital Policy Wallet | ${BRAND_CONFIG.brandName}`,
    descHr: 'Pristupite svojim policama, Zelenoj karti, IPID dokumentima, prijavljenim štetama i porukama.',
    descEn: 'Manage your active policies, Green Cards, IPID documents, claims, and advisor messages.',
  },
  {
    match: (p) => p.startsWith('/admin'),
    titleHr: `Agencijska operativa | ${BRAND_CONFIG.brandName}`,
    titleEn: `Agency Operations Portal | ${BRAND_CONFIG.brandName}`,
    descHr: 'Zaštićena upravljačka ploča za ovlaštene zastupnike u osiguranju.',
    descEn: 'Protected back-office workspace for licensed insurance advisors.',
  },
  {
    match: (p) => p.startsWith('/o-nama'),
    titleHr: `O nama i HANFA licencirani zastupnici | ${BRAND_CONFIG.brandName}`,
    titleEn: `About Us & Licensed Advisors | ${BRAND_CONFIG.brandName}`,
    descHr: `${BRAND_CONFIG.legalName} — transparentno zastupanje u osiguranju bez naknade za klijente.`,
    descEn: `${BRAND_CONFIG.legalName} — transparent Croatian insurance representation at €0 client fee.`,
  },
  {
    match: (p) => p.startsWith('/prigovori'),
    titleHr: `Prigovori potrošača (čl. 401.) | ${BRAND_CONFIG.brandName}`,
    titleEn: `Consumer Complaints (Art. 401) | ${BRAND_CONFIG.brandName}`,
    descHr: 'Službeno podnošenje prigovora potrošača sukladno članku 401. Zakona o osiguranju.',
    descEn: 'Submit a formal statutory consumer complaint under Article 401 of the Croatian Insurance Act.',
  },
];

const RouteSideEffects: React.FC = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const matched = ROUTE_META.find((r) => r.match(pathname));
    const title = matched
      ? language === 'en'
        ? matched.titleEn
        : matched.titleHr
      : `${BRAND_CONFIG.brandName} — ${language === 'en' ? 'Digital Insurance Agency' : 'Digitalna agencija za osiguranje'}`;
    const desc = matched
      ? language === 'en'
        ? matched.descEn
        : matched.descHr
      : language === 'en'
        ? BRAND_CONFIG.taglineEn
        : BRAND_CONFIG.taglineHr;

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [pathname, language]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <RouteSideEffects />
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  {/* Distraction-Free 90-Second Flipped-Funnel Quote Engine */}
                  <Route path="/izracun" element={<QuoteEnginePage />} />
                  <Route path="/izracun/:product" element={<QuoteEnginePage />} />

                  {/* Full Platform Shell */}
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <HomePage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/usporedi-policu"
                    element={
                      <Layout>
                        <SwitchAndSavePage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/ai-savjetnik"
                    element={
                      <Layout>
                        <AiAdvisorPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/prijava-stete"
                    element={
                      <Layout>
                        <ClaimsFnolPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/moj-profil"
                    element={
                      <Layout>
                        <ClientPortalPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <Layout>
                        <AdminOpsPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/o-nama"
                    element={
                      <Layout>
                        <AboutPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/pravne-informacije"
                    element={
                      <Layout>
                        <LegalDisclosuresPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/privatnost"
                    element={
                      <Layout>
                        <PrivacyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/kolacici"
                    element={
                      <Layout>
                        <CookiesPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/prigovori"
                    element={
                      <Layout>
                        <ComplaintsPage />
                      </Layout>
                    }
                  />

                  {/* Convenience Redirects */}
                  <Route path="/auto-osiguranje" element={<Navigate to="/izracun/auto" replace />} />
                  <Route path="/imovina" element={<Navigate to="/izracun/imovina" replace />} />
                  <Route path="/dopunsko-zdravstveno" element={<Navigate to="/izracun/zdravstveno" replace />} />
                  <Route path="/portal" element={<Navigate to="/moj-profil" replace />} />

                  {/* Dedicated Editorial 404 Page */}
                  <Route
                    path="*"
                    element={
                      <Layout>
                        <NotFoundPage />
                      </Layout>
                    }
                  />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
