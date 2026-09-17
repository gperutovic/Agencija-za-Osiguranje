import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CookieConsent } from '../components/layout/CookieConsent';
import { StickyMobileFAB } from '../components/ui/StickyMobileFAB';
import { ConversationalWizard } from '../components/conversational/ConversationalWizard';
import { QuoteModal } from '../components/quotes/QuoteModal';
import { InsuranceCategory } from '../lib/types';
import { AGENCY_DETAILS } from '../lib/content/insurance-data';

export const metadata = {
  title: 'Agencija Život | Ovlašteni partner za osiguranje u Hrvatskoj (HANFA ZO-88912)',
  description:
    'Vodeći hrvatski digitalni portal za usporedbu i ugovaranje osiguranja. Uštedite na dopunskom zdravstvenom nakon poskupljenja HZZO-a, osigurajte vozilo uz 50% bonusa i zaštitite dom u 60 sekundi.',
  keywords: [
    'dopunsko zdravstveno osiguranje 2026',
    'hzzo poskupljenje dopunskog 15 eura',
    'auto osiguranje kalkulator zagreb',
    'kasko osiguranje usporedba',
    'toyota kasko zagreb',
    'osiguranje imovine i potres',
    'hanfa zo-88912',
    'agencija život',
    'generali osiguranje partner',
  ],
};

const rootInsuranceAgencySchema = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  '@id': 'https://agencija-za-osiguranje.web.app/#agency',
  name: AGENCY_DETAILS.brandName,
  legalName: AGENCY_DETAILS.legalName,
  url: AGENCY_DETAILS.websiteUrl,
  logo: 'https://agencija-za-osiguranje.web.app/logo.svg',
  image: 'https://agencija-za-osiguranje.web.app/og-image.jpg',
  description:
    'Ovlašteni distributer osiguranja upisan u registar HANFA-e pod brojem ZO-88912. Specijalizirani za aktuarsku usporedbu polica Generali, Croatia i Allianz osiguranja uz 0 € naknade za klijenta.',
  telephone: '+38514800120',
  email: AGENCY_DETAILS.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: AGENCY_DETAILS.address,
    addressLocality: AGENCY_DETAILS.city,
    postalCode: AGENCY_DETAILS.postalCode,
    addressCountry: 'HR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: AGENCY_DETAILS.geoCoordinates.latitude,
    longitude: AGENCY_DETAILS.geoCoordinates.longitude,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  priceRange: '€',
  areaServed: {
    '@type': 'Country',
    name: 'Croatia',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Katalog osigurateljnih usluga',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'FinancialProduct',
          name: 'Dopunsko zdravstveno osiguranje 2026',
          description: 'Privatna alternativa HZZO polici od 6,50 € mjesečno s pokrićem B-liste lijekova.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'FinancialProduct',
          name: 'Obvezno i Kasko auto osiguranje',
          description: 'Usporedba ponuda vodećih osiguratelja uz trenutni prijenos 50% bonusa i Toyota VIP program.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'FinancialProduct',
          name: 'Osiguranje doma i potresa',
          description: 'Zaštita stana i obiteljske kuće na novu građevinsku vrijednost bez franšize.',
        },
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [isSavjetnikOpen, setIsSavjetnikOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<InsuranceCategory>('auto');

  const handleOpenQuote = (cat?: InsuranceCategory) => {
    if (cat) setSelectedCategory(cat);
    setIsQuoteModalOpen(true);
  };

  const handleOpenSavjetnik = (cat?: 'auto' | 'dopunsko' | 'imovina') => {
    if (cat === 'auto' || cat === 'dopunsko' || cat === 'imovina') {
      setSelectedCategory(cat as InsuranceCategory);
    }
    setIsSavjetnikOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#FF0055] selection:text-white antialiased font-sans">
      {/* Root Type-safe Schema.org Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rootInsuranceAgencySchema) }}
      />

      {/* Main Global Header */}
      <Header
        onOpenQuote={handleOpenQuote}
        onOpenSavjetnik={() => setIsSavjetnikOpen(true)}
      />

      {/* Dynamic Page Viewport */}
      <main className="flex-1 w-full">{children}</main>

      {/* Global Footer with Regulatory Compliance Badges */}
      <Footer />

      {/* Floating Action Button for Emergency Contact & Broker Call */}
      <StickyMobileFAB onOpenQuote={handleOpenQuote} />

      {/* GDPR / AZOP Cookie Notice */}
      <CookieConsent />

      {/* Conversational "Agent Savjetnik" Intake Wizard (Lemonade Maya engine) */}
      <ConversationalWizard
        isOpen={isSavjetnikOpen}
        onClose={() => setIsSavjetnikOpen(false)}
        initialTopic={selectedCategory === 'property' ? 'imovina' : selectedCategory === 'health' ? 'dopunsko' : 'auto'}
      />

      {/* Fast Quote Category Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCategory={selectedCategory}
      />
    </div>
  );
}
