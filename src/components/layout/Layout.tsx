import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from './CookieBanner';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-canvas text-ink">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
    <CookieBanner />
  </div>
);
