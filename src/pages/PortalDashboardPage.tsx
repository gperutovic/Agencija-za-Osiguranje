import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  FileText,
  AlertTriangle,
  Clock,
  User,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Download,
  QrCode,
  Bot,
  Send,
  X,
  Lock,
  Building2,
  ChevronRight,
  BarChart3,
  Phone,
  Mail,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useInsurtechStore } from '../store/useInsurtechStore';
import { Policy, Claim, InformativeOffer } from '../types/insurance';
import { AssignedAdvisorBadge } from '../components/advisor/AssignedAdvisorBadge';
import { InstantDocumentCenter } from '../components/dashboard/InstantDocumentCenter';
import { Hub3aPaymentSlipModal } from '../components/payment/Hub3aPaymentSlipModal';
import { MultiCarrierComparisonMatrix } from '../components/advisor/MultiCarrierComparisonMatrix';
import { MayaQuoteEngine } from '../components/quote-funnel/MayaQuoteEngine';
import {
  validateOIB,
  validateCroatianIBAN,
  formatEUR,
  normalizeOIBInput,
  normalizeIBANInput,
} from '../utils/validators';
import {
  generatePolicyCertificatePdf,
  generateGreenCardPdf,
  generateInformativeOfferPdf,
} from '../utils/formatters';
import { CLAIM_PHASE_LABELS } from '../lib/content/insurance-data';

type ClientPortalTab =
  | 'police'
  | 'stete'
  | 'ponude'
  | 'racun_gdpr'
  | 'alati';

interface AiModalContext {
  mode: 'policy' | 'claim';
  title: string;
  subtitle: string;
  systemSummary: string;
  suggestedQuestions: string[];
  policy?: Policy;
  claim?: Claim;
}

