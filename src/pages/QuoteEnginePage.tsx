import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  FileUp,
  Info,
  Plus,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { storageKey } from '../config/brand';
import { useLanguage } from '../i18n/LanguageContext';
import { PRODUCT_CATALOG, PRODUCT_MAP } from '../i18n/translations';
import {
  AutoQuoteInput,
  BusinessQuoteInput,
  CarrierOffer,
  CoverageCustomization,
  HealthQuoteInput,
  LifeQuoteInput,
  PetQuoteInput,
  ProductLine,
  ProductQuoteInput,
  PropertyQuoteInput,
  TravelQuoteInput,
} from '../types/domain';
import {
  isValidCroatianPlate,
  isValidCroatianPostalCode,
  normalizeCroatianPlate,
} from '../utils/croatianValidators';
import { downloadIpidPdf } from '../utils/documentGenerator';
import { formatEur, formatEurWhole } from '../utils/formatters';
import {
  computeBundleDiscountPercent,
  generateCarrierOffers,
  getDefaultCustomizationForLine,
  isDeductibleApplicable,
} from '../utils/pricingEngine';
import { BrandWordmark, ProductIllustration } from '../components/illustrations/EditorialIllustrations';
import { CoverageDrawer } from '../components/quote/CoverageDrawer';
import { QuoteCheckoutModal } from '../components/quote/QuoteCheckoutModal';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const DRAFT_STORAGE_KEY = storageKey('quote_draft_v1');

const VALID_LINES = new Set<ProductLine>([
  'auto',
  'imovina',
  'zdravstveno',
  'zivotno',
  'putno',
  'ljubimci',
  'poslovno',
]);

function parseProductLine(raw?: string): ProductLine | null {
  if (!raw) return null;
  return VALID_LINES.has(raw as ProductLine) ? (raw as ProductLine) : null;
}

const TOTAL_STEPS_BY_LINE: Record<ProductLine, number> = {
  auto: 4,
  imovina: 4,
  zdravstveno: 3,
  zivotno: 3,
  putno: 3,
  ljubimci: 3,
  poslovno: 3,
};

const POPULAR_CARS = [
  { label: 'VW Golf VIII', make: 'Volkswagen', model: 'Golf VIII', kw: 96, year: 2022 },
  { label: 'Škoda Octavia', make: 'Škoda', model: 'Octavia', kw: 110, year: 2023 },
  { label: 'Renault Clio', make: 'Renault', model: 'Clio', kw: 67, year: 2021 },
  { label: 'Toyota Corolla', make: 'Toyota', model: 'Corolla', kw: 103, year: 2023 },
];

const POPULAR_CITIES = [
  { city: 'Zagreb', postalCode: '10000' },
  { city: 'Split', postalCode: '21000' },
  { city: 'Rijeka', postalCode: '51000' },
  { city: 'Osijek', postalCode: '31000' },
];

interface SavedDraft {
  autoData?: AutoQuoteInput;
  propertyData?: PropertyQuoteInput;
  healthData?: HealthQuoteInput;
  lifeData?: LifeQuoteInput;
  travelData?: TravelQuoteInput;
  petData?: PetQuoteInput;
  businessData?: BusinessQuoteInput;
  bundleProducts?: ProductLine[];
}

function loadDraft(): SavedDraft {
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedDraft) : {};
  } catch {
    return {};
  }
}

