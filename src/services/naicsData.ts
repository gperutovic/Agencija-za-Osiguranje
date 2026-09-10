import { NaicsCode } from '../types/valiant';

export const NAICS_DATABASE: NaicsCode[] = [
  {
    code: '541512',
    title: 'Computer Systems Design Services & SaaS Platforms',
    hazardClass: 'Low',
    baseRateMultiplier: 1.05,
    description: 'Custom software architecture, cloud engineering, cybersecurity consulting, and infrastructure management.',
  },
  {
    code: '541511',
    title: 'Custom Computer Programming Services',
    hazardClass: 'Low',
    baseRateMultiplier: 1.0,
    description: 'Application software development, web app engineering, mobile app publishing.',
  },
  {
    code: '522110',
    title: 'Commercial Banking & FinTech Solutions',
    hazardClass: 'Moderate',
    baseRateMultiplier: 1.45,
    description: 'Transactional payment rails, digital asset custody, non-depository credit intermediation.',
  },
  {
    code: '621111',
    title: 'Offices of Physicians & Outpatient Medical Clinics',
    hazardClass: 'Moderate',
    baseRateMultiplier: 1.35,
    description: 'Clinical medical practices, ambulatory healthcare services, specialized outpatient diagnostic centers.',
  },
  {
    code: '493110',
    title: 'General Warehousing and Cold Storage Logistics',
    hazardClass: 'High',
    baseRateMultiplier: 1.85,
    description: 'Industrial automated warehousing, cold chain distribution hubs, fulfillment logistics centers.',
  },
  {
    code: '236220',
    title: 'Commercial and Institutional Building Construction',
    hazardClass: 'Severe',
    baseRateMultiplier: 2.30,
    description: 'General contractors, commercial high-rise development, industrial facility engineering.',
  },
  {
    code: '541110',
    title: 'Offices of Lawyers & Legal Advisory Practices',
    hazardClass: 'Low',
    baseRateMultiplier: 0.95,
    description: 'Corporate law, intellectual property litigation, contractual regulatory compliance.',
  },
  {
    code: '454110',
    title: 'Electronic Shopping and Mail-Order Houses (E-Commerce)',
    hazardClass: 'Low',
    baseRateMultiplier: 1.15,
    description: 'Direct-to-consumer digital commerce, marketplace aggregators, omnichannel retail distribution.',
  },
  {
    code: '541330',
    title: 'Engineering Services & Structural Design',
    hazardClass: 'Moderate',
    baseRateMultiplier: 1.40,
    description: 'Civil engineering, electrical systems design, mechanical integrity verification.',
  },
  {
    code: '334410',
    title: 'Semiconductor and Other Electronic Component Manufacturing',
    hazardClass: 'Moderate',
    baseRateMultiplier: 1.55,
    description: 'Silicon wafer fabrication, microchip assembly, advanced photonics manufacturing.',
  },
  {
    code: '722511',
    title: 'Full-Service Restaurants & Hospitality Venues',
    hazardClass: 'Moderate',
    baseRateMultiplier: 1.65,
    description: 'Food service establishments, private dining clubs, banquet event spaces.',
  },
  {
    code: '541810',
    title: 'Advertising Agencies & Growth Marketing Advisory',
    hazardClass: 'Low',
    baseRateMultiplier: 0.90,
    description: 'Omnichannel brand strategy, media purchasing, digital creative production.',
  },
];

export function searchNaicsCodes(query: string): NaicsCode[] {
  if (!query || query.trim().length === 0) return NAICS_DATABASE.slice(0, 6);
  const q = query.toLowerCase().trim();
  return NAICS_DATABASE.filter(
    (item) =>
      item.code.includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );
}

export function getNaicsByCode(code: string): NaicsCode | undefined {
  return NAICS_DATABASE.find((item) => item.code === code);
}

