import { AppetiteSector } from '../types/valiant';

export const APPETITE_MATRIX: AppetiteSector[] = [
  {
    sector: 'Enterprise Software & Cloud Platforms',
    naicsPrefix: '5415',
    chubbAppetite: 'Aggressive',
    aigAppetite: 'Aggressive',
    lloydsAppetite: 'Aggressive',
    maxCapacity: '$25,000,000',
    targetRisks: ['SaaS Platforms', 'DevOps Infrastructure', 'Cybersecurity Engineering', 'AI Model Training', 'Cloud Hosting'],
  },
  {
    sector: 'FinTech & Digital Payment Solutions',
    naicsPrefix: '5221',
    chubbAppetite: 'Selective',
    aigAppetite: 'Aggressive',
    lloydsAppetite: 'Aggressive',
    maxCapacity: '$15,000,000',
    targetRisks: ['Payment Gateways', 'Digital Wallets', 'B2B Invoicing Rails', 'Credit Scoring Algorithmic APIs', 'Cross-Border Remittances'],
  },
  {
    sector: 'Life Sciences, Biotech & Digital Health',
    naicsPrefix: '6211',
    chubbAppetite: 'Aggressive',
    aigAppetite: 'Selective',
    lloydsAppetite: 'Aggressive',
    maxCapacity: '$20,000,000',
    targetRisks: ['Telehealth Providers', 'Clinical Trial Analytics', 'Medical Software Devices (SaMD)', 'Bio-Informatics Diagnostics'],
  },
  {
    sector: 'Advanced Logistics & Cold Storage Warehousing',
    naicsPrefix: '4931',
    chubbAppetite: 'Selective',
    aigAppetite: 'Aggressive',
    lloydsAppetite: 'Selective',
    maxCapacity: '$50,000,000',
    targetRisks: ['Automated Robotics Fulfillment', 'Pharma Temperature-Controlled Storage', 'Cross-Docking Hubs', '3PL Fleet Logistics'],
  },
  {
    sector: 'Precision Manufacturing & Electronics',
    naicsPrefix: '3344',
    chubbAppetite: 'Aggressive',
    aigAppetite: 'Selective',
    lloydsAppetite: 'Selective',
    maxCapacity: '$30,000,000',
    targetRisks: ['PCB Fabrication', 'Optical Sensors', 'Industrial Automation Controllers', 'Lithography Component Assembly'],
  },
  {
    sector: 'CleanTech & Renewable Energy Infrastructure',
    naicsPrefix: '2211',
    chubbAppetite: 'Aggressive',
    aigAppetite: 'Aggressive',
    lloydsAppetite: 'Selective',
    maxCapacity: '$40,000,000',
    targetRisks: ['Commercial Solar Microgrids', 'Battery Energy Storage Systems (BESS)', 'Wind Turbine Farms', 'EV Fast-Charging Networks'],
  },
  {
    sector: 'High-Value Commercial Construction & Engineering',
    naicsPrefix: '2362',
    chubbAppetite: 'Restricted',
    aigAppetite: 'Selective',
    lloydsAppetite: 'Selective',
    maxCapacity: '$75,000,000',
    targetRisks: ['Data Center Shell Construction', 'Modern Logistics Facilities', 'Commercial Tenant Fit-outs', 'Cleanroom Facilities'],
  },
  {
    sector: 'Global E-Commerce & Omnichannel Distribution',
    naicsPrefix: '4541',
    chubbAppetite: 'Aggressive',
    aigAppetite: 'Aggressive',
    lloydsAppetite: 'Aggressive',
    maxCapacity: '$15,000,000',
    targetRisks: ['Direct-to-Consumer Brands', 'Digital Brand Incubators', 'Subscription Commerce', 'Multi-Warehouse Dropshipping'],
  },
  {
    sector: 'Aerospace Components & Autonomous Avionics',
    naicsPrefix: '3364',
    chubbAppetite: 'Selective',
    aigAppetite: 'Selective',
    lloydsAppetite: 'Aggressive',
    maxCapacity: '$60,000,000',
    targetRisks: ['UAV & Drone Systems', 'Flight Control Software', 'Telemetry Transceivers', 'Satellite Subsystem Assembly'],
  },
  {
    sector: 'Management Consulting & Strategic Advisory',
    naicsPrefix: '5416',
    chubbAppetite: 'Aggressive',
    aigAppetite: 'Aggressive',
    lloydsAppetite: 'Aggressive',
    maxCapacity: '$20,000,000',
    targetRisks: ['Corporate Restructuring', 'ESG & Compliance Auditing', 'Executive Recruiting', 'Mergers & Acquisitions Due Diligence'],
  },
  {
    sector: 'Specialty Chemical & Advanced Polymers',
    naicsPrefix: '3252',
    chubbAppetite: 'Selective',
    aigAppetite: 'Aggressive',
    lloydsAppetite: 'Selective',
    maxCapacity: '$35,000,000',
    targetRisks: ['Bio-Degradable Polymers', 'Industrial Coatings & Resins', 'High-Temp Conductive Adhesives'],
  },
  {
    sector: 'Hospitality & Luxury Boutique Hotels',
    naicsPrefix: '7211',
    chubbAppetite: 'Selective',
    aigAppetite: 'Selective',
    lloydsAppetite: 'Selective',
    maxCapacity: '$45,000,000',
    targetRisks: ['Boutique Urban Hotels', 'Resort Properties', 'Conference & Event Centers'],
  },
];

export function searchAppetiteMatrix(query: string): AppetiteSector[] {
  if (!query || query.trim() === '') return APPETITE_MATRIX;
  const q = query.toLowerCase().trim();
  return APPETITE_MATRIX.filter(
    (item) =>
      item.sector.toLowerCase().includes(q) ||
      item.naicsPrefix.includes(q) ||
      item.targetRisks.some((r) => r.toLowerCase().includes(q))
  );
}
