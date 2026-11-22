import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
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
  DEFAULT_CUSTOMIZATION,
  generateCarrierOffers,
} from '../utils/pricingEngine';
import { BrandWordmark, ProductIllustration } from '../components/illustrations/EditorialIllustrations';
import { CoverageDrawer } from '../components/quote/CoverageDrawer';
import { QuoteCheckoutModal } from '../components/quote/QuoteCheckoutModal';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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

export const QuoteEnginePage: React.FC = () => {
  const { product: paramProduct } = useParams<{ product?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialProduct = parseProductLine(paramProduct);
  const initialBundle = useMemo<ProductLine[]>(() => {
    const raw = searchParams.get('bundle');
    if (!raw) return initialProduct ? [initialProduct] : [];
    const parsed = raw
      .split(',')
      .map((s) => parseProductLine(s.trim()))
      .filter((x): x is ProductLine => x !== null);
    return parsed.length > 0 ? parsed : initialProduct ? [initialProduct] : [];
  }, [searchParams, initialProduct]);

  const [selectedLine, setSelectedLine] = useState<ProductLine | null>(initialProduct);
  const [bundleProducts, setBundleProducts] = useState<ProductLine[]>(initialBundle);
  const [stepIndex, setStepIndex] = useState<number>(initialProduct ? 1 : 0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [stepError, setStepError] = useState<string>('');

  useEffect(() => {
    const parsed = parseProductLine(paramProduct);
    setSelectedLine(parsed);
    setBundleProducts(initialBundle);
    setStepIndex(parsed ? 1 : 0);
    setShowResults(false);
    setStepError('');
  }, [paramProduct, initialBundle]);

  // Line-specific states
  const [autoData, setAutoData] = useState<AutoQuoteInput>({
    productLine: 'auto',
    plateNumber: 'ZG-1234-AB',
    make: 'Volkswagen',
    model: 'Golf VIII',
    year: 2022,
    kw: 96,
    bonusPercent: 50,
    youngDriver: false,
    annualMileage: '10k_20k',
    kaskoTier: 'full_kasko',
  });

  const [propertyData, setPropertyData] = useState<PropertyQuoteInput>({
    productLine: 'imovina',
    city: 'Zagreb',
    postalCode: '10000',
    propertyType: 'stan',
    areaSqm: 70,
    coverageScope: 'both',
    includeEarthquake: true,
    includeFlood: false,
    includeBurglary: true,
  });

  const [healthData, setHealthData] = useState<HealthQuoteInput>({
    productLine: 'zdravstveno',
    age: 34,
    planTier: 'kombinirano',
    includeBListDrugs: true,
    includeDiagnostics: true,
    familyMembers: 1,
  });

  const [lifeData, setLifeData] = useState<LifeQuoteInput>({
    productLine: 'zivotno',
    age: 36,
    smoker: false,
    sumInsured: 80000,
    termYears: 20,
    includeCriticalIllness: true,
  });

  const [travelData, setTravelData] = useState<TravelQuoteInput>({
    productLine: 'putno',
    destination: 'eu',
    days: 7,
    travelers: 2,
    includeWinterSports: false,
    includeCancellation: true,
  });

  const [petData, setPetData] = useState<PetQuoteInput>({
    productLine: 'ljubimci',
    petType: 'dog',
    petAgeYears: 3,
    breedSize: 'medium',
    includeLiability: true,
  });

  const [businessData, setBusinessData] = useState<BusinessQuoteInput>({
    productLine: 'poslovno',
    companyType: 'doo',
    employees: 5,
    annualRevenueBand: '100k_500k',
    includeProfessionalLiability: true,
    includeCyber: true,
  });

  // Live customization state on Results screen
  const [customization, setCustomization] = useState<CoverageCustomization>(DEFAULT_CUSTOMIZATION);
  const [drawerOffer, setDrawerOffer] = useState<CarrierOffer | null>(null);
  const [checkoutOffer, setCheckoutOffer] = useState<CarrierOffer | null>(null);

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

  const offers = useMemo(() => {
    if (!showResults || !selectedLine) return [];
    return generateCarrierOffers(activeInput, customization, bundleProducts);
  }, [showResults, selectedLine, activeInput, customization, bundleProducts]);

  const totalSteps = selectedLine ? TOTAL_STEPS_BY_LINE[selectedLine] : 4;
  const progressPercent = showResults
    ? 100
    : stepIndex === 0
      ? 12
      : Math.round((stepIndex / (totalSteps + 1)) * 100);

  const selectLineAndStart = (line: ProductLine) => {
    setSelectedLine(line);
    setBundleProducts((prev) => (prev.includes(line) ? prev : [line, ...prev]));
    setStepError('');
    setStepIndex(1);
    setShowResults(false);
  };

  const handleNext = () => {
    setStepError('');
    if (!selectedLine) return;

    // Step-level strict validation
    if (selectedLine === 'auto' && stepIndex === 1) {
      const normalized = normalizeCroatianPlate(autoData.plateNumber);
      if (!isValidCroatianPlate(normalized)) {
        setStepError('Unesite važeću hrvatsku registraciju (npr. ZG-1234-AB ili ST-999-A).');
        return;
      }
      setAutoData((prev) => ({ ...prev, plateNumber: normalized }));
    }

    if (selectedLine === 'imovina' && stepIndex === 1) {
      if (!propertyData.city.trim()) {
        setStepError('Unesite naziv grada ili mjesta.');
        return;
      }
      if (!isValidCroatianPostalCode(propertyData.postalCode)) {
        setStepError('Unesite ispravan hrvatski poštanski broj (10000 – 53296).');
        return;
      }
    }

    if (stepIndex < totalSteps) {
      setStepIndex((s) => s + 1);
    } else {
      // Sync earthquake customization with property input when entering results
      if (selectedLine === 'imovina') {
        setCustomization((prev) => ({
          ...prev,
          addons: { ...prev.addons, earthquake: propertyData.includeEarthquake },
        }));
      }
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

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Focused Distraction-Free Quote Header (Lemonade Pattern) */}
      <header className="sticky top-0 z-30 bg-canvas border-b border-hairline">
        <div className="max-w-5xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" aria-label="Povratak na naslovnu">
            <BrandWordmark />
          </Link>

          <div className="flex items-center gap-4 text-xs text-ink-muted tabular-nums">
            {activeMeta ? (
              <span className="hidden sm:inline font-medium text-ink">{activeMeta.nameHr}</span>
            ) : null}
            <span>
              {showResults
                ? 'Usporedba ponuda'
                : stepIndex === 0
                  ? 'Odabir osiguranja'
                  : `Korak ${stepIndex} od ${totalSteps}`}
            </span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-ink-secondary hover:text-ink font-medium"
            >
              Izlaz
            </button>
          </div>
        </div>
        {/* 2px Editorial Progress Bar */}
        <div className="h-[2px] w-full bg-hairline">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6">
        {/* STEP 0: Choose Product Line */}
        {!showResults && (stepIndex === 0 || !selectedLine) ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-step">
            <div className="text-center space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                90-sekundni izračun
              </p>
              <h1 className="font-display text-4xl sm:text-5xl text-ink">
                Što želite osigurati danas?
              </h1>
              <p className="text-sm sm:text-base text-ink-secondary">
                Odaberite vrstu osiguranja. Kontakt i OIB tražimo tek ako odaberete ponudu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
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
                      {item.nameHr}
                    </div>
                    <div className="text-xs text-ink-muted tabular-nums mt-0.5">
                      od {formatEurWhole(item.startingMonthlyEur)} / mj.
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* FLIPPED-FUNNEL QUESTIONS (1 Focused Question Per Screen) */}
        {!showResults && selectedLine && stepIndex >= 1 ? (
          <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto space-y-8 animate-step">
            {/* AUTO FLOW */}
            {selectedLine === 'auto' && stepIndex === 1 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Auto osiguranje • 1/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    Koja je registarska oznaka vašeg vozila?
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    Prema registracijskom području određujemo zonu rizika za obvezni AO.
                  </p>
                </div>
                <Input
                  label="Registarska oznaka"
                  placeholder="npr. ZG-1234-AB"
                  value={autoData.plateNumber}
                  onChange={(e) => setAutoData({ ...autoData, plateNumber: e.target.value.toUpperCase() })}
                  tabular
                  autoFocus
                  error={stepError || undefined}
                  helperText="Podržane su sve 34 hrvatske registracijske oznake (ZG, ST, RI, OS, ZD, PU...)."
                />
              </div>
            ) : null}

            {selectedLine === 'auto' && stepIndex === 2 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Auto osiguranje • 2/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    Recite nam osnovne podatke o vozilu
                  </h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Marka vozila"
                    value={autoData.make}
                    onChange={(e) => setAutoData({ ...autoData, make: e.target.value })}
                    required
                  />
                  <Input
                    label="Model"
                    value={autoData.model}
                    onChange={(e) => setAutoData({ ...autoData, model: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Godina proizvodnje"
                    type="number"
                    min={1990}
                    max={2027}
                    tabular
                    value={autoData.year}
                    onChange={(e) => setAutoData({ ...autoData, year: Number(e.target.value) || 2020 })}
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-ink">
                      <span>Snaga motora</span>
                      <span className="tabular-nums text-accent">
                        {autoData.kw} kW ({Math.round(autoData.kw * 1.36)} KS)
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
                    Auto osiguranje • 3/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    Koliki je vaš stečeni bonus i profil vozača?
                  </h1>
                </div>

                <div className="space-y-2 rounded-editorial bg-canvas-warm border border-hairline p-5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Stečeni bonus-malus</span>
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
                    <span>0% (novi vozač)</span>
                    <span>25%</span>
                    <span>50% (maks. bonus)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-ink">Procijenjena godišnja kilometraža</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(
                      [
                        { id: 'under_10k', label: 'Do 10.000 km' },
                        { id: '10k_20k', label: '10 – 20 tisuća' },
                        { id: 'over_20k', label: 'Preko 20.000 km' },
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
                    <div className="text-sm font-semibold text-ink">Mladi vozač (ispod 24 god.)</div>
                    <div className="text-xs text-ink-muted">
                      Uključuje pokriće i za mlađe vozače u kućanstvu
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
                    Auto osiguranje • 4/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    Koju razinu zaštite želite za {autoData.make} {autoData.model}?
                  </h1>
                </div>
                <div className="space-y-3">
                  {(
                    [
                      {
                        id: 'ao_only',
                        title: 'Samo obvezno osiguranje (AO)',
                        desc: 'Zakonska zaštita za štete prema trećim osobama + Zelena karta.',
                      },
                      {
                        id: 'mini_kasko',
                        title: 'AO + Mini Kasko',
                        desc: 'Dodatno štiti vozilo od krađe, požara, oluje i tuče.',
                      },
                      {
                        id: 'full_kasko',
                        title: 'AO + Puni Kasko',
                        desc: 'Potpuna zaštita i za vlastite štete u sudaru, krađu i vandalizam.',
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
                    Dom i imovina • 1/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    Gdje se nalazi vaša nekretnina?
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    Poštanski broj služi za izračun seizmičke i vremenske zone u Hrvatskoj.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Grad / mjesto"
                    value={propertyData.city}
                    onChange={(e) => setPropertyData({ ...propertyData, city: e.target.value })}
                    placeholder="Zagreb"
                    autoFocus
                  />
                  <Input
                    label="Poštanski broj"
                    value={propertyData.postalCode}
                    onChange={(e) => setPropertyData({ ...propertyData, postalCode: e.target.value })}
                    placeholder="10000"
                    maxLength={5}
                    tabular
                    error={stepError || undefined}
                  />
                </div>
              </div>
            ) : null}

            {selectedLine === 'imovina' && stepIndex === 2 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Dom i imovina • 2/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    Radi li se o stanu ili obiteljskoj kući?
                  </h1>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: 'stan', label: 'Stan u zgradi' },
                      { id: 'kuca', label: 'Obiteljska kuća' },
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
                    <span>Korisna stambena površina</span>
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
                    Dom i imovina • 3/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    Što želite pokriti policom?
                  </h1>
                </div>
                <div className="space-y-3">
                  {(
                    [
                      { id: 'both', title: 'Građevinski dio + Stvari kućanstva', desc: 'Preporučeno za vlasnike — pokriva zidove, instalacije i sav namještaj.' },
                      { id: 'building', title: 'Samo građevinski dio', desc: 'Idealno za vinkulaciju stambenog kredita.' },
                      { id: 'contents', title: 'Samo stvari kućanstva', desc: 'Najbolji odabir za najmoprimce.' },
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
                    Dom i imovina • 4/{totalSteps}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl text-ink">
                    Želite li dodati zaštitu od potresa i provale?
                  </h1>
                </div>
                <div className="space-y-3">
                  <label className="flex items-start justify-between gap-4 p-4 rounded-editorial border border-hairline cursor-pointer hover:border-ink/40">
                    <div>
                      <div className="text-sm font-semibold text-ink">Osiguranje od potresa</div>
                      <div className="text-xs text-ink-secondary mt-0.5">
                        Pokriće na punu građevinsku vrijednost bez podosiguranja (ključno za RH).
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
                      <div className="text-sm font-semibold text-ink">Poplava i bujice</div>
                      <div className="text-xs text-ink-secondary mt-0.5">
                        Štete od izlijevanja rijeka, bujica i podzemnih voda.
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
                      <div className="text-sm font-semibold text-ink">Provalna krađa i razbojništvo</div>
                      <div className="text-xs text-ink-secondary mt-0.5">
                        Pokriva otuđene stvari te popravak oštećenih brava i vrata.
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
                  Odaberite vrstu zdravstvenog osiguranja
                </h1>
                <div className="space-y-3">
                  {(
                    [
                      { id: 'dopunsko', title: 'Dopunsko zdravstveno', desc: 'Pokriva sve HZZO participacije od 9,50 €/mj. (umjesto 15,00 € kod HZZO-a).' },
                      { id: 'dodatno', title: 'Dodatno privatno zdravstveno', desc: 'Specijalistički pregledi, MR/CT i godišnji sistematski bez čekanja.' },
                      { id: 'kombinirano', title: 'Kombinirani paket (Dopunsko + Dodatno)', desc: 'Potpuna zdravstvena zaštita u javnom i privatnom sustavu.' },
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
                  Dob osiguranika i broj članova
                </h1>
                <div className="space-y-2 rounded-editorial bg-canvas-warm border border-hairline p-5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Starost nositelja police</span>
                    <span className="text-accent tabular-nums">{healthData.age} god.</span>
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
                  label="Broj osiguranih osoba (obiteljski popust za 2+)"
                  type="number"
                  min={1}
                  max={8}
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
                  Želite li dodatno uključiti B-listu lijekova i MR/CT dijagnostiku?
                </h1>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <div>
                      <div className="text-sm font-semibold text-ink">Pokriće B-liste lijekova</div>
                      <div className="text-xs text-ink-secondary">Bez nadoplate u ljekarni za dopunsku listu</div>
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
                      <div className="text-sm font-semibold text-ink">Brza dijagnostika (MR, CT, UZV)</div>
                      <div className="text-xs text-ink-secondary">Termini u 300+ privatnih poliklinika u RH</div>
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
                  Koliku osiguranu svotu želite ugovoriti?
                </h1>
                <div className="space-y-2 rounded-editorial bg-canvas-warm border border-hairline p-5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Osigurana svota</span>
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
                  Vaša dob i trajanje police
                </h1>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Dob (godine)"
                    type="number"
                    min={18}
                    max={65}
                    tabular
                    value={lifeData.age}
                    onChange={(e) => setLifeData({ ...lifeData, age: Number(e.target.value) || 35 })}
                  />
                  <Input
                    label="Trajanje ugovora (god.)"
                    type="number"
                    min={5}
                    max={30}
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
                  Dodatna pokrića i status pušača
                </h1>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <span className="text-sm font-semibold text-ink">Uključi pokriće 20+ teških bolesti</span>
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
                    <span className="text-sm font-semibold text-ink">Pušač (cigarete / duhanski proizvodi)</span>
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
                <h1 className="font-display text-3xl sm:text-5xl text-ink">Kamo putujete?</h1>
                <div className="space-y-3">
                  {(
                    [
                      { id: 'eu', title: 'Europa i Mediteran', desc: 'Limit medicinskih troškova 50.000 €' },
                      { id: 'world_excl_us', title: 'Svijet (bez SAD-a i Kanade)', desc: 'Limit 100.000 €' },
                      { id: 'world_incl_us', title: 'Cijeli svijet (uklj. SAD i Kanadu)', desc: 'Visoko pokriće bolničkog liječenja' },
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
                  Koliko dana i koliko putnika?
                </h1>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Trajanje (dana)"
                    type="number"
                    min={1}
                    max={90}
                    tabular
                    value={travelData.days}
                    onChange={(e) => setTravelData({ ...travelData, days: Math.max(1, Number(e.target.value) || 1) })}
                  />
                  <Input
                    label="Broj putnika"
                    type="number"
                    min={1}
                    max={12}
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
                  Dodatna putna pokrića
                </h1>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <span className="text-sm font-semibold text-ink">Osiguranje od otkaza putovanja</span>
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
                    <span className="text-sm font-semibold text-ink">Skijanje i zimski sportovi</span>
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
                  Kojeg ljubimca osiguravate?
                </h1>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: 'dog', label: 'Pas' },
                      { id: 'cat', label: 'Mačka' },
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
                  Dob i veličina ljubimca
                </h1>
                <Input
                  label="Starost (u godinama)"
                  type="number"
                  min={0}
                  max={14}
                  tabular
                  value={petData.petAgeYears}
                  onChange={(e) => setPetData({ ...petData, petAgeYears: Number(e.target.value) || 1 })}
                />
                <div className="grid grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'small', label: 'Mali (< 10 kg)' },
                      { id: 'medium', label: 'Srednji (10-25 kg)' },
                      { id: 'large', label: 'Veliki (> 25 kg)' },
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
                  Odgovornost vlasnika prema trećima?
                </h1>
                <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold text-ink">Pokriće odgovornosti do 30.000 €</div>
                    <div className="text-xs text-ink-secondary">
                      Šteta koju ljubimac nenamjerno počini drugim osobama ili imovini
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
                  Pravni oblik vašeg poslovanja
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'obrt', label: 'Obrt / Paušalni' },
                      { id: 'doo', label: 'd.o.o. / j.d.o.o.' },
                      { id: 'slobodna_djelatnost', label: 'Slobodna djelatnost' },
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
                  Broj zaposlenih i godišnji prihod
                </h1>
                <Input
                  label="Broj zaposlenih"
                  type="number"
                  min={1}
                  max={250}
                  tabular
                  value={businessData.employees}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, employees: Math.max(1, Number(e.target.value) || 1) })
                  }
                />
                <div className="grid grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'under_100k', label: 'Do 100.000 €' },
                      { id: '100k_500k', label: '100k – 500k €' },
                      { id: 'over_500k', label: 'Preko 500k €' },
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
                  Dodatna poslovna pokrića
                </h1>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <div>
                      <div className="text-sm font-semibold text-ink">Profesionalna odgovornost</div>
                      <div className="text-xs text-ink-secondary">Zaštita od financijskih potraživanja klijenata</div>
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
                      <div className="text-sm font-semibold text-ink">Cyber & GDPR zaštita</div>
                      <div className="text-xs text-ink-secondary">Ransomware oporavak i incident response</div>
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

            {/* Step Footer Controls */}
            <div className="pt-4 flex items-center justify-between gap-4 border-t border-hairline">
              <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true">
                Potvrdi
              </button>
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                <span>Natrag</span>
              </Button>
              <Button type="button" size="lg" onClick={handleNext}>
                <span>{stepIndex === totalSteps ? 'Prikaži ponude osiguratelja' : 'Nastavi'}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Button>
            </div>
          </form>
        ) : null}

        {/* MAGIC MOMENT: INTERACTIVE MULTI-CARRIER RESULTS & LIVE COVERAGE CUSTOMIZER */}
        {showResults && selectedLine && activeMeta ? (
          <div className="max-w-6xl mx-auto space-y-8 animate-step">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">Informativna usporedba agencije</Badge>
                  {offers[0] && offers[0].bundleDiscountPercent > 0 ? (
                    <Badge variant="accent">
                      Paketni popust -{offers[0].bundleDiscountPercent}% aktivan
                    </Badge>
                  ) : null}
                </div>
                <h1 className="font-display text-3xl sm:text-5xl text-ink">
                  {activeMeta.nameHr} — usporedba 7 osiguratelja
                </h1>
                <p className="text-sm text-ink-secondary">
                  Prilagodite franšizu, visinu pokrića i dodatke. Sve cijene osvježavaju se uživo.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                <span>Uredi podatke</span>
              </Button>
            </div>

            {/* Interactive Live Customizer Bar */}
            <section
              aria-label="Prilagodba pokrića uživo"
              className="rounded-editorial bg-canvas-warm border border-hairline p-5 sm:p-6 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <SlidersHorizontal className="w-4 h-4 text-accent" strokeWidth={1.75} />
                  <span>Prilagodi pokriće uživo</span>
                </div>

                {/* Billing Cycle Switch */}
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
                    Mjesečno
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
                    Godišnje (-3%)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Deductible Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-ink-secondary">Franšiza (sudjelovanje u šteti)</span>
                    <span className="text-ink tabular-nums">{formatEurWhole(customization.deductible)}</span>
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

                {/* Coverage Limit Multiplier Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-ink-secondary">Razina pokrića / svota</span>
                    <span className="text-accent tabular-nums">
                      {Math.round(customization.coverageMultiplier * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={1}
                    aria-label="Razina pokrića"
                    value={([0.85, 1, 1.25, 1.5] as const).indexOf(customization.coverageMultiplier)}
                    onChange={(e) => {
                      const steps = [0.85, 1, 1.25, 1.5] as const;
                      const picked = steps[Number(e.target.value)] ?? 1;
                      setCustomization((prev) => ({ ...prev, coverageMultiplier: picked }));
                    }}
                    className="editorial-slider mt-2"
                  />
                  <div className="flex justify-between text-[11px] text-ink-muted">
                    <span>Osnovno</span>
                    <span>Optimalno</span>
                    <span>Prošireno</span>
                    <span>Maksimalno</span>
                  </div>
                </div>
              </div>

              {/* Add-on Toggles */}
              {selectedLine === 'auto' ? (
                <div className="pt-3 border-t border-hairline flex flex-wrap gap-2">
                  {(
                    [
                      { key: 'glass', label: 'Lom stakala' },
                      { key: 'hail', label: 'Tuča i oluja' },
                      { key: 'animals', label: 'Nalet na divljač' },
                      { key: 'roadside', label: 'Asistencija 24/7' },
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
                  })}
                </div>
              ) : null}

              {selectedLine === 'imovina' ? (
                <div className="pt-3 border-t border-hairline flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-pressed={customization.addons.earthquake}
                    onClick={() => {
                      setCustomization((prev) => {
                        const nextEq = !prev.addons.earthquake;
                        setPropertyData((p) => ({ ...p, includeEarthquake: nextEq }));
                        return {
                          ...prev,
                          addons: { ...prev.addons, earthquake: nextEq },
                        };
                      });
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border text-xs font-semibold transition-colors ${
                      customization.addons.earthquake
                        ? 'border-ink bg-ink text-white'
                        : 'border-hairline-strong bg-canvas text-ink-secondary hover:border-ink'
                    }`}
                  >
                    {customization.addons.earthquake ? <Check className="w-3.5 h-3.5" strokeWidth={2.25} /> : null}
                    <span>Pokriće od potresa</span>
                  </button>
                </div>
              ) : null}
            </section>

            {/* Side-by-Side Carrier Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offers.map((offer) => {
                const displayPrice =
                  customization.billingCycle === 'monthly' ? offer.monthlyPrice : offer.annualPrice;
                const priceUnit = customization.billingCycle === 'monthly' ? '/ mj.' : '/ god.';
                const subPrice =
                  customization.billingCycle === 'monthly'
                    ? `${formatEur(offer.annualPrice)} godišnje`
                    : `${formatEur(offer.monthlyPrice)} mjesečno`;

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
                        <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between">
                          <span>{subPrice}</span>
                          <span>Franšiza {formatEurWhole(offer.deductible)}</span>
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
                        Odaberi ponudu
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDrawerOffer(offer)}
                          className="inline-flex items-center justify-center gap-1 py-2 rounded-lg border border-hairline text-xs font-semibold text-ink hover:bg-canvas-warm transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>Što pokriva?</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadIpidPdf(offer, activeMeta.nameHr)}
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
        productLabel={activeMeta?.nameHr ?? 'Osiguranje'}
        onClose={() => setDrawerOffer(null)}
        onSelectOffer={(offer) => setCheckoutOffer(offer)}
      />

      {/* OIB + GDPR Binding Request Modal */}
      <QuoteCheckoutModal
        offer={checkoutOffer}
        productLine={selectedLine ?? 'auto'}
        productLabel={activeMeta?.nameHr ?? 'Osiguranje'}
        bundleProducts={bundleProducts}
        inputs={activeInput}
        customization={customization}
        onClose={() => setCheckoutOffer(null)}
      />
    </div>
  );
};