export const PortalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    advisor,
    policies,
    addPolicy,
    removePolicy,
    acceptPolicyRenewal,
    claims,
    removeClaim,
    appendClaimMessage,
    informativeOffers,
    acceptInformativeOffer,
    removeInformativeOffer,
    gdprRequests,
    submitGdprRequest,
  } = useInsurtechStore();

  const [activeTab, setActiveTab] = useState<ClientPortalTab>('police');
  const [activeDocumentPolicy, setActiveDocumentPolicy] = useState<Policy | null>(null);
  const [activePaymentSlipPolicy, setActivePaymentSlipPolicy] = useState<Policy | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // "+" Add Existing / External Policy Modal
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [newPolicyNumber, setNewPolicyNumber] = useState('HR-GEN-904112-AO');
  const [newPolicyCarrier, setNewPolicyCarrier] = useState('Generali osiguranje d.d.');
  const [newPolicyAsset, setNewPolicyAsset] = useState('Toyota Yaris Cross 1.5 Hybrid (ZG-1192-TC)');
  const [newPolicyType, setNewPolicyType] = useState<Policy['type']>('kasko');
  const [newPolicyPremium, setNewPolicyPremium] = useState('540');
  const [newPolicyFrequency, setNewPolicyFrequency] = useState<'monthly' | 'annual'>('monthly');

  // AI Contextual Assistant Modal ("AI Pomoć za policu" & "AI Status štete")
  const [aiModal, setAiModal] = useState<AiModalContext | null>(null);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [aiInput, setAiInput] = useState('');

  // Account & GDPR Form State
  const [profileName, setProfileName] = useState(user.displayName || 'Marko Horvatić');
  const [profileEmail, setProfileEmail] = useState(user.email || 'marko.horvatic@gmail.com');
  const [profilePhone, setProfilePhone] = useState(user.phone || '+385 91 555 4321');
  const [profileOib, setProfileOib] = useState(user.oib || '24918274015');
  const [profileIban, setProfileIban] = useState(user.iban || 'HR1223600003219847561');
  const [profileAddress, setProfileAddress] = useState(user.address || 'Palmotićeva ulica 42');
  const [profileCity, setProfileCity] = useState(user.city || 'Zagreb');
  const [prefEmail, setPrefEmail] = useState(user.communicationPreferences?.emailNotifications ?? true);
  const [prefSms, setPrefSms] = useState(user.communicationPreferences?.smsExpiryAlerts ?? true);
  const [prefWhatsapp, setPrefWhatsapp] = useState(user.communicationPreferences?.whatsappClaimsUpdates ?? true);
  const [prefMarketing, setPrefMarketing] = useState(user.communicationPreferences?.marketingOffers ?? true);
  const [gdprReason, setGdprReason] = useState('');
  const [gdprConfirmDelete, setGdprConfirmDelete] = useState(false);

  const getDaysUntilExpiry = (endDateStr: string) => {
    const end = new Date(endDateStr).getTime();
    const now = Date.now();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  const expiringPolicies = policies.filter((p) => {
    const days = getDaysUntilExpiry(p.endDate);
    return days >= 0 && days <= 30;
  });

  const pendingOffers = informativeOffers.filter((o) => o.status !== 'prihvacena' && o.status !== 'odbijena');
  const openClaims = claims.filter((c) => (c.phase ?? 1) < 5);

  const openPolicyAiModal = (policy: Policy) => {
    const daysLeft = getDaysUntilExpiry(policy.endDate);
    const cov = policy.coverageDetails || { limitEur: 35000, deductibleEur: 100, riders: ['Osnovno pokriće'] };
    const initialMsg = `Analizirao sam vašu policu ${policy.policyNumber} (${policy.carrier}) za "${policy.assetName}". Polica vrijedi do ${policy.endDate} (${daysLeft > 0 ? `još ${daysLeft} dana` : 'istekla'}), uz godišnja premiju ${formatEUR(policy.premiumAnnual)} (${policy.paymentFrequency === 'monthly' ? 'mjesečno plaćanje' : 'jednokratno godišnje'}). Maksimalni limit pokrića iznosi ${formatEUR(cov.limitEur)}, a ugovorena franšiza ${formatEUR(cov.deductibleEur)}. Kako vam mogu pomoći oko uvjeta ili pokrića?`;
    setAiModal({
      mode: 'policy',
      title: `AI Pomoć za policu: ${policy.policyNumber}`,
      subtitle: `${policy.assetName} • ${policy.carrier}`,
      systemSummary: `Limit: ${formatEUR(cov.limitEur)} | Franšiza: ${formatEUR(cov.deductibleEur)} | Pokrića: ${cov.riders.join(', ')}`,
      suggestedQuestions: [
        'Što je sve pokriveno ovom policom i kolika je franšiza?',
        'Pokriva li ova polica zamjensko vozilo i pomoć na cesti u EU?',
        'Kako funkcionira obnova police i gubim li bonus kod prve štete?',
      ],
      policy,
    });
    setAiChatHistory([{ sender: 'ai', text: initialMsg }]);
    setAiInput('');
  };

  const openClaimAiModal = (claim: Claim) => {
    const currentPhase = claim.phase ?? 1;
    const phaseInfo = CLAIM_PHASE_LABELS.find((p) => p.phase === currentPhase) || CLAIM_PHASE_LABELS[0];
    const initialMsg = `Pratim vaš odštetni zahtjev ${claim.id} za policu ${claim.policyNumber || claim.policyId}. Trenutni status je Faza ${currentPhase}/5: "${phaseInfo.label}" (${phaseInfo.description}). Traženi iznos: ${formatEUR(claim.claimAmountRequested || 0)} na IBAN ${claim.iban}. Bilješka zastupnika: "${claim.agentNotes || 'Dokumentacija je uredno zaprimljena.'}"`;
    setAiModal({
      mode: 'claim',
      title: `AI Status štete: ${claim.id}`,
      subtitle: `Faza ${currentPhase}/5 (${phaseInfo.label}) • Polica ${claim.policyNumber || claim.policyId}`,
      systemSummary: `Kategorija: ${claim.category} | Lokacija: ${claim.location} | IBAN za isplatu: ${claim.iban}`,
      suggestedQuestions: [
        'Koji je sljedeći korak u obradi moje štete i kada mogu očekivati isplatu?',
        'Trebam li dostaviti još neku dokumentaciju za procjenitelja?',
        'Mogu li popraviti vozilo u ovlaštenom Toyota Centru Zagreb?',
      ],
      claim,
    });
    setAiChatHistory([{ sender: 'ai', text: initialMsg }]);
    setAiInput('');
  };

  const handleSendAiQuestion = (questionText?: string) => {
    const query = (questionText ?? aiInput).trim();
    if (!query || !aiModal) return;

    const qLower = query.toLowerCase();
    let reply = '';

    if (aiModal.mode === 'policy' && aiModal.policy) {
      const p = aiModal.policy;
      const cov = p.coverageDetails || { limitEur: 35000, deductibleEur: 100, riders: ['Osnovno pokriće'] };
      if (qLower.includes('franšiz') || qLower.includes('pokriven') || qLower.includes('uvjet')) {
        reply = `Prema uvjetima police ${p.policyNumber} (${p.carrier}), vaš limit pokrića iznosi ${formatEUR(cov.limitEur)}, a ugovorena franšiza (udjel u šteti) iznosi ${formatEUR(cov.deductibleEur)}. Aktivna dopunska pokrića uključuju: ${cov.riders.join('; ')}.`;
      } else if (qLower.includes('zamjensk') || qLower.includes('cesti') || qLower.includes('asistenc')) {
        reply = `Vaša polica uključuje 24/7 asistenciju (HR + EU). U slučaju kvara ili nezgode nazovite Brzu podršku na +385 91 450 1458 ili besplatni info telefon asistencije. Popravak u ovlaštenom servisu (npr. Toyota Centar Zagreb) jamči ugradnju originalnih OEM dijelova.`;
      } else {
        reply = `Za policu ${p.policyNumber} (${p.assetName}) vaša godišnja premija iznosi ${formatEUR(p.premiumAnnual)}. Ako želite proširiti pokriće ili aktivirati 1-klik obnovu prije isteka (${p.endDate}), možete kliknuti na gumb "Produlji policu" ili kontaktirati zastupnicu Dianu na agencija.zivot@generali.com.`;
      }
    } else if (aiModal.mode === 'claim' && aiModal.claim) {
      const c = aiModal.claim;
      if (qLower.includes('isplat') || qLower.includes('sljedeći') || qLower.includes('rok')) {
        reply = `Vaš spis ${c.id} je trenutno u fazi ${c.phase}/5. Prema Zakonu o obveznim odnosima i HANFA smjernicama, nakon kompletiranja dokumentacije (Faza 2) i izvida procjenitelja (Faza 4), isplata nespornog dijela štete izvršava se na vaš IBAN (${c.iban}) u roku od 14 radnih dana.`;
      } else if (qLower.includes('dokument') || qLower.includes('procjen')) {
        reply = `Evidentirana dokumentacija u spisu ${c.id}: ${(c.documentChecklist || ['Prijava štete', 'Fotografije oštećenja']).join(', ')}. Bilješka vašeg zastupnika glasi: "${c.agentNotes || 'Spis je u redovnoj obradi.'}"`;
      } else {
        reply = `Za štetu ${c.id} (${c.category}) ovlašteni zastupnici Agencije Život (Diana, Hrvoje i Laura) izravno komuniciraju s likvidatorom Generali / Toyota Osiguranja kako bi ubrzali odobrenje popravka i isplatu od ${formatEUR(c.claimAmountRequested || 0)}.`;
      }
    }

    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: query },
      { sender: 'ai', text: reply },
    ]);
    setAiInput('');
  };

  const handleCreateManualPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPremium = parseFloat(newPolicyPremium) || 420;
    const created: Policy = {
      id: `pol-client-${Date.now()}`,
      userId: user.uid,
      policyNumber: newPolicyNumber.trim() || `HR-GEN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: newPolicyType,
      carrier: newPolicyCarrier,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      premiumAnnual: parsedPremium,
      paymentFrequency: newPolicyFrequency,
      assetName: newPolicyAsset.trim() || 'Osobno vozilo / Imovina',
      clientName: user.displayName,
      clientOib: user.oib,
      assignedAgentId: 'diana',
      provisionStatus: 'pending_provision',
      coverageDetails: {
        limitEur: 35000,
        deductibleEur: 100,
        riders: ['Osnovno i dopunsko pokriće Agencija Život', '24/7 Pomoć i pravna zaštita'],
      },
      documents: [
        {
          title: `Polica osiguranja (${newPolicyNumber})`,
          type: 'policy_pdf',
          downloadUrl: '#',
          fileSizeBytes: 245000,
        },
      ],
    };
    addPolicy(created);
    setShowAddPolicyModal(false);
    setStatusBanner(`Polica ${created.policyNumber} uspješno je dodana u vaš Korisnički portal i sinkronizirana sa Zastupničkim portalom.`);
  };

  const handleAcceptOffer = (offer: InformativeOffer) => {
    const newPol = acceptInformativeOffer(offer.id);
    if (newPol) {
      setStatusBanner(
        `Čestitamo! Ponuda ${offer.offerNumber} je prihvaćena. Izrađena je aktivna polica ${newPol.policyNumber} koja se sada nalazi u "Moje aktivne police".`
      );
      setActiveTab('police');
    }
  };

  const isOibValid = validateOIB(profileOib);
  const isIbanValid = validateCroatianIBAN(profileIban);

  const handleSaveAccountProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOibValid) {
      setStatusBanner('Greška: OIB mora sadržavati točno 11 znamenki uz važeći ISO 7064 (MOD 11, 10) kontrolni broj.');
      return;
    }
    if (!isIbanValid) {
      setStatusBanner('Greška: Hrvatski IBAN mora počinjati s HR i sadržavati točno 21 znak (HR + 19 znamenki).');
      return;
    }
    setUser({
      displayName: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      oib: profileOib,
      iban: profileIban,
      address: profileAddress.trim(),
      city: profileCity.trim(),
      communicationPreferences: {
        emailNotifications: prefEmail,
        smsExpiryAlerts: prefSms,
        whatsappClaimsUpdates: prefWhatsapp,
        marketingOffers: prefMarketing,
      },
    });
    setStatusBanner('Osobni podaci, OIB/IBAN zapisi i komunikacijske privole uspješno su ažurirani.');
  };

  const handleGdprAction = (type: 'data_export' | 'account_deletion') => {
    if (type === 'account_deletion' && !gdprConfirmDelete) {
      setStatusBanner('Molimo označite potvrdu prije slanja zahtjeva za brisanje računa i osobnih podataka (Čl. 17. GDPR).');
      return;
    }
    const req = submitGdprRequest(type, gdprReason || 'Zahtjev podnesen putem Korisničkog portala Agencije Život.');
    setStatusBanner(
      type === 'account_deletion'
        ? `Zahtjev za brisanje osobnih podataka (${req.id}) je evidentiran prema Čl. 17. GDPR-a i proslijeđen službeniku za zaštitu podataka (agencija.zivot@generali.com).`
        : `Zahtjev za strojno čitljivi izvoz podataka (${req.id}) je zaprimljen prema Čl. 20. GDPR-a.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
      {/* Top Executive Header */}
      <section className="bg-[#0F172A] text-white pt-10 pb-10 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C21817]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C21817] text-white text-xs font-bold tracking-wide">
                  <Shield className="w-3.5 h-3.5" />
                  KORISNIČKI PORTAL • AGENCIJA ŽIVOT
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  OIB: {user.oib}
                </span>
                {user.iban && (
                  <span className="text-xs font-mono tabular-nums text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    IBAN: {user.iban}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Dobrodošli, {user.displayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Samoposlužni centar za upravljanje policama Generali i Toyota Osiguranja, praćenje šteta kroz 5 faza, prihvat informativnih ponuda i AI podršku.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/zatrazi-ponudu"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Zatraži novu ponudu</span>
              </Link>
              <Link
                to="/prijava-stete"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-xs transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Prijavi štetu (FNOL)</span>
              </Link>
              <Link
                to="/zastupnicki-portal"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zastupnički portal (Sinkronizirano)</span>
              </Link>
            </div>
          </div>

          {/* 1. CLIENT AI OVERVIEW BANNER */}
          <div className="bg-gradient-to-r from-slate-900/95 via-slate-900 to-[#1E293B] border border-slate-700/80 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Pregled Portfelja i Hitni Podsjetnici (&lt;30 dana)</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Imate ukupno <strong className="text-white font-mono tabular-nums">{policies.length}</strong> aktivnih polica,{' '}
                  <strong className="text-amber-300 font-mono tabular-nums">{pendingOffers.length}</strong> informativnih ponuda koje čekaju vaš odgovor i{' '}
                  <strong className="text-emerald-300 font-mono tabular-nums">{openClaims.length}</strong> aktivnih odštetnih zahtjeva u rješavanju.
                </p>
                {expiringPolicies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {expiringPolicies.map((ep) => {
                      const days = getDaysUntilExpiry(ep.endDate);
                      return (
                        <span
                          key={ep.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C21817]/25 border border-[#C21817]/50 text-xs font-mono tabular-nums text-red-200"
                        >
                          <Clock className="w-3.5 h-3.5 text-red-400" />
                          <span>
                            Polica <strong>{ep.policyNumber}</strong> ({ep.assetName}) istječe za <strong>{days} dana</strong> ({ep.endDate})
                          </span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {pendingOffers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('ponude')}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Pregledaj ponude ({pendingOffers.length})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                <Link
                  to="/ai-centar"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Bot className="w-4 h-4 text-red-400" />
                  <span>Otvori AI Štit pokrića</span>
                </Link>
              </div>
            </div>
          </div>

          <AssignedAdvisorBadge advisor={advisor} />
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {statusBanner && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{statusBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'police', label: `Moje aktivne police (${policies.length})`, icon: Shield },
            { id: 'stete', label: `Moje prijavljene štete (${claims.length})`, icon: AlertTriangle },
            { id: 'ponude', label: `Informativne ponude (${informativeOffers.length})`, icon: FileText },
            { id: 'racun_gdpr', label: 'Moj račun i GDPR centar', icon: User },
            { id: 'alati', label: 'Usporedba tržišta & Maya izračun', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ClientPortalTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C21817] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MOJE AKTIVNE POLICE */}
        {activeTab === 'police' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Moje aktivne police osiguranja</h2>
                <p className="text-xs text-slate-600">
                  Pregled svih aktivnih ugovora, dinamike plaćanja, PDF certifikata i izravne AI podrške po polici.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPolicyModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Dodaj postojeću policu</span>
                </button>
                <Link
                  to="/zatrazi-ponudu"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ugovori novu policu</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {policies.map((pol) => {
                const daysLeft = getDaysUntilExpiry(pol.endDate);
                const isExpiring = daysLeft >= 0 && daysLeft <= 30;
                const monthlyRate = pol.premiumAnnual / 12;

                return (
                  <div
                    key={pol.id}
                    className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                      isExpiring ? 'border-[#C21817]/60 ring-1 ring-[#C21817]/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono tabular-nums text-xs font-bold">
                            Šifra police: {pol.policyNumber}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#C21817] border border-red-200 text-xs font-bold">
                            {pol.carrier}
                          </span>
                          {isExpiring ? (
                            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-mono tabular-nums font-bold">
                              Istječe za {daysLeft} dana ({pol.endDate})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                              Aktivna ({pol.startDate} &rarr; {pol.endDate})
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900">{pol.assetName}</h3>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                            Premija i Dinamika plaćanja
                          </span>
                          <span className="text-xl font-extrabold font-mono tabular-nums text-slate-900">
                            {formatEUR(pol.premiumAnnual)} / god.
                          </span>
                          <span className="text-xs font-mono tabular-nums text-slate-600 block">
                            {pol.paymentFrequency === 'monthly'
                              ? `Mjesečno (12 rata po ${formatEUR(monthlyRate)})`
                              : 'Jednokratno godišnje plaćanje'}
                          </span>
                        </div>
                        <button
                          type="button"
                          title="Ukloni / arhiviraj policu iz prikaza (-)"
                          onClick={() => {
                            removePolicy(pol.id);
                            setStatusBanner(`Polica ${pol.policyNumber} uklonjena je iz aktivnog prikaza.`);
                          }}
                          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Coverage Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-slate-100 text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                        <span className="text-slate-500 block">Osigurana svota / Limit pokrića</span>
                        <strong className="text-sm font-mono tabular-nums text-slate-900">
                          {formatEUR(pol.coverageDetails?.limitEur ?? 35000)}
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                        <span className="text-slate-500 block">Ugovorena franšiza (udjel u šteti)</span>
                        <strong className="text-sm font-mono tabular-nums text-slate-900">
                          {(pol.coverageDetails?.deductibleEur ?? 0) === 0
                            ? '0,00 € (Bez franšize)'
                            : formatEUR(pol.coverageDetails?.deductibleEur ?? 100)}
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                        <span className="text-slate-500 block">Uključena pokrića ({(pol.coverageDetails?.riders || []).length})</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(pol.coverageDetails?.riders || []).map((r, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-medium text-slate-700"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openPolicyAiModal(pol)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEF2F2] hover:bg-red-100 text-[#C21817] border border-red-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Bot className="w-4 h-4" />
                          <span>AI Pomoć za policu</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            generatePolicyCertificatePdf({
                              policyNumber: pol.policyNumber,
                              carrier: pol.carrier,
                              clientName: pol.clientName || user.displayName,
                              clientOib: pol.clientOib || user.oib,
                              assetName: pol.assetName,
                              startDate: pol.startDate,
                              endDate: pol.endDate,
                              premiumEur: pol.premiumAnnual,
                              coverageRiders: pol.coverageDetails?.riders || [],
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-600" />
                          <span>Preuzmi PDF policu</span>
                        </button>

                        {(pol.type === 'auto' || pol.type === 'kasko') && (
                          <button
                            type="button"
                            onClick={() =>
                              generateGreenCardPdf({
                                policyNumber: pol.policyNumber,
                                carrier: pol.carrier,
                                clientName: pol.clientName || user.displayName,
                                vehicleDesc: pol.assetName,
                                validFrom: pol.startDate,
                                validUntil: pol.endDate,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Zelena karta (PDF)</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setActivePaymentSlipPolicy(pol)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#C21817]" />
                          <span>SEPA HUB 3A uplatnica</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveDocumentPolicy(pol)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <span>Svi dokumenti ({pol.documents.length})</span>
                        </button>
                      </div>

                      <div>
                        {pol.renewalOffer && !pol.renewalOffer.accepted ? (
                          <button
                            type="button"
                            onClick={() => {
                              acceptPolicyRenewal(pol.id);
                              setStatusBanner(
                                `Zahtjev za obnovu police ${pol.policyNumber} po cijeni ${formatEUR(pol.renewalOffer!.newPremiumAnnual)} je potvrđen!`
                              );
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>
                              1-Klik Obnova ({formatEUR(pol.renewalOffer.newPremiumAnnual)} • -{pol.renewalOffer.carrierDiscountPercentage}%)
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              acceptPolicyRenewal(pol.id);
                              setStatusBanner(`Poslan zahtjev za obnovu police ${pol.policyNumber}.`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Zatraži ponudu za obnovu</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MOJE PRIJAVLJENE ŠTETE (5-PHASE TRACKER) */}
        {activeTab === 'stete' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Moje prijavljene štete (5-fazno praćenje u stvarnom vremenu)
                </h2>
                <p className="text-xs text-slate-600">
                  Svaka promjena faze u Zastupničkom portalu vidljiva je odmah ovdje, uz bilješke zastupnika i AI asistenta.
                </p>
              </div>
              <Link
                to="/prijava-stete"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Prijavi novu štetu</span>
              </Link>
            </div>

            {claims.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Nemate aktivnih prijavljenih šteta</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  U slučaju prometne nezgode, oštećenja imovine ili zdravstvenog slučaja, prijavite štetu online u 3 minute.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {claims.map((claim) => {
                  const cPhase = claim.phase ?? 1;
                  return (
                    <div
                      key={claim.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono tabular-nums text-xs font-bold">
                              Broj spisa: {claim.id}
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono tabular-nums text-xs font-semibold">
                              Polica: {claim.policyNumber || claim.policyId}
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#C21817] text-xs font-bold">
                              Faza {cPhase}/5: {CLAIM_PHASE_LABELS.find((p) => p.phase === cPhase)?.label}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            {claim.category} — {claim.location} ({claim.incidentDate})
                          </h3>
                          <p className="text-xs text-slate-600">{claim.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[11px] text-slate-500 block">Traženi iznos / Isplatni IBAN</span>
                            <strong className="text-base font-extrabold font-mono tabular-nums text-slate-900">
                              {formatEUR(claim.claimAmountRequested || 0)}
                            </strong>
                            <span className="text-[11px] font-mono tabular-nums text-slate-500 block">
                              {claim.iban}
                            </span>
                          </div>
                          <button
                            type="button"
                            title="Povuci prijavu / ukloni nacrt (-)"
                            onClick={() => {
                              removeClaim(claim.id);
                              setStatusBanner(`Odštetni zahtjev ${claim.id} je povučen i uklonjen.`);
                            }}
                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 5-PHASE VISUAL PROGRESS BAR */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                          {CLAIM_PHASE_LABELS.map((step) => {
                            const isDone = cPhase > step.phase;
                            const isCurrent = cPhase === step.phase;
                            return (
                              <div
                                key={step.phase}
                                className={`p-3 rounded-xl border text-xs transition-all ${
                                  isCurrent
                                    ? 'bg-[#FEF2F2] border-[#C21817] text-slate-900 shadow-2xs'
                                    : isDone
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                    : 'bg-slate-50 border-slate-200 text-slate-400'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono font-bold text-[11px]">FAZA {step.phase}</span>
                                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                  {isCurrent && <span className="w-2 h-2 rounded-full bg-[#C21817] animate-ping" />}
                                </div>
                                <div className="font-bold leading-snug">{step.label}</div>
                                <div className="text-[11px] opacity-80 mt-0.5">{step.description}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Agent Notes & AI Status Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs flex-1">
                          <span className="font-bold text-slate-700 block mb-0.5">
                            Bilješka licenciranog zastupnika (Agencija Život):
                          </span>
                          <span className="text-slate-600">
                            {claim.agentNotes || 'Vaša prijava je zaprimljena te je u tijeku provjera dokumentacije.'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => openClaimAiModal(claim)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            <Bot className="w-4 h-4" />
                            <span>AI Status štete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INFORMATIVNE PONUDE */}
        {activeTab === 'ponude' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Informativne ponude i izračuni osiguratelja
                </h2>
                <p className="text-xs text-slate-600">
                  Klikom na "Prihvati ponudu" ponuda se automatski pretvara u aktivnu policu i prebacuje u "Moje aktivne police".
                </p>
              </div>
              <Link
                to="/zatrazi-ponudu"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Zatraži novu ponudu</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {informativeOffers.map((offer) => {
                const isAccepted = offer.status === 'prihvacena';
                const offerPremium = offer.annualPremium ?? offer.annualPremiumEur ?? 0;
                const offerMonthly = offer.monthlyInstallmentEur ?? offerPremium / 12;
                const offerRiders = offer.coverageHighlights || offer.riders || [];
                return (
                  <div
                    key={offer.id}
                    className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                      isAccepted ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono tabular-nums text-xs font-bold">
                            Ponuda: {offer.offerNumber}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#C21817] border border-red-200 text-xs font-bold">
                            {offer.carrier}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                            Paket: {offer.packageTier || 'Ekskluziv'}
                          </span>
                          {isAccepted ? (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold">
                              ✓ Prihvaćena i pretvorena u policu
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                              Status: {offer.status === 'poslana_klijentu' || offer.status === 'ponuda_spremna' ? 'Spremna za prihvat' : 'U obradi zastupnika'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900">{offer.productTitle}</h3>
                        <p className="text-xs text-slate-600">{offer.assetDescription}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                            Godišnja premija
                          </span>
                          <span className="text-xl font-extrabold font-mono tabular-nums text-[#C21817]">
                            {formatEUR(offerPremium)}
                          </span>
                          <span className="text-xs font-mono tabular-nums text-slate-500 block">
                            ili 12 × {formatEUR(offerMonthly)} / mj.
                          </span>
                        </div>
                        <button
                          type="button"
                          title="Odbij / ukloni ponudu (-)"
                          onClick={() => {
                            removeInformativeOffer(offer.id);
                            setStatusBanner(`Informativna ponuda ${offer.offerNumber} je uklonjena.`);
                          }}
                          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="py-4 border-b border-slate-100 flex flex-wrap gap-2">
                      {offerRiders.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                        >
                          • {item}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
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
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-[#C21817]" />
                          <span>Preuzmi informativni izračun (PDF)</span>
                        </button>
                        <span className="text-xs font-mono tabular-nums text-slate-500">
                          Ponuda vrijedi do: {offer.validUntil}
                        </span>
                      </div>

                      {!isAccepted && (
                        <button
                          type="button"
                          onClick={() => handleAcceptOffer(offer)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Prihvati ponudu (Aktiviraj policu)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT MANAGEMENT & GDPR DELETION CENTER */}
        {activeTab === 'racun_gdpr' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form
              onSubmit={handleSaveAccountProfile}
              className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
            >
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Osobni podaci, OIB/IBAN zapisi i privole
                </h2>
                <p className="text-xs text-slate-600">
                  Podaci se koriste za automatsko popunjavanje polica i isplatu šteta. OIB i IBAN prolaze strogu algoritamsku provjeru.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ime i prezime / Naziv</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    OIB (11 znamenki, ISO 7064 MOD 11,10)
                  </label>
                  <input
                    type="text"
                    value={profileOib}
                    onChange={(e) => setProfileOib(normalizeOIBInput(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-mono tabular-nums text-sm ${
                      isOibValid ? 'border-emerald-400 bg-emerald-50/20' : 'border-red-400 bg-red-50/20'
                    }`}
                  />
                  <span className={`text-[11px] font-mono ${isOibValid ? 'text-emerald-700' : 'text-red-600'}`}>
                    {isOibValid ? '✓ Valjan OIB prema kontrolnoj znamenci' : '✗ Neispravan OIB kontrolni broj'}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail adresa</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Broj mobitela</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono tabular-nums text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primarni IBAN račun za isplatu šteta (HR + 19 znamenki)
                  </label>
                  <input
                    type="text"
                    value={profileIban}
                    onChange={(e) => setProfileIban(normalizeIBANInput(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-mono tabular-nums text-sm ${
                      isIbanValid ? 'border-emerald-400 bg-emerald-50/20' : 'border-red-400 bg-red-50/20'
                    }`}
                  />
                  <span className={`text-[11px] font-mono ${isIbanValid ? 'text-emerald-700' : 'text-red-600'}`}>
                    {isIbanValid ? '✓ Valjan hrvatski IBAN (21 znak)' : '✗ Format mora biti HR + 19 znamenki'}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ulica i kućni broj</label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grad / Sjedište</label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Komunikacijske postavke</span>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" checked={prefEmail} onChange={(e) => setPrefEmail(e.target.checked)} />
                  <span>E-mail obavijesti o policama, ponudama i dokumentima</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" checked={prefSms} onChange={(e) => setPrefSms(e.target.checked)} />
                  <span>SMS podsjetnici 30 dana prije isteka registracije i police</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" checked={prefWhatsapp} onChange={(e) => setPrefWhatsapp(e.target.checked)} />
                  <span>Obavijesti o promjeni faze štete (1–5)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" checked={prefMarketing} onChange={(e) => setPrefMarketing(e.target.checked)} />
                  <span>Posebne pogodnosti Programa vjernosti i Toyota Centar Zagreb akcije</span>
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Spremi promjene profila
              </button>
            </form>

            {/* GDPR & AZOP Center */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <Lock className="w-3.5 h-3.5 text-[#C21817]" />
                <span>GDPR & AZOP Centar privatnosti</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Upravljanje osobnim podacima i pravo na brisanje (Čl. 17. GDPR)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sukladno Općoj uredbi o zaštiti podataka (EU 2016/679) i Zakonu o osiguranju, u svakom trenutku možete zatražiti izvoz svojih podataka ili trajno brisanje korisničkog računa.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Napomena uz GDPR zahtjev (opcionalno)
                </label>
                <textarea
                  rows={2}
                  value={gdprReason}
                  onChange={(e) => setGdprReason(e.target.value)}
                  placeholder="Npr. Želim kopiju svih izračuna ili brisanje računa..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => handleGdprAction('data_export')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Zatraži izvoz osobnih podataka (Čl. 20. GDPR)
              </button>

              <div className="pt-3 border-t border-slate-200 space-y-3">
                <label className="flex items-start gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={gdprConfirmDelete}
                    onChange={(e) => setGdprConfirmDelete(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Potvrđujem da želim podnijeti verificirani zahtjev za brisanje korisničkog računa i osobnih podataka koji nisu predmet zakonske obveze čuvanja.
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleGdprAction('account_deletion')}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-[#C21817] border border-red-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Podnesi zahtjev za brisanje računa (Čl. 17. GDPR)
                </button>
              </div>

              {gdprRequests.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block">
                    Evidentirani GDPR zahtjevi ({gdprRequests.length})
                  </span>
                  {gdprRequests.map((req) => (
                    <div key={req.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono">
                      <div>ID: {req.id} • {req.requestType}</div>
                      <div className="text-emerald-700">Status: {req.status}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PRESERVED TOOLS (COMPARISON MATRIX & MAYA ENGINE) */}
        {activeTab === 'alati' && (
          <div className="space-y-8">
            <MultiCarrierComparisonMatrix />
            <MayaQuoteEngine onCompleted={() => setActiveTab('police')} />
          </div>
        )}
      </div>

      {/* "+" ADD POLICY MODAL */}
      {showAddPolicyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Dodaj policu u Korisnički portal</h3>
              <button
                type="button"
                onClick={() => setShowAddPolicyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateManualPolicy} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Šifra police</label>
                <input
                  type="text"
                  value={newPolicyNumber}
                  onChange={(e) => setNewPolicyNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Osiguratelj</label>
                <select
                  value={newPolicyCarrier}
                  onChange={(e) => setNewPolicyCarrier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Generali osiguranje d.d.">Generali osiguranje d.d.</option>
                  <option value="Toyota Osiguranje (Generali osiguranje d.d.)">
                    Toyota Osiguranje (Generali osiguranje d.d.)
                  </option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Predmet osiguranja (Vozilo / Nekretnina / Osoba)</label>
                <input
                  type="text"
                  value={newPolicyAsset}
                  onChange={(e) => setNewPolicyAsset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vrsta</label>
                  <select
                    value={newPolicyType}
                    onChange={(e) => setNewPolicyType(e.target.value as Policy['type'])}
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
                  <label className="block font-bold text-slate-700 mb-1">Premija (€)</label>
                  <input
                    type="number"
                    value={newPolicyPremium}
                    onChange={(e) => setNewPolicyPremium(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dinamika</label>
                  <select
                    value={newPolicyFrequency}
                    onChange={(e) => setNewPolicyFrequency(e.target.value as 'monthly' | 'annual')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="monthly">Mjesečno</option>
                    <option value="annual">Godišnje</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPolicyModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C21817] text-white font-bold"
                >
                  Dodaj policu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTEXTUAL AI ASSISTANT MODAL ("AI Pomoć za policu" & "AI Status štete") */}
      {aiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C21817]">
                  <Bot className="w-4 h-4" />
                  <span>AGENCIJA ŽIVOT AI SAVJETNIK (HANFA IDD USKLAĐENO)</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{aiModal.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{aiModal.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setAiModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
              {aiModal.systemSummary}
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {aiChatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'ai'
                      ? 'bg-[#FEF2F2] border border-red-200 text-slate-900'
                      : 'bg-slate-900 text-white ml-8'
                  }`}
                >
                  <span className="font-bold block mb-1 text-[10px] uppercase tracking-wider opacity-75">
                    {msg.sender === 'ai' ? 'AI Analitičar Agencije Život' : user.displayName}
                  </span>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {aiModal.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendAiQuestion(q)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium transition-all cursor-pointer text-left"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuestion()}
                placeholder="Postavite pitanje o uvjetima police ili statusu štete..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
              <button
                type="button"
                onClick={() => handleSendAiQuestion()}
                className="px-4 py-2.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Pošalji</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instant Document Center Modal */}
      {activeDocumentPolicy && (
        <InstantDocumentCenter
          policy={activeDocumentPolicy}
          isOpen={!!activeDocumentPolicy}
          onClose={() => setActiveDocumentPolicy(null)}
        />
      )}

      {/* SEPA HUB 3A Payment Slip Modal */}
      {activePaymentSlipPolicy && (
        <Hub3aPaymentSlipModal
          isOpen={!!activePaymentSlipPolicy}
          onClose={() => setActivePaymentSlipPolicy(null)}
          data={{
            payerName: user.displayName || 'Marko Horvatić',
            amountEur:
              activePaymentSlipPolicy.paymentFrequency === 'monthly'
                ? Math.round((activePaymentSlipPolicy.premiumAnnual / 12) * 100) / 100
                : activePaymentSlipPolicy.premiumAnnual,
            paymentDescription: `Premija ${activePaymentSlipPolicy.carrier} polica ${activePaymentSlipPolicy.policyNumber}`,
            callNumber: `2026-${activePaymentSlipPolicy.policyNumber.replace(/\D/g, '').slice(0, 8) || '889120'}`,
          }}
        />
      )}
    </div>
  );
};

export default PortalDashboardPage;
