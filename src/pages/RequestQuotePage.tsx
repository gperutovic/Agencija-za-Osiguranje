import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Home,
  HeartPulse,
  Shield,
  Plane,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ArrowRight,
  Sparkles,
  Scale,
} from 'lucide-react';
import {
  validateOIB,
  validateVIN,
  formatEUR,
  normalizeOIBInput,
  normalizeVINInput,
} from '../utils/validators';
import { useInsurtechStore } from '../store/useInsurtechStore';
import { firestoreService, needsAssessmentService } from '../api/firestoreService';
import { generateSupportDocumentPdf, generateInformativeOfferPdf } from '../utils/formatters';
import { InsuranceProductType } from '../types/insurance';

type ProductTabId = 'auto_kasko' | 'imovina' | 'zivot' | 'zdravlje' | 'putno' | 'msp';

export const RequestQuotePage: React.FC = () => {
  const {
    user,
    prefilledQuoteTransfer,
    setPrefilledQuoteTransfer,
    createInformativeOffer,
  } = useInsurtechStore();

  const [selectedProduct, setSelectedProduct] = useState<ProductTabId>('auto_kasko');

  // Client Details
  const [fullName, setFullName] = useState<string>(user.displayName || 'Marko Horvatić');
  const [oib, setOib] = useState<string>(user.oib || '24918274015');
  const [email, setEmail] = useState<string>(user.email || 'marko.horvatic@gmail.com');
  const [phone, setPhone] = useState<string>(user.phone || '+385 91 555 4321');
  const [paymentDynamics, setPaymentDynamics] = useState<
    'Godišnje' | 'Polugodišnje' | 'Kvartalno' | 'Mjesečno (12 rata)'
  >('Mjesečno (12 rata)');
  const [preferredCarrier, setPreferredCarrier] = useState<string>(
    'Generali osiguranje d.d.'
  );
  const [assignedAgent, setAssignedAgent] = useState<'diana' | 'hrvoje' | 'laura'>('diana');

  // 1. Auto & Kasko fields
  const [regPlate, setRegPlate] = useState<string>('ZG-4821-HP');
  const [vin, setVin] = useState<string>('JTMAB3FV80D123456');
  const [vehicleMakeModel, setVehicleMakeModel] = useState<string>('Toyota RAV4 2.5 Hybrid');
  const [kwPower, setKwPower] = useState<number>(115);
  const [vehicleValueEur, setVehicleValueEur] = useState<number>(34000);
  const [bonusClass, setBonusClass] = useState<string>('B10 (50% bonus)');
  const [leasingCompany, setLeasingCompany] = useState<string>('Bez leasinga (Vlastito vozilo)');
  const [autoFranchiseEur, setAutoFranchiseEur] = useState<number>(150);
  const [includeFullKasko, setIncludeFullKasko] = useState<boolean>(true);
  const [includeRoadsideEu, setIncludeRoadsideEu] = useState<boolean>(true);
  const [includeGlassShield, setIncludeGlassShield] = useState<boolean>(true);

  // 2. Property fields
  const [propAddress, setPropAddress] = useState<string>('Palmotićeva ulica, Zagreb');
  const [propAreaM2, setPropAreaM2] = useState<number>(82);
  const [propConstructionYear, setPropConstructionYear] = useState<number>(2015);
  const [propType, setPropType] = useState<string>('Stan u višestambenoj zgradi');
  const [includeEarthquake, setIncludeEarthquake] = useState<boolean>(true);
  const [includeFlood, setIncludeFlood] = useState<boolean>(true);
  const [includeHouseholdThings, setIncludeHouseholdThings] = useState<boolean>(true);
  const [propFranchiseEur, setPropFranchiseEur] = useState<number>(0);

  // 3. Life & Životni kasko fields
  const [lifeAge, setLifeAge] = useState<number>(36);
  const [lifeDurationYears, setLifeDurationYears] = useState<number>(20);
  const [lifeSumEur, setLifeSumEur] = useState<number>(50000);
  const [lifeIncludeCriticalIllness, setLifeIncludeCriticalIllness] = useState<boolean>(true);
  const [lifeIncludeAccidentDouble, setLifeIncludeAccidentDouble] = useState<boolean>(true);

  // 4. Health fields
  const [healthPackage, setHealthPackage] = useState<string>('Komfort Specijalist + Dopunsko B-lista');
  const [healthSpecialistLimitEur, setHealthSpecialistLimitEur] = useState<number>(3000);
  const [healthDeductibleEur, setHealthDeductibleEur] = useState<number>(0);
  const [healthPreventiveCheckup, setHealthPreventiveCheckup] = useState<boolean>(true);

  // 5. Travel fields
  const [travelDestination, setTravelDestination] = useState<string>('Europa i Mediteran');
  const [travelDays, setTravelDays] = useState<number>(10);
  const [travelPersons, setTravelPersons] = useState<number>(2);
  const [travelCancellation, setTravelCancellation] = useState<boolean>(true);
  const [travelLuggage, setTravelLuggage] = useState<boolean>(true);

  // 6. SME / Business Liability fields
  const [smeCompanyName, setSmeCompanyName] = useState<string>('Adria Projekt d.o.o.');
  const [smeIndustry, setSmeIndustry] = useState<string>('IT, savjetovanje i uredsko poslovanje');
  const [smeEmployees, setSmeEmployees] = useState<number>(8);
  const [smeLiabilityLimitEur, setSmeLiabilityLimitEur] = useState<number>(150000);
  const [smeIncludePropertyEquipment, setSmeIncludePropertyEquipment] = useState<boolean>(true);
  const [smeIncludeCyberLiability, setSmeIncludeCyberLiability] = useState<boolean>(false);

  // Mandatory HANFA IDD Step (Test zahtjeva i potreba)
  const [iddPurposeConfirmed, setIddPurposeConfirmed] = useState<boolean>(true);
  const [iddFinancialCapacityConfirmed, setIddFinancialCapacityConfirmed] = useState<boolean>(true);
  const [iddIpidReadConfirmed, setIddIpidReadConfirmed] = useState<boolean>(true);
  const [gdprConsentConfirmed, setGdprConsentConfirmed] = useState<boolean>(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [createdOffer, setCreatedOffer] = useState<any | null>(null);

  // Apply prefilled quote transfer if user came from Homepage 3-Tier Comparator or Toyota Hub
  useEffect(() => {
    if (prefilledQuoteTransfer) {
      if (prefilledQuoteTransfer.productType === 'auto' || prefilledQuoteTransfer.productType === 'kasko') {
        setSelectedProduct('auto_kasko');
        if (prefilledQuoteTransfer.kwPower) setKwPower(prefilledQuoteTransfer.kwPower);
        if (prefilledQuoteTransfer.vehicleModel) setVehicleMakeModel(prefilledQuoteTransfer.vehicleModel);
        setAutoFranchiseEur(prefilledQuoteTransfer.deductibleEur);
      } else if (prefilledQuoteTransfer.productType === 'property') {
        setSelectedProduct('imovina');
        if (prefilledQuoteTransfer.areaM2) setPropAreaM2(prefilledQuoteTransfer.areaM2);
        setPropFranchiseEur(prefilledQuoteTransfer.deductibleEur);
      } else if (prefilledQuoteTransfer.productType === 'life') {
        setSelectedProduct('zivot');
        if (prefilledQuoteTransfer.coverageLimitEur) setLifeSumEur(prefilledQuoteTransfer.coverageLimitEur);
      } else if (prefilledQuoteTransfer.productType === 'health') {
        setSelectedProduct('zdravlje');
      }
    }
  }, [prefilledQuoteTransfer]);

  // Dynamic Calculation per Product
  const calculateCurrentProductQuote = () => {
    if (selectedProduct === 'auto_kasko') {
      const baseAo = Math.round((115 + kwPower * 1.4) * (bonusClass.includes('50%') ? 0.5 : 0.7));
      let kasko = includeFullKasko ? vehicleValueEur * 0.0165 + 90 : 0;
      if (autoFranchiseEur === 150) kasko *= 0.88;
      if (autoFranchiseEur === 300) kasko *= 0.76;
      const ridersAmt = (includeRoadsideEu ? 29 : 0) + (includeGlassShield ? 38 : 0);
      const annual = Math.round((baseAo + kasko + ridersAmt) * 100) / 100;

      return {
        productType: (includeFullKasko ? 'kasko' : 'auto') as InsuranceProductType,
        productTitle: includeFullKasko
          ? `Obvezno AO + Puni Kasko (${vehicleMakeModel})`
          : `Obvezno AO osiguranje (${vehicleMakeModel})`,
        assetDescription: `${vehicleMakeModel} (${kwPower} kW, Reg: ${regPlate}, VIN: ${vin})`,
        annualPremium: annual,
        deductibleEur: autoFranchiseEur,
        coverageLimitEur: includeFullKasko ? vehicleValueEur : 6450000,
        riders: [
          `Obvezno AO (${bonusClass})`,
          ...(includeFullKasko ? [`Puni Kasko (franšiza ${formatEUR(autoFranchiseEur)}, ${leasingCompany})`] : []),
          ...(includeRoadsideEu ? ['Pomoć na cesti 24/7 (HR + EU)'] : []),
          ...(includeGlassShield ? ['Lom stakala bez gubitka bonusa'] : []),
        ],
      };
    }

    if (selectedProduct === 'imovina') {
      const base = propAreaM2 * 1.65;
      const eq = includeEarthquake ? propAreaM2 * 0.95 : 0;
      const fl = includeFlood ? 39 : 0;
      const hh = includeHouseholdThings ? 48 : 0;
      let total = base + eq + fl + hh;
      if (propFranchiseEur === 150) total *= 0.89;
      if (propFranchiseEur === 300) total *= 0.8;
      const annual = Math.round(total * 100) / 100;

      return {
        productType: 'property' as InsuranceProductType,
        productTitle: `Osiguranje imovine — ${propType} (${propAreaM2} m²)`,
        assetDescription: `${propAddress} (${propAreaM2} m², god. gradnje ${propConstructionYear}.)`,
        annualPremium: annual,
        deductibleEur: propFranchiseEur,
        coverageLimitEur: propAreaM2 * 1850,
        riders: [
          `Građevinski dio (${propAreaM2} m²) — požar, oluja, tuča, izljev vode`,
          ...(includeHouseholdThings ? ['Stvari kućanstva na novu vrijednost + provalna krađa'] : []),
          ...(includeEarthquake ? ['Rizik potresa na novu građevinsku vrijednost'] : []),
          ...(includeFlood ? ['Rizik poplave, bujice i visokih voda'] : []),
        ],
      };
    }

    if (selectedProduct === 'zivot') {
      const base = (lifeSumEur / 1000) * (4.8 + (lifeAge - 25) * 0.14);
      const ci = lifeIncludeCriticalIllness ? 64 : 0;
      const acc = lifeIncludeAccidentDouble ? 38 : 0;
      const annual = Math.round((base + ci + acc) * 100) / 100;

      return {
        productType: 'life' as InsuranceProductType,
        productTitle: `Generali Životno osiguranje & Životni kasko (${lifeDurationYears} god.)`,
        assetDescription: `Osigurana svota ${formatEUR(lifeSumEur)}, trajanje ${lifeDurationYears} god. (dob ${lifeAge})`,
        annualPremium: annual,
        deductibleEur: 0,
        coverageLimitEur: lifeSumEur,
        riders: [
          `Osigurana svota za slučaj smrti: ${formatEUR(lifeSumEur)}`,
          ...(lifeIncludeAccidentDouble ? [`Dvostruka svota za smrt uslijed nezgode (${formatEUR(lifeSumEur * 2)})`] : []),
          ...(lifeIncludeCriticalIllness ? ['Pokriće za 25 teških bolesti + drugo liječničko mišljenje'] : []),
        ],
      };
    }

    if (selectedProduct === 'zdravlje') {
      const base = healthSpecialistLimitEur >= 3000 ? 285 : 178;
      const prev = healthPreventiveCheckup ? 48 : 0;
      const discount = healthDeductibleEur > 0 ? 35 : 0;
      const annual = Math.round((base + prev - discount) * 100) / 100;

      return {
        productType: 'health' as InsuranceProductType,
        productTitle: `Dobrovoljno zdravstveno — ${healthPackage}`,
        assetDescription: `Limit specijalističkih pregleda ${formatEUR(healthSpecialistLimitEur)} / god.`,
        annualPremium: annual,
        deductibleEur: healthDeductibleEur,
        coverageLimitEur: healthSpecialistLimitEur,
        riders: [
          `Specijalistički pregledi i dijagnostika do ${formatEUR(healthSpecialistLimitEur)}`,
          'Dopunsko zdravstveno pokriće A + B liste lijekova',
          ...(healthPreventiveCheckup ? ['Godišnji sistematski pregled u privatnoj poliklinici'] : []),
        ],
      };
    }

    if (selectedProduct === 'putno') {
      const perPersonDay = travelDestination.includes('Svijet') ? 3.8 : 2.1;
      let total = travelDays * travelPersons * perPersonDay + 14;
      if (travelCancellation) total += 24;
      if (travelLuggage) total += 15;
      const annual = Math.round(total * 100) / 100;

      return {
        productType: 'travel' as InsuranceProductType,
        productTitle: `Putno zdravstveno osiguranje (${travelDestination})`,
        assetDescription: `${travelPersons} putnika, ${travelDays} dana (${travelDestination})`,
        annualPremium: annual,
        deductibleEur: 0,
        coverageLimitEur: travelDestination.includes('Svijet') ? 100000 : 50000,
        riders: [
          `Hitni medicinski troškovi i asistencija u inozemstvu`,
          ...(travelCancellation ? ['Osiguranje otkaza putovanja'] : []),
          ...(travelLuggage ? ['Osiguranje prtljage od gubitka i krađe'] : []),
        ],
      };
    }

    // SME / Business Liability
    const baseSme = (smeLiabilityLimitEur / 50000) * 95 + smeEmployees * 24;
    const eqp = smeIncludePropertyEquipment ? 140 : 0;
    const cyb = smeIncludeCyberLiability ? 110 : 0;
    const annual = Math.round((baseSme + eqp + cyb) * 100) / 100;

    return {
      productType: 'business' as InsuranceProductType,
      productTitle: `Osiguranje MSP i odgovornosti — ${smeCompanyName}`,
      assetDescription: `${smeIndustry} (${smeEmployees} zaposlenih, limit ${formatEUR(smeLiabilityLimitEur)})`,
      annualPremium: annual,
      deductibleEur: 200,
      coverageLimitEur: smeLiabilityLimitEur,
      riders: [
        `Opća i profesionalna odgovornost do ${formatEUR(smeLiabilityLimitEur)}`,
        ...(smeIncludePropertyEquipment ? ['Osiguranje poslovnog prostora, opreme i zaliha'] : []),
        ...(smeIncludeCyberLiability ? ['Cyber odgovornost i zaštita elektroničkih podataka'] : []),
      ],
    };
  };

  const currentCalc = calculateCurrentProductQuote();

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateOIB(oib)) {
      setFormError('Uneseni OIB nije valjan. Provjerite 11 znamenki prema ISO 7064 (MOD 11, 10) standardu.');
      return;
    }

    if (selectedProduct === 'auto_kasko' && vin && !validateVIN(vin)) {
      setFormError('Uneseni broj šasije (VIN) mora sadržavati točno 17 valjanih znakova (bez slova I, O, Q).');
      return;
    }

    if (!iddPurposeConfirmed || !iddFinancialCapacityConfirmed || !iddIpidReadConfirmed || !gdprConsentConfirmed) {
      setFormError('Molimo potvrdite sve stavke obveznog HANFA IDD Testa zahtjeva i potreba te GDPR privolu.');
      return;
    }

    const offer = createInformativeOffer({
      clientName: fullName,
      clientOib: oib,
      clientEmail: email,
      clientPhone: phone,
      productType: currentCalc.productType,
      productTitle: currentCalc.productTitle,
      carrier: preferredCarrier,
      assetDescription: currentCalc.assetDescription,
      annualPremium: currentCalc.annualPremium,
      paymentDynamics,
      deductibleEur: currentCalc.deductibleEur,
      coverageLimitEur: currentCalc.coverageLimitEur,
      riders: currentCalc.riders,
      assignedAgentId: assignedAgent,
      status: 'ponuda_spremna',
      pdfCalculationAttached: true,
      iddNeedsVerified: true,
      notes: `Ponuda kreirana kroz modul Zatraži ponudu uz potvrđeni HANFA IDD Test zahtjeva i potreba.`,
    });

    // Persist to Cloud Firestore quotes & needs_assessments collections
    firestoreService
      .createQuote({
        customer: { fullName, email, phone, oib },
        type:
          currentCalc.productType === 'kasko'
            ? 'auto'
            : currentCalc.productType === 'travel'
            ? 'health'
            : (currentCalc.productType as any),
        inputs: {
          assetDescription: currentCalc.assetDescription,
          paymentDynamics,
          carrier: preferredCarrier,
          riders: currentCalc.riders,
        },
        calculatedEstimate: {
          annualPremium: currentCalc.annualPremium,
          monthlyPremium: Math.round((currentCalc.annualPremium / 12) * 100) / 100,
          currency: 'EUR',
          deductible: currentCalc.deductibleEur,
          coverageLimit: currentCalc.coverageLimitEur,
        },
        status: 'quoted',
        assignedBrokerId: assignedAgent,
      })
      .catch(() => {});

    needsAssessmentService
      .saveAssessment({
        clientOib: oib,
        clientEmail: email,
        riskProfile: 'comprehensive',
        answers: {
          selectedProduct,
          iddPurposeConfirmed,
          iddFinancialCapacityConfirmed,
          iddIpidReadConfirmed,
        },
        recommendedProducts: [currentCalc.productTitle],
      })
      .catch(() => {});

    setPrefilledQuoteTransfer(null);
    setCreatedOffer(offer);
  };

  const productTabs: Array<{ id: ProductTabId; label: string; icon: any }> = [
    { id: 'auto_kasko', label: 'AO & Kasko vozila', icon: Car },
    { id: 'imovina', label: 'Imovina (Dom i stvari)', icon: Home },
    { id: 'zivot', label: 'Životno & Životni kasko', icon: Shield },
    { id: 'zdravlje', label: 'Dobrovoljno zdravstveno', icon: HeartPulse },
    { id: 'putno', label: 'Putno osiguranje', icon: Plane },
    { id: 'msp', label: 'Poduzeća (MSP) & Odgovornost', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF2F2] text-[#C21817] border border-[#FECACA] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIŠEPROIZVODNI SUSTAV PONUDA &bull; HANFA IDD USKLAĐENO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Zatraži ponudu osiguranja
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl">
            Odaberite vrstu osiguranja, prilagodite parametre rizika i provedite zakonski <strong>Test zahtjeva i potreba</strong>.
            Vaša informativna ponuda odmah se sinkronizira u <strong>Korisnički portal</strong> i <strong>Zastupnički portal</strong>.
          </p>
        </div>

        {/* Product Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {productTabs.map((tab) => {
            const Icon = tab.icon;
            const active = selectedProduct === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedProduct(tab.id);
                  setCreatedOffer(null);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  active
                    ? 'bg-[#C21817] text-white border-[#C21817] shadow-crimson-glow'
                    : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#C21817]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#C21817]'}`} />
                <span className="text-xs font-extrabold leading-snug">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {createdOffer ? (
          <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-elevated p-8 max-w-3xl mx-auto text-left space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
                    PONUDA SINKRONIZIRANA U OBA PORTALA
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#0F172A]">
                    Broj ponude: <span className="font-mono text-[#C21817]">{createdOffer.offerNumber}</span>
                  </h2>
                </div>
              </div>
              <span className="text-2xl font-black font-mono text-[#0F172A] tabular-nums">
                {formatEUR(createdOffer.annualPremium)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
              <div>
                <span className="text-slate-500 block">Klijent i OIB:</span>
                <strong className="font-mono">{createdOffer.clientName} ({createdOffer.clientOib})</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Osiguratelj i zastupnik:</span>
                <strong>{createdOffer.carrier} ({createdOffer.assignedAgentId.toUpperCase()})</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Proizvod:</span>
                <strong>{createdOffer.productTitle}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Dinamika plaćanja i franšiza:</span>
                <strong className="font-mono">{createdOffer.paymentDynamics} | Franšiza: {formatEUR(createdOffer.deductibleEur)}</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  generateInformativeOfferPdf({
                    offerNumber: createdOffer.offerNumber,
                    clientName: createdOffer.clientName,
                    clientOib: createdOffer.clientOib,
                    productTitle: createdOffer.productTitle,
                    carrier: createdOffer.carrier,
                    annualPremium: createdOffer.annualPremium,
                    paymentDynamics: createdOffer.paymentDynamics,
                    deductibleEur: createdOffer.deductibleEur,
                    coverageSummary: createdOffer.riders,
                    agentName: createdOffer.assignedAgentId.toUpperCase(),
                    agentEmail:
                      createdOffer.assignedAgentId === 'hrvoje'
                        ? 'osiguranje@tcz.hr'
                        : createdOffer.assignedAgentId === 'laura'
                        ? 'osiguranje2@tcz.hr'
                        : 'agencija.zivot@generali.com',
                    validUntil: createdOffer.validUntil,
                  })
                }
                className="px-5 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Preuzmi informativni izračun (PDF)</span>
              </button>

              <Link
                to="/korisnicki-portal"
                className="px-5 py-3 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white font-bold text-xs flex items-center gap-2"
              >
                <span>Otvori u Korisničkom portalu (Prihvati ponudu)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/zastupnicki-portal"
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs"
              >
                Pregled u Zastupničkom portalu
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuote} className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Left 8 Columns: Product Parameters + IDD Step */}
            <div className="lg:col-span-8 space-y-6">
              {/* Dynamic Product Parameters Card */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-6">
                <h2 className="text-lg font-extrabold text-[#0F172A] border-b border-slate-100 pb-3">
                  1. Parametri predmeta osiguranja i opseg pokrića
                </h2>

                {selectedProduct === 'auto_kasko' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Marka i model vozila *</label>
                        <input
                          type="text"
                          value={vehicleMakeModel}
                          onChange={(e) => setVehicleMakeModel(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Registarska oznaka *</label>
                        <input
                          type="text"
                          value={regPlate}
                          onChange={(e) => setRegPlate(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs uppercase tabular-nums"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Broj šasije (VIN - 17 znakova) *</label>
                        <input
                          type="text"
                          value={vin}
                          onChange={(e) => setVin(normalizeVINInput(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs uppercase tabular-nums"
                          required
                        />
                        <span className={`text-[10px] font-mono ${validateVIN(vin) ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {validateVIN(vin) ? '✓ VIN valjan (17 znakova)' : `${vin.length}/17 znakova`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Snaga motora (kW)</label>
                        <input
                          type="number"
                          min={25}
                          max={450}
                          value={kwPower}
                          onChange={(e) => setKwPower(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Vrijednost vozila (EUR)</label>
                        <input
                          type="number"
                          min={3000}
                          max={200000}
                          step={500}
                          value={vehicleValueEur}
                          onChange={(e) => setVehicleValueEur(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Bonus / Malus razred</label>
                        <select
                          value={bonusClass}
                          onChange={(e) => setBonusClass(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                        >
                          <option value="B10 (50% bonus)">B10 (50% maksimalni bonus)</option>
                          <option value="B8 (40% bonus)">B8 (40% bonus)</option>
                          <option value="B6 (30% bonus)">B6 (30% bonus)</option>
                          <option value="B0 (0% osnovni razred)">B0 (0% osnovni razred)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Leasing / Vinkulacija</label>
                        <select
                          value={leasingCompany}
                          onChange={(e) => setLeasingCompany(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                        >
                          <option value="Bez leasinga (Vlastito vozilo)">Bez leasinga (Vlastito vozilo)</option>
                          <option value="Toyota Tsusho Leasing">Toyota Tsusho Leasing</option>
                          <option value="UniCredit Leasing Croatia">UniCredit Leasing Croatia</option>
                          <option value="Erste & Steiermärkische S-Leasing">Erste S-Leasing</option>
                          <option value="Porsche Leasing">Porsche Leasing</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold cursor-pointer">
                        <span>Uključi Puni Kasko</span>
                        <input
                          type="checkbox"
                          checked={includeFullKasko}
                          onChange={(e) => setIncludeFullKasko(e.target.checked)}
                          className="w-4 h-4 accent-[#C21817]"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold cursor-pointer">
                        <span>Pomoć na cesti 24/7 (HR+EU)</span>
                        <input
                          type="checkbox"
                          checked={includeRoadsideEu}
                          onChange={(e) => setIncludeRoadsideEu(e.target.checked)}
                          className="w-4 h-4 accent-[#C21817]"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold cursor-pointer">
                        <span>Lom stakala bez franšize</span>
                        <input
                          type="checkbox"
                          checked={includeGlassShield}
                          onChange={(e) => setIncludeGlassShield(e.target.checked)}
                          className="w-4 h-4 accent-[#C21817]"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {selectedProduct === 'imovina' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Adresa nekretnine *</label>
                        <input
                          type="text"
                          value={propAddress}
                          onChange={(e) => setPropAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Površina (m²)</label>
                        <input
                          type="number"
                          min={15}
                          max={600}
                          value={propAreaM2}
                          onChange={(e) => setPropAreaM2(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Godina gradnje</label>
                        <input
                          type="number"
                          min={1900}
                          max={2026}
                          value={propConstructionYear}
                          onChange={(e) => setPropConstructionYear(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold cursor-pointer">
                        <span>Rizik potresa (nova vrijednost)</span>
                        <input
                          type="checkbox"
                          checked={includeEarthquake}
                          onChange={(e) => setIncludeEarthquake(e.target.checked)}
                          className="w-4 h-4 accent-[#C21817]"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold cursor-pointer">
                        <span>Rizik poplave i bujice</span>
                        <input
                          type="checkbox"
                          checked={includeFlood}
                          onChange={(e) => setIncludeFlood(e.target.checked)}
                          className="w-4 h-4 accent-[#C21817]"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold cursor-pointer">
                        <span>Stvari kućanstva &amp; krađa</span>
                        <input
                          type="checkbox"
                          checked={includeHouseholdThings}
                          onChange={(e) => setIncludeHouseholdThings(e.target.checked)}
                          className="w-4 h-4 accent-[#C21817]"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {selectedProduct === 'zivot' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Dob osiguranika (godina)</label>
                      <input
                        type="number"
                        min={18}
                        max={70}
                        value={lifeAge}
                        onChange={(e) => setLifeAge(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Trajanje ugovora (godina)</label>
                      <input
                        type="number"
                        min={5}
                        max={40}
                        value={lifeDurationYears}
                        onChange={(e) => setLifeDurationYears(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Osigurana svota (EUR)</label>
                      <input
                        type="number"
                        min={10000}
                        max={250000}
                        step={5000}
                        value={lifeSumEur}
                        onChange={(e) => setLifeSumEur(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                      />
                    </div>
                  </div>
                )}

                {selectedProduct === 'zdravlje' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Zdravstveni paket</label>
                      <select
                        value={healthPackage}
                        onChange={(e) => setHealthPackage(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                      >
                        <option value="Dopunsko + B-lista lijekova">Dopunsko + B-lista lijekova</option>
                        <option value="Komfort Specijalist + Dopunsko B-lista">Komfort Specijalist + Dopunsko</option>
                        <option value="Ekskluziv Poliklinika bez čekanja">Ekskluziv Poliklinika VIP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Godišnji limit specijalista (EUR)</label>
                      <select
                        value={healthSpecialistLimitEur}
                        onChange={(e) => setHealthSpecialistLimitEur(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs font-semibold bg-white tabular-nums"
                      >
                        <option value={1500}>1.500,00 €</option>
                        <option value={3000}>3.000,00 €</option>
                        <option value={5000}>5.000,00 €</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Učešće / Franšiza po pregledu</label>
                      <select
                        value={healthDeductibleEur}
                        onChange={(e) => setHealthDeductibleEur(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs font-semibold bg-white tabular-nums"
                      >
                        <option value={0}>0,00 € (Bez participacije)</option>
                        <option value={20}>20,00 € po pregledu (-12% premije)</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedProduct === 'putno' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Destinacija putovanja</label>
                      <select
                        value={travelDestination}
                        onChange={(e) => setTravelDestination(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                      >
                        <option value="Europa i Mediteran">Europa i Mediteran (50.000 €)</option>
                        <option value="Cijeli Svijet (SAD, Kanada, Azija)">Cijeli Svijet (100.000 €)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Trajanje putovanja (dana)</label>
                      <input
                        type="number"
                        min={1}
                        max={365}
                        value={travelDays}
                        onChange={(e) => setTravelDays(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Broj putnika</label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={travelPersons}
                        onChange={(e) => setTravelPersons(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                      />
                    </div>
                  </div>
                )}

                {selectedProduct === 'msp' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Naziv poduzeća / obrta</label>
                      <input
                        type="text"
                        value={smeCompanyName}
                        onChange={(e) => setSmeCompanyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Broj zaposlenika</label>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={smeEmployees}
                        onChange={(e) => setSmeEmployees(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Limit odgovornosti (EUR)</label>
                      <select
                        value={smeLiabilityLimitEur}
                        onChange={(e) => setSmeLiabilityLimitEur(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs font-semibold bg-white tabular-nums"
                      >
                        <option value={50000}>50.000,00 €</option>
                        <option value={150000}>150.000,00 €</option>
                        <option value={500000}>500.000,00 €</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Podaci o ugovaratelju (OIB Validator) */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-extrabold text-[#0F172A] border-b border-slate-100 pb-3">
                  2. Podaci o ugovaratelju osiguranja i dinamika plaćanja
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ime i prezime / Naziv *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">OIB ugovaratelja (ISO 7064) *</label>
                    <input
                      type="text"
                      value={oib}
                      onChange={(e) => setOib(normalizeOIBInput(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                      required
                    />
                    <span className={`text-[10px] font-mono ${validateOIB(oib) ? 'text-emerald-600' : 'text-[#C21817]'}`}>
                      {validateOIB(oib) ? '✓ Valjan 11-znamenkasti OIB (ISO 7064)' : 'Unesite valjani 11-znamenkasti OIB'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-mail adresa *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kontakt telefon *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferirani osiguratelj</label>
                    <select
                      value={preferredCarrier}
                      onChange={(e) => setPreferredCarrier(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                    >
                      <option value="Generali osiguranje d.d.">Generali osiguranje d.d. (Službeni partner)</option>
                      <option value="Toyota Osiguranje (Generali × TCZ)">Toyota Osiguranje (Generali × TCZ)</option>
                      <option value="Croatia osiguranje d.d.">Croatia osiguranje d.d.</option>
                      <option value="Allianz Hrvatska d.d.">Allianz Hrvatska d.d.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dinamika plaćanja</label>
                    <select
                      value={paymentDynamics}
                      onChange={(e) => setPaymentDynamics(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                    >
                      <option value="Mjesečno (12 rata)">Mjesečno (12 rata bez kamata)</option>
                      <option value="Kvartalno">Kvartalno (4 rate)</option>
                      <option value="Polugodišnje">Polugodišnje (2 rate)</option>
                      <option value="Godišnje">Godišnje (jednokratno)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dodijeljeni zastupnik</label>
                    <select
                      value={assignedAgent}
                      onChange={(e) => setAssignedAgent(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                    >
                      <option value="diana">Diana (agencija.zivot@generali.com)</option>
                      <option value="hrvoje">Hrvoje — TCZ (osiguranje@tcz.hr)</option>
                      <option value="laura">Laura — TCZ (osiguranje2@tcz.hr)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Mandatory HANFA IDD Step (Test zahtjeva i potreba) */}
              <div className="bg-white rounded-3xl border-2 border-[#0F172A] shadow-card p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#C21817]" />
                    <h2 className="text-lg font-extrabold text-[#0F172A]">
                      3. Obvezni HANFA IDD korak — Test zahtjeva i potreba
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => generateSupportDocumentPdf('general_terms')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] text-xs font-bold text-[#C21817] cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Preuzmi IPID &amp; Uvjete osiguranja (PDF)</span>
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={iddPurposeConfirmed}
                      onChange={(e) => setIddPurposeConfirmed(e.target.checked)}
                      className="w-4 h-4 accent-[#C21817] mt-0.5 shrink-0"
                    />
                    <span>
                      <strong>Usklađenost sa zahtjevima i potrebama (IDD):</strong> Potvrđujem da odabrana vrsta osiguranja, osigurana svota ({formatEUR(currentCalc.coverageLimitEur)}) i razina franšize ({formatEUR(currentCalc.deductibleEur)}) odgovaraju mojim stvarnim potrebama zaštite imovine/osoba.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={iddFinancialCapacityConfirmed}
                      onChange={(e) => setIddFinancialCapacityConfirmed(e.target.checked)}
                      className="w-4 h-4 accent-[#C21817] mt-0.5 shrink-0"
                    />
                    <span>
                      <strong>Financijska primjerenost i trajanje:</strong> Upoznat/a sam s godišnjom premijom od <strong>{formatEUR(currentCalc.annualPremium)}</strong> i odabranom dinamikom plaćanja ({paymentDynamics}) te potvrđujem da ne plaćam nikakvu dodatnu proviziju zastupniku (Čl. 417. Zakona o osiguranju).
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={iddIpidReadConfirmed}
                      onChange={(e) => setIddIpidReadConfirmed(e.target.checked)}
                      className="w-4 h-4 accent-[#C21817] mt-0.5 shrink-0"
                    />
                    <span>
                      <strong>Predugovorne informacije i IPID dokument:</strong> Potvrđujem primitak Dokumenta s informacijama o proizvodu osiguranja (IPID) i općih uvjeta društva {preferredCarrier}.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gdprConsentConfirmed}
                      onChange={(e) => setGdprConsentConfirmed(e.target.checked)}
                      className="w-4 h-4 accent-[#C21817] mt-0.5 shrink-0"
                    />
                    <span>
                      <strong>GDPR privola za obradu podataka:</strong> Suglasan/na sam da ŽIVOT d.o.o. za zastupanje u osiguranju (Palmotićeva 76, Zagreb) obrađuje moje osobne podatke (uključujući OIB) isključivo u svrhu izrade ponude i ugovaranja police osiguranja.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Live Summary & Submit */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-white rounded-3xl border border-[#E2E8F0] shadow-elevated p-6 space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#C21817]">
                    INFORMATIVNI IZRAČUN PREMIJE
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0F172A] mt-1">{currentCalc.productTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{preferredCarrier}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-slate-600">Godišnja premija:</span>
                    <span className="text-3xl font-black font-mono text-[#0F172A] tabular-nums">
                      {formatEUR(currentCalc.annualPremium)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#C21817] font-bold tabular-nums">
                    <span>Mjesečni obrok (12x):</span>
                    <span>{formatEUR(Math.round((currentCalc.annualPremium / 12) * 100) / 100)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200/70 tabular-nums">
                    <span>Osigurana svota / limit:</span>
                    <span>{formatEUR(currentCalc.coverageLimitEur)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#0F172A] block">Uključena pokrića:</span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {currentCalc.riders.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C21817] shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#C21817] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 px-5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white font-bold text-sm shadow-crimson-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Pošalji zahtjev i sinkroniziraj u portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestQuotePage;
