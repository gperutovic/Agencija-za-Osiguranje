import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  FileImage,
  LayoutGrid,
  List,
  Lock,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useAuth } from '../context/AuthContext';
import { agencyRepository } from '../services/agencyRepository';
import {
  AiEscalationRecord,
  ClaimRecord,
  ClaimStage,
  ComplaintRecord,
  PolicyRecord,
  QuotePipelineStatus,
  QuoteSubmission,
  SwitchAnalysisRecord,
} from '../types/domain';
import { daysUntilDate, formatDateHr, formatEur } from '../utils/formatters';
import { CLAIM_STAGES } from './ClaimsFnolPage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

const PIPELINE_COLUMNS: Array<{ id: QuotePipelineStatus; label: string }> = [
  { id: 'new', label: 'Novi upit' },
  { id: 'quoted', label: 'Ponuda poslana' },
  { id: 'bound', label: 'Ugovoreno' },
  { id: 'lost', label: 'Izgubljeno' },
];

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
}

export const AdminOpsPage: React.FC = () => {
  const { user, isAgent, signInAsDemo } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'renewals' | 'claims' | 'complaints'>(
    'pipeline'
  );
  const [pipelineView, setPipelineView] = useState<'kanban' | 'table'>('kanban');
  const [statusFilter, setStatusFilter] = useState<'all' | QuotePipelineStatus>('all');
  const [renewalHorizon, setRenewalHorizon] = useState<15 | 30 | 60>(60);

  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [switches, setSwitches] = useState<SwitchAnalysisRecord[]>([]);
  const [escalations, setEscalations] = useState<AiEscalationRecord[]>([]);
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);

  const [selectedEscalation, setSelectedEscalation] = useState<AiEscalationRecord | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);
  const [claimNote, setClaimNote] = useState('');

  const loadAll = async () => {
    const [q, s, e, p, c, comp] = await Promise.all([
      agencyRepository.getQuotes(),
      agencyRepository.getSwitchAnalyses(),
      agencyRepository.getEscalations(),
      agencyRepository.getPolicies(),
      agencyRepository.getClaims(),
      agencyRepository.getComplaints(),
    ]);
    setQuotes(q);
    setSwitches(s);
    setEscalations(e);
    setPolicies(p);
    setClaims(c);
    setComplaints(comp);
  };

  useEffect(() => {
    if (isAgent) {
      void loadAll();
    }
  }, [isAgent]);

  const unifiedPipeline = useMemo<UnifiedPipelineItem[]>(() => {
    const qItems: UnifiedPipelineItem[] = quotes.map((q) => ({
      id: q.id,
      referenceNumber: q.referenceNumber,
      kind: 'quote',
      sourceLabel: '90s Kalkulator',
      customerName: q.customer.fullName,
      customerEmail: q.customer.email,
      customerPhone: q.customer.phone,
      summary: `${q.selectedOffer.carrierShortName} (${q.productLine})`,
      valueEur: q.selectedOffer.annualPrice,
      status: q.status,
      assignedAgent: q.assignedAgent,
      createdAt: q.createdAt,
    }));

    const sItems: UnifiedPipelineItem[] = switches.map((s) => ({
      id: s.id,
      referenceNumber: s.referenceNumber,
      kind: 'switch',
      sourceLabel: 'Switch & Save',
      customerName: s.customerName ?? 'Klijent (upload police)',
      customerEmail: s.customerEmail ?? '—',
      customerPhone: s.customerPhone ?? '—',
      summary: `${s.extractedPolicy.insurer} • Ušteda ~${formatEur(s.estimatedAnnualSavings)}`,
      valueEur: s.estimatedNewAnnualPremium,
      status: s.status,
      assignedAgent: s.assignedAgent,
      createdAt: s.createdAt,
    }));

    const eItems: UnifiedPipelineItem[] = escalations.map((e) => ({
      id: e.id,
      referenceNumber: e.referenceNumber,
      kind: 'escalation',
      sourceLabel: 'AI Eskalacija',
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
  }, [quotes, switches, escalations, statusFilter]);

  const renewingPolicies = useMemo(() => {
    return policies
      .map((p) => ({ policy: p, daysLeft: daysUntilDate(p.expiryDate) }))
      .filter((item) => item.daysLeft <= renewalHorizon)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [policies, renewalHorizon]);

  // ROLE PROTECTION GATE
  if (!isAgent) {
    return (
      <div className="bg-canvas-warm py-20">
        <div className="max-w-md mx-auto px-4 text-center space-y-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-canvas border border-hairline flex items-center justify-center text-ink">
            <Lock className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-4xl text-ink">Zaštićeni operativni portal</h1>
          <p className="text-sm text-ink-secondary leading-relaxed">
            {user
              ? `Trenutno ste prijavljeni kao klijent (${user.fullName}). Za pristup agencijskom Back-Office sustavu potrebna je uloga licenciranog zastupnika.`
              : 'Pristup agencijskom operativnom sustavu (Kanban pipeline, Skadencar, trijaža šteta) dopušten je isključivo ovlaštenim zastupnicima.'}
          </p>
          <Button
            size="lg"
            onClick={() => {
              const agent = signInAsDemo('agent');
              showToast(`Prijavljeni ste kao ovlašteni zastupnik ${agent.fullName}.`, 'success');
            }}
          >
            <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
            <span>Prijava kao zastupnik (Demo: Marko Kovač)</span>
          </Button>
        </div>
      </div>
    );
  }

  // Agency KPI Calculations
  const activeGwp = policies.reduce((sum, p) => sum + p.annualPremium, 0);
  const estCommission = activeGwp * 0.14;
  const boundCount = unifiedPipeline.filter((i) => i.status === 'bound').length;
  const totalPipelineCount = Math.max(1, quotes.length + switches.length + escalations.length);
  const conversionRate = Math.round(((boundCount + policies.length) / (totalPipelineCount + policies.length)) * 100);

  const handleUpdatePipelineItem = async (
    item: UnifiedPipelineItem,
    patch: { status?: QuotePipelineStatus; assignedAgent?: string }
  ) => {
    if (item.kind === 'quote') {
      await agencyRepository.updateQuotePipeline(item.id, patch);
    } else if (item.kind === 'switch') {
      await agencyRepository.updateSwitchStatus(item.id, patch);
    } else {
      await agencyRepository.updateEscalationStatus(item.id, patch);
    }
    showToast(`Ažuriran predmet ${item.referenceNumber}.`, 'success');
    await loadAll();
  };

  const handleTriggerRenewal = async (policy: PolicyRecord) => {
    await agencyRepository.markRenewalReminderSent(policy.id);
    showToast(`Podsjetnik za obnovu police ${policy.policyNumber} je poslan klijentu.`, 'success');
    await loadAll();
  };

  const handleAdvanceClaimStage = async (claim: ClaimRecord, nextStage: ClaimStage) => {
    const stageLabel = CLAIM_STAGES.find((s) => s.id === nextStage)?.label ?? nextStage;
    await agencyRepository.updateClaimStage(
      claim.id,
      nextStage,
      claimNote.trim() || `Status ažuriran u fazu: ${stageLabel} (${user?.fullName ?? 'Zastupnik'}).`
    );
    showToast(`Šteta ${claim.referenceNumber} prebačena u: ${stageLabel}.`, 'success');
    setClaimNote('');
    setSelectedClaim(null);
    await loadAll();
  };

  return (
    <div className="bg-canvas-warm min-h-[82vh] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-hairline">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Agencijska operativa • Back-Office
            </p>
            <h1 className="font-display text-3xl sm:text-5xl text-ink mt-1">
              Upravljačka ploča zastupnika
            </h1>
            <p className="text-xs text-ink-muted mt-1">
              Prijavljeni zastupnik: <strong className="text-ink">{user?.fullName}</strong> • HANFA{' '}
              {BRAND_CONFIG.hanfaRegistrationNumber}
            </p>
          </div>
          <Badge variant="success">Sustav operativan</Badge>
        </div>

        {/* Agency KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">Aktivna bruto premija (GWP)</div>
            <div className="text-2xl sm:text-3xl font-bold text-ink mt-1 tabular-nums">
              {formatEur(activeGwp)}
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">Procijenjena provizija (~14%)</div>
            <div className="text-2xl sm:text-3xl font-bold text-status-success mt-1 tabular-nums">
              {formatEur(estCommission)}
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">Stopa konverzije</div>
            <div className="text-2xl sm:text-3xl font-bold text-ink mt-1 tabular-nums">
              {conversionRate}%
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">Prosječno vrijeme odgovora</div>
            <div className="text-2xl sm:text-3xl font-bold text-ink mt-1 tabular-nums">18 min</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'pipeline', label: `Upiti & Pipeline (${unifiedPipeline.length})` },
                { id: 'renewals', label: `Skadencar / Obnove (${renewingPolicies.length})` },
                { id: 'claims', label: `Trijaža šteta (${claims.length})` },
                { id: 'complaints', label: `Prigovori čl. 401. (${complaints.length})` },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === t.id
                    ? 'bg-ink text-white'
                    : 'bg-canvas border border-hairline text-ink-secondary hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'pipeline' ? (
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | QuotePipelineStatus)}
                aria-label="Filtriraj po statusu"
                className="h-9 rounded-lg border border-hairline bg-canvas px-3 text-xs font-semibold text-ink"
              >
                <option value="all">Svi statusi</option>
                {PIPELINE_COLUMNS.map((c) => (
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
                  aria-label="Kanban prikaz"
                >
                  <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setPipelineView('table')}
                  className={`p-1.5 rounded ${pipelineView === 'table' ? 'bg-ink text-white' : 'text-ink-muted'}`}
                  aria-label="Tablični prikaz"
                >
                  <List className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* TAB 1: LEAD & QUOTE PIPELINE */}
        {activeTab === 'pipeline' ? (
          pipelineView === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {PIPELINE_COLUMNS.map((col) => {
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
                        <p className="text-xs text-ink-muted py-4 text-center">Nema predmeta</p>
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
                              <div className="text-sm font-semibold text-ink">
                                {item.customerName}
                              </div>
                              <div className="text-xs text-ink-secondary line-clamp-2">
                                {item.summary}
                              </div>
                              {item.valueEur ? (
                                <div className="text-xs font-bold text-ink tabular-nums mt-1">
                                  {formatEur(item.valueEur)} / god.
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
                                <span>Otvori AI transkript</span>
                              </button>
                            ) : null}

                            <div className="pt-2 border-t border-hairline grid grid-cols-2 gap-1.5">
                              <select
                                value={item.assignedAgent ?? ''}
                                aria-label={`Dodijeli agenta za ${item.referenceNumber}`}
                                onChange={(e) =>
                                  void handleUpdatePipelineItem(item, {
                                    assignedAgent: e.target.value || undefined,
                                  })
                                }
                                className="h-8 rounded border border-hairline bg-canvas px-1.5 text-[11px] text-ink"
                              >
                                <option value="">Dodijeli agenta</option>
                                {BRAND_CONFIG.licensedAdvisors.map((adv) => (
                                  <option key={adv.id} value={adv.name}>
                                    {adv.name}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={item.status}
                                aria-label={`Promijeni status za ${item.referenceNumber}`}
                                onChange={(e) =>
                                  void handleUpdatePipelineItem(item, {
                                    status: e.target.value as QuotePipelineStatus,
                                  })
                                }
                                className="h-8 rounded border border-hairline bg-canvas px-1.5 text-[11px] text-ink"
                              >
                                {PIPELINE_COLUMNS.map((c) => (
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
                    <th className="py-3 px-4">Oznaka</th>
                    <th className="py-3 px-4">Klijent</th>
                    <th className="py-3 px-4">Izvor / Predmet</th>
                    <th className="py-3 px-4">Agent</th>
                    <th className="py-3 px-4">Status</th>
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
                      <td className="py-3 px-4 text-xs">{item.assignedAgent ?? 'Nedodijeljeno'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            void handleUpdatePipelineItem(item, {
                              status: e.target.value as QuotePipelineStatus,
                            })
                          }
                          className="h-8 rounded border border-hairline bg-canvas px-2 text-xs"
                        >
                          {PIPELINE_COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}

        {/* TAB 2: RENEWAL RADAR (SKADENCAR — 60 / 30 / 15 DAYS) */}
        {activeTab === 'renewals' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-secondary">
                Police kojima istječe trajanje unutar odabranog horizonta:
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
                    Do {days} dana
                  </button>
                ))}
              </div>
            </div>

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
                        Istječe za {daysLeft} dana ({formatDateHr(policy.expiryDate)})
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
                        <span>Podsjetnik poslan ({formatDateHr(policy.renewalReminderSentAt)})</span>
                      </span>
                    ) : (
                      <Button size="sm" onClick={() => void handleTriggerRenewal(policy)}>
                        <Bell className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>Pošalji podsjetnik za obnovu</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* TAB 3: CLAIMS TRIAGE QUEUE */}
        {activeTab === 'claims' ? (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="rounded-editorial bg-canvas border border-hairline p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold tabular-nums">{claim.referenceNumber}</span>
                    <Badge variant="accent">
                      {CLAIM_STAGES.find((s) => s.id === claim.stage)?.label}
                    </Badge>
                    <span className="text-xs text-ink-muted tabular-nums">
                      Polica: {claim.policyNumber}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-ink">
                    {claim.claimantName} • {claim.carrierName}
                  </div>
                  <p className="text-xs text-ink-secondary">{claim.description}</p>
                  <div className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                    <FileImage className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{claim.attachments.length} priloženih fotografija/dokumenata</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelectedClaim(claim)}>
                  Otvori i ažuriraj fazu
                </Button>
              </div>
            ))}
          </div>
        ) : null}

        {/* TAB 4: STATUTORY COMPLAINTS REGISTER (Art. 401) */}
        {activeTab === 'complaints' ? (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="rounded-editorial bg-canvas border border-hairline p-5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tabular-nums">{c.protocolNumber}</span>
                    <Badge variant={c.status === 'resolved' ? 'success' : 'warning'}>
                      {c.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-ink-muted tabular-nums">
                    Zakonski rok odgovora (15 dana): {formatDateHr(c.statutoryDeadlineDate)}
                  </span>
                </div>
                <div className="text-sm font-semibold text-ink">{c.subject}</div>
                <p className="text-xs text-ink-secondary">{c.description}</p>
                <div className="text-xs text-ink-muted tabular-nums">
                  Podnositelj: {c.fullName} (OIB: {c.oib}) • {c.email} • {c.phone}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* AI Escalation Transcript Modal */}
      <Modal
        isOpen={Boolean(selectedEscalation)}
        onClose={() => setSelectedEscalation(null)}
        title={`Transkript razgovora — ${selectedEscalation?.referenceNumber ?? ''}`}
        subtitle={
          selectedEscalation
            ? `${selectedEscalation.customerName} • ${selectedEscalation.customerEmail} • ${selectedEscalation.customerPhone}`
            : undefined
        }
      >
        {selectedEscalation ? (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
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
                  {m.sender === 'user' ? 'Klijent' : 'AI Savjetnik'}
                </div>
                {m.text}
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      {/* Claim Triage Detail & Stage Transition Modal */}
      <Modal
        isOpen={Boolean(selectedClaim)}
        onClose={() => setSelectedClaim(null)}
        title={`Trijaža štete — ${selectedClaim?.referenceNumber ?? ''}`}
        subtitle={
          selectedClaim
            ? `${selectedClaim.claimantName} • Polica ${selectedClaim.policyNumber}`
            : undefined
        }
      >
        {selectedClaim ? (
          <div className="space-y-5">
            <div className="text-sm text-ink space-y-1">
              <p className="font-semibold">Opis događaja ({selectedClaim.incidentLocation}):</p>
              <p className="text-ink-secondary">{selectedClaim.description}</p>
            </div>

            {selectedClaim.attachments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-ink">Prilozi klijenta:</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedClaim.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="rounded-lg border border-hairline p-2 text-xs space-y-1.5"
                    >
                      {att.previewDataUrl ? (
                        <img
                          src={att.previewDataUrl}
                          alt={att.name}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : null}
                      <div className="truncate font-medium text-ink">{att.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-2 pt-3 border-t border-hairline">
              <label className="block text-xs font-semibold text-ink">
                Napomena vidljiva klijentu
              </label>
              <input
                type="text"
                value={claimNote}
                onChange={(e) => setClaimNote(e.target.value)}
                placeholder="npr. Procjenitelj zakazan za četvrtak u 10:00..."
                className="w-full h-10 rounded-lg border border-hairline-strong px-3 text-sm"
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                {CLAIM_STAGES.map((st) => (
                  <Button
                    key={st.id}
                    size="sm"
                    variant={selectedClaim.stage === st.id ? 'primary' : 'outline'}
                    onClick={() => void handleAdvanceClaimStage(selectedClaim, st.id)}
                  >
                    {st.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
