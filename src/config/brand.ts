import type { ProductLine } from '../types/domain';

export interface PartnerInsurer {
  id: string;
  name: string;
  shortName: string;
  countryOfOrigin: string;
  rating: string;
  baseFactor: number;
  strengthsHr: string[];
  strengthsEn: string[];
  ipidPrefix: string;
}

export interface LicensedAdvisor {
  id: string;
  name: string;
  titleHr: string;
  titleEn: string;
  hanfaLicense: string;
}

export interface BrandConfig {
  brandName: string;
  storagePrefix: string;
  domain: string;
  siteUrl: string;
  taglineHr: string;
  taglineEn: string;
  legalName: string;
  legalStatusHr: string;
  legalStatusEn: string;
  oib: string;
  mbs: string;
  courtRegistry: string;
  shareCapital: string;
  hanfaRegistrationNumber: string;
  hanfaRegistryUrl: string;
  huoMediationUrl: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  phoneHref: string;
  claimsPhone: string;
  email: string;
  complaintsEmail: string;
  paymentIban: string;
  workingHoursHr: string;
  workingHoursEn: string;
  defaultAdvisorDeskHr: string;
  defaultAdvisorDeskEn: string;
  accentHex: string;
  verifiedRating: number;
  verifiedReviewCount: number;
  commissionRatesByLine: Record<ProductLine, number>;
  licensedAdvisors: LicensedAdvisor[];
  partnerInsurers: PartnerInsurer[];
}

