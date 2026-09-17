import { z } from 'zod';
import { isValidOIB } from '../validation';

export const oibSchema = z
  .string()
  .min(1, 'OIB je obvezan podatak')
  .refine(isValidOIB, {
    message: 'Neispravan OIB. Mora sadržavati 11 znamenki i točnu kontrolnu znamenku (ISO 7064 Mod 11, 10).',
  });

export const croatianPhoneSchema = z
  .string()
  .min(8, 'Broj telefona je prekratak')
  .regex(
    /^(\+385|00385|0)[1-9][0-9]{6,8}$/,
    'Unesite valjani telefonski broj u Republici Hrvatskoj (npr. 091 234 5678)'
  );

export const emailSchema = z
  .string()
  .min(1, 'E-mail adresa je obvezna')
  .email('Unesite valjanu e-mail adresu');

/**
 * Zod shema za Dopunsko zdravstveno osiguranje (2026 Switcher & Bind)
 */
export const dopunskoQuoteSchema = z.object({
  birthDate: z.string().min(1, 'Datum rođenja je obvezan'),
  age: z.number().min(18, 'Minimalna dob je 18 godina').max(100, 'Neispravna dob'),
  currentProvider: z.enum(['hzzo', 'private', 'none']),
  includeBList: z.boolean().default(true),
  fullName: z.string().min(3, 'Ime i prezime je obvezno'),
  oib: oibSchema,
  email: emailSchema,
  phone: croatianPhoneSchema,
  address: z.string().min(5, 'Ulica i kućni broj su obvezni'),
  city: z.string().min(2, 'Grad je obvezan'),
  postalCode: z.string().regex(/^\d{5}$/, 'Poštanski broj mora imati 5 znamenki'),
  consentGdpr: z.literal(true, {
    errorMap: () => ({ message: 'Potrebna je suglasnost s uvjetima poslovanja i obradom podataka.' }),
  }),
});

export type DopunskoQuoteFormData = z.infer<typeof dopunskoQuoteSchema>;

/**
 * Zod shema za Obvezno auto i Kasko osiguranje
 */
export const autoCalculatorSchema = z.object({
  kw: z.number().min(15, 'Snaga mora biti najmanje 15 kW').max(600, 'Maksimalna snaga je 600 kW'),
  zone: z.enum(['zona_1', 'zona_2', 'zona_3', 'zona_ostalo']),
  bonusClass: z.enum(['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10']),
  includeKasko: z.boolean().default(false),
  vehicleValueEuro: z.number().min(1000).max(250000).optional(),
  kaskoDeductible: z.enum(['0', '150', '300']).optional(),
  glassBreakage: z.boolean().default(false),
  bonusProtection: z.boolean().default(false),
  roadAssistance: z.boolean().default(true),
  passengerInsurance: z.boolean().default(false),
  isToyotaVehicle: z.boolean().default(false),
  // Kontakt podaci
  fullName: z.string().min(3, 'Ime i prezime je obvezno'),
  email: emailSchema,
  phone: croatianPhoneSchema,
  licensePlate: z.string().optional(),
});

export type AutoCalculatorFormData = z.infer<typeof autoCalculatorSchema>;

/**
 * Zod shema za Osiguranje imovine i doma
 */
export const propertyCalculatorSchema = z.object({
  propertyType: z.enum(['stan', 'kuca', 'vikendica']),
  squareMeters: z.number().min(15, 'Minimalna kvadratura je 15 m²').max(600, 'Maksimalna kvadratura je 600 m²'),
  buildingYear: z.number().min(1900).max(2026),
  city: z.string().min(2, 'Grad je obvezan'),
  includeEarthquake: z.boolean().default(true),
  includeWaterLeak: z.boolean().default(true),
  includeTheft: z.boolean().default(true),
  deductibleEuro: z.enum(['0', '150', '300']).default('0'),
  fullName: z.string().min(3, 'Ime i prezime je obvezno'),
  email: emailSchema,
  phone: croatianPhoneSchema,
  oib: oibSchema.optional().or(z.literal('')),
});

export type PropertyCalculatorFormData = z.infer<typeof propertyCalculatorSchema>;

/**
 * Zod shema za zakonski prigovor potrošača (čl. 401. Zakona o osiguranju)
 */
export const consumerComplaintSchema = z.object({
  fullName: z.string().min(3, 'Ime i prezime ili naziv pravne osobe je obvezno'),
  oib: oibSchema,
  email: emailSchema,
  phone: croatianPhoneSchema,
  address: z.string().min(5, 'Adresa prebivališta je obvezna'),
  policyNumber: z.string().optional(),
  claimNumber: z.string().optional(),
  subject: z.string().min(5, 'Naslov prigovora je obvezan'),
  description: z.string().min(20, 'Detaljan opis prigovora mora sadržavati najmanje 20 znakova'),
  desiredResolution: z.string().optional(),
  consentFormal: z.literal(true, {
    errorMap: () => ({ message: 'Morate potvrditi točnost navedenih podataka.' }),
  }),
});

export type ConsumerComplaintFormData = z.infer<typeof consumerComplaintSchema>;
