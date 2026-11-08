import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  FileText,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Sparkles,
  Download,
  Send,
  Kanban,
  Megaphone,
  TrendingUp,
  Clock,
  Building2,
  X,
  Check,
  Filter,
  Bot,
} from 'lucide-react';
import { useInsurtechStore } from '../store/useInsurtechStore';
import { Policy, Claim, InformativeOffer, ContractPipelineItem } from '../types/insurance';
import {
  LICENSED_AGENTS,
  CLAIM_PHASE_LABELS,
  CONTRACT_STAGE_LABELS,
} from '../lib/content/insurance-data';
import {
  validateOIB,
  validateCroatianIBAN,
  formatEUR,
  normalizeOIBInput,
  normalizeIBANInput,
} from '../utils/validators';
import {
  generatePolicyCertificatePdf,
  generateInformativeOfferPdf,
} from '../utils/formatters';
import { portalSyncService } from '../api/firestoreService';
import { LeadPipelineKanban } from '../components/admin/LeadPipelineKanban';
import { RegulatoryAuditView } from '../components/admin/RegulatoryAuditView';

type AgentPortalTab =
  | 'upravljanje_policama'
  | 'upravljanje_stetama'
  | 'upravljanje_ugovorima'
  | 'informativne_ponude'
  | 'prodaja_marketing'
  | 'revizija_kanban';

