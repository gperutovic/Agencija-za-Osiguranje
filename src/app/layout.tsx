import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CookieConsent } from '../components/layout/CookieConsent';
import { StickyMobileFAB } from '../components/ui/StickyMobileFAB';
import { QuoteModal } from '../components/quotes/QuoteModal';
import { InsuranceCategory } from '../lib/types';

export const metadata = {
  title: 'Agencija za osiguranje d.o.o. | Usporedba i ugovaranje polica u Hrvatskoj',
  description:
    'Službeni registrirani distributer osiguranja pri HANFA (ZO-88912). Usporedite ponude 10 vodećih osiguravajućih kuća za auto, imovinu, zdravlje i putovanja.',
  keywords: [
    'osiguranje',
    'auto osiguranje',
    'kasko kalkulator',
    'prijepis vozila kalkulator',
    'osiguranje imovine',
    'dopunsko zdravstveno',
    'prijava štete',
    'kompare',
    'laqo',
    'croatia osiguranje',
    'allianz',
  ],
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: 'Agencija za osiguranje d.o.o.',
  alternateName: 'Insurtech Hrvatska',
  url: 'https://agencija-za-osiguranje.web.app',
  logo: 'https://agencija-za-osiguranje.web.app/logo.png',
  description:
    'Vodeći hrvatski digitalni portal za usporedbu i ugovaranje polica osiguranja. Licencirano od strane HANFA (Registar ZO-88912).',
  telephone: '+38515550666',
  email: 'podrska@agencija-za-osiguranje.hr',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Radnička cesta 80',
    addressLocality: 'Zagreb',
    postalCode: '10000',
    addressCountry: 'HR',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  priceRange: '€€',
  areaServed: {
    '@type': 'Country',
    name: 'Croatia',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Police osiguranja',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Obvezno auto osiguranje (AO) i Kasko',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Osiguranje imovine i doma',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Dopunsko i dodatno zdravstveno osiguranje',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Putno zdravstveno osiguranje',
        },
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<InsuranceCategory>('auto');

  const handleOpenQuote = (cat?: InsuranceCategory) => {
    if (cat) setSelectedCategory(cat);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white antialiased font-sans">
      {/* Structured Schema.org Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Main Global Header */}
      <Header onOpenQuote={handleOpenQuote} />

      {/* Page Content Body */}
      <main className="flex-1 w-full">{children}</main>

      {/* Global Footer with HANFA & IDD disclosures */}
      <Footer />

      {/* Mobile Sticky Quick Action Bar */}
      <StickyMobileFAB />

      {/* AZOP / GDPR Consent Banner */}
      <CookieConsent />

      {/* Universal Instant Quote Wizard Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCategory={selectedCategory}
      />
    </div>
  );
}
