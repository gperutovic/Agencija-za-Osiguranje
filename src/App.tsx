import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StickyMobileFAB } from './components/ui/StickyMobileFAB';
import { CookieConsent } from './components/layout/CookieConsent';

// Primary Insurtech Platform Pages
import { HomePage } from './pages/HomePage';
import { QuoteCalculatorPage } from './pages/QuoteCalculatorPage';
import { PortalDashboardPage } from './pages/PortalDashboardPage';
import { ClaimsReportPage } from './pages/ClaimsReportPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { LegalNoticePage } from './pages/LegalNoticePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#06080c] text-slate-100 selection:bg-[#fb6504] selection:text-white">
        {/* Global Navigation Header */}
        <Navbar />

        {/* Dynamic Route Viewport */}
        <main className="flex-1">
          <Routes>
            {/* Početna stranica - Vodeći InsurTech portal Agencije Život */}
            <Route path="/" element={<HomePage />} />

            {/* Višestupanjski kalkulator i usporedba osiguranja (Auto, Imovina, Zdravlje, IDD Analiza) */}
            <Route path="/quote" element={<QuoteCalculatorPage />} />
            <Route path="/calculator" element={<QuoteCalculatorPage />} />

            {/* Korisnički portal za osiguranike - Trezor polica, Zelena karta, Zahtjevi za aneksom */}
            <Route path="/portal" element={<PortalDashboardPage />} />
            <Route path="/portal/coi" element={<PortalDashboardPage />} />

            {/* 24/7 Digitalna prijava šteta (FNOL) i praćenje odštetnih spisa */}
            <Route path="/claims" element={<ClaimsReportPage />} />
            <Route path="/claims/file" element={<ClaimsReportPage />} />

            {/* Broker & CRM Administracija - Kanban lijevak, praćenje obnova i likvidacija */}
            <Route path="/admin" element={<AdminDashboardPage />} />

            {/* Proizvodi i katalozi pokrića */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />

            {/* O nama, kontakt i savjetovanje */}
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Pravne stranice i regulatorna usklađenost s HANFA i GDPR */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/legal" element={<LegalNoticePage />} />

            {/* Autentifikacija klijenta / agenta */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Preusmjeravanje za nepostojeće rute */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Globalni footer */}
        <Footer />

        {/* Plutajuća kontaktna traka za mobilne uređaje (WhatsApp, poziv, hitni povratni poziv u 15 min) */}
        <StickyMobileFAB />

        {/* GDPR privola za kolačiće */}
        <CookieConsent />
      </div>
    </BrowserRouter>
  );
};

export default App;
