import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from './CookieBanner';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { copy } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-ink focus:text-white focus:text-sm focus:font-semibold focus:shadow-elevated"
      >
        {copy.nav.skipToContent}
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
};
