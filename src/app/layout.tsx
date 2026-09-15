import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CookieConsent } from '../components/layout/CookieConsent';
import { StickyMobileFAB } from '../components/ui/StickyMobileFAB';
import { QuoteModal } from '../components/quotes/QuoteModal';
import { InsuranceCategory } from '../lib/types';

export const metadata = {
  title: 'Agencija Život | Generali Partner & Toyota Osiguranja Zagreb (HANFA ZO-88912)',
  description:
    'Vodeća digitalna agencija za osiguranje u Zagrebu. Ekskluzivni Generali partner i Toyota VIP Kasko program. Izračunajte premiju, preuzmite zelenu kartu i prijavite štetu u 60 sekundi.',
  keywords: [
    'agencija život',
    'generali osiguranje zagreb',
    'toyota kasko osiguranje',
    'toyota centar zagreb osiguranje',
    'auto osiguranje izračun',
    'kalkulator prijepisa vozila',
    'osiguranje od potresa zagreb',
    'dopunsko zdravstveno',
    'prijava štete fnol',
    'hanfa zo-88912',
  ],
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: 'Agencija Život - ŽIVOT d.o.o.',
  alternateName: 'Agencija Život za poslove zastupanja u osiguranju',
  url: 'https://agencija-za-osiguranje.web.app',
  logo: 'https://agencija-za-osiguranje.web.app/logo.svg',
  description:
    'Ovlašteni i licencirani partner Generali osiguranja d.d. i Toyota Centra Zagreb pod nadzorom HANFA-e (Registar ZO-88912). Vrhunska rješenja za auto, kasko, dom i životno osiguranje.',
  telephone: '+38514800120',
  email: 'osiguranje@agencija-zivot.hr',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Junija Palmotića 76',
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
    name: 'Programi osiguranja',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Toyota VIP Kasko & Obvezno Auto Osiguranje',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'ŽIVOT Dom & Zaštita od potresa',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'ŽIVOT+ Mješovito životno osiguranje',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Dopunsko i dodatno zdravstveno osiguranje',
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
    <div className="min-h-screen flex flex-col bg-[#06080c] text-slate-100 selection:bg-[#fb6504] selection:text-white antialiased font-sans">
      {/* Structured Schema.org Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Main Global Header */}
      <Header onOpenQuote={handleOpenQuote} />

      {/* Page Content Body */}
      <main className="flex-1 w-full bg-[#06080c]">{children}</main>

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
