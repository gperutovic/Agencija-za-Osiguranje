import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout & Global Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StickyMobileFAB } from './components/layout/StickyMobileFAB';
import { CookieConsent } from './components/layout/CookieConsent';
import { QuoteModal } from './components/quotes/QuoteModal';
import { ConversationalWizard } from './components/conversational/ConversationalWizard';
import { InsuranceCategory } from './lib/types';

// 9 Core Platform Destinations (AGENCIJA ŽIVOT — Generali & Toyota Partner)
import HomePage from './pages/HomePage';
import ToyotaPartnershipPage from './pages/ToyotaPartnershipPage';
import RequestQuotePage from './pages/RequestQuotePage';
import ClaimsReportingPage from './pages/ClaimsReportingPage';
import AiCenterPage from './pages/AiCenterPage';
import LoyaltyProgramPage from './pages/LoyaltyProgramPage';
import FastSupportPage from './pages/FastSupportPage';
import { PortalDashboardPage } from './pages/PortalDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Preserved Specialized Calculators & Statutory Pages
import AutoOsiguranjePage from './pages/AutoInsurancePage';
import DopunskoZdravstvenoPage from './pages/DopunskoHealthPage';
import ImovinaPage from './pages/PropertyInsurancePage';
import ONamaPage from './pages/AboutUsPage';
import PrigovoriPage from './pages/ComplaintsPage';
import VehicleTransferPage from './pages/VehicleTransferPage';
import LegalImpressumPage from './pages/LegalImpressumPage';
import PolicyExpiryReminderPage from './pages/PolicyExpiryReminderPage';
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
      <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#C21817] selection:text-white">
        {/* Global Collision-Free Navigation Header */}
        <Header
          onOpenQuote={handleOpenQuote}
          onOpenSavjetnik={handleOpenSavjetnik}
        />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 w-full bg-[#F8FAFC] text-slate-900">
          <Routes>
            {/* 1. AGENCIJA ŽIVOT (Home, Interactive Multi-Tier Calculator & Coverage Overview) */}
            <Route path="/" element={<HomePage />} />

            {/* 2. Toyota partnerstvo (Toyota Centar Zagreb Mobility Hub) */}
            <Route path="/toyota-partnerstvo" element={<ToyotaPartnershipPage />} />

            {/* 3. Zatraži ponudu (Multi-Product Tailored Quoting Wizard + HANFA IDD) */}
            <Route path="/zatrazi-ponudu" element={<RequestQuotePage />} />

            {/* 4. Prijava šteta (Guided FNOL Claims Center) */}
            <Route path="/prijava-stete" element={<ClaimsReportingPage />} />
            <Route path="/claims" element={<ClaimsReportingPage />} />
            <Route path="/claims/file" element={<ClaimsReportingPage />} />

            {/* 5. AI Centar (AI Agenti, Coverage Shield Štit pokrića & Smart Tools) */}
            <Route path="/ai-centar" element={<AiCenterPage />} />

            {/* 6. Program vjernosti (Silver / Gold / Platinum Tiers & Bundle Discounts) */}
            <Route path="/program-vjernosti" element={<LoyaltyProgramPage />} />

            {/* 7. Brza podrška (24/7 Emergency Assistance, SLA & Direct Contact) */}
            <Route path="/brza-podrska" element={<FastSupportPage />} />

            {/* 8. Korisnički portal (Client Self-Service Workspace) */}
            <Route path="/korisnicki-portal" element={<PortalDashboardPage />} />
            <Route path="/portal" element={<PortalDashboardPage />} />
            <Route path="/portal/coi" element={<PortalDashboardPage />} />

            {/* 9. Zastupnički portal (Agent Command & CRM Workspace) */}
            <Route path="/zastupnicki-portal" element={<AdminDashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />

            {/* Preserved Specialized Calculators & Statutory Routes */}
            <Route path="/dopunsko-zdravstveno" element={<DopunskoZdravstvenoPage />} />
            <Route path="/dopunsko" element={<DopunskoZdravstvenoPage />} />
            <Route path="/auto-osiguranje" element={<AutoOsiguranjePage />} />
            <Route path="/auto" element={<AutoOsiguranjePage />} />
            <Route path="/imovina" element={<ImovinaPage />} />
            <Route path="/dom" element={<ImovinaPage />} />
            <Route path="/kalkulator-prijepisa" element={<VehicleTransferPage />} />
            <Route path="/prijepis" element={<VehicleTransferPage />} />
            <Route path="/o-nama" element={<ONamaPage />} />
            <Route path="/about" element={<ONamaPage />} />
            <Route path="/prigovori" element={<PrigovoriPage />} />
            <Route path="/zalbe" element={<PrigovoriPage />} />
            <Route path="/podsjetnik-isteka" element={<PolicyExpiryReminderPage />} />
            <Route path="/podsjetnik" element={<PolicyExpiryReminderPage />} />
            <Route path="/o-nama-pravno" element={<LegalImpressumPage />} />
            <Route path="/legal" element={<LegalImpressumPage />} />
            <Route path="/privacy" element={<LegalImpressumPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Statutory HANFA Footer (Članak 417. Zakona o osiguranju) */}
        <Footer />

        {/* Mobile Floating Action Bar */}
        <StickyMobileFAB onOpenQuote={handleOpenQuote} />

        {/* AZOP / GDPR Cookie Consent */}
        <CookieConsent />

        {/* Conversational "Agent Savjetnik" Intake Wizard */}
        <ConversationalWizard
          isOpen={isSavjetnikOpen}
          onClose={() => setIsSavjetnikOpen(false)}
          initialTopic={modalCategory === 'property' ? 'imovina' : modalCategory === 'health' ? 'dopunsko' : 'auto'}
        />

        {/* Central Quote Modal */}
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