export const QuoteEnginePage: React.FC = () => {
  const { product: paramProduct } = useParams<{ product?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, setLanguage, copy, t } = useLanguage();

  const initialDraft = useMemo(() => loadDraft(), []);
  const initialProduct = parseProductLine(paramProduct);
  const initialBundle = useMemo<ProductLine[]>(() => {
    const raw = searchParams.get('bundle');
    if (raw) {
      const parsed = raw
        .split(',')
        .map((s) => parseProductLine(s.trim()))
        .filter((x): x is ProductLine => x !== null);
      if (parsed.length > 0) return Array.from(new Set(parsed));
    }
    if (initialProduct) return [initialProduct];
    return initialDraft.bundleProducts ?? [];
  }, [searchParams, initialProduct, initialDraft.bundleProducts]);

  const [selectedLine, setSelectedLine] = useState<ProductLine | null>(initialProduct);
  const [bundleProducts, setBundleProducts] = useState<ProductLine[]>(initialBundle);
  const [stepIndex, setStepIndex] = useState<number>(initialProduct ? 1 : 0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [stepError, setStepError] = useState<string>('');
  const [showBundlePicker, setShowBundlePicker] = useState<boolean>(false);

  // Clean empty/realistic defaults (no fake dummy vehicle/city prefilled)
  const [autoData, setAutoData] = useState<AutoQuoteInput>(
    initialDraft.autoData ?? {
      productLine: 'auto',
      plateNumber: '',
      make: '',
      model: '',
      year: new Date().getFullYear() - 3,
      kw: 96,
      bonusPercent: 50,
      youngDriver: false,
      annualMileage: '10k_20k',
      kaskoTier: 'full_kasko',
    }
  );

  const [propertyData, setPropertyData] = useState<PropertyQuoteInput>(
    initialDraft.propertyData ?? {
      productLine: 'imovina',
      city: '',
      postalCode: '',
      propertyType: 'stan',
      areaSqm: 70,
      coverageScope: 'both',
      includeEarthquake: true,
      includeFlood: false,
      includeBurglary: true,
    }
  );

  const [healthData, setHealthData] = useState<HealthQuoteInput>(
    initialDraft.healthData ?? {
      productLine: 'zdravstveno',
      age: 34,
      planTier: 'kombinirano',
      includeBListDrugs: true,
      includeDiagnostics: true,
      familyMembers: 1,
    }
  );

  const [lifeData, setLifeData] = useState<LifeQuoteInput>(
    initialDraft.lifeData ?? {
      productLine: 'zivotno',
      age: 36,
      smoker: false,
      sumInsured: 80000,
      termYears: 20,
      includeCriticalIllness: true,
    }
  );

  const [travelData, setTravelData] = useState<TravelQuoteInput>(
    initialDraft.travelData ?? {
      productLine: 'putno',
      destination: 'eu',
      days: 7,
      travelers: 2,
      includeWinterSports: false,
      includeCancellation: true,
    }
  );

  const [petData, setPetData] = useState<PetQuoteInput>(
    initialDraft.petData ?? {
      productLine: 'ljubimci',
      petType: 'dog',
      petAgeYears: 3,
      breedSize: 'medium',
      includeLiability: true,
    }
  );

  const [businessData, setBusinessData] = useState<BusinessQuoteInput>(
    initialDraft.businessData ?? {
      productLine: 'poslovno',
      companyType: 'doo',
      employees: 5,
      annualRevenueBand: '100k_500k',
      includeProfessionalLiability: true,
      includeCyber: true,
    }
  );

  const [customization, setCustomization] = useState<CoverageCustomization>(() =>
    getDefaultCustomizationForLine(initialProduct ?? 'auto')
  );
  const [drawerOffer, setDrawerOffer] = useState<CarrierOffer | null>(null);
  const [checkoutOffer, setCheckoutOffer] = useState<CarrierOffer | null>(null);

  // Sync URL changes and reset customization to line-appropriate defaults
  useEffect(() => {
    const parsed = parseProductLine(paramProduct);
    setSelectedLine(parsed);
    if (parsed) {
      setCustomization(getDefaultCustomizationForLine(parsed));
    }
    setBundleProducts(initialBundle);
    setStepIndex(parsed ? 1 : 0);
    setShowResults(false);
    setStepError('');
  }, [paramProduct, initialBundle]);

  // Persist quote progress to sessionStorage
  useEffect(() => {
    try {
      const payload: SavedDraft = {
        autoData,
        propertyData,
        healthData,
        lifeData,
        travelData,
        petData,
        businessData,
        bundleProducts,
      };
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [
    autoData,
    propertyData,
    healthData,
    lifeData,
    travelData,
    petData,
    businessData,
    bundleProducts,
  ]);

  const activeInput: ProductQuoteInput = useMemo(() => {
    switch (selectedLine ?? 'auto') {
      case 'auto':
        return autoData;
      case 'imovina':
        return propertyData;
      case 'zdravstveno':
        return healthData;
      case 'zivotno':
        return lifeData;
      case 'putno':
        return travelData;
      case 'ljubimci':
        return petData;
      case 'poslovno':
        return businessData;
    }
  }, [selectedLine, autoData, propertyData, healthData, lifeData, travelData, petData, businessData]);

  const deductibleApplicable = useMemo(() => isDeductibleApplicable(activeInput), [activeInput]);

  const offers = useMemo(() => {
    if (!showResults || !selectedLine) return [];
    return generateCarrierOffers(activeInput, customization, bundleProducts, language);
  }, [showResults, selectedLine, activeInput, customization, bundleProducts, language]);

  // Combined multi-policy bundle summary estimation when 2+ lines are bundled
  const bundleSummary = useMemo(() => {
    if (!selectedLine || bundleProducts.length < 2 || offers.length === 0) return null;
    const discountPct = computeBundleDiscountPercent(bundleProducts);
    const primaryBest = offers[0]!;
    const secondaryLines = bundleProducts.filter((l) => l !== selectedLine);
    const secondaryBaseAnnual = secondaryLines.reduce(
      (sum, line) => sum + PRODUCT_MAP[line].startingAnnualEur,
      0
    );
    const secondaryDiscounted = secondaryBaseAnnual * (1 - discountPct / 100);
    const combinedAnnual = Math.round((primaryBest.annualPrice + secondaryDiscounted) * 100) / 100;
    const combinedSavings =
      Math.round(
        (primaryBest.baseAnnualBeforeBundle - primaryBest.annualPrice + (secondaryBaseAnnual - secondaryDiscounted)) *
          100
      ) / 100;
    return {
      discountPct,
      combinedAnnual,
      combinedSavings,
      secondaryLines,
    };
  }, [selectedLine, bundleProducts, offers]);

  const totalSteps = selectedLine ? TOTAL_STEPS_BY_LINE[selectedLine] : 4;
  const progressPercent = showResults
    ? 100
    : stepIndex === 0
      ? 12
      : Math.round((stepIndex / (totalSteps + 1)) * 100);

  const selectLineAndStart = (line: ProductLine) => {
    setSelectedLine(line);
    setCustomization(getDefaultCustomizationForLine(line));
    setBundleProducts((prev) => (prev.includes(line) ? prev : [line, ...prev]));
    setStepError('');
    setStepIndex(1);
    setShowResults(false);
  };

  const toggleBundleLine = (line: ProductLine) => {
    if (line === selectedLine) return; // Primary quoted line always remains in bundle
    setBundleProducts((prev) =>
      prev.includes(line) ? prev.filter((item) => item !== line) : [...prev, line]
    );
  };

  const validateCurrentStep = (): string | null => {
    if (!selectedLine) return null;
    const maxYear = new Date().getFullYear() + 1;

    if (selectedLine === 'auto') {
      if (stepIndex === 1) {
        const normalized = normalizeCroatianPlate(autoData.plateNumber);
        if (!isValidCroatianPlate(normalized)) {
          return t(
            'Unesite važeću hrvatsku registraciju (npr. ZG-1234-AB ili ST-999-A).',
            'Enter a valid Croatian license plate (e.g. ZG-1234-AB or ST-999-A).'
          );
        }
        setAutoData((prev) => ({ ...prev, plateNumber: normalized }));
      }
      if (stepIndex === 2) {
        const res = z
          .object({
            make: z.string().trim().min(2, t('Unesite marku vozila.', 'Enter vehicle make.')),
            model: z.string().trim().min(1, t('Unesite model vozila.', 'Enter vehicle model.')),
            year: z
              .number()
              .int()
              .min(1980, t('Godina proizvodnje mora biti od 1980. nadalje.', 'Year must be 1980 or later.'))
              .max(maxYear, t(`Godina ne može biti veća od ${maxYear}.`, `Year cannot exceed ${maxYear}.`)),
            kw: z.number().min(20).max(600),
          })
          .safeParse(autoData);
        if (!res.success) return res.error.issues[0]?.message ?? t('Provjerite podatke o vozilu.', 'Check vehicle details.');
      }
    }

    if (selectedLine === 'imovina') {
      if (stepIndex === 1) {
        if (propertyData.city.trim().length < 2) {
          return t('Unesite naziv grada ili mjesta.', 'Enter the city or town name.');
        }
        if (!isValidCroatianPostalCode(propertyData.postalCode)) {
          return t(
            'Unesite ispravan hrvatski poštanski broj (10000 – 53296).',
            'Enter a valid Croatian postal code (10000 – 53296).'
          );
        }
      }
      if (stepIndex === 2) {
        if (propertyData.areaSqm < 15 || propertyData.areaSqm > 1000) {
          return t('Stambena površina mora biti između 15 i 1000 m².', 'Area must be between 15 and 1000 m².');
        }
      }
    }

    if (selectedLine === 'zdravstveno' && stepIndex === 2) {
      const res = z
        .object({
          age: z.number().int().min(18).max(85),
          familyMembers: z.number().int().min(1).max(10),
        })
        .safeParse(healthData);
      if (!res.success) {
        return t('Dob mora biti 18–85 god., a broj osoba 1–10.', 'Age must be 18–85 and members 1–10.');
      }
    }

    if (selectedLine === 'zivotno') {
      if (stepIndex === 1 && (lifeData.sumInsured < 10000 || lifeData.sumInsured > 500000)) {
        return t('Osigurana svota mora biti između 10.000 € i 500.000 €.', 'Sum insured must be €10,000–€500,000.');
      }
      if (stepIndex === 2) {
        const res = z
          .object({
            age: z.number().int().min(18, t('Minimalna dob je 18 godina.', 'Minimum age is 18.')).max(65, t('Maksimalna pristupna dob je 65 godina.', 'Maximum entry age is 65.')),
            termYears: z.number().int().min(5, t('Minimalno trajanje je 5 godina.', 'Minimum term is 5 years.')).max(35, t('Maksimalno trajanje je 35 godina.', 'Maximum term is 35 years.')),
          })
          .safeParse(lifeData);
        if (!res.success) return res.error.issues[0]?.message ?? t('Provjerite dob i trajanje.', 'Check age and term.');
      }
    }

    if (selectedLine === 'putno' && stepIndex === 2) {
      const res = z
        .object({
          days: z.number().int().min(1, t('Najmanje 1 dan.', 'At least 1 day.')).max(180, t('Maksimalno 180 dana po putovanju.', 'Maximum 180 days per trip.')),
          travelers: z.number().int().min(1, t('Najmanje 1 putnik.', 'At least 1 traveler.')).max(20, t('Maksimalno 20 putnika.', 'Maximum 20 travelers.')),
        })
        .safeParse(travelData);
      if (!res.success) return res.error.issues[0]?.message ?? t('Provjerite trajanje i broj putnika.', 'Check trip days and travelers.');
    }

    if (selectedLine === 'ljubimci' && stepIndex === 2) {
      if (petData.petAgeYears < 0 || petData.petAgeYears > 18) {
        return t('Starost ljubimca mora biti između 0 i 18 godina.', 'Pet age must be 0–18 years.');
      }
    }

    if (selectedLine === 'poslovno' && stepIndex === 2) {
      if (businessData.employees < 1 || businessData.employees > 500) {
        return t('Broj zaposlenih mora biti između 1 i 500.', 'Employees must be between 1 and 500.');
      }
    }

    return null;
  };

  const handleNext = () => {
    setStepError('');
    if (!selectedLine) return;

    const validationError = validateCurrentStep();
    if (validationError) {
      setStepError(validationError);
      return;
    }

    if (stepIndex < totalSteps) {
      setStepIndex((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    setStepError('');
    if (showResults) {
      setShowResults(false);
      return;
    }
    if (stepIndex > 1) {
      setStepIndex((s) => s - 1);
    } else {
      setStepIndex(0);
      setSelectedLine(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  const activeMeta = selectedLine ? PRODUCT_MAP[selectedLine] : null;
  const activeProductLabel = activeMeta
    ? language === 'en'
      ? activeMeta.nameEn
      : activeMeta.nameHr
    : t('Osiguranje', 'Insurance');
  const isTravel = selectedLine === 'putno';

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Focused Distraction-Free Quote Header */}
      <header className="sticky top-0 z-30 bg-canvas border-b border-hairline">
        <div className="max-w-5xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
          <Link to="/" aria-label={t('Povratak na naslovnu', 'Back to homepage')}>
            <BrandWordmark />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 text-xs text-ink-muted tabular-nums">
            {activeMeta ? (
              <span className="hidden sm:inline font-medium text-ink">{activeProductLabel}</span>
            ) : null}
            <span>
              {showResults
                ? t('Usporedba ponuda', 'Offer comparison')
                : stepIndex === 0
                  ? t('Odabir osiguranja', 'Select insurance')
                  : t(`Korak ${stepIndex} od ${totalSteps}`, `Step ${stepIndex} of ${totalSteps}`)}
            </span>
            <div className="inline-flex rounded-md border border-hairline bg-canvas-warm p-0.5 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('hr')}
                className={`px-1.5 py-0.5 rounded ${language === 'hr' ? 'bg-ink text-white' : 'text-ink-muted'}`}
              >
                HR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-ink text-white' : 'text-ink-muted'}`}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-ink-secondary hover:text-ink font-medium"
            >
              {t('Izlaz', 'Exit')}
            </button>
          </div>
        </div>
        <div className="h-[2px] w-full bg-hairline">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        {/* Interactive Multi-Policy Bundle Chip Bar (when inside a line or results) */}
        {selectedLine ? (
          <div className="max-w-5xl mx-auto mb-8">
            <div className="rounded-editorial bg-canvas-warm border border-hairline px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  {t('Aktivni paket:', 'Active bundle:')}
                </span>
                {bundleProducts.map((line) => {
                  const meta = PRODUCT_MAP[line];
                  const isPrimary = line === selectedLine;
                  return (
                    <span
                      key={line}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-semibold border ${
                        isPrimary
                          ? 'bg-ink text-white border-ink'
                          : 'bg-canvas text-ink border-hairline-strong'
                      }`}
                    >
                      <span>{language === 'en' ? meta.nameEn : meta.nameHr}</span>
                      {!isPrimary ? (
                        <button
                          type="button"
                          onClick={() => toggleBundleLine(line)}
                          aria-label={t(`Ukloni ${meta.nameHr} iz paketa`, `Remove ${meta.nameEn} from bundle`)}
                          className="text-ink-muted hover:text-status-danger"
                        >
                          <X className="w-3 h-3" strokeWidth={2.25} />
                        </button>
                      ) : null}
                    </span>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setShowBundlePicker((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill border border-dashed border-hairline-strong bg-canvas text-xs font-semibold text-accent hover:border-accent transition-colors"
                >
                  <Plus className="w-3 h-3" strokeWidth={2.25} />
                  <span>{t('Dodaj policu (-15%)', 'Add line (up to -15%)')}</span>
                </button>
              </div>
              {computeBundleDiscountPercent(bundleProducts) > 0 ? (
                <Badge variant="accent">
                  {t(
                    `Paketni popust -${computeBundleDiscountPercent(bundleProducts)}%`,
                    `Bundle discount -${computeBundleDiscountPercent(bundleProducts)}%`
                  )}
                </Badge>
              ) : (
                <span className="text-xs text-ink-muted">
                  {t('Spojite 2+ police za 12%–15% popusta', 'Bundle 2+ lines for 12%–15% off')}
                </span>
              )}
            </div>

            {showBundlePicker ? (
              <div className="mt-2 rounded-editorial bg-canvas border border-hairline p-3 flex flex-wrap gap-2 animate-step">
                {PRODUCT_CATALOG.filter((p) => p.id !== selectedLine).map((p) => {
                  const active = bundleProducts.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleBundleLine(p.id)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        active
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-hairline hover:border-ink text-ink-secondary'
                      }`}
                    >
                      {active ? <Check className="w-3.5 h-3.5 text-accent" strokeWidth={2.25} /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{language === 'en' ? p.nameEn : p.nameHr}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* STEP 0: Balanced 4 × 2 Product Line Hub */}
        {!showResults && (stepIndex === 0 || !selectedLine) ? (
          <div className="max-w-5xl mx-auto space-y-8 animate-step">
            <div className="text-center space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                {t('90-sekundni izračun', '90-second quote')}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl text-ink">
                {t('Što želite osigurati danas?', 'What would you like to insure today?')}
              </h1>
              <p className="text-sm sm:text-base text-ink-secondary">
                {t(
                  'Odaberite vrstu osiguranja. Kontakt i OIB tražimo tek ako odaberete ponudu.',
                  'Pick an insurance line. We only ask for contact info and OIB if you choose an offer.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCT_CATALOG.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectLineAndStart(item.id)}
                  className="group rounded-editorial border border-hairline hover:border-ink bg-canvas p-5 text-left transition-all hover:shadow-card flex flex-col items-center text-center gap-3"
                >
                  <ProductIllustration productLine={item.id} className="w-16 h-16" />
                  <div>
                    <div className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                      {language === 'en' ? item.nameEn : item.nameHr}
                    </div>
                    <div className="text-xs text-ink-muted tabular-nums mt-0.5">
                      {copy.units.from} {formatEurWhole(item.startingMonthlyEur)}{' '}
                      {item.isSingleTrip ? copy.units.perTripShort : copy.units.perMonthShort}
                    </div>
                  </div>
                </button>
              ))}

              {/* Balanced 8th Helper Card */}
              <Link
                to="/usporedi-policu"
                className="group rounded-editorial border border-ink bg-ink text-white p-5 transition-all hover:bg-ink/95 flex flex-col items-center justify-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-accent">
                  <FileUp className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t('Već imate policu?', 'Already have a policy?')}
                  </div>
                  <div className="text-xs text-white/75 mt-1">
                    {t('Učitajte PDF za brzu AI usporedbu', 'Upload PDF for instant savings check')}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ) : null}

        {/* FLIPPED-FUNNEL QUESTIONS */}
        {!showResults && selectedLine && stepIndex >= 1 ? (
          <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto space-y-8 animate-step" noValidate>
            {/* AUTO FLOW */}
            {selectedLine === 'auto' && stepIndex === 1 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {activeProductLabel} • 1/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    {t(
                      'Koja je registarska oznaka vašeg vozila?',
                      'What is your vehicle license plate?'
                    )}
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    {t(
                      'Prema registracijskom području određujemo zonu rizika za obvezni AO.',
                      'Croatian registration zones determine your mandatory liability risk tier.'
                    )}
                  </p>
                </div>
                <Input
                  label={t('Registarska oznaka *', 'Croatian License Plate *')}
                  placeholder={t('npr. ZG-1234-AB', 'e.g. ZG-1234-AB')}
                  value={autoData.plateNumber}
                  onChange={(e) => {
                    setStepError('');
                    setAutoData({ ...autoData, plateNumber: e.target.value.toUpperCase() });
                  }}
                  tabular
                  autoFocus
                  error={stepError || undefined}
                  helperText={t(
                    'Podržane su sve 34 hrvatske registracijske oznake (ZG, ST, RI, OS, ZD, PU...).',
                    'All 34 Croatian registration areas supported (ZG, ST, RI, OS, ZD, PU...).'
                  )}
                />
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-ink-muted">{t('Brzi primjer:', 'Quick sample:')}</span>
                  {['ZG-4821-MK', 'ST-902-AB', 'RI-2241-CD'].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => {
                        setStepError('');
                        setAutoData({ ...autoData, plateNumber: sample });
                      }}
                      className="px-2.5 py-1 rounded-pill border border-hairline bg-canvas-warm text-ink-secondary hover:border-ink hover:text-ink tabular-nums"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedLine === 'auto' && stepIndex === 2 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {activeProductLabel} • 2/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    {t('Recite nam osnovne podatke o vozilu', 'Tell us about your vehicle')}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-ink-muted">{t('Popularna vozila:', 'Popular models:')}</span>
                  {POPULAR_CARS.map((car) => (
                    <button
                      key={car.label}
                      type="button"
                      onClick={() => {
                        setStepError('');
                        setAutoData({
                          ...autoData,
                          make: car.make,
                          model: car.model,
                          kw: car.kw,
                          year: car.year,
                        });
                      }}
                      className="px-2.5 py-1 rounded-pill border border-hairline bg-canvas-warm text-ink-secondary hover:border-ink hover:text-ink"
                    >
                      {car.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t('Marka vozila *', 'Vehicle make *')}
                    placeholder={t('npr. Volkswagen', 'e.g. Volkswagen')}
                    value={autoData.make}
                    onChange={(e) => {
                      setStepError('');
                      setAutoData({ ...autoData, make: e.target.value });
                    }}
                  />
                  <Input
                    label={t('Model *', 'Model *')}
                    placeholder={t('npr. Golf VIII', 'e.g. Golf VIII')}
                    value={autoData.model}
                    onChange={(e) => {
                      setStepError('');
                      setAutoData({ ...autoData, model: e.target.value });
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t('Godina proizvodnje *', 'Production year *')}
                    type="number"
                    min={1980}
                    max={new Date().getFullYear() + 1}
                    tabular
                    value={autoData.year}
                    onChange={(e) => setAutoData({ ...autoData, year: Number(e.target.value) || 2020 })}
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-ink">
                      <span>{t('Snaga motora', 'Engine power')}</span>
                      <span className="tabular-nums text-accent">
                        {autoData.kw} kW ({Math.round(autoData.kw * 1.36)} {t('KS', 'HP')})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={35}
                      max={260}
                      step={5}
                      value={autoData.kw}
                      onChange={(e) => setAutoData({ ...autoData, kw: Number(e.target.value) })}
                      className="editorial-slider mt-3"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {selectedLine === 'auto' && stepIndex === 3 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {activeProductLabel} • 3/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    {t(
                      'Koliki je vaš stečeni bonus i profil vozača?',
                      'What is your bonus class & driver profile?'
                    )}
                  </h1>
                </div>

                <div className="space-y-2 rounded-editorial bg-canvas-warm border border-hairline p-5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{t('Stečeni bonus-malus', 'No-claims bonus')}</span>
                    <span className="text-accent tabular-nums">{autoData.bonusPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={autoData.bonusPercent}
                    onChange={(e) => setAutoData({ ...autoData, bonusPercent: Number(e.target.value) })}
                    className="editorial-slider"
                  />
                  <div className="flex justify-between text-[11px] text-ink-muted tabular-nums">
                    <span>{t('0% (novi vozač)', '0% (new driver)')}</span>
                    <span>25%</span>
                    <span>{t('50% (maks. bonus)', '50% (max bonus)')}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-ink">
                    {t('Procijenjena godišnja kilometraža', 'Estimated annual mileage')}
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(
                      [
                        { id: 'under_10k', label: t('Do 10.000 km', 'Under 10k km') },
                        { id: '10k_20k', label: t('10 – 20 tisuća', '10k – 20k km') },
                        { id: 'over_20k', label: t('Preko 20.000 km', 'Over 20k km') },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAutoData({ ...autoData, annualMileage: opt.id })}
                        className={`p-3 rounded-lg border text-xs font-semibold transition-colors ${
                          autoData.annualMileage === opt.id
                            ? 'border-accent bg-accent-soft text-ink'
                            : 'border-hairline bg-canvas text-ink-secondary hover:border-ink'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer hover:border-ink/40">
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {t('Mladi vozač (ispod 24 god.)', 'Young driver (under 24)')}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {t(
                        'Uključuje pokriće i za mlađe vozače u kućanstvu',
                        'Includes coverage for younger household drivers'
                      )}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoData.youngDriver}
                    onChange={(e) => setAutoData({ ...autoData, youngDriver: e.target.checked })}
                    className="w-5 h-5 rounded accent-accent"
                  />
                </label>
              </div>
            ) : null}

            {selectedLine === 'auto' && stepIndex === 4 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {activeProductLabel} • 4/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    {t(
                      `Koju razinu zaštite želite za ${autoData.make} ${autoData.model}?`,
                      `Which protection level for your ${autoData.make} ${autoData.model}?`
                    )}
                  </h1>
                </div>
                <div className="space-y-3">
                  {(
                    [
                      {
                        id: 'ao_only',
                        title: t('Samo obvezno osiguranje (AO)', 'Mandatory Liability Only (AO)'),
                        desc: t(
                          'Zakonska zaštita za štete prema trećim osobama + Zelena karta.',
                          'Statutory third-party liability + Digital Green Card.'
                        ),
                      },
                      {
                        id: 'mini_kasko',
                        title: t('AO + Mini Kasko', 'Liability + Mini Kasko'),
                        desc: t(
                          'Dodatno štiti vozilo od krađe, požara, oluje i tuče.',
                          'Adds theft, fire, storm, and hail protection.'
                        ),
                      },
                      {
                        id: 'full_kasko',
                        title: t('AO + Puni Kasko', 'Liability + Full Comprehensive (Kasko)'),
                        desc: t(
                          'Potpuna zaštita i za vlastite štete u sudaru, krađu i vandalizam.',
                          'Full protection for collision, rollover, theft, and vandalism.'
                        ),
                      },
                    ] as const
                  ).map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setAutoData({ ...autoData, kaskoTier: tier.id })}
                      className={`w-full text-left p-4 rounded-editorial border transition-all flex items-start justify-between gap-3 ${
                        autoData.kaskoTier === tier.id
                          ? 'border-accent bg-accent-soft'
                          : 'border-hairline hover:border-ink'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-ink">{tier.title}</div>
                        <div className="text-xs text-ink-secondary mt-0.5">{tier.desc}</div>
                      </div>
                      {autoData.kaskoTier === tier.id ? (
                        <Check className="w-5 h-5 text-accent shrink-0" strokeWidth={2} />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* IMOVINA FLOW */}
            {selectedLine === 'imovina' && stepIndex === 1 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {activeProductLabel} • 1/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    {t('Gdje se nalazi vaša nekretnina?', 'Where is your property located?')}
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    {t(
                      'Poštanski broj služi za izračun seizmičke i vremenske zone u Hrvatskoj.',
                      'Croatian postal codes determine seismic and weather risk zones.'
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-ink-muted">{t('Brzi odabir:', 'Quick select:')}</span>
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c.postalCode}
                      type="button"
                      onClick={() => {
                        setStepError('');
                        setPropertyData({ ...propertyData, city: c.city, postalCode: c.postalCode });
                      }}
                      className="px-2.5 py-1 rounded-pill border border-hairline bg-canvas-warm text-ink-secondary hover:border-ink hover:text-ink tabular-nums"
                    >
                      {c.city} ({c.postalCode})
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t('Grad / mjesto *', 'City / town *')}
                    value={propertyData.city}
                    onChange={(e) => {
                      setStepError('');
                      setPropertyData({ ...propertyData, city: e.target.value });
                    }}
                    placeholder={t('npr. Zagreb', 'e.g. Zagreb')}
                    autoFocus
                  />
                  <Input
                    label={t('Poštanski broj *', 'Postal code *')}
                    value={propertyData.postalCode}
                    onChange={(e) => {
                      setStepError('');
                      setPropertyData({ ...propertyData, postalCode: e.target.value });
                    }}
                    placeholder="10000"
                    maxLength={5}
                    tabular
                  />
                </div>
              </div>
            ) : null}

            {selectedLine === 'imovina' && stepIndex === 2 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {activeProductLabel} • 2/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    {t('Radi li se o stanu ili obiteljskoj kući?', 'Is it an apartment or a house?')}
                  </h1>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: 'stan', label: t('Stan u zgradi', 'Apartment') },
                      { id: 'kuca', label: t('Obiteljska kuća', 'Detached house') },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPropertyData({ ...propertyData, propertyType: opt.id })}
                      className={`p-4 rounded-editorial border text-sm font-semibold transition-colors ${
                        propertyData.propertyType === opt.id
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-hairline hover:border-ink text-ink-secondary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 rounded-editorial bg-canvas-warm border border-hairline p-5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{t('Korisna stambena površina', 'Living area')}</span>
                    <span className="text-accent tabular-nums">{propertyData.areaSqm} m²</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={300}
                    step={5}
                    value={propertyData.areaSqm}
                    onChange={(e) => setPropertyData({ ...propertyData, areaSqm: Number(e.target.value) })}
                    className="editorial-slider"
                  />
                </div>
              </div>
            ) : null}

            {selectedLine === 'imovina' && stepIndex === 3 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {activeProductLabel} • 3/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    {t('Što želite pokriti policom?', 'What should the policy cover?')}
                  </h1>
                </div>
                <div className="space-y-3">
                  {(
                    [
                      {
                        id: 'both',
                        title: t('Građevinski dio + Stvari kućanstva', 'Building + Household Contents'),
                        desc: t(
                          'Preporučeno za vlasnike — pokriva zidove, instalacije i sav namještaj.',
                          'Recommended for owners — covers structure, pipes, and belongings.'
                        ),
                      },
                      {
                        id: 'building',
                        title: t('Samo građevinski dio', 'Building Structure Only'),
                        desc: t(
                          'Idealno za vinkulaciju stambenog kredita.',
                          'Ideal for bank mortgage assignment (vinkulacija).'
                        ),
                      },
                      {
                        id: 'contents',
                        title: t('Samo stvari kućanstva', 'Household Contents Only'),
                        desc: t('Najbolji odabir za najmoprimce.', 'Best fit for tenants and renters.'),
                      },
                    ] as const
                  ).map((scope) => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setPropertyData({ ...propertyData, coverageScope: scope.id })}
                      className={`w-full text-left p-4 rounded-editorial border transition-colors ${
                        propertyData.coverageScope === scope.id
                          ? 'border-accent bg-accent-soft'
                          : 'border-hairline hover:border-ink'
                      }`}
                    >
                      <div className="text-sm font-semibold text-ink">{scope.title}</div>
                      <div className="text-xs text-ink-secondary mt-0.5">{scope.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedLine === 'imovina' && stepIndex === 4 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {activeProductLabel} • 4/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    {t(
                      'Želite li dodati zaštitu od potresa i provale?',
                      'Add earthquake, flood, or burglary protection?'
                    )}
                  </h1>
                </div>
                <div className="space-y-3">
                  <label className="flex items-start justify-between gap-4 p-4 rounded-editorial border border-hairline cursor-pointer hover:border-ink/40">
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {t('Osiguranje od potresa', 'Earthquake protection')}
                      </div>
                      <div className="text-xs text-ink-secondary mt-0.5">
                        {t(
                          'Pokriće na punu građevinsku vrijednost bez podosiguranja (ključno za RH).',
                          'Full reconstruction value cover without underinsurance.'
                        )}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={propertyData.includeEarthquake}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, includeEarthquake: e.target.checked })
                      }
                      className="mt-1 w-5 h-5 accent-accent"
                    />
                  </label>
                  <label className="flex items-start justify-between gap-4 p-4 rounded-editorial border border-hairline cursor-pointer hover:border-ink/40">
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {t('Poplava i bujice', 'Flood & flash floods')}
                      </div>
                      <div className="text-xs text-ink-secondary mt-0.5">
                        {t(
                          'Štete od izlijevanja rijeka, bujica i podzemnih voda.',
                          'River overflow, flash floods, and groundwater damage.'
                        )}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={propertyData.includeFlood}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, includeFlood: e.target.checked })
                      }
                      className="mt-1 w-5 h-5 accent-accent"
                    />
                  </label>
                  <label className="flex items-start justify-between gap-4 p-4 rounded-editorial border border-hairline cursor-pointer hover:border-ink/40">
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {t('Provalna krađa i razbojništvo', 'Burglary & robbery')}
                      </div>
                      <div className="text-xs text-ink-secondary mt-0.5">
                        {t(
                          'Pokriva otuđene stvari te popravak oštećenih brava i vrata.',
                          'Covers stolen goods and forced-entry lock/door repairs.'
                        )}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={propertyData.includeBurglary}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, includeBurglary: e.target.checked })
                      }
                      className="mt-1 w-5 h-5 accent-accent"
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {/* ZDRAVSTVENO FLOW */}
            {selectedLine === 'zdravstveno' && stepIndex === 1 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Odaberite vrstu zdravstvenog osiguranja', 'Choose your health insurance tier')}
                </h1>
                <div className="space-y-3">
                  {(
                    [
                      {
                        id: 'dopunsko',
                        title: t('Dopunsko zdravstveno', 'Supplemental Health (Dopunsko)'),
                        desc: t(
                          'Pokriva sve HZZO participacije od 9,50 €/mj. (umjesto 15,00 € kod HZZO-a).',
                          'Covers all HZZO copays starting from €9.50/mo (vs €15 at HZZO).'
                        ),
                      },
                      {
                        id: 'dodatno',
                        title: t('Dodatno privatno zdravstveno', 'Private Additional Health (Dodatno)'),
                        desc: t(
                          'Specijalistički pregledi, MR/CT i godišnji sistematski bez čekanja.',
                          'Private specialists, MRI/CT diagnostics, and annual check-up.'
                        ),
                      },
                      {
                        id: 'kombinirano',
                        title: t('Kombinirani paket (Dopunsko + Dodatno)', 'Combined Package (Both)'),
                        desc: t(
                          'Potpuna zdravstvena zaštita u javnom i privatnom sustavu.',
                          'Complete public copay and private specialist protection.'
                        ),
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setHealthData({ ...healthData, planTier: opt.id })}
                      className={`w-full text-left p-4 rounded-editorial border ${
                        healthData.planTier === opt.id
                          ? 'border-accent bg-accent-soft'
                          : 'border-hairline hover:border-ink'
                      }`}
                    >
                      <div className="text-sm font-semibold text-ink">{opt.title}</div>
                      <div className="text-xs text-ink-secondary mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedLine === 'zdravstveno' && stepIndex === 2 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Dob osiguranika i broj članova', 'Insured age & family members')}
                </h1>
                <div className="space-y-2 rounded-editorial bg-canvas-warm border border-hairline p-5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{t('Starost nositelja police', 'Primary holder age')}</span>
                    <span className="text-accent tabular-nums">
                      {healthData.age} {t('god.', 'yrs')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={75}
                    value={healthData.age}
                    onChange={(e) => setHealthData({ ...healthData, age: Number(e.target.value) })}
                    className="editorial-slider"
                  />
                </div>
                <Input
                  label={t('Broj osiguranih osoba (obiteljski popust za 2+)', 'Number of insured persons (family discount 2+)')}
                  type="number"
                  min={1}
                  max={10}
                  tabular
                  value={healthData.familyMembers}
                  onChange={(e) =>
                    setHealthData({ ...healthData, familyMembers: Math.max(1, Number(e.target.value) || 1) })
                  }
                />
              </div>
            ) : null}

            {selectedLine === 'zdravstveno' && stepIndex === 3 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t(
                    'Želite li dodatno uključiti B-listu lijekova i MR/CT dijagnostiku?',
                    'Include B-list prescriptions and private MRI/CT diagnostics?'
                  )}
                </h1>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {t('Pokriće B-liste lijekova', 'HZZO B-list prescription drugs')}
                      </div>
                      <div className="text-xs text-ink-secondary">
                        {t('Bez nadoplate u ljekarni za dopunsku listu', 'No pharmacy copayments on supplemental drugs')}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={healthData.includeBListDrugs}
                      onChange={(e) =>
                        setHealthData({ ...healthData, includeBListDrugs: e.target.checked })
                      }
                      className="w-5 h-5 accent-accent"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {t('Brza dijagnostika (MR, CT, UZV)', 'Fast private diagnostics (MRI, CT, Ultrasound)')}
                      </div>
                      <div className="text-xs text-ink-secondary">
                        {t('Termini u 300+ privatnih poliklinika u RH', 'Appointments across 300+ private Croatian clinics')}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={healthData.includeDiagnostics}
                      onChange={(e) =>
                        setHealthData({ ...healthData, includeDiagnostics: e.target.checked })
                      }
                      className="w-5 h-5 accent-accent"
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {/* ZIVOTNO FLOW */}
            {selectedLine === 'zivotno' && stepIndex === 1 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Koliku osiguranu svotu želite ugovoriti?', 'Choose your life coverage amount')}
                </h1>
                <div className="space-y-2 rounded-editorial bg-canvas-warm border border-hairline p-5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{t('Osigurana svota', 'Sum insured')}</span>
                    <span className="text-accent tabular-nums">{formatEurWhole(lifeData.sumInsured)}</span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={300000}
                    step={10000}
                    value={lifeData.sumInsured}
                    onChange={(e) => setLifeData({ ...lifeData, sumInsured: Number(e.target.value) })}
                    className="editorial-slider"
                  />
                </div>
              </div>
            ) : null}

            {selectedLine === 'zivotno' && stepIndex === 2 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Vaša dob i trajanje police', 'Your age and policy term')}
                </h1>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('Dob (godine)', 'Age (years)')}
                    type="number"
                    min={18}
                    max={65}
                    tabular
                    value={lifeData.age}
                    onChange={(e) => setLifeData({ ...lifeData, age: Number(e.target.value) || 35 })}
                  />
                  <Input
                    label={t('Trajanje ugovora (god.)', 'Policy term (years)')}
                    type="number"
                    min={5}
                    max={35}
                    tabular
                    value={lifeData.termYears}
                    onChange={(e) => setLifeData({ ...lifeData, termYears: Number(e.target.value) || 15 })}
                  />
                </div>
              </div>
            ) : null}

            {selectedLine === 'zivotno' && stepIndex === 3 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Dodatna pokrića i status pušača', 'Riders & smoking status')}
                </h1>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <span className="text-sm font-semibold text-ink">
                      {t('Uključi pokriće 20+ teških bolesti', 'Include 20+ critical illnesses rider')}
                    </span>
                    <input
                      type="checkbox"
                      checked={lifeData.includeCriticalIllness}
                      onChange={(e) =>
                        setLifeData({ ...lifeData, includeCriticalIllness: e.target.checked })
                      }
                      className="w-5 h-5 accent-accent"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <span className="text-sm font-semibold text-ink">
                      {t('Pušač (cigarete / duhanski proizvodi)', 'Smoker (cigarettes / tobacco)')}
                    </span>
                    <input
                      type="checkbox"
                      checked={lifeData.smoker}
                      onChange={(e) => setLifeData({ ...lifeData, smoker: e.target.checked })}
                      className="w-5 h-5 accent-accent"
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {/* PUTNO FLOW */}
            {selectedLine === 'putno' && stepIndex === 1 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Kamo putujete?', 'Where are you traveling?')}
                </h1>
                <div className="space-y-3">
                  {(
                    [
                      {
                        id: 'eu',
                        title: t('Europa i Mediteran', 'Europe & Mediterranean'),
                        desc: t('Limit medicinskih troškova 50.000 €', '€50,000 emergency medical limit'),
                      },
                      {
                        id: 'world_excl_us',
                        title: t('Svijet (bez SAD-a i Kanade)', 'Worldwide (excl. US & Canada)'),
                        desc: t('Limit 100.000 €', '€100,000 medical limit'),
                      },
                      {
                        id: 'world_incl_us',
                        title: t('Cijeli svijet (uklj. SAD i Kanadu)', 'Worldwide (incl. US & Canada)'),
                        desc: t('Visoko pokriće bolničkog liječenja', 'High inpatient hospital protection'),
                      },
                    ] as const
                  ).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setTravelData({ ...travelData, destination: d.id })}
                      className={`w-full text-left p-4 rounded-editorial border ${
                        travelData.destination === d.id
                          ? 'border-accent bg-accent-soft'
                          : 'border-hairline hover:border-ink'
                      }`}
                    >
                      <div className="text-sm font-semibold text-ink">{d.title}</div>
                      <div className="text-xs text-ink-secondary">{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedLine === 'putno' && stepIndex === 2 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Koliko dana i koliko putnika?', 'Trip duration and travelers')}
                </h1>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('Trajanje (dana)', 'Duration (days)')}
                    type="number"
                    min={1}
                    max={180}
                    tabular
                    value={travelData.days}
                    onChange={(e) => setTravelData({ ...travelData, days: Math.max(1, Number(e.target.value) || 1) })}
                  />
                  <Input
                    label={t('Broj putnika', 'Number of travelers')}
                    type="number"
                    min={1}
                    max={20}
                    tabular
                    value={travelData.travelers}
                    onChange={(e) =>
                      setTravelData({ ...travelData, travelers: Math.max(1, Number(e.target.value) || 1) })
                    }
                  />
                </div>
              </div>
            ) : null}

            {selectedLine === 'putno' && stepIndex === 3 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Dodatna putna pokrića', 'Optional travel add-ons')}
                </h1>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <span className="text-sm font-semibold text-ink">
                      {t('Osiguranje od otkaza putovanja', 'Trip cancellation protection')}
                    </span>
                    <input
                      type="checkbox"
                      checked={travelData.includeCancellation}
                      onChange={(e) =>
                        setTravelData({ ...travelData, includeCancellation: e.target.checked })
                      }
                      className="w-5 h-5 accent-accent"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <span className="text-sm font-semibold text-ink">
                      {t('Skijanje i zimski sportovi', 'Skiing & winter sports')}
                    </span>
                    <input
                      type="checkbox"
                      checked={travelData.includeWinterSports}
                      onChange={(e) =>
                        setTravelData({ ...travelData, includeWinterSports: e.target.checked })
                      }
                      className="w-5 h-5 accent-accent"
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {/* LJUBIMCI FLOW */}
            {selectedLine === 'ljubimci' && stepIndex === 1 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Kojeg ljubimca osiguravate?', 'Which pet are you insuring?')}
                </h1>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: 'dog', label: t('Pas', 'Dog') },
                      { id: 'cat', label: t('Mačka', 'Cat') },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPetData({ ...petData, petType: opt.id })}
                      className={`p-5 rounded-editorial border text-sm font-semibold ${
                        petData.petType === opt.id
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-hairline hover:border-ink text-ink-secondary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedLine === 'ljubimci' && stepIndex === 2 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Dob i veličina ljubimca', 'Pet age and size')}
                </h1>
                <Input
                  label={t('Starost (u godinama)', 'Age (years)')}
                  type="number"
                  min={0}
                  max={18}
                  tabular
                  value={petData.petAgeYears}
                  onChange={(e) => setPetData({ ...petData, petAgeYears: Math.max(0, Number(e.target.value) || 0) })}
                />
                <div className="grid grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'small', label: t('Mali (< 10 kg)', 'Small (< 10 kg)') },
                      { id: 'medium', label: t('Srednji (10-25 kg)', 'Medium (10–25 kg)') },
                      { id: 'large', label: t('Veliki (> 25 kg)', 'Large (> 25 kg)') },
                    ] as const
                  ).map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setPetData({ ...petData, breedSize: sz.id })}
                      className={`p-3 rounded-lg border text-xs font-semibold ${
                        petData.breedSize === sz.id
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-hairline text-ink-secondary'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedLine === 'ljubimci' && stepIndex === 3 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Odgovornost vlasnika prema trećima?', 'Include third-party owner liability?')}
                </h1>
                <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {t('Pokriće odgovornosti do 30.000 €', 'Liability cover up to €30,000')}
                    </div>
                    <div className="text-xs text-ink-secondary">
                      {t(
                        'Šteta koju ljubimac nenamjerno počini drugim osobama ili imovini',
                        'Accidental damage caused by your pet to third parties'
                      )}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={petData.includeLiability}
                    onChange={(e) => setPetData({ ...petData, includeLiability: e.target.checked })}
                    className="w-5 h-5 accent-accent"
                  />
                </label>
              </div>
            ) : null}

            {/* POSLOVNO (SME) FLOW */}
            {selectedLine === 'poslovno' && stepIndex === 1 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Pravni oblik vašeg poslovanja', 'Your business legal form')}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'obrt', label: t('Obrt / Paušalni', 'Sole Trade (Obrt)') },
                      { id: 'doo', label: 'd.o.o. / j.d.o.o.' },
                      { id: 'slobodna_djelatnost', label: t('Slobodna djelatnost', 'Independent Practice') },
                    ] as const
                  ).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setBusinessData({ ...businessData, companyType: c.id })}
                      className={`p-4 rounded-editorial border text-sm font-semibold ${
                        businessData.companyType === c.id
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-hairline text-ink-secondary'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedLine === 'poslovno' && stepIndex === 2 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Broj zaposlenih i godišnji prihod', 'Headcount and annual revenue')}
                </h1>
                <Input
                  label={t('Broj zaposlenih', 'Number of employees')}
                  type="number"
                  min={1}
                  max={500}
                  tabular
                  value={businessData.employees}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, employees: Math.max(1, Number(e.target.value) || 1) })
                  }
                />
                <div className="grid grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'under_100k', label: t('Do 100.000 €', 'Under €100k') },
                      { id: '100k_500k', label: '100k – 500k €' },
                      { id: 'over_500k', label: t('Preko 500k €', 'Over €500k') },
                    ] as const
                  ).map((rev) => (
                    <button
                      key={rev.id}
                      type="button"
                      onClick={() => setBusinessData({ ...businessData, annualRevenueBand: rev.id })}
                      className={`p-3 rounded-lg border text-xs font-semibold tabular-nums ${
                        businessData.annualRevenueBand === rev.id
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-hairline text-ink-secondary'
                      }`}
                    >
                      {rev.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedLine === 'poslovno' && stepIndex === 3 ? (
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {t('Dodatna poslovna pokrića', 'Optional business coverages')}
                </h1>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {t('Profesionalna odgovornost', 'Professional Indemnity')}
                      </div>
                      <div className="text-xs text-ink-secondary">
                        {t('Zaštita od financijskih potraživanja klijenata', 'Errors & omissions protection against client claims')}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={businessData.includeProfessionalLiability}
                      onChange={(e) =>
                        setBusinessData({ ...businessData, includeProfessionalLiability: e.target.checked })
                      }
                      className="w-5 h-5 accent-accent"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {t('Cyber & GDPR zaštita', 'Cyber & GDPR Protection')}
                      </div>
                      <div className="text-xs text-ink-secondary">
                        {t('Ransomware oporavak i incident response', 'Ransomware recovery and incident response')}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={businessData.includeCyber}
                      onChange={(e) =>
                        setBusinessData({ ...businessData, includeCyber: e.target.checked })
                      }
                      className="w-5 h-5 accent-accent"
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {stepError && !(selectedLine === 'auto' && stepIndex === 1) ? (
              <p role="alert" className="text-xs font-medium text-status-danger">
                {stepError}
              </p>
            ) : null}

            {/* Step Footer Controls — Native Submit Button for Reliable Enter-Key Submission */}
            <div className="pt-4 flex items-center justify-between gap-4 border-t border-hairline">
              <Button type="button" variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                <span>{t('Natrag', 'Back')}</span>
              </Button>
              <Button type="submit" size="lg">
                <span>
                  {stepIndex === totalSteps
                    ? t('Prikaži ponude osiguratelja', 'Compare 7 Insurers')
                    : t('Nastavi', 'Continue')}
                </span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Button>
            </div>
          </form>
        ) : null}

        {/* MAGIC MOMENT: INTERACTIVE MULTI-CARRIER RESULTS & LINE-AWARE CUSTOMIZER */}
        {showResults && selectedLine && activeMeta ? (
          <div className="max-w-6xl mx-auto space-y-8 animate-step">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">
                    {t('Informativna usporedba agencije', 'Agency Multi-Carrier Comparison')}
                  </Badge>
                  {offers[0] && offers[0].bundleDiscountPercent > 0 ? (
                    <Badge variant="accent">
                      {t(
                        `Paketni popust -${offers[0].bundleDiscountPercent}% aktivan`,
                        `Bundle discount -${offers[0].bundleDiscountPercent}% active`
                      )}
                    </Badge>
                  ) : null}
                </div>
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {activeProductLabel} — {t('usporedba 7 osiguratelja', '7 Croatian insurers compared')}
                </h1>
                <p className="text-sm text-ink-secondary">
                  {t(
                    'Prilagodite pokriće i dodatke uživo. Sve cijene osvježavaju se odmah.',
                    'Customize coverage and add-ons live. Every price updates instantaneously.'
                  )}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                <span>{t('Uredi podatke', 'Edit inputs')}</span>
              </Button>
            </div>

            {/* Combined Bundle Summary Strip when 2+ lines active */}
            {bundleSummary ? (
              <div className="rounded-editorial bg-emerald-50 border border-emerald-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="space-y-0.5">
                  <div className="font-semibold text-ink">
                    {t(
                      `Kombinirani paket (${bundleProducts.length} police) s -${bundleSummary.discountPct}% popusta`,
                      `Combined ${bundleProducts.length}-policy bundle with -${bundleSummary.discountPct}% discount`
                    )}
                  </div>
                  <div className="text-ink-secondary">
                    {t(
                      `Uključuje ${activeProductLabel} + orientacijski za: ${bundleSummary.secondaryLines.map((l) => PRODUCT_MAP[l].nameHr).join(', ')}`,
                      `Includes ${activeProductLabel} + estimated for: ${bundleSummary.secondaryLines.map((l) => PRODUCT_MAP[l].nameEn).join(', ')}`
                    )}
                  </div>
                </div>
                <div className="sm:text-right tabular-nums shrink-0">
                  <div className="text-base font-bold text-ink">
                    ~{formatEur(bundleSummary.combinedAnnual)} {copy.units.perYearShort}
                  </div>
                  <div className="text-xs font-semibold text-status-success">
                    {t('Procijenjena ušteda:', 'Est. savings:')} {formatEur(bundleSummary.combinedSavings)}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Interactive Line-Aware Live Customizer Bar */}
            <section
              aria-label={t('Prilagodba pokrića uživo', 'Live coverage customizer')}
              className="rounded-editorial bg-canvas-warm border border-hairline p-5 sm:p-6 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <SlidersHorizontal className="w-4 h-4 text-accent" strokeWidth={1.75} />
                  <span>{t('Prilagodi pokriće uživo', 'Customize coverage live')}</span>
                </div>

                {/* Billing Cycle Switch — Hidden for Single-Trip Travel Insurance */}
                {!isTravel ? (
                  <div className="inline-flex rounded-lg border border-hairline bg-canvas p-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomization((prev) => ({ ...prev, billingCycle: 'monthly' }))
                      }
                      className={`px-3 py-1.5 rounded-md transition-colors ${
                        customization.billingCycle === 'monthly'
                          ? 'bg-ink text-white'
                          : 'text-ink-secondary hover:text-ink'
                      }`}
                    >
                      {t('Mjesečno', 'Monthly')}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomization((prev) => ({ ...prev, billingCycle: 'annual' }))
                      }
                      className={`px-3 py-1.5 rounded-md transition-colors ${
                        customization.billingCycle === 'annual'
                          ? 'bg-ink text-white'
                          : 'text-ink-secondary hover:text-ink'
                      }`}
                    >
                      {t('Godišnje (-3%)', 'Annual (-3%)')}
                    </button>
                  </div>
                ) : (
                  <Badge variant="neutral">
                    {t(
                      `Jednokratno putovanje: ${travelData.days} dana • ${travelData.travelers} putnik(a)`,
                      `Single trip: ${travelData.days} days • ${travelData.travelers} traveler(s)`
                    )}
                  </Badge>
                )}
              </div>

              <div className={`grid grid-cols-1 ${deductibleApplicable ? 'md:grid-cols-2' : ''} gap-6`}>
                {/* Deductible Selector ONLY shown when deductible materially affects price */}
                {deductibleApplicable ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-ink-secondary">
                        {t('Franšiza (sudjelovanje u šteti)', 'Deductible (out-of-pocket)')}
                      </span>
                      <span className="text-ink tabular-nums">
                        {formatEurWhole(customization.deductible)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {([0, 150, 300, 500] as const).map((ded) => (
                        <button
                          key={ded}
                          type="button"
                          aria-pressed={customization.deductible === ded}
                          onClick={() =>
                            setCustomization((prev) => ({ ...prev, deductible: ded }))
                          }
                          className={`py-2 rounded-lg border text-xs font-semibold tabular-nums transition-colors ${
                            customization.deductible === ded
                              ? 'border-accent bg-accent text-white'
                              : 'border-hairline bg-canvas text-ink hover:border-ink'
                          }`}
                        >
                          {ded} €
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Coverage Limit Multiplier Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-ink-secondary">
                      {t('Razina pokrića / svota', 'Coverage limit tier')}
                    </span>
                    <span className="text-accent tabular-nums">
                      {Math.round(customization.coverageMultiplier * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={1}
                    aria-label={t('Razina pokrića', 'Coverage tier')}
                    value={([0.85, 1, 1.25, 1.5] as const).indexOf(customization.coverageMultiplier)}
                    onChange={(e) => {
                      const steps = [0.85, 1, 1.25, 1.5] as const;
                      const picked = steps[Number(e.target.value)] ?? 1;
                      setCustomization((prev) => ({ ...prev, coverageMultiplier: picked }));
                    }}
                    className="editorial-slider mt-2"
                  />
                  <div className="flex justify-between text-[11px] text-ink-muted">
                    <span>{t('Osnovno', 'Essential')}</span>
                    <span>{t('Optimalno', 'Optimal')}</span>
                    <span>{t('Prošireno', 'Extended')}</span>
                    <span>{t('Maksimalno', 'Maximum')}</span>
                  </div>
                </div>
              </div>

              {/* Line-Specific Live Add-On Toggles — Every visible pill genuinely recalculates price */}
              <div className="pt-3 border-t border-hairline flex flex-wrap gap-2">
                {selectedLine === 'auto'
                  ? (
                      [
                        { key: 'glass', label: t('Lom stakala', 'Glass breakage') },
                        { key: 'hail', label: t('Tuča i oluja', 'Hail & storm') },
                        { key: 'animals', label: t('Nalet na divljač', 'Wildlife collision') },
                        { key: 'roadside', label: t('Asistencija 24/7', '24/7 Roadside assist') },
                      ] as const
                    ).map((addon) => {
                      const active = customization.addons[addon.key];
                      return (
                        <button
                          key={addon.key}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            setCustomization((prev) => ({
                              ...prev,
                              addons: { ...prev.addons, [addon.key]: !prev.addons[addon.key] },
                            }))
                          }
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border text-xs font-semibold transition-colors ${
                            active
                              ? 'border-ink bg-ink text-white'
                              : 'border-hairline-strong bg-canvas text-ink-secondary hover:border-ink'
                          }`}
                        >
                          {active ? <Check className="w-3.5 h-3.5" strokeWidth={2.25} /> : null}
                          <span>{addon.label}</span>
                        </button>
                      );
                    })
                  : null}

                {selectedLine === 'imovina'
                  ? (
                      [
                        {
                          key: 'includeEarthquake',
                          label: t('Pokriće od potresa', 'Earthquake cover'),
                          active: propertyData.includeEarthquake,
                        },
                        {
                          key: 'includeFlood',
                          label: t('Poplava i bujice', 'Flood & flash floods'),
                          active: propertyData.includeFlood,
                        },
                        {
                          key: 'includeBurglary',
                          label: t('Provalna krađa', 'Burglary protection'),
                          active: propertyData.includeBurglary,
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        aria-pressed={opt.active}
                        onClick={() =>
                          setPropertyData((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))
                        }
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border text-xs font-semibold transition-colors ${
                          opt.active
                            ? 'border-ink bg-ink text-white'
                            : 'border-hairline-strong bg-canvas text-ink-secondary hover:border-ink'
                        }`}
                      >
                        {opt.active ? <Check className="w-3.5 h-3.5" strokeWidth={2.25} /> : null}
                        <span>{opt.label}</span>
                      </button>
                    ))
                  : null}

                {selectedLine === 'zdravstveno'
                  ? (
                      [
                        {
                          key: 'includeBListDrugs',
                          label: t('B-lista lijekova', 'B-list drugs'),
                          active: healthData.includeBListDrugs,
                        },
                        {
                          key: 'includeDiagnostics',
                          label: t('MR / CT dijagnostika', 'MRI / CT diagnostics'),
                          active: healthData.includeDiagnostics,
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        aria-pressed={opt.active}
                        onClick={() =>
                          setHealthData((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))
                        }
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border text-xs font-semibold transition-colors ${
                          opt.active
                            ? 'border-ink bg-ink text-white'
                            : 'border-hairline-strong bg-canvas text-ink-secondary hover:border-ink'
                        }`}
                      >
                        {opt.active ? <Check className="w-3.5 h-3.5" strokeWidth={2.25} /> : null}
                        <span>{opt.label}</span>
                      </button>
                    ))
                  : null}

                {selectedLine === 'zivotno' ? (
                  <button
                    type="button"
                    aria-pressed={lifeData.includeCriticalIllness}
                    onClick={() =>
                      setLifeData((prev) => ({
                        ...prev,
                        includeCriticalIllness: !prev.includeCriticalIllness,
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border text-xs font-semibold transition-colors ${
                      lifeData.includeCriticalIllness
                        ? 'border-ink bg-ink text-white'
                        : 'border-hairline-strong bg-canvas text-ink-secondary hover:border-ink'
                    }`}
                  >
                    {lifeData.includeCriticalIllness ? (
                      <Check className="w-3.5 h-3.5" strokeWidth={2.25} />
                    ) : null}
                    <span>{t('20+ teških bolesti', '20+ critical illnesses')}</span>
                  </button>
                ) : null}

                {selectedLine === 'putno'
                  ? (
                      [
                        {
                          key: 'includeCancellation',
                          label: t('Otkaz putovanja', 'Trip cancellation'),
                          active: travelData.includeCancellation,
                        },
                        {
                          key: 'includeWinterSports',
                          label: t('Zimski sportovi', 'Winter sports'),
                          active: travelData.includeWinterSports,
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        aria-pressed={opt.active}
                        onClick={() =>
                          setTravelData((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))
                        }
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border text-xs font-semibold transition-colors ${
                          opt.active
                            ? 'border-ink bg-ink text-white'
                            : 'border-hairline-strong bg-canvas text-ink-secondary hover:border-ink'
                        }`}
                      >
                        {opt.active ? <Check className="w-3.5 h-3.5" strokeWidth={2.25} /> : null}
                        <span>{opt.label}</span>
                      </button>
                    ))
                  : null}

                {selectedLine === 'ljubimci' ? (
                  <button
                    type="button"
                    aria-pressed={petData.includeLiability}
                    onClick={() =>
                      setPetData((prev) => ({ ...prev, includeLiability: !prev.includeLiability }))
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border text-xs font-semibold transition-colors ${
                      petData.includeLiability
                        ? 'border-ink bg-ink text-white'
                        : 'border-hairline-strong bg-canvas text-ink-secondary hover:border-ink'
                    }`}
                  >
                    {petData.includeLiability ? (
                      <Check className="w-3.5 h-3.5" strokeWidth={2.25} />
                    ) : null}
                    <span>{t('Odgovornost vlasnika (30.000 €)', 'Owner liability (€30,000)')}</span>
                  </button>
                ) : null}

                {selectedLine === 'poslovno'
                  ? (
                      [
                        {
                          key: 'includeProfessionalLiability',
                          label: t('Profesionalna odgovornost', 'Professional indemnity'),
                          active: businessData.includeProfessionalLiability,
                        },
                        {
                          key: 'includeCyber',
                          label: t('Cyber & GDPR zaštita', 'Cyber & GDPR'),
                          active: businessData.includeCyber,
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        aria-pressed={opt.active}
                        onClick={() =>
                          setBusinessData((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))
                        }
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border text-xs font-semibold transition-colors ${
                          opt.active
                            ? 'border-ink bg-ink text-white'
                            : 'border-hairline-strong bg-canvas text-ink-secondary hover:border-ink'
                        }`}
                      >
                        {opt.active ? <Check className="w-3.5 h-3.5" strokeWidth={2.25} /> : null}
                        <span>{opt.label}</span>
                      </button>
                    ))
                  : null}
              </div>
            </section>

            {/* Side-by-Side Carrier Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offers.map((offer) => {
                const displayPrice = isTravel
                  ? offer.annualPrice
                  : customization.billingCycle === 'monthly'
                    ? offer.monthlyPrice
                    : offer.annualPrice;
                const priceUnit = isTravel
                  ? copy.units.perTripShort
                  : customization.billingCycle === 'monthly'
                    ? copy.units.perMonthShort
                    : copy.units.perYearShort;
                const perDayTravel = isTravel
                  ? formatEur(offer.annualPrice / Math.max(1, travelData.days))
                  : null;
                const subPrice = isTravel
                  ? `${perDayTravel} ${copy.units.perDayShort} • ${travelData.travelers} ${t('putnik(a)', 'traveler(s)')}`
                  : customization.billingCycle === 'monthly'
                    ? `${formatEur(offer.annualPrice)} ${copy.units.perYearShort}`
                    : `${formatEur(offer.monthlyPrice)} ${copy.units.perMonthShort}`;

                return (
                  <article
                    key={offer.carrierId}
                    className={`rounded-editorial bg-canvas border p-6 flex flex-col justify-between space-y-5 transition-shadow hover:shadow-card ${
                      offer.highlightBadge ? 'border-ink' : 'border-hairline'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="font-sans text-lg font-bold text-ink">
                            {offer.carrierShortName}
                          </h2>
                          <p className="text-xs text-ink-muted">
                            {offer.tierLabel} • {offer.rating}
                          </p>
                        </div>
                        {offer.highlightBadge ? (
                          <Badge variant="accent">{offer.highlightBadge}</Badge>
                        ) : null}
                      </div>

                      <div className="py-3 border-y border-hairline tabular-nums">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-bold text-ink">
                            {formatEur(displayPrice)}
                          </span>
                          <span className="text-xs font-medium text-ink-muted">{priceUnit}</span>
                        </div>
                        <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between gap-2">
                          <span>{subPrice}</span>
                          {deductibleApplicable ? (
                            <span>
                              {t('Franšiza', 'Deductible')} {formatEurWhole(offer.deductible)}
                            </span>
                          ) : (
                            <span>
                              {t('Limit', 'Limit')} {formatEurWhole(offer.coverageLimit)}
                            </span>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs text-ink-secondary">
                        {offer.coveredItems.slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <Check
                              className="w-3.5 h-3.5 text-status-success shrink-0 mt-0.5"
                              strokeWidth={2.25}
                            />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Button fullWidth onClick={() => setCheckoutOffer(offer)}>
                        {t('Odaberi ponudu', 'Select Offer')}
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDrawerOffer(offer)}
                          className="inline-flex items-center justify-center gap-1 py-2 rounded-lg border border-hairline text-xs font-semibold text-ink hover:bg-canvas-warm transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>{t('Što pokriva?', 'Coverage')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void downloadIpidPdf(offer, activeProductLabel)}
                          className="inline-flex items-center justify-center gap-1 py-2 rounded-lg border border-hairline text-xs font-semibold text-ink hover:bg-canvas-warm transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>IPID PDF</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}
      </main>

      {/* Policy 2.0 Coverage Drawer */}
      <CoverageDrawer
        offer={drawerOffer}
        productLine={selectedLine ?? 'auto'}
        productLabel={activeProductLabel}
        onClose={() => setDrawerOffer(null)}
        onSelectOffer={(offer) => setCheckoutOffer(offer)}
      />

      {/* OIB + GDPR Binding Request Modal */}
      <QuoteCheckoutModal
        offer={checkoutOffer}
        productLine={selectedLine ?? 'auto'}
        productLabel={activeProductLabel}
        bundleProducts={bundleProducts}
        inputs={activeInput}
        customization={customization}
        onClose={() => setCheckoutOffer(null)}
      />
    </div>
  );
};
