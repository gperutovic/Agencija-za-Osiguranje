/**
 * Deterministički aktuarski izračun obveznog auto osiguranja (AO) i kasko pokrića.
 * Formula: Premium = (BaseTariff * PowerScalar * ZoneScalar * (1 - BonusRate)) + Addons
 */

export type RegistrationZone = 'zona_1' | 'zona_2' | 'zona_3' | 'zona_ostalo';
export type BonusClass =
  | 'B0'
  | 'B1'
  | 'B2'
  | 'B3'
  | 'B4'
  | 'B5'
  | 'B6'
  | 'B7'
  | 'B8'
  | 'B9'
  | 'B10';

export interface AutoAddons {
  glassBreakage: boolean; // Lom stakla (+35 €)
  bonusProtection: boolean; // Zaštita bonusa (+20 €)
  roadAssistance: boolean; // Pomoć na cesti (+25 €)
  passengerInsurance: boolean; // Nezgoda putnika (+15 €)
}

export interface AutoCalculationInput {
  kw: number;
  zone: RegistrationZone;
  bonusClass: BonusClass;
  includeKasko?: boolean;
  vehicleValueEuro?: number;
  kaskoDeductible?: 0 | 150 | 300;
  addons?: Partial<AutoAddons>;
  isToyotaVehicle?: boolean;
}

export interface AutoCalculationOutput {
  baseTariff: number;
  powerScalar: number;
  zoneScalar: number;
  bonusRate: number;
  bonusPercent: number;
  aoNetto: number;
  addonsTotal: number;
  aoTotalAnnual: number;
  kaskoAnnual: number;
  totalAnnual: number;
  monthlyInstallment: number;
  addonsBreakdown: {
    glassBreakage: number;
    bonusProtection: number;
    roadAssistance: number;
    passengerInsurance: number;
  };
  discountsApplied: string[];
}

export const BASE_AO_TARIFF = 220.0;

export const ZONE_NAMES: Record<RegistrationZone, string> = {
  zona_1: 'Zona 1 (Zagreb i zagrebački prsten)',
  zona_2: 'Zona 2 (Split, Rijeka, Istra)',
  zona_3: 'Zona 3 (Osijek, Zadar, Slavonija)',
  zona_ostalo: 'Zona 4 (Ostale županije i gradovi)',
};

/**
 * Određivanje skalarnog koeficijenta snage motora (kW)
 */
export function getPowerScalar(kw: number): number {
  if (kw <= 33) return 0.7;
  if (kw <= 44) return 0.82;
  if (kw <= 55) return 0.95;
  if (kw <= 66) return 1.08;
  if (kw <= 84) return 1.25;
  if (kw <= 110) return 1.45;
  return 1.8;
}

/**
 * Određivanje skalarnog faktora zone registracije
 */
export function getZoneScalar(zone: RegistrationZone): number {
  switch (zone) {
    case 'zona_1':
      return 1.15;
    case 'zona_2':
      return 1.05;
    case 'zona_3':
      return 0.98;
    case 'zona_ostalo':
    default:
      return 0.9;
  }
}

/**
 * Određivanje postotka bonusa po B0–B10 ljestvici
 */
export function getBonusRate(bonusClass: BonusClass): { rate: number; percent: number } {
  const bonusMapping: Record<BonusClass, number> = {
    B0: 0.0,
    B1: 0.05,
    B2: 0.1,
    B3: 0.15,
    B4: 0.2,
    B5: 0.25,
    B6: 0.3,
    B7: 0.35,
    B8: 0.4,
    B9: 0.45,
    B10: 0.5,
  };

  const rate = bonusMapping[bonusClass] ?? 0.5;
  return {
    rate,
    percent: Math.round(rate * 100),
  };
}

/**
 * Glavni deterministički izračun za Auto i Kasko
 */
export function calculateAutoInsurance(input: AutoCalculationInput): AutoCalculationOutput {
  const kw = Math.max(15, Math.min(600, input.kw || 75));
  const powerScalar = getPowerScalar(kw);
  const zoneScalar = getZoneScalar(input.zone || 'zona_1');
  const { rate: bonusRate, percent: bonusPercent } = getBonusRate(input.bonusClass || 'B10');

  // Osnovna formula za AO: Premium = (BaseTariff * PowerScalar * ZoneScalar * (1 - BonusRate))
  const aoNetto = parseFloat(
    (BASE_AO_TARIFF * powerScalar * zoneScalar * (1 - bonusRate)).toFixed(2)
  );

  const addonsInput = input.addons || {};
  const glassBreakage = addonsInput.glassBreakage ? 35.0 : 0.0;
  const bonusProtection = addonsInput.bonusProtection ? 20.0 : 0.0;
  const roadAssistance = addonsInput.roadAssistance ? 25.0 : 0.0;
  const passengerInsurance = addonsInput.passengerInsurance ? 15.0 : 0.0;

  const addonsTotal = parseFloat(
    (glassBreakage + bonusProtection + roadAssistance + passengerInsurance).toFixed(2)
  );

  const aoTotalAnnual = parseFloat((aoNetto + addonsTotal).toFixed(2));

  // Kasko izračun
  let kaskoAnnual = 0.0;
  const discountsApplied: string[] = [];

  if (input.includeKasko) {
    const val = input.vehicleValueEuro || 22000;
    // Osnovna kasko stopa ~ 2.4% vrijednosti vozila prilagođena snazi
    let kaskoBase = val * 0.024 * (powerScalar * 0.85);

    // Primjena odbitne franšize
    const franchise = input.kaskoDeductible ?? 150;
    if (franchise === 0) {
      kaskoBase *= 1.15; // 0 € franšiza bez učešća
    } else if (franchise === 150) {
      kaskoBase *= 0.88; // 150 € franšiza (-12%)
    } else if (franchise === 300) {
      kaskoBase *= 0.74; // 300 € franšiza (-26%)
    }

    // Toyota Centar Zagreb VIP Kasko popust
    if (input.isToyotaVehicle) {
      kaskoBase *= 0.85; // 15% popusta za Toyota partnerstvo
      discountsApplied.push('Toyota VIP Kasko: 15% popusta & originalni zamjenski dijelovi');
    }

    kaskoAnnual = parseFloat(Math.max(180.0, kaskoBase).toFixed(2));
  }

  if (bonusPercent > 0) {
    discountsApplied.push(`Maksimalni prijenos bonusa: ${bonusPercent}% (Klasa ${input.bonusClass})`);
  }

  const totalAnnual = parseFloat((aoTotalAnnual + kaskoAnnual).toFixed(2));
  const monthlyInstallment = parseFloat((totalAnnual / 12).toFixed(2));

  return {
    baseTariff: BASE_AO_TARIFF,
    powerScalar,
    zoneScalar,
    bonusRate,
    bonusPercent,
    aoNetto,
    addonsTotal,
    aoTotalAnnual,
    kaskoAnnual,
    totalAnnual,
    monthlyInstallment,
    addonsBreakdown: {
      glassBreakage,
      bonusProtection,
      roadAssistance,
      passengerInsurance,
    },
    discountsApplied,
  };
}