export const AdminDashboardPage: React.FC = () => {
  const {
    activeAgentId,
    setActiveAgentId,
    policies,
    addPolicy,
    removePolicy,
    updatePolicyProvisionStatus,
    claims,
    submitNewClaim,
    updateClaimPhase,
    removeClaim,
    informativeOffers,
    createInformativeOffer,
    updateInformativeOffer,
    removeInformativeOffer,
    contractPipeline,
    addContractPipelineItem,
    updateContractPipelineStage,
    removeContractPipelineItem,
  } = useInsurtechStore();

  const [activeTab, setActiveTab] = useState<AgentPortalTab>('upravljanje_policama');
  const [salesSubTab, setSalesSubTab] = useState<'prodaja' | 'marketing'>('prodaja');
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Tab 1: Upravljanje policama filters & "+" modal
  const [policySearch, setPolicySearch] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<'all' | 'generali' | 'toyota'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'expiring_30' | 'provision_paid' | 'archived'>('all');
  const [showNewPolicyModal, setShowNewPolicyModal] = useState(false);
  const [polNumber, setPolNumber] = useState('HR-GEN-950218-KASKO');
  const [polClientName, setPolClientName] = useState('Ivan Kovačević');
  const [polClientOib, setPolClientOib] = useState('58192047127');
  const [polCarrier, setPolCarrier] = useState('Toyota Osiguranje (Generali osiguranje d.d.)');
  const [polAsset, setPolAsset] = useState('Toyota Corolla Cross 2.0 Hybrid (ZG-9012-TC)');
  const [polType, setPolType] = useState<Policy['type']>('kasko');
  const [polPremium, setPolPremium] = useState('695');

  // Tab 2: Upravljanje štetama notes & "+" modal
  const [claimNoteDrafts, setClaimNoteDrafts] = useState<Record<string, string>>({});
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [clmPolicyNumber, setClmPolicyNumber] = useState('HR-GEN-882914-AO');
  const [clmClientName, setClmClientName] = useState('Marko Horvatić');
  const [clmClientOib, setClmClientOib] = useState('24918274015');
  const [clmCategory, setClmCategory] = useState('Prometna nesreća - AO/Kasko');
  const [clmLocation, setClmLocation] = useState('Zagreb, Slavonska avenija');
  const [clmIban, setClmIban] = useState('HR1223600003219847561');
  const [clmAmount, setClmAmount] = useState('1420');
  const [clmDesc, setClmDesc] = useState('Oštećenje prednjeg odbojnika i desnog LED fara — popravak u Toyota Centru Zagreb.');

  // Tab 3: Upravljanje ugovorima i fazama "+" modal
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [cntClientName, setCntClientName] = useState('Ana Babić');
  const [cntClientOib, setCntClientOib] = useState('73019482611');
  const [cntProduct, setCntProduct] = useState('Generali Dom & Stvari Ekskluziv + Potres');
  const [cntCarrier, setCntCarrier] = useState('Generali osiguranje d.d.');
  const [cntPremium, setCntPremium] = useState('385');
  const [cntNotes, setCntNotes] = useState('Izrađena IDD analiza potreba, čeka se potvrda klijentice.');

  // Tab 4: Informativne ponude "+" modal
  const [showNewOfferModal, setShowNewOfferModal] = useState(false);
  const [offClientName, setOffClientName] = useState('Marko Horvatić');
  const [offClientOib, setOffClientOib] = useState('24918274015');
  const [offCarrier, setOffCarrier] = useState('Toyota Osiguranje (Generali osiguranje d.d.)');
  const [offTitle, setOffTitle] = useState('Toyota Kasko Ekskluziv + Zaštita Hybrid baterije');
  const [offAsset, setOffAsset] = useState('Toyota C-HR 2.0 Hybrid GR Sport (2026.)');
  const [offTier, setOffTier] = useState<'Osnovni' | 'Komfort' | 'Ekskluziv'>('Ekskluziv');
  const [offPremium, setOffPremium] = useState('740');

  // Tab 5: Prodaja & Marketing state
  const [clientSearch, setClientSearch] = useState('');
  const [campaignType, setCampaignType] = useState<'renewal_30' | 'seasonal_travel_home' | 'loyalty_upgrade'>('renewal_30');
  const [dispatchedCampaigns, setDispatchedCampaigns] = useState<
    Array<{ id: string; title: string; recipients: number; timestamp: string; previewText: string }>
  >([]);

  const activeAgent =
    LICENSED_AGENTS.find((a) => a.id === activeAgentId) || LICENSED_AGENTS[0];

  const getDaysUntilExpiry = (endDateStr: string) => {
    const end = new Date(endDateStr).getTime();
    const now = Date.now();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  // Filtered policies for Skadencar Ledger
  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      const q = policySearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.policyNumber.toLowerCase().includes(q) ||
        (p.clientOib || '').toLowerCase().includes(q) ||
        (p.clientName || '').toLowerCase().includes(q) ||
        p.assetName.toLowerCase().includes(q) ||
        p.carrier.toLowerCase().includes(q);

      const matchesCarrier =
        carrierFilter === 'all' ||
        (carrierFilter === 'toyota' && p.carrier.toLowerCase().includes('toyota')) ||
        (carrierFilter === 'generali' && !p.carrier.toLowerCase().includes('toyota'));

      const days = getDaysUntilExpiry(p.endDate);
      const matchesUrgency =
        urgencyFilter === 'all' ||
        (urgencyFilter === 'expiring_30' && days >= 0 && days <= 30) ||
        (urgencyFilter === 'provision_paid' && p.provisionStatus === 'paid_provision') ||
        (urgencyFilter === 'archived' && p.provisionStatus === 'archived');

      return matchesQuery && matchesCarrier && matchesUrgency;
    });
  }, [policies, policySearch, carrierFilter, urgencyFilter]);

  // Aggregated Client Database Tiles for Tab 5 ("Prodaja")
  const clientDatabaseTiles = useMemo(() => {
    const map = new Map<
      string,
      {
        clientName: string;
        clientOib: string;
        activePolicies: Policy[];
        totalAnnualPremiumEur: number;
        earliestExpiryDays: number;
        recommendedCrossSell: {
          productTitle: string;
          carrier: string;
          reason: string;
          estimatedPremiumEur: number;
          packageTier: 'Osnovni' | 'Komfort' | 'Ekskluziv';
        };
      }
    >();

    policies.forEach((p) => {
      const oib = p.clientOib || '24918274015';
      const name = p.clientName || 'Marko Horvatić';
      const days = getDaysUntilExpiry(p.endDate);
      const existing = map.get(oib);
      if (!existing) {
        map.set(oib, {
          clientName: name,
          clientOib: oib,
          activePolicies: [p],
          totalAnnualPremiumEur: p.premiumAnnual,
          earliestExpiryDays: days,
          recommendedCrossSell: {
            productTitle: 'Generali Životni Kasko & Nezgoda Ekskluziv',
            carrier: 'Generali osiguranje d.d.',
            reason: 'Klijent ima auto/imovinsku policu bez aktivnog pokrića Životnog kaska.',
            estimatedPremiumEur: 310,
            packageTier: 'Ekskluziv',
          },
        });
      } else {
        existing.activePolicies.push(p);
        existing.totalAnnualPremiumEur += p.premiumAnnual;
        if (days < existing.earliestExpiryDays) {
          existing.earliestExpiryDays = days;
        }
      }
    });

    // Refine AI Cross-Sell Propensity per client product mix
    Array.from(map.values()).forEach((tile) => {
      const types = new Set(tile.activePolicies.map((ap) => ap.type));
      if ((types.has('kasko') || types.has('auto')) && !types.has('property')) {
        tile.recommendedCrossSell = {
          productTitle: 'Generali Osiguranje Imovine (Dom i stvari + Potres)',
          carrier: 'Generali osiguranje d.d.',
          reason:
            'AI Propensity 92%: Vlasnik Toyota Kasko police ostvaruje 15% мульти-polica popusta na osiguranje stana/kuće.',
          estimatedPremiumEur: 265,
          packageTier: 'Ekskluziv',
        };
      } else if (!types.has('life')) {
        tile.recommendedCrossSell = {
          productTitle: 'Generali Životni Kasko i Osiguranje obitelji',
          carrier: 'Generali osiguranje d.d.',
          reason:
            'AI Propensity 88%: Klijent posjeduje vozilo i nekretninu — preporučena financijska zaštita obitelji i kredita.',
          estimatedPremiumEur: 340,
          packageTier: 'Komfort',
        };
      } else {
        tile.recommendedCrossSell = {
          productTitle: 'Dobrovoljno zdravstveno osiguranje (Sistematski + Specijalisti)',
          carrier: 'Generali osiguranje d.d.',
          reason:
            'AI Propensity 85%: Platinum klijent s 3+ police kvalificiran za obiteljski zdravstveni paket bez čekanja.',
          estimatedPremiumEur: 420,
          packageTier: 'Ekskluziv',
        };
      }
    });

    return Array.from(map.values()).filter((tile) => {
      const q = clientSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        tile.clientName.toLowerCase().includes(q) ||
        tile.clientOib.toLowerCase().includes(q)
      );
    });
  }, [policies, clientSearch]);

  const expiringCount = policies.filter((p) => {
    const d = getDaysUntilExpiry(p.endDate);
    return d >= 0 && d <= 30;
  }).length;

  const totalPortfolioPremium = policies.reduce((acc, p) => acc + p.premiumAnnual, 0);

  const handleIssueManualPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOIB(polClientOib)) {
      setBannerMessage('Greška: OIB klijenta nije valjan prema ISO 7064 (MOD 11, 10) provjeri.');
      return;
    }
    const created: Policy = {
      id: `pol-agent-${Date.now()}`,
      userId: 'usr-zagreb-001',
      policyNumber: polNumber.trim(),
      type: polType,
      carrier: polCarrier,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      premiumAnnual: parseFloat(polPremium) || 550,
      paymentFrequency: 'monthly',
      assetName: polAsset.trim(),
      clientName: polClientName.trim(),
      clientOib: polClientOib,
      assignedAgentId: activeAgentId,
      provisionStatus: 'paid_provision',
      coverageDetails: {
        limitEur: 40000,
        deductibleEur: 100,
        riders: ['Puno pokriće po polici', '24/7 Asistencija HR i EU'],
      },
      documents: [
        {
          title: `Polica osiguranja (${polNumber})`,
          type: 'policy_pdf',
          downloadUrl: '#',
          fileSizeBytes: 310000,
        },
      ],
    };
    addPolicy(created);
    setShowNewPolicyModal(false);
    setBannerMessage(
      `Polica ${created.policyNumber} za klijenta ${created.clientName} (OIB: ${created.clientOib}) uspješno je upisana u Skadencar i Korisnički portal.`
    );
  };

  const handleCreateAgentClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOIB(clmClientOib)) {
      setBannerMessage('Greška: OIB klijenta u prijavi štete nije valjan.');
      return;
    }
    if (!validateCroatianIBAN(clmIban)) {
      setBannerMessage('Greška: IBAN za isplatu mora biti valjani HR IBAN (21 znak).');
      return;
    }
    const created = submitNewClaim({
      policyId: policies[0]?.id || 'pol-toyota-rav4-2026',
      policyNumber: clmPolicyNumber,
      clientName: clmClientName,
      clientOib: clmClientOib,
      carrierName: 'Generali / Toyota Osiguranje',
      incidentDate: new Date().toISOString().split('T')[0],
      location: clmLocation,
      category: clmCategory,
      description: clmDesc,
      mediaUrls: [],
      iban: clmIban,
      claimAmountRequested: parseFloat(clmAmount) || 1000,
      documentChecklist: ['Prijava štete zastupnika', 'Procjena servisa'],
    });
    setShowNewClaimModal(false);
    setBannerMessage(`Otovren je novi spis štete ${created.id} i sinkroniziran s Korisničkim portalom.`);
  };

  const handleCreateContractPipeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOIB(cntClientOib)) {
      setBannerMessage('Greška: OIB klijenta nije valjan.');
      return;
    }
    const item = addContractPipelineItem({
      clientName: cntClientName,
      clientOib: cntClientOib,
      productTitle: cntProduct,
      carrier: cntCarrier,
      stage: 1,
      annualPremiumEur: parseFloat(cntPremium) || 350,
      assignedAgentId: activeAgentId,
      notes: cntNotes,
    });
    setShowNewContractModal(false);
    setBannerMessage(`Predmet ugovaranja ${item.id} (${item.clientName}) dodan je u Fazu 1.`);
  };

  const handleCreateAgentOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOIB(offClientOib)) {
      setBannerMessage('Greška: OIB klijenta nije valjan.');
      return;
    }
    const offer = createInformativeOffer({
      clientName: offClientName,
      clientOib: offClientOib,
      productType: 'kasko',
      productTitle: offTitle,
      carrier: offCarrier,
      packageTier: offTier,
      annualPremiumEur: parseFloat(offPremium) || 680,
      deductibleEur: 100,
      assetDescription: offAsset,
      coverageHighlights: [
        'Službeni izračun zastupnika Agencije Život',
        'Popravak u ovlaštenom servisu s OEM dijelovima',
        '24/7 Pomoć na cesti u RH i EU',
      ],
      status: 'poslana_klijentu',
      assignedAgentId: activeAgentId,
      iddVerified: true,
      pdfCalculationAttached: true,
    });
    setShowNewOfferModal(false);
    setBannerMessage(
      `Informativna ponuda ${offer.offerNumber} poslana je u Korisnički portal klijenta ${offer.clientName}.`
    );
  };

  const handleOneClickCrossSellOffer = (tile: (typeof clientDatabaseTiles)[number]) => {
    const rec = tile.recommendedCrossSell;
    const offer = createInformativeOffer({
      clientName: tile.clientName,
      clientOib: tile.clientOib,
      productType: 'property',
      productTitle: rec.productTitle,
      carrier: rec.carrier,
      packageTier: rec.packageTier,
      annualPremiumEur: rec.estimatedPremiumEur,
      deductibleEur: 0,
      assetDescription: `Preporučena Cross-Sell ponuda za klijenta ${tile.clientName} (OIB: ${tile.clientOib})`,
      coverageHighlights: [
        rec.reason,
        'Uključen multi-polica popust Program vjernosti (-15%)',
        'Izravna aktivacija 1-klikom u Korisničkom portalu',
      ],
      status: 'poslana_klijentu',
      assignedAgentId: activeAgentId,
      iddVerified: true,
      pdfCalculationAttached: true,
    });
    setBannerMessage(
      `AI Cross-Sell ponuda ${offer.offerNumber} (${rec.productTitle}) kreirana je i poslana klijentu ${tile.clientName} u Korisnički portal!`
    );
  };

  const getCampaignPreview = () => {
    if (campaignType === 'renewal_30') {
      return {
        title: 'Automatski podsjetnik za obnovu polica koje istječu za <30 dana',
        recipients: expiringCount || 3,
        previewText: `Poštovani, vaša polica osiguranja u portfelju Agencije Život istječe u narednih 30 dana. Vaš zastupnik (${activeAgent.name}, ${activeAgent.email}) pripremio je prijedlog obnove uz do 7% popusta za neškodovane godine i zadržavanje 50% bonusa. Ponudu možete prihvatiti 1-klikom u svom Korisničkom portalu.`,
      };
    }
    if (campaignType === 'seasonal_travel_home') {
      return {
        title: 'Sezonska kampanja: Generali Osiguranje Imovine (Potres + Poplava) & Putno',
        recipients: clientDatabaseTiles.length,
        previewText: `Poštovani klijenti Agencije Život, zaštitite svoj dom i obitelj uz Generali Dom & Stvari Ekskluziv paket s uključenim rizikom potresa, poplave i loma stakla te obiteljskim putnim zdravstvenim osiguranjem uz 15% popusta za postojeće osiguranike.`,
      };
    }
    return {
      title: 'Program vjernosti Agencije Život: Nadogradnja u Gold / Platinum status',
      recipients: clientDatabaseTiles.length,
      previewText: `Čestitamo! Zbrajanjem vaših polica obveznog AO, Toyota Kasko i osiguranja imovine ostvarujete pravo na višu razinu Programa vjernosti Agencije Život d.o.o. (Palmotićeva 76, Zagreb) uz dodatni popust do 20% i prioritetnu obradu šteta.`,
    };
  };

  const handleLaunchCampaign = async () => {
    const preview = getCampaignPreview();
    const record = {
      id: `CMP-${Date.now().toString().slice(-5)}`,
      title: preview.title,
      recipients: preview.recipients,
      timestamp: new Date().toLocaleString('hr-HR'),
      previewText: preview.previewText,
    };
    setDispatchedCampaigns((prev) => [record, ...prev]);
    await portalSyncService.syncMarketingCampaign({
      ...record,
      agentEmail: activeAgent.email,
    });
    setBannerMessage(
      `Marketinška kampanja "${preview.title}" uspješno je poslana prema ${preview.recipients} klijenata (Zastupnik: ${activeAgent.name}).`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
      {/* Top Executive Header & Licensed Agent Profile Switcher */}
      <section className="bg-[#0F172A] text-white pt-10 pb-10 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#C21817]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C21817] text-white text-xs font-bold tracking-wide">
                  <Shield className="w-3.5 h-3.5" />
                  ZASTUPNIČKI PORTAL • AGENCIJA ŽIVOT d.o.o.
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  OIB: 14329077049 • MBS: 01918940
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Zapovjedni centar zastupnika i Skadencar
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Dvosmjerno upravljanje policama, 5-faznom likvidacijom šteta, fazama ugovaranja, informativnim ponudama i AI prodajnim centrom za Generali i Toyota Centar Zagreb.
              </p>
            </div>

            {/* Licensed Agent Profile Switcher (Diana, Hrvoje, Laura) */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Aktivni profil zastupnika:
                </span>
                <Link
                  to="/korisnicki-portal"
                  className="text-[11px] font-mono text-amber-400 hover:underline"
                >
                  Otvori Korisnički portal &rarr;
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {LICENSED_AGENTS.map((ag) => {
                  const isSelected = ag.id === activeAgentId;
                  return (
                    <button
                      key={ag.id}
                      type="button"
                      onClick={() => setActiveAgentId(ag.id)}
                      className={`px-3 py-2 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#C21817] text-white border-red-400 shadow-sm'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-extrabold">{ag.name}</div>
                      <div className="text-[10px] font-mono opacity-90">{ag.email}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Executive KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Aktivne police</span>
              <strong className="text-2xl font-extrabold font-mono tabular-nums text-white">
                {policies.length}
              </strong>
              <span className="text-[11px] text-amber-400 font-mono block">
                {expiringCount} istječe za &lt;30 dana
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Portfelj premije</span>
              <strong className="text-xl font-extrabold font-mono tabular-nums text-emerald-400">
                {formatEUR(totalPortfolioPremium)}
              </strong>
              <span className="text-[11px] text-slate-400 block">Godišnja bruto premija</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Prijavljene štete</span>
              <strong className="text-2xl font-extrabold font-mono tabular-nums text-white">
                {claims.length}
              </strong>
              <span className="text-[11px] text-slate-400 block">5-fazna obrada spisa</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Ugovori u obradi</span>
              <strong className="text-2xl font-extrabold font-mono tabular-nums text-white">
                {contractPipeline.length}
              </strong>
              <span className="text-[11px] text-slate-400 block">Aktivni pipeline faza 1–5</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 col-span-2 lg:col-span-1">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Informativne ponude</span>
              <strong className="text-2xl font-extrabold font-mono tabular-nums text-amber-400">
                {informativeOffers.length}
              </strong>
              <span className="text-[11px] text-emerald-400 block">
                {informativeOffers.filter((o) => o.status === 'prihvacena').length} prihvaćeno od klijenata
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {bannerMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{bannerMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              className="p-1 text-emerald-700 hover:text-emerald-950"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 5 Core Operational Tabs + 6th Preserved Kanban/Audit Tab */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            {
              id: 'upravljanje_policama',
              label: `1. Upravljanje policama (${policies.length})`,
              icon: Shield,
            },
            {
              id: 'upravljanje_stetama',
              label: `2. Upravljanje štetama (${claims.length})`,
              icon: AlertTriangle,
            },
            {
              id: 'upravljanje_ugovorima',
              label: `3. Upravljanje ugovorima i fazama (${contractPipeline.length})`,
              icon: Kanban,
            },
            {
              id: 'informativne_ponude',
              label: `4. Informativne ponude (${informativeOffers.length})`,
              icon: FileText,
            },
            {
              id: 'prodaja_marketing',
              label: '5. Prodajni/marketinški centar',
              icon: TrendingUp,
            },
            {
              id: 'revizija_kanban',
              label: 'HANFA IDD Revizija & CRM ploča',
              icon: Building2,
            },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as AgentPortalTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C21817] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: UPRAVLJANJE POLICAMA (SKADENCAR LEDGER) */}
        {activeTab === 'upravljanje_policama' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Glavna knjiga polica i Skadencar (Generali & Toyota Osiguranje)
                  </h2>
                  <p className="text-xs text-slate-600">
                    Pretražujte po OIB-u, šifri police, osiguratelju ili hitnosti isteka (&lt;30 dana) te upravljajte statusom provizije i arhive.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPolicyModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Upis nove police u Skadencar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={policySearch}
                    onChange={(e) => setPolicySearch(e.target.value)}
                    placeholder="Pretraži po OIB-u, šifri police, imenu klijenta ili vozilu..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <select
                  value={carrierFilter}
                  onChange={(e) => setCarrierFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="all">Svi osiguratelji (Generali + Toyota)</option>
                  <option value="generali">Samo Generali osiguranje d.d.</option>
                  <option value="toyota">Samo Toyota Osiguranje (TCZ)</option>
                </select>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="all">Sve police ({policies.length})</option>
                  <option value="expiring_30">Hitni istek &lt;30 dana ({expiringCount})</option>
                  <option value="provision_paid">Obračunata provizija</option>
                  <option value="archived">Arhivirane police</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredPolicies.map((pol) => {
                const days = getDaysUntilExpiry(pol.endDate);
                const isUrgent = days >= 0 && days <= 30;
                return (
                  <div
                    key={pol.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      isUrgent ? 'border-[#C21817]/60' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono tabular-nums text-xs font-bold">
                          {pol.policyNumber}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono tabular-nums text-xs font-bold">
                          OIB: {pol.clientOib || '24918274015'}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#C21817] text-xs font-bold">
                          {pol.carrier}
                        </span>
                        {isUrgent && (
                          <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-mono tabular-nums text-xs font-bold">
                            Istječe za {days} dana ({pol.endDate})
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {pol.clientName || 'Marko Horvatić'} — {pol.assetName}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono tabular-nums">
                        Trajanje: {pol.startDate} &rarr; {pol.endDate} • Limit: {formatEUR(pol.coverageDetails?.limitEur ?? 35000)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-right mr-2">
                        <span className="text-[11px] text-slate-500 block">Godišnja premija</span>
                        <strong className="text-base font-extrabold font-mono tabular-nums text-slate-900">
                          {formatEUR(pol.premiumAnnual)}
                        </strong>
                      </div>

                      <select
                        value={pol.provisionStatus || 'paid_provision'}
                        onChange={(e) => {
                          updatePolicyProvisionStatus(pol.id, e.target.value as any);
                          setBannerMessage(`Status provizije/arhive za policu ${pol.policyNumber} je ažuriran.`);
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50"
                      >
                        <option value="paid_provision">✓ Provizija obračunata</option>
                        <option value="pending_provision">⏳ Provizija u obračunu</option>
                        <option value="archived">📁 Arhivirano</option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          generatePolicyCertificatePdf({
                            policyNumber: pol.policyNumber,
                            carrier: pol.carrier,
                            clientName: pol.clientName || 'Marko Horvatić',
                            clientOib: pol.clientOib || '24918274015',
                            assetName: pol.assetName,
                            startDate: pol.startDate,
                            endDate: pol.endDate,
                            premiumEur: pol.premiumAnnual,
                            coverageRiders: pol.coverageDetails?.riders || [],
                          })
                        }
                        className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title="Preuzmi PDF certifikat police"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          removePolicy(pol.id);
                          setBannerMessage(`Polica ${pol.policyNumber} uklonjena je iz registra.`);
                        }}
                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Ukloni policu (-)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: UPRAVLJANJE ŠTETAMA (5-PHASE TRIAGE BOARD) */}
        {activeTab === 'upravljanje_stetama' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Upravljanje štetama i 5-fazna likvidacija (Sinkronizirano s Korisničkim portalom)
                </h2>
                <p className="text-xs text-slate-600">
                  Promjena faze (1–5) ili bilješke zastupnika trenutno se prikazuje klijentu u njegovom Korisničkom portalu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewClaimModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Otvori novi spis štete</span>
              </button>
            </div>

            <div className="space-y-4">
              {claims.map((claim) => {
                const cPhase = claim.phase ?? 1;
                return (
                  <div
                    key={claim.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono tabular-nums text-xs font-bold">
                            {claim.id}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono tabular-nums text-xs font-bold">
                            Polica: {claim.policyNumber || claim.policyId}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono tabular-nums text-xs">
                            OIB: {claim.clientOib || '24918274015'}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#C21817] text-xs font-bold">
                            Faza {cPhase}/5
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">
                          {claim.clientName || 'Marko Horvatić'} — {claim.category} ({claim.location})
                        </h3>
                        <p className="text-xs text-slate-600">{claim.description}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[11px] text-slate-500 block">Odštetni zahtjev / IBAN</span>
                          <strong className="text-base font-extrabold font-mono tabular-nums text-slate-900">
                            {formatEUR(claim.claimAmountRequested || 0)}
                          </strong>
                          <span className="text-[11px] font-mono tabular-nums text-slate-500 block">
                            {claim.iban}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            removeClaim(claim.id);
                            setBannerMessage(`Spis štete ${claim.id} je uklonjen.`);
                          }}
                          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Obriši spis štete (-)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive 1-5 Phase Selector Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {CLAIM_PHASE_LABELS.map((st) => {
                        const isCurrent = cPhase === st.phase;
                        const isDone = cPhase > st.phase;
                        return (
                          <button
                            key={st.phase}
                            type="button"
                            onClick={() => {
                              updateClaimPhase(
                                claim.id,
                                st.phase,
                                claimNoteDrafts[claim.id] || claim.agentNotes
                              );
                              setBannerMessage(
                                `Spis ${claim.id} prebačen je u Fazu ${st.phase} (${st.label}) — vidljivo klijentu u Korisničkom portalu.`
                              );
                            }}
                            className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-[#C21817] text-white border-[#C21817] shadow-xs'
                                : isDone
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div className="font-mono font-bold text-[10px]">FAZA {st.phase}</div>
                            <div className="font-bold mt-0.5">{st.label}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Agent Note Input */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={claimNoteDrafts[claim.id] ?? claim.agentNotes ?? ''}
                        onChange={(e) =>
                          setClaimNoteDrafts((prev) => ({ ...prev, [claim.id]: e.target.value }))
                        }
                        placeholder="Unesite službenu napomenu zastupnika za klijenta..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateClaimPhase(
                            claim.id,
                            cPhase,
                            claimNoteDrafts[claim.id] ?? claim.agentNotes
                          );
                          setBannerMessage(`Bilješka zastupnika za spis ${claim.id} je spremljena.`);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                      >
                        Spremi bilješku za klijenta
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: UPRAVLJANJE UGOVORIMA I FAZAMA (5-STAGE CONTRACTING PIPELINE) */}
        {activeTab === 'upravljanje_ugovorima' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Upravljanje ugovorima i fazama (1. Upit i IDD analiza &rarr; 5. Polica izdana)
                </h2>
                <p className="text-xs text-slate-600">
                  Svi zahtjevi poslani kroz "Zatraži ponudu" automatski ulaze u ovaj cjevovod ugovaranja.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewContractModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Novi predmet ugovaranja</span>
              </button>
            </div>

            <div className="space-y-4">
              {contractPipeline.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono tabular-nums text-xs font-bold">
                          {item.id}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono tabular-nums text-xs font-bold">
                          OIB: {item.clientOib}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#C21817] text-xs font-bold">
                          {item.carrier}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {item.clientName} — {item.productTitle}
                      </h3>
                      <p className="text-xs text-slate-600">{item.notes}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">Planirana premija</span>
                        <strong className="text-base font-extrabold font-mono tabular-nums text-slate-900">
                          {formatEUR(item.annualPremiumEur)}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeContractPipelineItem(item.id);
                          setBannerMessage(`Predmet ugovaranja ${item.id} je uklonjen.`);
                        }}
                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Ukloni predmet (-)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {CONTRACT_STAGE_LABELS.map((st) => {
                      const isCurrent = item.stage === st.stage;
                      const isDone = item.stage > st.stage;
                      return (
                        <button
                          key={st.stage}
                          type="button"
                          onClick={() => {
                            updateContractPipelineStage(item.id, st.stage);
                            setBannerMessage(
                              `Ugovor ${item.id} (${item.clientName}) prebačen je u Fazu ${st.stage}: ${st.label}.`
                            );
                          }}
                          className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-[#0F172A] text-white border-[#0F172A]'
                              : isDone
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="font-mono font-bold text-[10px]">FAZA {st.stage}</div>
                          <div className="font-bold mt-0.5">{st.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INFORMATIVNE PONUDE (BIDIRECTIONAL OFFER DISPATCH) */}
        {activeTab === 'informativne_ponude' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Informativne ponude osiguratelja (Generali & Toyota Osiguranje)
                </h2>
                <p className="text-xs text-slate-600">
                  Kreirajte ponudu, priložite PDF izračun i pratite u stvarnom vremenu je li klijent kliknuo "Prihvati ponudu".
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewOfferModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Kreiraj i pošalji ponudu klijentu</span>
              </button>
            </div>

            <div className="space-y-4">
              {informativeOffers.map((offer) => {
                const isAccepted = offer.status === 'prihvacena';
                const offerPremium = offer.annualPremium ?? offer.annualPremiumEur ?? 0;
                const offerRiders = offer.coverageHighlights || offer.riders || [];
                return (
                  <div
                    key={offer.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      isAccepted ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono tabular-nums text-xs font-bold">
                          {offer.offerNumber}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono tabular-nums text-xs font-bold">
                          OIB: {offer.clientOib}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#C21817] text-xs font-bold">
                          {offer.carrier}
                        </span>
                        {isAccepted ? (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold">
                            ✓ Klijent prihvatio ponudu (Polica izdana)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                            ⏳ Čeka prihvat u Korisničkom portalu ({offer.status})
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {offer.clientName} — {offer.productTitle} ({offer.packageTier || 'Ekskluziv'})
                      </h3>
                      <p className="text-xs text-slate-600">{offer.assetDescription}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">Godišnja premija</span>
                        <strong className="text-base font-extrabold font-mono tabular-nums text-[#C21817]">
                          {formatEUR(offerPremium)}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          updateInformativeOffer(offer.id, {
                            status: 'poslana_klijentu',
                            pdfCalculationAttached: true,
                          });
                          setBannerMessage(
                            `PDF izračun priložen, a ponuda ${offer.offerNumber} označena kao poslana klijentu.`
                          );
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                      >
                        {offer.pdfCalculationAttached ? '✓ PDF priložen' : 'Priloži PDF i pošalji'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          generateInformativeOfferPdf({
                            offerNumber: offer.offerNumber,
                            carrier: offer.carrier,
                            clientName: offer.clientName,
                            clientOib: offer.clientOib,
                            productTitle: offer.productTitle,
                            assetDescription: offer.assetDescription,
                            annualPremiumEur: offerPremium,
                            coverageHighlights: offerRiders,
                            validUntil: offer.validUntil,
                          })
                        }
                        className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title="Preuzmi PDF ponudu"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          removeInformativeOffer(offer.id);
                          setBannerMessage(`Ponuda ${offer.offerNumber} je uklonjena.`);
                        }}
                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Ukloni ponudu (-)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: PRODAJNI / MARKETINŠKI CENTAR (SPLIT INTO PRODAJA & MARKETING SUB-TABS) */}
        {activeTab === 'prodaja_marketing' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Prodajni i marketinški centar Agencije Život
                </h2>
                <p className="text-xs text-slate-600">
                  Baza klijenata s AI Cross-Sell/Up-Sell preporukama i automatizirani studio za kampanje obnove i vjernosti.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSalesSubTab('prodaja')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    salesSubTab === 'prodaja'
                      ? 'bg-[#C21817] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Prodaja (Baza klijenata & AI Cross-Sell)
                </button>
                <button
                  type="button"
                  onClick={() => setSalesSubTab('marketing')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    salesSubTab === 'marketing'
                      ? 'bg-[#C21817] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Marketing (Kampanje obnove & Program vjernosti)
                </button>
              </div>
            </div>

            {salesSubTab === 'prodaja' ? (
              <div className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Pretraži klijente po imenu ili OIB-u..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {clientDatabaseTiles.map((tile) => (
                    <div
                      key={tile.clientOib}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white font-mono tabular-nums text-[11px] font-bold">
                              OIB: {tile.clientOib}
                            </span>
                            <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                              {tile.clientName}
                            </h3>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] text-slate-500 block">Ukupna godišnja premija</span>
                            <strong className="text-lg font-extrabold font-mono tabular-nums text-[#C21817]">
                              {formatEUR(tile.totalAnnualPremiumEur)}
                            </strong>
                            <span className="text-[11px] font-mono tabular-nums text-slate-500 block">
                              Prvi istek za {tile.earliestExpiryDays} dana
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase text-slate-500 block">
                            Aktivni miks proizvoda ({tile.activePolicies.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {tile.activePolicies.map((ap) => (
                              <span
                                key={ap.id}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                              >
                                {ap.policyNumber} • {ap.assetName}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* AI Cross-Sell / Up-Sell Propensity Engine Box */}
                        <div className="p-4 rounded-xl bg-[#FEF2F2] border border-red-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C21817]">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>AI Cross-Sell / Up-Sell Preporuka</span>
                            </span>
                            <span className="font-mono tabular-nums text-xs font-extrabold text-slate-900">
                              {formatEUR(tile.recommendedCrossSell.estimatedPremiumEur)} / god.
                            </span>
                          </div>
                          <div className="text-xs font-extrabold text-slate-900">
                            {tile.recommendedCrossSell.productTitle}
                          </div>
                          <p className="text-[11px] text-slate-700 leading-relaxed">
                            {tile.recommendedCrossSell.reason}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleOneClickCrossSellOffer(tile)}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>1-Klik Generiraj i pošalji ponudu u Korisnički portal</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* MARKETING SUB-TAB */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C21817]">
                    <Megaphone className="w-4 h-4" />
                    <span>AUTOMATIZIRANI STUDIO ZA KAMPANJE (HRVATSKI JEZIK)</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Generiranje personaliziranih obavijesti klijentima
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: 'renewal_30',
                        label: 'Obnova polica (<30 dana)',
                        desc: 'Klijenti kojima uskoro istječe AO/Kasko ili Imovina',
                      },
                      {
                        id: 'seasonal_travel_home',
                        label: 'Sezonski Dom & Putno',
                        desc: 'Potres, poplava i obiteljsko putno osiguranje',
                      },
                      {
                        id: 'loyalty_upgrade',
                        label: 'Program vjernosti (Gold/Platinum)',
                        desc: 'Obavijest o multi-polica popustima do 20%',
                      },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCampaignType(c.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          campaignType === c.id
                            ? 'bg-[#FEF2F2] border-[#C21817] text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{c.label}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{c.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-slate-900">{getCampaignPreview().title}</strong>
                      <span className="font-mono tabular-nums text-[#C21817] font-bold">
                        Primatelja: {getCampaignPreview().recipients}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {getCampaignPreview().previewText}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLaunchCampaign}
                    className="px-5 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Pokreni kampanju ({activeAgent.name})</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Povijest poslanih kampanja ({dispatchedCampaigns.length})
                  </h3>
                  {dispatchedCampaigns.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      Odaberite predložak lijevo i kliknite "Pokreni kampanju" za slanje personaliziranih obavijesti.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {dispatchedCampaigns.map((dc) => (
                        <div
                          key={dc.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                        >
                          <div className="flex justify-between font-mono text-[11px] text-slate-500">
                            <span>{dc.id}</span>
                            <span>{dc.timestamp}</span>
                          </div>
                          <div className="font-bold text-slate-900">{dc.title}</div>
                          <div className="text-emerald-700 font-semibold">
                            ✓ Isporučeno na {dc.recipients} klijenata
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PRESERVED KANBAN & HANFA IDD AUDIT VIEW */}
        {activeTab === 'revizija_kanban' && (
          <div className="space-y-8">
            <LeadPipelineKanban />
            <RegulatoryAuditView />
          </div>
        )}
      </div>

      {/* MODAL 1: "+" UPIS NOVE POLICE U SKADENCAR */}
      {showNewPolicyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Upis nove police u Skadencar i Korisnički portal
              </h3>
              <button
                type="button"
                onClick={() => setShowNewPolicyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleIssueManualPolicy} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Šifra police</label>
                  <input
                    type="text"
                    value={polNumber}
                    onChange={(e) => setPolNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">OIB klijenta (ISO 7064)</label>
                  <input
                    type="text"
                    value={polClientOib}
                    onChange={(e) => setPolClientOib(normalizeOIBInput(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ime i prezime / Naziv klijenta</label>
                <input
                  type="text"
                  value={polClientName}
                  onChange={(e) => setPolClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Osiguratelj</label>
                <select
                  value={polCarrier}
                  onChange={(e) => setPolCarrier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Toyota Osiguranje (Generali osiguranje d.d.)">
                    Toyota Osiguranje (Generali osiguranje d.d.)
                  </option>
                  <option value="Generali osiguranje d.d.">Generali osiguranje d.d.</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Predmet osiguranja</label>
                <input
                  type="text"
                  value={polAsset}
                  onChange={(e) => setPolAsset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategorija</label>
                  <select
                    value={polType}
                    onChange={(e) => setPolType(e.target.value as Policy['type'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="kasko">Kasko / AO</option>
                    <option value="auto">Obvezno AO</option>
                    <option value="property">Imovina</option>
                    <option value="life">Životno</option>
                    <option value="health">Zdravstveno</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Godišnja premija (€)</label>
                  <input
                    type="number"
                    value={polPremium}
                    onChange={(e) => setPolPremium(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPolicyModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C21817] text-white font-bold"
                >
                  Izdaj i sinkroniziraj policu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: "+" OTVORI NOVI SPIS ŠTETE */}
      {showNewClaimModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Otvori novi spis štete (FNOL)</h3>
              <button
                type="button"
                onClick={() => setShowNewClaimModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAgentClaim} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Šifra police</label>
                  <input
                    type="text"
                    value={clmPolicyNumber}
                    onChange={(e) => setClmPolicyNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">OIB osiguranika</label>
                  <input
                    type="text"
                    value={clmClientOib}
                    onChange={(e) => setClmClientOib(normalizeOIBInput(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Klijent</label>
                  <input
                    type="text"
                    value={clmClientName}
                    onChange={(e) => setClmClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Traženi iznos (€)</label>
                  <input
                    type="number"
                    value={clmAmount}
                    onChange={(e) => setClmAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">IBAN za isplatu (HR + 19 znamenki)</label>
                <input
                  type="text"
                  value={clmIban}
                  onChange={(e) => setClmIban(normalizeIBANInput(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Opis oštećenja</label>
                <textarea
                  rows={2}
                  value={clmDesc}
                  onChange={(e) => setClmDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewClaimModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C21817] text-white font-bold"
                >
                  Evidentiraj štetu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: "+" NOVI PREDMET UGOVARANJA */}
      {showNewContractModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Novi predmet ugovaranja (Faza 1–5)</h3>
              <button
                type="button"
                onClick={() => setShowNewContractModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateContractPipeline} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ime i prezime klijenta</label>
                  <input
                    type="text"
                    value={cntClientName}
                    onChange={(e) => setCntClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">OIB klijenta</label>
                  <input
                    type="text"
                    value={cntClientOib}
                    onChange={(e) => setCntClientOib(normalizeOIBInput(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Proizvod osiguranja</label>
                <input
                  type="text"
                  value={cntProduct}
                  onChange={(e) => setCntProduct(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Osiguratelj</label>
                  <input
                    type="text"
                    value={cntCarrier}
                    onChange={(e) => setCntCarrier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Premija (€)</label>
                  <input
                    type="number"
                    value={cntPremium}
                    onChange={(e) => setCntPremium(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewContractModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C21817] text-white font-bold"
                >
                  Dodaj u ugovaranje
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: "+" KREIRAJ INFORMATIVNU PONUDU */}
      {showNewOfferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Nova informativna ponuda za Korisnički portal
              </h3>
              <button
                type="button"
                onClick={() => setShowNewOfferModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAgentOffer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Klijent</label>
                  <input
                    type="text"
                    value={offClientName}
                    onChange={(e) => setOffClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">OIB klijenta</label>
                  <input
                    type="text"
                    value={offClientOib}
                    onChange={(e) => setOffClientOib(normalizeOIBInput(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Naziv ponude / Paketa</label>
                <input
                  type="text"
                  value={offTitle}
                  onChange={(e) => setOffTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Predmet osiguranja (Vozilo / Imovina)</label>
                <input
                  type="text"
                  value={offAsset}
                  onChange={(e) => setOffAsset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Razina</label>
                  <select
                    value={offTier}
                    onChange={(e) => setOffTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="Osnovni">Osnovni</option>
                    <option value="Komfort">Komfort</option>
                    <option value="Ekskluziv">Ekskluziv</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Godišnja premija (€)</label>
                  <input
                    type="number"
                    value={offPremium}
                    onChange={(e) => setOffPremium(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewOfferModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C21817] text-white font-bold"
                >
                  Pošalji u Korisnički portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
