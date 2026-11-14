import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout & Global Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StickyMobileFAB } from './components/ui/StickyMobileFAB';
import { CookieConsent } from './components/layout/CookieConsent';
import { QuoteModal } from './components/quotes/QuoteModal';
import { ConversationalWizard } from './components/conversational/ConversationalWizard';
import { InsuranceCategory } from './lib/types';

// Core Insurtech Funnels & Pages
import HomePage from './app/page';
import AutoOsiguranjePage from './app/auto-osiguranje/page';
import DopunskoZdravstvenoPage from './app/dopunsko-zdravstveno/page';
import ImovinaPage from './app/imovina/page';
import ClaimsReportingPage from './app/prijava-stete/page';
import ONamaPage from './app/o-nama/page';
import PrigovoriPage from './app/prigovori/page';
import VehicleTransferPage from './app/kalkulator-prijepisa/page';
import LegalImpressumPage from './app/o-nama-pravno/page';

// Portal, Admin, & Auxiliary Pages
import { PortalDashboardPage } from './pages/PortalDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Auto-scroll to top on every route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const App: React.FC = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [isSavjetnikOpen, setIsSavjetnikOpen] = useState<boolean>(false);
  const [modalCategory, setModalCategory] = useState<InsuranceCategory>('auto');

  const handleOpenQuote = (category?: InsuranceCategory) => {
    if (category) {
      setModalCategory(category);
    }
    setIsQuoteModalOpen(true);
  };

  const handleOpenSavjetnik = () => {
    setIsSavjetnikOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-[#FF0055] selection:text-white">
        {/* Global Navigation Header with HANFA license & direct quoting triggers */}
        <Header
          onOpenQuote={handleOpenQuote}
          onOpenSavjetnik={handleOpenSavjetnik}
        />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 w-full bg-slate-50 text-slate-900">
          <Routes>
            {/* 1. Početna stranica - Vodeći InsurTech portal za usporedbu i ugovaranje */}
            <Route path="/" element={<HomePage />} />

            {/* 2. Dopunsko zdravstveno osiguranje (2026 HZZO 15 € vs Privatno) */}
            <Route path="/dopunsko-zdravstveno" element={<DopunskoZdravstvenoPage />} />
            <Route path="/dopunsko" element={<DopunskoZdravstvenoPage />} />

            {/* 3. Obvezno Auto Osiguranje (AO) & Toyota VIP Kasko */}
            <Route path="/auto-osiguranje" element={<AutoOsiguranjePage />} />
            <Route path="/auto" element={<AutoOsiguranjePage />} />

            {/* 4. Osiguranje imovine, stana, kuće i potresa */}
            <Route path="/imovina" element={<ImovinaPage />} />
            <Route path="/dom" element={<ImovinaPage />} />

            {/* 5. Službeni kalkulator upravne pristojbe na prijenos vozila (NN 92/21) */}
            <Route path="/kalkulator-prijepisa" element={<VehicleTransferPage />} />
            <Route path="/prijepis" element={<VehicleTransferPage />} />

            {/* 6. 24/7 Digitalna prijava šteta (FNOL) i praćenje statusa likvidacije */}
            <Route path="/prijava-stete" element={<ClaimsReportingPage />} />
            <Route path="/claims" element={<ClaimsReportingPage />} />
            <Route path="/claims/file" element={<ClaimsReportingPage />} />

            {/* 7. O nama, HANFA licenca ZO-88912 i tim */}
            <Route path="/o-nama" element={<ONamaPage />} />
            <Route path="/about" element={<ONamaPage />} />

            {/* 8. Zakonski postupak rješavanja prigovora potrošača (čl. 401.) */}
            <Route path="/prigovori" element={<PrigovoriPage />} />
            <Route path="/zalbe" element={<PrigovoriPage />} />

            {/* 9. Pravne stranice, IDD obavijest i izvansudsko rješavanje sporova */}
            <Route path="/o-nama-pravno" element={<LegalImpressumPage />} />
            <Route path="/legal" element={<LegalImpressumPage />} />
            <Route path="/privacy" element={<LegalImpressumPage />} />

            {/* 10. Korisnički portal za osiguranike - digitalni novčanik i police */}
            <Route path="/portal" element={<PortalDashboardPage />} />
            <Route path="/portal/coi" element={<PortalDashboardPage />} />

            {/* 11. Agencijski CRM i administrativni nadzor */}
            <Route path="/admin" element={<AdminDashboardPage />} />

            {/* 12. Katalozi usluga i kontakt */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Preusmjeravanje za nepostojeće rute */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Globalni footer sa svim zakonskim ogradama i certifikatima */}
        <Footer />

        {/* Plutajući mobilni pozivni centar (24/7 asistencija i povratni poziv u 15 min) */}
        <StickyMobileFAB onOpenQuote={handleOpenQuote} />

        {/* AZOP / GDPR privola za kolačiće */}
        <CookieConsent />

        {/* Conversational "Agent Savjetnik" Intake Wizard (Lemonade Maya engine) */}
        <ConversationalWizard
          isOpen={isSavjetnikOpen}
          onClose={() => setIsSavjetnikOpen(false)}
          initialTopic={modalCategory === 'property' ? 'imovina' : modalCategory === 'health' ? 'dopunsko' : 'auto'}
        />

        {/* Centralni modal za trenutni izračun i usporedbu ponuda 10 osiguratelja */}
        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          initialCategory={modalCategory}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
