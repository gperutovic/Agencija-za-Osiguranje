import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { Layout } from './components/layout/Layout';
import { ToastProvider } from './components/ui/Toast';
import { AboutPage } from './pages/AboutPage';
import { AdminOpsPage } from './pages/AdminOpsPage';
import { AiAdvisorPage } from './pages/AiAdvisorPage';
import { ClaimsFnolPage } from './pages/ClaimsFnolPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { HomePage } from './pages/HomePage';
import {
  ComplaintsPage,
  CookiesPage,
  LegalDisclosuresPage,
  PrivacyPage,
} from './pages/LegalPages';
import { QuoteEnginePage } from './pages/QuoteEnginePage';
import { SwitchAndSavePage } from './pages/SwitchAndSavePage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
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

              {/* Legacy / Convenience Redirects */}
              <Route path="/auto-osiguranje" element={<Navigate to="/izracun/auto" replace />} />
              <Route path="/imovina" element={<Navigate to="/izracun/imovina" replace />} />
              <Route path="/dopunsko-zdravstveno" element={<Navigate to="/izracun/zdravstveno" replace />} />
              <Route path="/portal" element={<Navigate to="/moj-profil" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