export const BRAND_CONFIG: BrandConfig = {
  brandName: 'Vedro',
  storagePrefix: 'vedro',
  domain: 'vedro-osiguranje.hr',
  siteUrl: 'https://agencija-za-osiguranje.web.app',
  taglineHr: 'Osiguranje bez sitnih slova. Ugovoreno za 90 sekundi.',
  taglineEn: 'Insurance without the fine print. Bound in 90 seconds.',
  legalName: 'Vedro d.o.o. za zastupanje u osiguranju',
  legalStatusHr: 'Društvo za zastupanje u osiguranju pod nadzorom HANFA-e',
  legalStatusEn: 'Authorized Insurance Agency supervised by HANFA',
  oib: '48291047313',
  mbs: '081429031',
  courtRegistry: 'Trgovački sud u Zagrebu',
  shareCapital: '2.500,00 EUR (uplaćen u cijelosti)',
  hanfaRegistrationNumber: 'HR-HANFA-ZO-2026-0412',
  hanfaRegistryUrl: 'https://www.hanfa.hr/registri/registar-distributera-osiguranja-i-reosiguranja/',
  huoMediationUrl: 'https://huo.hr/hr/centar-za-mirenje',
  address: 'Ul. kralja Zvonimira 18',
  postalCode: '10000',
  city: 'Zagreb',
  country: 'Republika Hrvatska',
  phone: '+385 1 4800 910',
  phoneHref: 'tel:+38514800910',
  claimsPhone: '+385 1 4800 911',
  email: 'podrska@vedro-osiguranje.hr',
  complaintsEmail: 'prigovori@vedro-osiguranje.hr',
  paymentIban: 'HR1210010051863000160',
  workingHoursHr: 'Pon – Pet: 08:00 – 19:00 | Sub: 09:00 – 13:00 | Digitalna prijava štete 24/7',
  workingHoursEn: 'Mon – Fri: 08:00 – 19:00 | Sat: 09:00 – 13:00 | Digital Claims 24/7',
  defaultAdvisorDeskHr: 'Vedro tim ovlaštenih zastupnika',
  defaultAdvisorDeskEn: 'Vedro Licensed Advisory Desk',
  accentHex: '#FF006E',
  verifiedRating: 4.9,
  verifiedReviewCount: 1840,
  commissionRatesByLine: {
    auto: 0.12,
    imovina: 0.18,
    zdravstveno: 0.15,
    zivotno: 0.2,
    putno: 0.22,
    ljubimci: 0.16,
    poslovno: 0.15,
  },
  licensedAdvisors: [
    {
      id: 'agent-marko',
      name: 'Marko Kovač',
      titleHr: 'Viši ovlašteni zastupnik u osiguranju',
      titleEn: 'Senior Licensed Insurance Advisor',
      hanfaLicense: 'ZO-2024-11820',
    },
    {
      id: 'agent-petra',
      name: 'Petra Novak',
      titleHr: 'Specijalistica za štete i imovinska osiguranja',
      titleEn: 'Claims & Property Insurance Specialist',
      hanfaLicense: 'ZO-2023-09451',
    },
    {
      id: 'agent-luka',
      name: 'Luka Babić',
      titleHr: 'Zastupnik za gospodarska i flotna osiguranja',
      titleEn: 'Commercial & Fleet Insurance Advisor',
      hanfaLicense: 'ZO-2025-14002',
    },
  ],
  partnerInsurers: [
    {
      id: 'allianz',
      name: 'Allianz Hrvatska d.d.',
      shortName: 'Allianz',
      countryOfOrigin: 'Njemačka / HR',
      rating: 'AA (S&P)',
      baseFactor: 1.04,
      strengthsHr: ['Brza obrada kasko šteta', 'Široka mreža ovlaštenih servisa'],
      strengthsEn: ['Fast comprehensive claims handling', 'Wide authorized repair network'],
      ipidPrefix: 'IPID-ALZ',
    },
    {
      id: 'croatia',
      name: 'Croatia osiguranje d.d.',
      shortName: 'Croatia osiguranje',
      countryOfOrigin: 'Hrvatska',
      rating: 'A- (AM Best)',
      baseFactor: 1.06,
      strengthsHr: ['Najveća mreža procjenitelja u RH', 'Potres bez podosiguranja'],
      strengthsEn: ['Largest claims network in Croatia', 'Earthquake without underinsurance'],
      ipidPrefix: 'IPID-CRO',
    },
    {
      id: 'generali',
      name: 'Generali osiguranje d.d.',
      shortName: 'Generali',
      countryOfOrigin: 'Italija / HR',
      rating: 'A+ (Fitch)',
      baseFactor: 0.98,
      strengthsHr: ['Odličan omjer cijene i pokrića', '24/7 asistencija u EU i RH'],
      strengthsEn: ['Strong price-to-coverage ratio', '24/7 EU and domestic assistance'],
      ipidPrefix: 'IPID-GEN',
    },
    {
      id: 'wiener',
      name: 'Wiener osiguranje VIG d.d.',
      shortName: 'Wiener VIG',
      countryOfOrigin: 'Austrija / HR',
      rating: 'A+ (S&P)',
      baseFactor: 0.96,
      strengthsHr: ['Povoljna dodatna zdravstvena pokrića', 'Fleksibilni paketi doma'],
      strengthsEn: ['Competitive supplemental health', 'Flexible home bundles'],
      ipidPrefix: 'IPID-WIE',
    },
    {
      id: 'triglav',
      name: 'Triglav osiguranje d.d.',
      shortName: 'Triglav',
      countryOfOrigin: 'Slovenija / HR',
      rating: 'A (S&P)',
      baseFactor: 0.94,
      strengthsHr: ['Konkurentan obvezni AO', 'Jednostavna prijava loma stakla'],
      strengthsEn: ['Competitive motor liability', 'Streamlined glass claim handling'],
      ipidPrefix: 'IPID-TRG',
    },
    {
      id: 'sava',
      name: 'Sava osiguranje d.d.',
      shortName: 'Sava',
      countryOfOrigin: 'Slovenija / HR',
      rating: 'A (S&P)',
      baseFactor: 0.92,
      strengthsHr: ['Povoljne premije za mlađa vozila', 'Transparentna franšiza'],
      strengthsEn: ['Competitive newer vehicle rates', 'Transparent deductible tiers'],
      ipidPrefix: 'IPID-SAV',
    },
    {
      id: 'groupama',
      name: 'Groupama osiguranje d.d.',
      shortName: 'Groupama',
      countryOfOrigin: 'Francuska / HR',
      rating: 'A (Fitch)',
      baseFactor: 0.95,
      strengthsHr: ['Brzo izdavanje polica za putovanja', 'Prilagođeni paketi za obrte i SME'],
      strengthsEn: ['Instant travel certificates', 'Tailored SME packages'],
      ipidPrefix: 'IPID-GRP',
    },
  ],
};

export function storageKey(suffix: string): string {
  return `${BRAND_CONFIG.storagePrefix}_${suffix}`;
}
