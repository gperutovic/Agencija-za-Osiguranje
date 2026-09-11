import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ValiantHomePage } from './pages/valiant/ValiantHomePage';
import { QuoteBindPage } from './pages/valiant/QuoteBindPage';
import { CoiEnginePage } from './pages/valiant/CoiEnginePage';
import { FnolClaimsPage } from './pages/valiant/FnolClaimsPage';
import { EnterprisePortalPage } from './pages/valiant/EnterprisePortalPage';
import { AppetitePage } from './pages/valiant/AppetitePage';
import { ValiantLoginPage } from './pages/valiant/LoginPage';

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
      <Routes>
        {/* Agencija Život Homepage with Lemonade, Zebra, Policygenius, and GEICO Modules */}
        <Route path="/" element={<ValiantHomePage />} />

        {/* Intelligent Multi-Step Quote & Bind Funnel */}
        <Route path="/quote" element={<QuoteBindPage />} />

        {/* Instant Certificate of Insurance & Zelena Karta Generator */}
        <Route path="/portal/coi" element={<CoiEnginePage />} />

        {/* Autonomous FNOL Claims Triage with 911 Life-Safety Intercept */}
        <Route path="/claims/file" element={<FnolClaimsPage />} />
        <Route path="/claims" element={<FnolClaimsPage />} />

        {/* Client & Broker Policy Management Portal */}
        <Route path="/portal" element={<EnterprisePortalPage />} />

        {/* Supporting Views */}
        <Route path="/appetite" element={<AppetitePage />} />
        <Route path="/login" element={<ValiantLoginPage />} />

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
