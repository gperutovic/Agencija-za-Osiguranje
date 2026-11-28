import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck2,
  FileImage,
  LayoutGrid,
  List,
  Lock,
  MessageSquare,
  MessageSquareText,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { IS_DEMO_MODE_ENABLED, useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { agencyRepository, ALLOWED_NEXT_CLAIM_STAGE } from '../services/agencyRepository';
import {
  AdvisorThreadMessage,
  AiEscalationRecord,
  ClaimAttachment,
  ClaimRecord,
  ClaimStage,
  ComplaintRecord,
  PolicyEndorsement,
  PolicyRecord,
  QuotePipelineStatus,
  QuoteSubmission,
  SwitchAnalysisRecord,
  UserProfile,
} from '../types/domain';
import { addDaysIso, daysUntilDate, formatDateHr, formatDateTimeHr, formatEur } from '../utils/formatters';
import { CLAIM_STAGES, getClaimStageLabel } from './ClaimsFnolPage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { CardSkeleton, ErrorBanner } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

interface UnifiedPipelineItem {
  id: string;
  referenceNumber: string;
  kind: 'quote' | 'switch' | 'escalation';
  sourceLabel: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  summary: string;
  valueEur?: number;
  status: QuotePipelineStatus;
  assignedAgent?: string;
  createdAt: string;
  escalation?: AiEscalationRecord;
  quote?: QuoteSubmission;
}

function summarizeQuoteAsset(q: QuoteSubmission): string {
  switch (q.inputs.productLine) {
    case 'auto':
      return `${q.inputs.make} ${q.inputs.model} (${q.inputs.kw} kW, ${q.inputs.plateNumber}) • ${q.inputs.kaskoTier}`;
    case 'imovina':
      return `${q.inputs.propertyType === 'kuca' ? 'Kuća' : 'Stan'} ${q.inputs.areaSqm} m², ${q.inputs.city} (${q.inputs.postalCode})`;
    case 'zdravstveno':
      return `Zdravstveno (${q.inputs.planTier}) • ${q.inputs.familyMembers} osiguranika`;
    case 'zivotno':
      return `Životno osiguranje • svota ${formatEur(q.inputs.sumInsured)} (${q.inputs.termYears} god.)`;
    case 'putno':
      return `Putno (${q.inputs.destination}) • ${q.inputs.days} dana, ${q.inputs.travelers} putnika`;
    case 'ljubimci':
      return `Ljubimac (${q.inputs.petType}, ${q.inputs.breedSize})`;
    case 'poslovno':
      return `Poslovno (${q.inputs.companyType}, ${q.inputs.employees} zap.)`;
  }
}

export const AdminOpsPage: React.FC = () => {
  const { user, isAgent, signInAsDemo } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'endorsements' | 'renewals' | 'claims' | 'messages' | 'complaints'
  >('pipeline');
  const [pipelineView, setPipelineView] = useState<'kanban' | 'table'>('kanban');
  const [statusFilter, setStatusFilter] = useState<'all' | QuotePipelineStatus>('all');
  const [endorsementFilter, setEndorsementFilter] = useState<'requested' | 'completed' | 'all'>('requested');
  const [renewalHorizon, setRenewalHorizon] = useState<15 | 30 | 60>(60);

  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [switches, setSwitches] = useState<SwitchAnalysisRecord[]>([]);
  const [escalations, setEscalations] = useState<AiEscalationRecord[]>([]);
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [allMessages, setAllMessages] = useState<AdvisorThreadMessage[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reloadNonce, setReloadNonce] = useState(0);

  // Modals & Drawers State
  const [selectedEscalation, setSelectedEscalation] = useState<AiEscalationRecord | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);
  const [claimNote, setClaimNote] = useState('');
  const [claimEstAmount, setClaimEstAmount] = useState<string>('');
  const [claimUpdating, setClaimUpdating] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string; name: string; isPdf: boolean } | null>(null);

  // Quote -> Policy Issuance Drawer
  const [issuingQuote, setIssuingQuote] = useState<QuoteSubmission | null>(null);
  const [polNumber, setPolNumber] = useState('');
  const [polStartDate, setPolStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [polExpiryDate, setPolExpiryDate] = useState(addDaysIso(new Date().toISOString().slice(0, 10), 365));
  const [polGreenCard, setPolGreenCard] = useState('');
  const [polAssetSummary, setPolAssetSummary] = useState('');
  const [polFile, setPolFile] = useState<File | null>(null);
  const [polIssuing, setPolIssuing] = useState(false);

  // Endorsement Resolution State
  const [endorsementNotes, setEndorsementNotes] = useState<Record<string, string>>({});

  // Messages Inbox State
  const [selectedThreadUid, setSelectedThreadUid] = useState<string | null>(null);
  const [agentReply, setAgentReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Complaint Management Modal State
  const [editingComplaint, setEditingComplaint] = useState<ComplaintRecord | null>(null);
  const [compAgent, setCompAgent] = useState('');
  const [compStatus, setCompStatus] = useState<ComplaintRecord['status']>('in_review');
  const [compNotes, setCompNotes] = useState('');
  const [compSaving, setCompSaving] = useState(false);

  useEffect(() => {
    if (!isAgent) return;
    setLoading(true);
    setLoadError('');
    const unsub = agencyRepository.subscribeAdminQueues(
      (partial) => {
        if (partial.quotes) setQuotes(partial.quotes);
        if (partial.switches) setSwitches(partial.switches);
        if (partial.escalations) setEscalations(partial.escalations);
        if (partial.policies) setPolicies(partial.policies);
        if (partial.claims) setClaims(partial.claims);
        if (partial.complaints) setComplaints(partial.complaints);
        if (partial.messages) setAllMessages(partial.messages);
        if (partial.users) setUsers(partial.users);
        setLoading(false);
      },
      (err) => {
        setLoadError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [isAgent, reloadNonce]);

  const pipelineColumns: Array<{ id: QuotePipelineStatus; label: string }> = [
    { id: 'new', label: t('Novi upit', 'New Lead') },
    { id: 'quoted', label: t('Ponuda poslana', 'Quoted') },
    { id: 'bound', label: t('Ugovoreno', 'Bound') },
    { id: 'lost', label: t('Izgubljeno', 'Lost') },
  ];

  const unifiedPipeline = useMemo<UnifiedPipelineItem[]>(() => {
    const qItems: UnifiedPipelineItem[] = quotes.map((q) => ({
      id: q.id,
      referenceNumber: q.referenceNumber,
      kind: 'quote',
      sourceLabel: t('90s Kalkulator', '90s Quote'),
      customerName: q.customer.fullName,
      customerEmail: q.customer.email,
      customerPhone: q.customer.phone,
      summary: `${q.selectedOffer.carrierShortName} (${q.productLine})`,
      valueEur: q.selectedOffer.annualPrice,
      status: q.status,
      assignedAgent: q.assignedAgent,
      createdAt: q.createdAt,
      quote: q,
    }));

    const sItems: UnifiedPipelineItem[] = switches.map((s) => ({
      id: s.id,
      referenceNumber: s.referenceNumber,
      kind: 'switch',
      sourceLabel: 'Switch & Save',
      customerName: s.customerName ?? t('Klijent (upload police)', 'Client (policy upload)'),
      customerEmail: s.customerEmail ?? '—',
      customerPhone: s.customerPhone ?? '—',
      summary: `${s.extractedPolicy.insurer} • ${t('Ušteda', 'Savings')} ~${formatEur(s.estimatedAnnualSavings)}`,
      valueEur: s.estimatedNewAnnualPremium,
      status: s.status,
      assignedAgent: s.assignedAgent,
      createdAt: s.createdAt,
    }));

    const eItems: UnifiedPipelineItem[] = escalations.map((e) => ({
      id: e.id,
      referenceNumber: e.referenceNumber,
      kind: 'escalation',
      sourceLabel: t('AI Eskalacija', 'AI Handoff'),
      customerName: e.customerName,
      customerEmail: e.customerEmail,
      customerPhone: e.customerPhone,
      summary: e.topic,
      status: e.status,
      assignedAgent: e.assignedAgent,
      createdAt: e.createdAt,
      escalation: e,
    }));

    const merged = [...qItems, ...sItems, ...eItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return statusFilter === 'all' ? merged : merged.filter((i) => i.status === statusFilter);
  }, [quotes, switches, escalations, statusFilter, t]);

  const renewingPolicies = useMemo(() => {
    return policies
      .map((p) => ({ policy: p, daysLeft: daysUntilDate(p.expiryDate) }))
      .filter((item) => item.daysLeft <= renewalHorizon)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [policies, renewalHorizon]);

  // Flat Policy Endorsements Queue
  const endorsementQueue = useMemo(() => {
    const rows: Array<{ policy: PolicyRecord; endorsement: PolicyEndorsement }> = [];
    for (const pol of policies) {
      for (const end of pol.endorsements ?? []) {
        if (endorsementFilter === 'all' || end.status === endorsementFilter) {
          rows.push({ policy: pol, endorsement: end });
        }
      }
    }
    return rows.sort(
      (a, b) =>
        new Date(b.endorsement.createdAt).getTime() - new Date(a.endorsement.createdAt).getTime()
    );
  }, [policies, endorsementFilter]);

  const pendingEndorsementsCount = useMemo(
    () =>
      policies.reduce(
        (acc, p) => acc + (p.endorsements ?? []).filter((e) => e.status === 'requested').length,
        0
      ),
    [policies]
  );

  // Grouped Client Message Threads
  const messageThreads = useMemo(() => {
    const map = new Map<string, AdvisorThreadMessage[]>();
    for (const m of allMessages) {
      const list = map.get(m.threadUserId) ?? [];
      list.push(m);
      map.set(m.threadUserId, list);
    }
    return Array.from(map.entries())
      .map(([threadUserId, msgs]) => {
        const sorted = [...msgs].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        const last = sorted[sorted.length - 1]!;
        const clientUser = users.find((u) => u.uid === threadUserId);
        const clientPolicies = policies.filter((p) => p.userId === threadUserId);
        const clientName =
          clientUser?.fullName ||
          clientPolicies[0]?.clientName ||
          sorted.find((m) => m.senderRole === 'client')?.senderName ||
          threadUserId;
        const needsReply = last.senderRole === 'client';
        return {
          threadUserId,
          clientName,
          clientEmail: clientUser?.email ?? '—',
          clientPhone: clientUser?.phone ?? '—',
          policies: clientPolicies,
          messages: sorted,
          lastMessage: last,
          needsReply,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      );
  }, [allMessages, users, policies]);

  const unreadThreadsCount = useMemo(
    () => messageThreads.filter((th) => th.needsReply).length,
    [messageThreads]
  );

  const activeThread = useMemo(
    () => messageThreads.find((th) => th.threadUserId === selectedThreadUid) ?? messageThreads[0] ?? null,
    [messageThreads, selectedThreadUid]
  );

  // REAL COMPUTED AGENCY KPIs (Zero hardcoded toy values)
  const kpis = useMemo(() => {
    const activePolicies = policies.filter((p) => p.status !== 'expired');
    const activeGwp = activePolicies.reduce((sum, p) => sum + p.annualPremium, 0);
    const estCommission = activePolicies.reduce((sum, p) => {
      const rate = BRAND_CONFIG.commissionRatesByLine[p.productLine] ?? 0.14;
      return sum + p.annualPremium * rate;
    }, 0);
    const weightedCommissionPct = activeGwp > 0 ? Math.round((estCommission / activeGwp) * 100) : 0;

    // True Quote-to-Bound Conversion Rate
    const boundQuotes = quotes.filter((q) => q.status === 'bound').length;
    const conversionRate =
      quotes.length > 0 ? Math.round((boundQuotes / quotes.length) * 100) : null;

    // Real Average First Response Time from actual timestamps (minutes)
    const responseDiffsMin: number[] = [];
    for (const q of quotes) {
      if (q.status !== 'new' && q.updatedAt && q.createdAt) {
        const diff = (new Date(q.updatedAt).getTime() - new Date(q.createdAt).getTime()) / 60_000;
        if (diff > 0 && diff < 60 * 24 * 14) responseDiffsMin.push(diff);
      }
    }
    for (const c of claims) {
      if (c.stageHistory.length >= 2) {
        const diff =
          (new Date(c.stageHistory[1]!.timestamp).getTime() -
            new Date(c.stageHistory[0]!.timestamp).getTime()) /
          60_000;
        if (diff > 0 && diff < 60 * 24 * 14) responseDiffsMin.push(diff);
      }
    }
    const avgResponseMin =
      responseDiffsMin.length > 0
        ? Math.round(responseDiffsMin.reduce((a, b) => a + b, 0) / responseDiffsMin.length)
        : null;

    const avgResponseDisplay =
      avgResponseMin === null
        ? '—'
        : avgResponseMin < 60
          ? `${avgResponseMin} min`
          : `${(avgResponseMin / 60).toFixed(1).replace('.', ',')} h`;

    return {
      activeGwp,
      estCommission,
      weightedCommissionPct,
      boundQuotes,
      totalQuotes: quotes.length,
      conversionRate,
      avgResponseDisplay,
    };
  }, [policies, quotes, claims]);

  // ROLE PROTECTION GATE (Zero Demo Agent Bypass in Production!)
  if (!isAgent) {
    return (
      <div className="bg-canvas-warm py-20">
        <div className="max-w-md mx-auto px-4 text-center space-y-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-canvas border border-hairline flex items-center justify-center text-ink">
            <Lock className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-4xl text-ink">
            {t('Zaštićeni operativni portal', 'Protected Operations Portal')}
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed">
            {user
              ? t(
                  `Trenutno ste prijavljeni kao klijent (${user.fullName}). Za pristup agencijskom Back-Office sustavu potrebna je dodijeljena uloga licenciranog zastupnika (Firebase Custom Claim).`,
                  `You are signed in as a client (${user.fullName}). Agency Back-Office access requires an authorized licensed advisor role claim.`
                )
              : t(
                  'Pristup agencijskom operativnom sustavu (Kanban pipeline, izdavanje polica, Skadencar, trijaža šteta) dopušten je isključivo ovlaštenim zastupnicima.',
                  'Access to the agency operations portal is restricted to verified licensed advisors.'
                )}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2.5">
            <Link to="/moj-profil">
              <Button size="lg">
                <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
                <span>{t('Prijava putem Moj Profil', 'Sign in via My Profile')}</span>
              </Button>
            </Link>
            {IS_DEMO_MODE_ENABLED ? (
              <Button
                variant="outline"
                size="lg"
                onClick={async () => {
                  const agent = await signInAsDemo('agent');
                  showToast(`DEV Agent: ${agent.fullName}`, 'success');
                }}
              >
                DEV Zastupnik
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const openIssuePolicyDrawer = (quote: QuoteSubmission) => {
    const today = new Date().toISOString().slice(0, 10);
    setIssuingQuote(quote);
    setPolNumber(
      `${quote.selectedOffer.carrierId.slice(0, 3).toUpperCase()}-${quote.productLine.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`
    );
    setPolStartDate(today);
    setPolExpiryDate(
      quote.inputs.productLine === 'putno'
        ? addDaysIso(today, quote.inputs.days)
        : addDaysIso(today, 365)
    );
    setPolGreenCard(
      quote.productLine === 'auto' ? `HR/012/${Math.floor(100000 + Math.random() * 899999)}` : ''
    );
    setPolAssetSummary(summarizeQuoteAsset(quote));
    setPolFile(null);
  };

  const handleUpdatePipelineItem = async (
    item: UnifiedPipelineItem,
    patch: { status?: QuotePipelineStatus; assignedAgent?: string }
  ) => {
    try {
      if (item.kind === 'quote') {
        await agencyRepository.updateQuotePipeline(item.id, patch);
        if (patch.status === 'bound' && item.quote && !item.quote.policyId) {
          openIssuePolicyDrawer(item.quote);
        }
      } else if (item.kind === 'switch') {
        await agencyRepository.updateSwitchStatus(item.id, patch);
      } else {
        await agencyRepository.updateEscalationStatus(item.id, patch);
      }
      showToast(
        t(`Ažuriran predmet ${item.referenceNumber}.`, `Updated item ${item.referenceNumber}.`),
        'success'
      );
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Ažuriranje nije uspjelo.', 'Update failed.'), 'error');
    }
  };

  const handleIssuePolicySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issuingQuote || polNumber.trim().length < 5) {
      showToast(t('Unesite službeni broj police.', 'Enter the official carrier policy number.'), 'error');
      return;
    }
    setPolIssuing(true);
    try {
      const resolvedClient = await agencyRepository.resolveOrInviteClientForPolicy({
        existingUserId: issuingQuote.userId,
        email: issuingQuote.customer.email,
        fullName: issuingQuote.customer.fullName,
        oib: issuingQuote.customer.oib,
        phone: issuingQuote.customer.phone,
      });

      let policyPdfUrl: string | undefined;
      let policyPdfPath: string | undefined;
      const tempPolId = `pol-${Date.now()}`;
      if (polFile) {
        const uploaded = await agencyRepository.uploadPolicyFile(tempPolId, resolvedClient.uid, polFile);
        policyPdfUrl = uploaded.storageUrl;
        policyPdfPath = uploaded.storagePath;
      }

      const advisor = BRAND_CONFIG.licensedAdvisors.find((a) => a.name === user?.fullName);

      const created = await agencyRepository.createPolicy({
        policyNumber: polNumber.trim().toUpperCase(),
        userId: resolvedClient.uid,
        clientName: issuingQuote.customer.fullName,
        clientOib: issuingQuote.customer.oib,
        productLine: issuingQuote.productLine,
        carrierName: issuingQuote.selectedOffer.carrierName,
        status: 'active',
        startDate: polStartDate,
        expiryDate: polExpiryDate,
        annualPremium: issuingQuote.selectedOffer.annualPrice,
        monthlyPremium: issuingQuote.selectedOffer.monthlyPrice,
        deductible: issuingQuote.selectedOffer.deductible,
        coverageLimit: issuingQuote.selectedOffer.coverageLimit,
        assetSummary: polAssetSummary.trim() || summarizeQuoteAsset(issuingQuote),
        vehiclePlate:
          issuingQuote.inputs.productLine === 'auto' ? issuingQuote.inputs.plateNumber : undefined,
        propertyAddress:
          issuingQuote.inputs.productLine === 'imovina'
            ? `${issuingQuote.inputs.city} (${issuingQuote.inputs.postalCode})`
            : undefined,
        greenCardNumber: polGreenCard.trim() || undefined,
        ipidCode: issuingQuote.selectedOffer.ipidCode,
        policyPdfUrl,
        policyPdfPath,
        assignedAgent: user?.fullName,
        assignedAgentLicense: advisor?.hanfaLicense,
        sourceQuoteId: issuingQuote.id,
      });

      await agencyRepository.updateQuotePipeline(issuingQuote.id, {
        status: 'bound',
        policyId: created.id,
        assignedAgent: issuingQuote.assignedAgent || user?.fullName,
      });

      showToast(
        t(
          `Polica ${created.policyNumber} izdana je u klijentski novčanik!`,
          `Policy ${created.policyNumber} issued to client wallet!`
        ),
        'success'
      );
      setIssuingQuote(null);
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Izdavanje police nije uspjelo.', 'Policy issuance failed.'), 'error');
    } finally {
      setPolIssuing(false);
    }
  };

  const handleCompleteEndorsement = async (policy: PolicyRecord, endorsement: PolicyEndorsement) => {
    try {
      await agencyRepository.completePolicyEndorsement(
        policy.id,
        endorsement.id,
        endorsementNotes[endorsement.id] || '',
        user?.fullName || 'Zastupnik'
      );
      showToast(t('Zahtjev za izmjenu označen kao riješen.', 'Endorsement marked completed.'), 'success');
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Greška.', 'Action failed.'), 'error');
    }
  };

  const handleTriggerRenewal = async (policy: PolicyRecord) => {
    try {
      await agencyRepository.markRenewalReminderSent(policy.id);
      showToast(
        t(
          `Podsjetnik za obnovu police ${policy.policyNumber} je poslan klijentu.`,
          `Renewal reminder sent for ${policy.policyNumber}.`
        ),
        'success'
      );
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Greška pri slanju.', 'Failed to send.'), 'error');
    }
  };

  const handleAdvanceClaimStage = async (claim: ClaimRecord, nextStage: ClaimStage) => {
    const stageLabel = getClaimStageLabel(nextStage, language);
    const parsedEst = claimEstAmount.trim() !== '' ? Number(claimEstAmount) : undefined;
    if (parsedEst !== undefined && (Number.isNaN(parsedEst) || parsedEst < 0)) {
      showToast(t('Unesite valjan iznos procjene (€).', 'Enter a valid estimated amount (€).'), 'error');
      return;
    }

    setClaimUpdating(true);
    try {
      await agencyRepository.updateClaimTriage(claim.id, {
        stage: nextStage,
        note:
          claimNote.trim() ||
          `Status ažuriran u fazu: ${stageLabel} (${user?.fullName ?? 'Zastupnik'}).`,
        estimatedAmount: parsedEst,
        actor: user?.fullName,
      });
      showToast(
        t(`Šteta ${claim.referenceNumber} ažurirana: ${stageLabel}.`, `Claim ${claim.referenceNumber} updated: ${stageLabel}.`),
        'success'
      );
      setClaimNote('');
      setClaimEstAmount('');
      setSelectedClaim(null);
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Ažuriranje štete nije uspjelo.', 'Claim update failed.'), 'error');
    } finally {
      setClaimUpdating(false);
    }
  };

  const handleInspectAttachment = async (att: ClaimAttachment) => {
    const url = await agencyRepository.resolveAttachmentDownloadUrl(att);
    if (!url) {
      showToast(t('Datoteka nema spremljen prikaz.', 'No preview available for this file.'), 'info');
      return;
    }
    setLightboxMedia({
      url,
      name: att.name,
      isPdf: att.mimeType === 'application/pdf' || att.name.toLowerCase().endsWith('.pdf'),
    });
  };

  const handleSendAgentReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !user || !agentReply.trim()) return;
    setSendingReply(true);
    try {
      await agencyRepository.sendMessage({
        threadUserId: activeThread.threadUserId,
        senderRole: 'agent',
        senderName: user.fullName,
        text: agentReply.trim(),
      });
      setAgentReply('');
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Slanje odgovora nije uspjelo.', 'Reply failed.'), 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const openComplaintModal = (c: ComplaintRecord) => {
    setEditingComplaint(c);
    setCompAgent(c.assignedAgent || user?.fullName || '');
    setCompStatus(c.status === 'received' ? 'in_review' : c.status);
    setCompNotes(c.resolutionNotes || '');
  };

  const handleSaveComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplaint) return;
    if (compStatus === 'resolved' && compNotes.trim().length < 10) {
      showToast(
        t('Za zatvaranje prigovora unesite pisano obrazloženje (min 10 znakova).', 'Enter official resolution notes (min 10 characters).'),
        'error'
      );
      return;
    }
    setCompSaving(true);
    try {
      await agencyRepository.updateComplaint(editingComplaint.id, {
        status: compStatus,
        assignedAgent: compAgent,
        resolutionNotes: compNotes,
      });
      showToast(
        t(`Prigovor ${editingComplaint.protocolNumber} je ažuriran.`, `Complaint ${editingComplaint.protocolNumber} updated.`),
        'success'
      );
      setEditingComplaint(null);
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Ažuriranje prigovora nije uspjelo.', 'Update failed.'), 'error');
    } finally {
      setCompSaving(false);
    }
  };

  const localizeComplaintStatus = (status: ComplaintRecord['status']) => {
    if (status === 'received') return t('Zaprimljeno', 'Received');
    if (status === 'in_review') return t('U obradi', 'In Review');
    return t('Riješeno', 'Resolved');
  };

  return (
    <div className="bg-canvas-warm min-h-[82vh] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header — Clean Mobile Badge Alignment */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-hairline">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {t('Agencijska operativa • Back-Office', 'Agency Operations • Back-Office')}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl text-ink mt-1">
              {t('Upravljačka ploča zastupnika', 'Licensed Advisor Dashboard')}
            </h1>
            <p className="text-xs text-ink-muted mt-1">
              {t('Prijavljeni zastupnik:', 'Signed in advisor:')}{' '}
              <strong className="text-ink">{user?.fullName}</strong> • HANFA{' '}
              {BRAND_CONFIG.hanfaRegistrationNumber}
            </p>
          </div>
          <Badge variant="success" className="self-start sm:self-auto">
            {t('Sustav operativan', 'System Operational')}
          </Badge>
        </div>

        {loadError ? (
          <ErrorBanner
            message={loadError}
            onRetry={() => setReloadNonce((n) => n + 1)}
            retryLabel={t('Pokušaj ponovno', 'Retry')}
          />
        ) : null}

        {/* Real Computed Agency KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">{t('Aktivna bruto premija (GWP)', 'Active GWP')}</div>
            <div className="text-2xl sm:text-3xl font-bold text-ink mt-1 tabular-nums">
              {formatEur(kpis.activeGwp)}
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">
              {t('Procijenjena provizija', 'Est. Commission')}
              {kpis.weightedCommissionPct > 0 ? ` (~${kpis.weightedCommissionPct}%)` : ''}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-status-success mt-1 tabular-nums">
              {formatEur(kpis.estCommission)}
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">
              {t('Konverzija ponuda', 'Quote-to-Bound Rate')}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink mt-1 tabular-nums">
              {kpis.conversionRate !== null ? `${kpis.conversionRate}%` : '—'}
            </div>
            <div className="text-[11px] text-ink-muted tabular-nums mt-0.5">
              {kpis.boundQuotes} / {kpis.totalQuotes} {t('ugovoreno', 'bound')}
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">
              {t('Prosječno vrijeme odgovora', 'Avg. First Response')}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink mt-1 tabular-nums">
              {kpis.avgResponseDisplay}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'pipeline', label: `${t('Upiti & Pipeline', 'Pipeline')} (${unifiedPipeline.length})` },
                { id: 'endorsements', label: `${t('Izmjene polica', 'Endorsements')} (${pendingEndorsementsCount})` },
                { id: 'renewals', label: `${t('Skadencar', 'Renewals')} (${renewingPolicies.length})` },
                { id: 'claims', label: `${t('Trijaža šteta', 'Claims')} (${claims.length})` },
                {
                  id: 'messages',
                  label: `${t('Poruke klijenata', 'Client Inbox')} (${messageThreads.length})`,
                  badge: unreadThreadsCount,
                },
                { id: 'complaints', label: `${t('Prigovori čl. 401.', 'Complaints')} (${complaints.length})` },
              ] as Array<{ id: typeof activeTab; label: string; badge?: number }>
            ).map((tabItem) => (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => setActiveTab(tabItem.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === tabItem.id
                    ? 'bg-ink text-white'
                    : 'bg-canvas border border-hairline text-ink-secondary hover:text-ink'
                }`}
              >
                <span>{tabItem.label}</span>
                {tabItem.badge && tabItem.badge > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-pill bg-accent text-white text-[10px] leading-none tabular-nums">
                    {tabItem.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {activeTab === 'pipeline' ? (
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | QuotePipelineStatus)}
                aria-label={t('Filtriraj po statusu', 'Filter by status')}
                className="h-9 rounded-lg border border-hairline bg-canvas px-3 text-xs font-semibold text-ink"
              >
                <option value="all">{t('Svi statusi', 'All statuses')}</option>
                {pipelineColumns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="inline-flex rounded-lg border border-hairline bg-canvas p-0.5">
                <button
                  type="button"
                  onClick={() => setPipelineView('kanban')}
                  className={`p-1.5 rounded ${pipelineView === 'kanban' ? 'bg-ink text-white' : 'text-ink-muted'}`}
                  aria-label="Kanban"
                >
                  <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setPipelineView('table')}
                  className={`p-1.5 rounded ${pipelineView === 'table' ? 'bg-ink text-white' : 'text-ink-muted'}`}
                  aria-label={t('Tablica', 'Table')}
                >
                  <List className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {loading ? <CardSkeleton rows={3} /> : null}

        {/* TAB 1: LEAD & QUOTE PIPELINE + ISSUE POLICY WORKFLOW */}
        {!loading && activeTab === 'pipeline' ? (
          pipelineView === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {pipelineColumns.map((col) => {
                const colItems = unifiedPipeline.filter((i) => i.status === col.id);
                return (
                  <div
                    key={col.id}
                    className="rounded-editorial bg-canvas border border-hairline p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-hairline">
                      <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-ink">
                        {col.label}
                      </h2>
                      <span className="text-xs font-semibold text-ink-muted tabular-nums">
                        {colItems.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {colItems.length === 0 ? (
                        <p className="text-xs text-ink-muted py-4 text-center">
                          {t('Nema predmeta', 'No items')}
                        </p>
                      ) : (
                        colItems.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg border border-hairline bg-canvas-warm/60 p-3.5 space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-ink tabular-nums">
                                {item.referenceNumber}
                              </span>
                              <Badge
                                variant={
                                  item.kind === 'escalation'
                                    ? 'accent'
                                    : item.kind === 'switch'
                                      ? 'warning'
                                      : 'neutral'
                                }
                              >
                                {item.sourceLabel}
                              </Badge>
                            </div>

                            <div>
                              <div className="text-sm font-semibold text-ink">{item.customerName}</div>
                              <div className="text-xs text-ink-secondary line-clamp-2">{item.summary}</div>
                              {item.valueEur ? (
                                <div className="text-xs font-bold text-ink tabular-nums mt-1">
                                  {formatEur(item.valueEur)} / {t('god.', 'yr.')}
                                </div>
                              ) : null}
                            </div>

                            {item.escalation ? (
                              <button
                                type="button"
                                onClick={() => setSelectedEscalation(item.escalation ?? null)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                              >
                                <MessageSquareText className="w-3.5 h-3.5" />
                                <span>{t('Otvori AI transkript', 'Open AI transcript')}</span>
                              </button>
                            ) : null}

                            {item.quote && item.status === 'bound' ? (
                              item.quote.policyId ? (
                                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-success">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{t('Polica izdana u novčanik', 'Policy issued to wallet')}</span>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  fullWidth
                                  onClick={() => openIssuePolicyDrawer(item.quote!)}
                                >
                                  <FileCheck2 className="w-3.5 h-3.5" />
                                  <span>{t('Izdaj policu klijentu', 'Issue Policy to Wallet')}</span>
                                </Button>
                              )
                            ) : null}

                            <div className="pt-2 border-t border-hairline grid grid-cols-2 gap-1.5">
                              <select
                                value={item.assignedAgent ?? ''}
                                aria-label={`Agent ${item.referenceNumber}`}
                                onChange={(e) =>
                                  void handleUpdatePipelineItem(item, {
                                    assignedAgent: e.target.value || undefined,
                                  })
                                }
                                className="h-8 rounded border border-hairline bg-canvas px-1.5 text-[11px] text-ink"
                              >
                                <option value="">{t('Dodijeli agenta', 'Assign agent')}</option>
                                {BRAND_CONFIG.licensedAdvisors.map((adv) => (
                                  <option key={adv.id} value={adv.name}>
                                    {adv.name}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={item.status}
                                aria-label={`Status ${item.referenceNumber}`}
                                onChange={(e) =>
                                  void handleUpdatePipelineItem(item, {
                                    status: e.target.value as QuotePipelineStatus,
                                  })
                                }
                                className="h-8 rounded border border-hairline bg-canvas px-1.5 text-[11px] text-ink"
                              >
                                {pipelineColumns.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-editorial bg-canvas border border-hairline overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-canvas-warm text-xs text-ink-muted uppercase">
                    <th className="py-3 px-4">{t('Oznaka', 'Ref')}</th>
                    <th className="py-3 px-4">{t('Klijent', 'Client')}</th>
                    <th className="py-3 px-4">{t('Izvor / Predmet', 'Source / Summary')}</th>
                    <th className="py-3 px-4">{t('Agent', 'Agent')}</th>
                    <th className="py-3 px-4">{t('Status / Akcija', 'Status / Action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {unifiedPipeline.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4 font-semibold tabular-nums">{item.referenceNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-ink">{item.customerName}</div>
                        <div className="text-xs text-ink-muted">{item.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-ink">{item.sourceLabel}</div>
                        <div className="text-xs text-ink-secondary">{item.summary}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {item.assignedAgent ?? t('Nedodijeljeno', 'Unassigned')}
                      </td>
                      <td className="py-3 px-4 flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            void handleUpdatePipelineItem(item, {
                              status: e.target.value as QuotePipelineStatus,
                            })
                          }
                          className="h-8 rounded border border-hairline bg-canvas px-2 text-xs"
                        >
                          {pipelineColumns.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        {item.quote && item.status === 'bound' && !item.quote.policyId ? (
                          <Button size="sm" onClick={() => openIssuePolicyDrawer(item.quote!)}>
                            {t('Izdaj policu', 'Issue Policy')}
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}

        {/* TAB 2: POLICY ENDORSEMENTS & RENEWAL QUEUE */}
        {!loading && activeTab === 'endorsements' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-secondary">
                {t(
                  'Zahtjevi klijenata za izmjene polica (vozač, adresa, pokriće) i obnove:',
                  'Client-submitted policy modifications and renewal requests:'
                )}
              </p>
              <div className="inline-flex rounded-lg border border-hairline bg-canvas p-1 text-xs font-semibold">
                {(
                  [
                    { id: 'requested', label: t('Na čekanju', 'Pending') },
                    { id: 'completed', label: t('Riješeno', 'Completed') },
                    { id: 'all', label: t('Sve', 'All') },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setEndorsementFilter(f.id)}
                    className={`px-3 py-1.5 rounded-md ${
                      endorsementFilter === f.id ? 'bg-ink text-white' : 'text-ink-secondary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {endorsementQueue.length === 0 ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-8 text-center text-sm text-ink-secondary">
                {t('Nema zahtjeva za izmjenu polica u ovom filtru.', 'No endorsement requests match this filter.')}
              </div>
            ) : (
              <div className="space-y-3">
                {endorsementQueue.map(({ policy, endorsement }) => (
                  <div
                    key={`${policy.id}-${endorsement.id}`}
                    className="rounded-editorial bg-canvas border border-hairline p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold tabular-nums">{policy.policyNumber}</span>
                          <Badge variant={endorsement.status === 'completed' ? 'success' : 'warning'}>
                            {endorsement.status === 'completed'
                              ? t('Riješeno', 'Completed')
                              : t('Zatraženo', 'Requested')}
                          </Badge>
                          <Badge variant="neutral">{endorsement.type}</Badge>
                        </div>
                        <div className="text-sm font-semibold text-ink">
                          {policy.clientName} • {policy.carrierName}
                        </div>
                        <p className="text-xs text-ink-secondary">{endorsement.summary}</p>
                        {endorsement.agentNote ? (
                          <p className="text-xs text-status-success font-medium">
                            {t('Bilješka zastupnika:', 'Advisor note:')} {endorsement.agentNote}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-xs text-ink-muted tabular-nums">
                        {formatDateTimeHr(endorsement.createdAt)}
                      </span>
                    </div>

                    {endorsement.status === 'requested' ? (
                      <div className="pt-3 border-t border-hairline flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={endorsementNotes[endorsement.id] ?? ''}
                          onChange={(e) =>
                            setEndorsementNotes((prev) => ({
                              ...prev,
                              [endorsement.id]: e.target.value,
                            }))
                          }
                          placeholder={t(
                            'Opcionalna poruka klijentu (npr. Aneks polica poslan na e-mail)...',
                            'Optional note to client (e.g. Endorsement schedule issued)...'
                          )}
                          className="flex-1 h-9 rounded-lg border border-hairline-strong px-3 text-xs text-ink"
                        />
                        <Button
                          size="sm"
                          onClick={() => void handleCompleteEndorsement(policy, endorsement)}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t('Označi riješenim', 'Mark Completed')}</span>
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* TAB 3: RENEWAL RADAR (SKADENCAR — 60 / 30 / 15 DAYS) */}
        {!loading && activeTab === 'renewals' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-secondary">
                {t(
                  'Police kojima istječe trajanje unutar odabranog horizonta:',
                  'Policies expiring within the selected horizon:'
                )}
              </p>
              <div className="inline-flex rounded-lg border border-hairline bg-canvas p-1 text-xs font-semibold tabular-nums">
                {([15, 30, 60] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setRenewalHorizon(days)}
                    className={`px-3 py-1.5 rounded-md ${
                      renewalHorizon === days ? 'bg-ink text-white' : 'text-ink-secondary'
                    }`}
                  >
                    {t(`Do ${days} dana`, `Within ${days}d`)}
                  </button>
                ))}
              </div>
            </div>

            {renewingPolicies.length === 0 ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-8 text-center text-sm text-ink-secondary">
                {t('Nema polica koje istječu u ovom razdoblju.', 'No policies expiring in this window.')}
              </div>
            ) : (
              <div className="space-y-3">
                {renewingPolicies.map(({ policy, daysLeft }) => (
                  <div
                    key={policy.id}
                    className="rounded-editorial bg-canvas border border-hairline p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold tabular-nums">{policy.policyNumber}</span>
                        <Badge variant={daysLeft <= 15 ? 'danger' : daysLeft <= 30 ? 'warning' : 'neutral'}>
                          {t(
                            `Istječe za ${daysLeft} dana (${formatDateHr(policy.expiryDate)})`,
                            `Expires in ${daysLeft}d (${formatDateHr(policy.expiryDate)})`
                          )}
                        </Badge>
                      </div>
                      <div className="text-sm font-semibold text-ink">
                        {policy.clientName} — {policy.carrierName}
                      </div>
                      <div className="text-xs text-ink-secondary">
                        {policy.assetSummary} •{' '}
                        <strong className="tabular-nums">{formatEur(policy.annualPremium)}</strong>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {policy.renewalReminderSentAt ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-status-success">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {t('Podsjetnik poslan', 'Reminder sent')} ({formatDateHr(policy.renewalReminderSentAt)})
                          </span>
                        </span>
                      ) : (
                        <Button size="sm" onClick={() => void handleTriggerRenewal(policy)}>
                          <Bell className="w-3.5 h-3.5" strokeWidth={1.75} />
                          <span>{t('Pošalji podsjetnik za obnovu', 'Send Renewal Reminder')}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* TAB 4: CLAIMS TRIAGE QUEUE */}
        {!loading && activeTab === 'claims' ? (
          <div className="space-y-4">
            {claims.length === 0 ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-8 text-center text-sm text-ink-secondary">
                {t('Nema zaprimljenih šteta.', 'No claims submitted yet.')}
              </div>
            ) : (
              claims.map((claim) => (
                <div
                  key={claim.id}
                  className="rounded-editorial bg-canvas border border-hairline p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold tabular-nums">{claim.referenceNumber}</span>
                      <Badge variant="accent">{getClaimStageLabel(claim.stage, language)}</Badge>
                      <span className="text-xs text-ink-muted tabular-nums">
                        {t('Polica:', 'Policy:')} {claim.policyNumber}
                      </span>
                      {typeof claim.estimatedAmount === 'number' && claim.estimatedAmount > 0 ? (
                        <Badge variant="success">{formatEur(claim.estimatedAmount)}</Badge>
                      ) : null}
                    </div>
                    <div className="text-sm font-semibold text-ink">
                      {claim.claimantName} • {claim.carrierName}
                    </div>
                    <p className="text-xs text-ink-secondary">{claim.description}</p>
                    <div className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                      <FileImage className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>
                        {claim.attachments.length} {t('priloženih dokumenata', 'attachments')}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedClaim(claim);
                      setClaimNote('');
                      setClaimEstAmount(
                        typeof claim.estimatedAmount === 'number' ? String(claim.estimatedAmount) : ''
                      );
                    }}
                  >
                    {t('Otvori i ažuriraj fazu', 'Open & Triage')}
                  </Button>
                </div>
              ))
            )}
          </div>
        ) : null}

        {/* TAB 5: TWO-WAY CLIENT ↔ ADVISOR MESSAGE INBOX */}
        {!loading && activeTab === 'messages' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Threads List */}
            <div className="lg:col-span-4 rounded-editorial bg-canvas border border-hairline overflow-hidden">
              <div className="px-4 py-3 border-b border-hairline bg-canvas-warm text-xs font-bold uppercase tracking-wider text-ink">
                {t('Razgovori s klijentima', 'Client Threads')} ({messageThreads.length})
              </div>
              <div className="divide-y divide-hairline max-h-[520px] overflow-y-auto">
                {messageThreads.length === 0 ? (
                  <p className="p-6 text-xs text-ink-muted text-center">
                    {t('Nema aktivnih razgovora.', 'No client conversations yet.')}
                  </p>
                ) : (
                  messageThreads.map((th) => {
                    const active = activeThread?.threadUserId === th.threadUserId;
                    return (
                      <button
                        key={th.threadUserId}
                        type="button"
                        onClick={() => setSelectedThreadUid(th.threadUserId)}
                        className={`w-full text-left p-4 space-y-1 transition-colors ${
                          active ? 'bg-accent-soft/60' : 'hover:bg-canvas-warm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-ink truncate">
                            {th.clientName}
                          </span>
                          {th.needsReply ? (
                            <Badge variant="accent">{t('Novo', 'Unread')}</Badge>
                          ) : null}
                        </div>
                        <p className="text-xs text-ink-secondary line-clamp-1">
                          {th.lastMessage.text}
                        </p>
                        <div className="text-[11px] text-ink-muted tabular-nums">
                          {formatDateTimeHr(th.lastMessage.createdAt)} • {th.policies.length}{' '}
                          {t('polica', 'policies')}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Active Thread & Client Context */}
            <div className="lg:col-span-8 rounded-editorial bg-canvas border border-hairline flex flex-col overflow-hidden min-h-[460px]">
              {activeThread ? (
                <>
                  <div className="px-5 py-4 border-b border-hairline bg-canvas-warm flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-accent" />
                      <div>
                        <div className="text-sm font-bold text-ink">{activeThread.clientName}</div>
                        <div className="text-xs text-ink-muted">
                          {activeThread.clientEmail} • {activeThread.clientPhone}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeThread.policies.map((p) => (
                        <Badge key={p.id} variant="neutral">
                          {p.policyNumber}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 p-5 space-y-3.5 max-h-[380px] overflow-y-auto">
                    {activeThread.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.senderRole === 'agent' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[82%] rounded-editorial px-4 py-2.5 text-sm ${
                            m.senderRole === 'agent'
                              ? 'bg-ink text-white'
                              : 'bg-canvas-warm border border-hairline text-ink'
                          }`}
                        >
                          <div className="text-[11px] opacity-70 mb-1">
                            {m.senderName} • {formatDateTimeHr(m.createdAt)}
                          </div>
                          <p className="leading-relaxed">{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleSendAgentReply}
                    className="p-4 border-t border-hairline flex items-center gap-2.5"
                  >
                    <input
                      type="text"
                      value={agentReply}
                      onChange={(e) => setAgentReply(e.target.value)}
                      placeholder={t('Odgovorite klijentu...', 'Reply to client...')}
                      className="flex-1 h-11 rounded-lg border border-hairline-strong px-3.5 text-sm text-ink focus:outline-none focus:border-accent"
                    />
                    <Button type="submit" disabled={!agentReply.trim()} isLoading={sendingReply}>
                      <Send className="w-4 h-4" />
                      <span>{t('Pošalji', 'Send')}</span>
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-10 text-sm text-ink-muted">
                  {t('Odaberite razgovor s lijeve strane.', 'Select a client thread on the left.')}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* TAB 6: INTERACTIVE STATUTORY COMPLAINTS REGISTER (Art. 401) */}
        {!loading && activeTab === 'complaints' ? (
          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-8 text-center text-sm text-ink-secondary">
                {t('Nema urudžbiranih prigovora.', 'No statutory complaints recorded.')}
              </div>
            ) : (
              complaints.map((c) => {
                const daysLeft = daysUntilDate(c.statutoryDeadlineDate);
                return (
                  <div
                    key={c.id}
                    className="rounded-editorial bg-canvas border border-hairline p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold tabular-nums">{c.protocolNumber}</span>
                        <Badge
                          variant={
                            c.status === 'resolved'
                              ? 'success'
                              : c.status === 'in_review'
                                ? 'warning'
                                : 'accent'
                          }
                        >
                          {localizeComplaintStatus(c.status)}
                        </Badge>
                        {c.status !== 'resolved' ? (
                          <Badge variant={daysLeft <= 3 ? 'danger' : 'neutral'}>
                            {t(
                              `Preostalo ${Math.max(0, daysLeft)} dana (rok ${formatDateHr(c.statutoryDeadlineDate)})`,
                              `${Math.max(0, daysLeft)}d left (due ${formatDateHr(c.statutoryDeadlineDate)})`
                            )}
                          </Badge>
                        ) : null}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => openComplaintModal(c)}>
                        {t('Obradi prigovor', 'Process Complaint')}
                      </Button>
                    </div>
                    <div className="text-sm font-semibold text-ink">{c.subject}</div>
                    <p className="text-xs text-ink-secondary">{c.description}</p>
                    {c.resolutionNotes ? (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-ink">
                        <strong>{t('Službeni odgovor / bilješka:', 'Official resolution:')}</strong>{' '}
                        {c.resolutionNotes}
                      </div>
                    ) : null}
                    <div className="text-xs text-ink-muted tabular-nums flex flex-wrap gap-x-3 gap-y-1">
                      <span>
                        {t('Podnositelj:', 'Claimant:')} {c.fullName} (OIB: {c.oib})
                      </span>
                      <span>{c.email}</span>
                      <span>{c.phone}</span>
                      {c.assignedAgent ? (
                        <span>
                          • {t('Zadužen:', 'Owner:')} {c.assignedAgent}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : null}
      </div>

      {/* Quote -> Policy Issuance Drawer */}
      <Drawer
        isOpen={Boolean(issuingQuote)}
        onClose={() => setIssuingQuote(null)}
        title={t('Izdaj policu u novčanik klijenta', 'Issue Policy to Client Wallet')}
        subtitle={
          issuingQuote
            ? `${issuingQuote.referenceNumber} • ${issuingQuote.customer.fullName} (OIB: ${issuingQuote.customer.oib})`
            : undefined
        }
      >
        {issuingQuote ? (
          <form onSubmit={handleIssuePolicySubmit} className="space-y-4">
            <div className="rounded-lg bg-canvas-warm border border-hairline p-3.5 text-xs space-y-1 tabular-nums">
              <div className="font-semibold text-ink">{issuingQuote.selectedOffer.carrierName}</div>
              <div className="text-ink-secondary">
                {formatEur(issuingQuote.selectedOffer.annualPrice)} / {t('god.', 'yr.')} •{' '}
                {t('Franšiza', 'Deductible')}: {formatEur(issuingQuote.selectedOffer.deductible)} •{' '}
                {t('Limit', 'Limit')}: {formatEur(issuingQuote.selectedOffer.coverageLimit)}
              </div>
            </div>

            <Input
              label={t('Službeni broj police osiguratelja *', 'Official carrier policy number *')}
              value={polNumber}
              onChange={(e) => setPolNumber(e.target.value)}
              tabular
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('Početak važenja *', 'Start date *')}
                type="date"
                value={polStartDate}
                onChange={(e) => setPolStartDate(e.target.value)}
                tabular
              />
              <Input
                label={t('Datum isteka (skadenca) *', 'Expiry date *')}
                type="date"
                value={polExpiryDate}
                onChange={(e) => setPolExpiryDate(e.target.value)}
                tabular
              />
            </div>

            {issuingQuote.productLine === 'auto' ? (
              <Input
                label={t('Broj Zelene karte (opcionalno)', 'Green Card number (optional)')}
                value={polGreenCard}
                onChange={(e) => setPolGreenCard(e.target.value)}
                tabular
              />
            ) : null}

            <Input
              label={t('Sažetak predmeta osiguranja *', 'Insured asset summary *')}
              value={polAssetSummary}
              onChange={(e) => setPolAssetSummary(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink">
                {t('Službeni PDF police / IPID (opcionalno)', 'Carrier Policy PDF / IPID (optional)')}
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPolFile(e.target.files?.[0] ?? null)}
                className="w-full text-xs text-ink-secondary file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-hairline-strong file:bg-canvas-warm file:text-xs file:font-semibold file:text-ink"
              />
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={polIssuing}>
              <FileCheck2 className="w-4 h-4" />
              <span>{t('Izdaj i spremi u novčanik klijenta', 'Issue & Save to Client Wallet')}</span>
            </Button>
          </form>
        ) : null}
      </Drawer>

      {/* AI Escalation Transcript Modal */}
      <Modal
        isOpen={Boolean(selectedEscalation)}
        onClose={() => setSelectedEscalation(null)}
        title={`${t('Transkript razgovora', 'Conversation Transcript')} — ${selectedEscalation?.referenceNumber ?? ''}`}
        subtitle={
          selectedEscalation
            ? `${selectedEscalation.customerName} • ${selectedEscalation.customerEmail} • ${selectedEscalation.customerPhone}`
            : undefined
        }
      >
        {selectedEscalation ? (
          <div className="space-y-3">
            {selectedEscalation.transcript.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-ink text-white ml-6'
                    : 'bg-canvas-warm border border-hairline text-ink mr-6'
                }`}
              >
                <div className="font-semibold opacity-75 mb-1">
                  {m.sender === 'user' ? t('Klijent', 'Client') : t('AI Savjetnik', 'AI Advisor')}
                </div>
                {m.text}
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      {/* Claim Triage Detail, Estimated Amount, Lightbox & Sequential Stage Transition Modal */}
      <Modal
        isOpen={Boolean(selectedClaim)}
        onClose={() => setSelectedClaim(null)}
        title={`${t('Trijaža štete', 'Claim Triage')} — ${selectedClaim?.referenceNumber ?? ''}`}
        subtitle={
          selectedClaim
            ? `${selectedClaim.claimantName} • ${t('Polica', 'Policy')} ${selectedClaim.policyNumber}`
            : undefined
        }
      >
        {selectedClaim ? (
          <div className="space-y-5">
            <div className="text-sm text-ink space-y-1">
              <p className="font-semibold">
                {t('Opis događaja', 'Incident description')} ({selectedClaim.incidentLocation}):
              </p>
              <p className="text-ink-secondary">{selectedClaim.description}</p>
              {selectedClaim.policeReportFiled ? (
                <p className="text-xs text-ink-muted">
                  {t('Policijski zapisnik:', 'Police report:')}{' '}
                  {selectedClaim.policeStation || t('Da', 'Yes')}{' '}
                  {selectedClaim.policeReportNumber ? `(${selectedClaim.policeReportNumber})` : ''}
                </p>
              ) : null}
            </div>

            {selectedClaim.attachments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-ink">
                  {t('Prilozi klijenta (kliknite za puni prikaz):', 'Client attachments (click to inspect):')}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {selectedClaim.attachments.map((att) => (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => void handleInspectAttachment(att)}
                      className="text-left rounded-lg border border-hairline hover:border-ink p-2 text-xs space-y-1.5 transition-colors"
                    >
                      {att.previewDataUrl ? (
                        <img
                          src={att.previewDataUrl}
                          alt={att.name}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-24 rounded bg-canvas-warm flex items-center justify-center text-ink-muted">
                          <FileImage className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate font-medium text-ink">{att.name}</span>
                        <ExternalLink className="w-3 h-3 text-accent shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-3 pt-3 border-t border-hairline">
              <Input
                label={t('Procijenjeni / odobreni iznos (€)', 'Estimated / approved payout (€)')}
                type="number"
                min={0}
                step={10}
                value={claimEstAmount}
                onChange={(e) => setClaimEstAmount(e.target.value)}
                placeholder="npr. 540"
                tabular
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink">
                  {t('Napomena vidljiva klijentu', 'Client-visible advisor note')}
                </label>
                <input
                  type="text"
                  value={claimNote}
                  onChange={(e) => setClaimNote(e.target.value)}
                  placeholder={t(
                    'npr. Procjenitelj zakazan za četvrtak u 10:00...',
                    'e.g. Adjuster scheduled for Thursday at 10:00...'
                  )}
                  className="w-full h-10 rounded-lg border border-hairline-strong px-3 text-sm"
                />
              </div>

              {/* Strictly Sequential Stage Buttons matching firestore.rules */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] text-ink-muted">
                  {t(
                    'Faze napreduju redoslijedom (možete dodati bilješku u trenutnoj fazi ili pomaknuti u sljedeću):',
                    'Stages progress sequentially (add a note on current stage or advance to the next valid stage):'
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CLAIM_STAGES.map((st, idx) => {
                    const currentIdx = CLAIM_STAGES.findIndex((s) => s.id === selectedClaim.stage);
                    const allowedNext = ALLOWED_NEXT_CLAIM_STAGE[selectedClaim.stage];
                    const isCurrent = st.id === selectedClaim.stage;
                    const isNextValid = st.id === allowedNext;
                    const isCompleted = idx < currentIdx;
                    const disabled = !isCurrent && !isNextValid;

                    return (
                      <Button
                        key={st.id}
                        size="sm"
                        disabled={disabled}
                        isLoading={claimUpdating}
                        variant={isNextValid ? 'primary' : isCurrent ? 'secondary' : 'outline'}
                        onClick={() => void handleAdvanceClaimStage(selectedClaim, st.id)}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>
                          {language === 'en' ? st.labelEn : st.label}
                          {isNextValid ? ' →' : ''}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Full-Resolution Attachment Lightbox Modal */}
      <Modal
        isOpen={Boolean(lightboxMedia)}
        onClose={() => setLightboxMedia(null)}
        title={lightboxMedia?.name ?? t('Pregled priloga', 'Attachment Preview')}
        maxWidthClass="max-w-3xl"
        footer={
          lightboxMedia ? (
            <div className="flex justify-end gap-2">
              <a
                href={lightboxMedia.url}
                download={lightboxMedia.name}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink/90"
              >
                <Download className="w-4 h-4" />
                <span>{t('Preuzmi izvornu datoteku', 'Download Original')}</span>
              </a>
            </div>
          ) : null
        }
      >
        {lightboxMedia ? (
          lightboxMedia.isPdf ? (
            <iframe
              src={lightboxMedia.url}
              title={lightboxMedia.name}
              className="w-full h-[65vh] rounded border border-hairline"
            />
          ) : (
            <img
              src={lightboxMedia.url}
              alt={lightboxMedia.name}
              className="w-full max-h-[65vh] object-contain rounded border border-hairline bg-canvas-warm"
            />
          )
        ) : null}
      </Modal>

      {/* Statutory Art. 401 Complaint Processing Modal */}
      <Modal
        isOpen={Boolean(editingComplaint)}
        onClose={() => setEditingComplaint(null)}
        title={t('Obrada prigovora (čl. 401.)', 'Process Statutory Complaint (Art. 401)')}
        subtitle={
          editingComplaint
            ? `${editingComplaint.protocolNumber} • ${editingComplaint.fullName} • ${t('Rok', 'Due')}: ${formatDateHr(editingComplaint.statutoryDeadlineDate)}`
            : undefined
        }
      >
        {editingComplaint ? (
          <form onSubmit={handleSaveComplaint} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink">
                {t('Zaduženi zastupnik', 'Assigned owner')}
              </label>
              <select
                value={compAgent}
                onChange={(e) => setCompAgent(e.target.value)}
                className="w-full h-11 rounded-lg border border-hairline-strong bg-canvas px-3 text-sm text-ink"
              >
                <option value="">{t('Odaberi zastupnika', 'Select advisor')}</option>
                {BRAND_CONFIG.licensedAdvisors.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink">
                {t('Status prigovora', 'Complaint status')}
              </label>
              <select
                value={compStatus}
                onChange={(e) => setCompStatus(e.target.value as ComplaintRecord['status'])}
                className="w-full h-11 rounded-lg border border-hairline-strong bg-canvas px-3 text-sm text-ink"
              >
                {editingComplaint.status === 'received' ? (
                  <>
                    <option value="received">{localizeComplaintStatus('received')}</option>
                    <option value="in_review">{localizeComplaintStatus('in_review')}</option>
                  </>
                ) : editingComplaint.status === 'in_review' ? (
                  <>
                    <option value="in_review">{localizeComplaintStatus('in_review')}</option>
                    <option value="resolved">{localizeComplaintStatus('resolved')}</option>
                  </>
                ) : (
                  <option value="resolved">{localizeComplaintStatus('resolved')}</option>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink">
                {t('Službeni pisani odgovor / obrazloženje', 'Official written response / resolution notes')}
              </label>
              <textarea
                rows={4}
                value={compNotes}
                onChange={(e) => setCompNotes(e.target.value)}
                placeholder={t(
                  'Unesite službeni odgovor koji se dostavlja potrošaču pri zatvaranju prigovora...',
                  'Enter the official written response delivered to the consumer...'
                )}
                className="w-full rounded-lg border border-hairline-strong p-3 text-sm text-ink focus:outline-none focus:border-accent"
              />
            </div>

            <Button type="submit" fullWidth isLoading={compSaving}>
              {compStatus === 'resolved'
                ? t('Spremi i zatvori prigovor', 'Save & Resolve Complaint')
                : t('Spremi ažuriranje', 'Save Update')}
            </Button>
          </form>
        ) : null}
      </Modal>
    </div>
  );
};
