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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuotes } from '../hooks/useQuotes';
import { useClaims } from '../hooks/useClaims';
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

  const [activeTab, setActiveTab] = useState<'leads' | 'pipeline' | 'claims' | 'audit'>('leads');

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
    <div className="space-y-8 pb-20">
      {/* Top Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-brand-950 to-navy-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 px-3 py-0.5 rounded-full border border-teal-400/30">
                Broker Back-Office & CRM &bull; Agencija Život
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Upravljačka ploča brokera
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Pregled prodajnog lijevka, obrada dolaznih upita i rješavanje odštetnih spisa Generali osiguranja.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-medium">
              Prijavljeni broker:{' '}
              <strong className="text-white">{user?.displayName || 'Marija Šarić'}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Novi upiti</span>
              <p className="text-2xl font-black text-slate-900">{newLeadsCount}</p>
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Ugovorene police</span>
              <p className="text-2xl font-black text-emerald-700">{boundQuotesCount}</p>
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Štete u rješavanju</span>
              <p className="text-2xl font-black text-rose-700">{activeClaimsCount}</p>
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Vrijednost pipelinea</span>
              <p className="text-xl font-bold text-slate-900 font-mono">
                {formatCurrency(totalPipelineVal)}
              </p>
            </div>
          </Card>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'leads', label: `Upiti i Klijenti (${quotes.length})`, icon: Users },
            { id: 'pipeline', label: 'Kanban Prodajni Lijevak', icon: Kanban },
            { id: 'claims', label: `Likvidacija Šteta (${claims.length})`, icon: FileCheck },
            { id: 'audit', label: 'HANFA & IDD Usklađenost', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: LEADS TABLE */}
        {activeTab === 'leads' && (
          <LeadsTable quotes={quotes} onStatusChange={updateQuoteStatus} />
        )}

        {/* TAB 2: PIPELINE BOARD */}
        {activeTab === 'pipeline' && (
          <QuotePipelineBoard quotes={quotes} onStatusChange={updateQuoteStatus} />
        )}

        {/* TAB 3: CLAIMS MANAGEMENT */}
        {activeTab === 'claims' && (
          <ClaimsManagementTable claims={claims} onUpdateStatus={updateClaimStatus} />
        )}

        {/* TAB 4: REGULATORY AUDIT */}
        {activeTab === 'audit' && (
          <RegulatoryAuditView />
        )}
      </div>
    </div>
  );
};
