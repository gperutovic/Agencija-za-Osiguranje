import { defineSecret } from 'firebase-functions/params';

export const FUNCTIONS_REGION = 'europe-west3';

export const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
export const RESEND_API_KEY = defineSecret('RESEND_API_KEY');

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export const AGENCY_BRAND = {
  brandName: 'Vedro',
  legalName: 'Vedro d.o.o. za zastupanje u osiguranju',
  hanfaRegistrationNumber: 'HR-HANFA-ZO-2026-0412',
  oib: '48291047313',
  address: 'Ul. kralja Zvonimira 18, 10000 Zagreb',
  email: 'podrska@vedro-osiguranje.hr',
  complaintsEmail: 'prigovori@vedro-osiguranje.hr',
  phone: '+385 1 4800 910',
  claimsPhone: '+385 1 4800 911',
  siteUrl: process.env.APP_URL || 'https://agencija-za-osiguranje.web.app',
  emailFrom: process.env.EMAIL_FROM || 'Vedro Osiguranje <podrska@vedro-osiguranje.hr>',
} as const;

export const ALLOWED_ORIGINS = new Set<string>([
  'https://agencija-za-osiguranje.web.app',
  'https://agencija-za-osiguranje.firebaseapp.com',
  'https://vedro-osiguranje.hr',
  'https://www.vedro-osiguranje.hr',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
]);
