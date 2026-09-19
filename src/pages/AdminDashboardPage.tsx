import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Kanban,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  FileText,
  DollarSign,
  Plus,
  Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuotes } from '../hooks/useQuotes';
import { useClaims } from '../hooks/useClaims';
import { usePolicies } from '../hooks/usePolicies';
import { LeadPipelineKanban } from '../components/admin/LeadPipelineKanban';
import { RenewalAlertEngine } from '../components/admin/RenewalAlertEngine';
import { LeadsTable } from '../components/admin/LeadsTable';
import { QuotePipelineBoard } from '../components/admin/QuotePipelineBoard';
import { ClaimsManagementTable } from '../components/admin/ClaimsManagementTable';
import { RegulatoryAuditView } from '../components/admin/RegulatoryAuditView';
import { QuoteRequest, Claim } from '../types/database';
import { formatCurrency } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { quotes, updateQuoteStatus, isLoading: quotesLoading } = useQuotes();
  const { claims, updateClaimStatus, isLoading: claimsLoading } = useClaims();
  const { policies } = usePolicies();

  const [activeTab, setActiveTab] = useState<'kanban' | 'renewals' | 'leads' | 'claims' | 'audit'>('kanban');

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
    <div className="space-y-8 pb-24 text-slate-900 relative">
      {/* Top Header Banner */}
      <section className="relative overflow-hidden pt-12 pb-14">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-mono font-bold tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-slate-800">Broker Back-Office & CRM</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-teal-700">Agencija Život</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
              Upravljačka ploča brokera
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Pregled prodajnog lijevka, obrada dolaznih upita i rješavanje odštetnih spisa Generali osiguranja.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-600 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
              Prijavljeni broker:{' '}
              <strong className="text-slate-900 font-bold">{user?.displayName || 'Marija Šarić'}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-bento flex items-center gap-4 group hover:border-teal-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Novi upiti</span>
              <p className="text-2xl font-black text-slate-900 font-mono">{newLeadsCount}</p>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-bento flex items-center gap-4 group hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Ugovorene police</span>
              <p className="text-2xl font-black text-emerald-600 font-mono">{boundQuotesCount}</p>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-bento flex items-center gap-4 group hover:border-rose-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Štete u rješavanju</span>
              <p className="text-2xl font-black text-rose-600 font-mono">{activeClaimsCount}</p>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-bento flex items-center gap-4 group hover:border-teal-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Vrijednost pipelinea</span>
              <p className="text-xl font-bold text-teal-700 font-mono">
                {formatCurrency(totalPipelineVal)}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'kanban', label: 'Kanban Prodajni Lijevak (Live CRM)', icon: Kanban },
            { id: 'renewals', label: 'Automatizacija Obnova Polica', icon: Bell },
            { id: 'leads', label: `Svi Upiti & Klijenti (${quotes.length})`, icon: Users },
            { id: 'claims', label: `Likvidacija Šteta (${claims.length})`, icon: FileCheck },
            { id: 'audit', label: 'HANFA & IDD Usklađenost', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25 border border-teal-500'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-xs'
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

        {/* TAB 5: REGULATORY AUDIT */}
        {activeTab === 'audit' && (
          <RegulatoryAuditView />
        )}
      </div>
    </div>
  );
};
