import React, { useState, useEffect } from 'react';
import {
  Users,
  Kanban,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Bell,
  MessageSquareWarning,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuotes } from '../hooks/useQuotes';
import { useClaims } from '../hooks/useClaims';
import { usePolicies } from '../hooks/usePolicies';
import { firestoreService } from '../api/firestoreService';
import { LeadPipelineKanban } from '../components/admin/LeadPipelineKanban';
import { RenewalAlertEngine } from '../components/admin/RenewalAlertEngine';
import { LeadsTable } from '../components/admin/LeadsTable';
import { ClaimsManagementTable } from '../components/admin/ClaimsManagementTable';
import { RegulatoryAuditView } from '../components/admin/RegulatoryAuditView';
import { QuoteRequest, Claim, ComplaintRecord } from '../types/database';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Badge } from '../components/common/Badge';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { quotes, updateQuoteStatus } = useQuotes();
  const { claims, updateClaimStatus } = useClaims();
  const { policies } = usePolicies();

  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'kanban' | 'renewals' | 'leads' | 'claims' | 'complaints' | 'audit'>('kanban');

  useEffect(() => {
    firestoreService.getComplaints().then(setComplaints).catch(() => {});
  }, []);

  // Aggregated KPIs
  const newLeadsCount = quotes.filter((q: QuoteRequest) => q.status === 'new').length;
  const boundQuotesCount = quotes.filter((q: QuoteRequest) => q.status === 'bound').length;
  const activeClaimsCount = claims.filter(
    (c: Claim) => c.status === 'submitted' || c.status === 'under_review' || c.status === 'assessing'
  ).length;
  const totalPipelineVal = quotes.reduce(
    (sum: number, q: QuoteRequest) => sum + (q.calculatedEstimate.annualPremium || 0),
    0
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-900">
      {/* Top Header Banner */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2942]/5 border border-[#0F2942]/15 text-xs font-semibold text-[#0F2942] mb-2">
              <span>Agencijski CRM i back-office</span>
              <span className="text-slate-400">&bull;</span>
              <span>Agencija Život</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Upravljačka ploča zastupnika
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pregled prodajnog lijevka, obrada dolaznih upita, obnova polica i praćenje odštetnih spisa.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-600 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
              Prijavljeni zastupnik:{' '}
              <strong className="text-slate-900 font-semibold">{user?.displayName || 'Marija Šarić'}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Novi upiti</span>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{newLeadsCount}</p>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ugovorene police</span>
              <p className="text-2xl font-bold text-emerald-700 tabular-nums">{boundQuotesCount}</p>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Štete u rješavanju</span>
              <p className="text-2xl font-bold text-rose-700 tabular-nums">{activeClaimsCount}</p>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F2942]/5 border border-[#0F2942]/15 text-[#0F2942] flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vrijednost upita</span>
              <p className="text-xl font-bold text-[#0F2942] tabular-nums">
                {formatCurrency(totalPipelineVal)}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'kanban', label: 'Prodajni lijevak (CRM)', icon: Kanban },
            { id: 'renewals', label: 'Obnove polica', icon: Bell },
            { id: 'leads', label: `Svi upiti i klijenti (${quotes.length})`, icon: Users },
            { id: 'claims', label: `Likvidacija šteta (${claims.length})`, icon: FileCheck },
            { id: 'complaints', label: `Prigovori (${complaints.length})`, icon: MessageSquareWarning },
            { id: 'audit', label: 'HANFA i IDD usklađenost', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0F2942] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: LIVE KANBAN PIPELINE */}
        {activeTab === 'kanban' && (
          <LeadPipelineKanban />
        )}

        {/* TAB 2: RENEWAL ALERT ENGINE */}
        {activeTab === 'renewals' && (
          <RenewalAlertEngine policies={policies} />
        )}

        {/* TAB 3: LEADS TABLE */}
        {activeTab === 'leads' && (
          <LeadsTable quotes={quotes} onStatusChange={updateQuoteStatus} />
        )}

        {/* TAB 4: CLAIMS MANAGEMENT */}
        {activeTab === 'claims' && (
          <ClaimsManagementTable claims={claims} onUpdateStatus={updateClaimStatus} />
        )}

        {/* TAB 5: STATUTORY COMPLAINTS REGISTER */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">Knjiga prigovora potrošača (čl. 401. Zakona o osiguranju)</h3>
              <p className="text-xs text-slate-600 mt-0.5">Zakonski rok za pisani odgovor podnositelju iznosi 15 dana od primitka.</p>
            </div>
            {complaints.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Trenutno nema zaprimljenih prigovora.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#0F2942]">{c.protocolId || c.id}</span>
                        <Badge variant={c.status === 'resolved' ? 'success' : 'warning'}>{c.status}</Badge>
                        {c.policyNumber && (
                          <span className="text-xs font-mono text-slate-500">Polica: {c.policyNumber}</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{c.fullName} &bull; {c.email}</p>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{c.description}</p>
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums shrink-0">{formatDate(c.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: REGULATORY AUDIT */}
        {activeTab === 'audit' && (
          <RegulatoryAuditView />
        )}
      </div>
    </div>
  );
};
