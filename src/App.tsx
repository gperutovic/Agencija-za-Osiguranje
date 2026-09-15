import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout & Global Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StickyMobileFAB } from './components/ui/StickyMobileFAB';
import { CookieConsent } from './components/layout/CookieConsent';
import { QuoteModal } from './components/quotes/QuoteModal';
import { InsuranceCategory } from './lib/types';

// Overhauled Insurtech Platform Pages
import HomePage from './app/page';
import VehicleTransferPage from './app/kalkulator-prijepisa/page';
import ClaimsReportingPage from './app/prijava-stete/page';
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
  const [modalCategory, setModalCategory] = useState<InsuranceCategory>('auto');

  const handleOpenQuote = (category?: InsuranceCategory) => {
    if (category) {
      setModalCategory(category);
    }
    setIsQuoteModalOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white">
        {/* Global Navigation Header with HANFA license & direct quoting triggers */}
        <Header onOpenQuote={handleOpenQuote} />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 bg-slate-50 text-slate-900">
          <Routes>
            {/* 1. Početna stranica - Vodeći InsurTech portal za usporedbu i ugovaranje */}
            <Route path="/" element={<HomePage />} />

            {/* 2. Službeni kalkulator upravne pristojbe na prijenos vozila (NN 92/21) */}
            <Route path="/kalkulator-prijepisa" element={<VehicleTransferPage />} />
            <Route path="/prijepis" element={<VehicleTransferPage />} />

            {/* 3. 24/7 Digitalna prijava šteta (FNOL) i praćenje statusa likvidacije */}
            <Route path="/prijava-stete" element={<ClaimsReportingPage />} />
            <Route path="/claims" element={<ClaimsReportingPage />} />
            <Route path="/claims/file" element={<ClaimsReportingPage />} />

            {/* 4. Pravne stranice, HANFA akreditacija, IDD obavijest i izvansudsko rješavanje sporova */}
            <Route path="/o-nama-pravno" element={<LegalImpressumPage />} />
            <Route path="/legal" element={<LegalImpressumPage />} />
            <Route path="/privacy" element={<LegalImpressumPage />} />
            <Route path="/about" element={<LegalImpressumPage />} />

            {/* 5. Korisnički portal za osiguranike - digitalni novčanik i police */}
            <Route path="/portal" element={<PortalDashboardPage />} />
            <Route path="/portal/coi" element={<PortalDashboardPage />} />

            {/* 6. Agencijski CRM i administrativni nadzor */}
            <Route path="/admin" element={<AdminDashboardPage />} />

            {/* 7. Proizvodi i katalozi pokrića */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />

            {/* 8. Kontakt i savjetovanje */}
            <Route path="/contact" element={<ContactPage />} />

            {/* 9. Autentifikacija klijenta / agenta */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Preusmjeravanje za nepostojeće rute */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Globalni footer sa svim zakonskim ogradama i certifikatima */}
        <Footer />

        {/* Plutajući mobilni pozivni centar (24/7 asistencija i povratni poziv u 15 min) */}
        <StickyMobileFAB />

        {/* AZOP / GDPR privola za kolačiće */}
        <CookieConsent />

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
