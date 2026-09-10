import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Download, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Building2, 
  PlusCircle, 
  FolderLock, 
  Calendar, 
  TrendingUp, 
  Sparkles,
  Phone,
  Mail,
  HelpCircle,
  FileCheck,
  RefreshCw,
  X,
  Truck,
  MapPin,
  Laptop
} from 'lucide-react';
import { ValiantNavbar } from '../../components/valiant/Navbar';
import { ValiantFooter } from '../../components/valiant/Footer';
import { useValiantStore } from '../../services/valiantStore';
import { generateAcord25Pdf, generateBinderPdf } from '../../services/pdfGenerator';
import { Policy, CoiCertificate, EndorsementType, CarrierQuote } from '../../types/valiant';

export const EnterprisePortalPage: React.FC = () => {
  const { 
    account, 
    quoteFormData,
    policies, 
    cois, 
    claims, 
    endorsements, 
    submitEndorsement 
  } = useValiantStore();

  const [activeTab, setActiveTab] = useState<'policies' | 'cois' | 'claims' | 'endorsements' | 'documents'>('policies');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  // Endorsement Modal State
  const [isEndorsementModalOpen, setIsEndorsementModalOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(policies[0]?.id || '');
  const [endorsementType, setEndorsementType] = useState<EndorsementType>('add_location');
  const [endorsementEffectiveDate, setEndorsementEffectiveDate] = useState<string>('2026-04-01');
  const [endorsementDetails, setEndorsementDetails] = useState<string>('');
  const [endorsementSuccessMessage, setEndorsementSuccessMessage] = useState<string | null>(null);

  // Stats Calculations
  const totalAggregateLimit = policies.reduce((acc, p) => acc + p.aggregate_limit, 0);
  const totalAnnualPremium = policies.reduce((acc, p) => acc + p.annual_premium, 0);
  const activePoliciesCount = policies.filter(p => p.status === 'active').length;
  const pendingRenewalCount = policies.filter(p => p.status === 'pending_renewal').length;

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleDownloadCoiPdf = (coi: CoiCertificate) => {
    const matchedPolicy = policies.find(p => p.id === coi.policy_id) || policies[0];
    generateAcord25Pdf(coi, matchedPolicy);
  };

  const handleDownloadBinder = (policy: Policy) => {
    const binderNum = `BND-VGR-${policy.policy_number.slice(-4)}`;
    const carrierObj: CarrierQuote = {
      carrierId: 'chubb-gl',
      carrierName: policy.carrier_name,
      syndicateName: policy.carrier_name,
      amBestRating: 'A++ Superior',
      spRating: 'AA+ Stable',
      annualPremium: policy.annual_premium,
      monthlyPremium: Math.round(policy.annual_premium / 12),
      deductible: policy.deductible,
      aggregateLimit: policy.aggregate_limit,
      occurrenceLimit: policy.occurrence_limit,
      keyFeatures: ['Primary & non-contributory', 'Cyber extortion rider', 'Worldwide territory'],
      keyExclusions: ['War & military action', 'Nuclear hazard'],
      underwritingConfidenceScore: 99,
      quoteId: `QTE-${policy.policy_number}`,
    };
    generateBinderPdf(quoteFormData, carrierObj, binderNum);
  };

  const handleSubmitEndorsementForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!endorsementDetails.trim()) return;

    submitEndorsement({
      policyId: selectedPolicyId,
      requestType: endorsementType,
      details: endorsementDetails,
      effectiveDate: endorsementEffectiveDate,
    });

    setEndorsementSuccessMessage(`Endorsement request submitted successfully for policy ${policies.find(p => p.id === selectedPolicyId)?.policy_number || ''}`);
    setEndorsementDetails('');
    setTimeout(() => {
      setEndorsementSuccessMessage(null);
      setIsEndorsementModalOpen(false);
      setActiveTab('endorsements');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-[#0284C7] selection:text-white">
      <ValiantNavbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header & Account Information */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38bdf8]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Commercial Policyholder Operations</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">EIN: {account.tax_id_ein}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {account.company_name}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              NAICS {account.naics_code}: {account.industry_category}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/portal/coi"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4 text-[#38bdf8]" />
              <span>Issue ACORD 25 COI</span>
            </Link>

            <button
              onClick={() => setIsEndorsementModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Request Endorsement</span>
            </button>

            <Link
              to="/claims/file"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600/90 to-amber-700/90 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02]"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report FNOL Claim</span>
            </Link>
          </div>
        </div>

        {/* Milestone Renewal Alert Bar */}
        {pendingRenewalCount > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300 font-mono tracking-wide uppercase">
                  Policy Renewal Milestone (X-Date Imminent)
                </div>
                <div className="text-sm text-slate-200 mt-0.5">
                  Policy <span className="font-mono text-white font-semibold">VGR-CP-2025-4421</span> (AIG Commercial Property) expires on <span className="font-mono text-white">2026-10-15</span> (Renewal term under review).
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/quote"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm whitespace-nowrap"
              >
                Instant Renewal Review
              </Link>
            </div>
          </div>
        )}

        {/* Aggregate Exposure & Coverage Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
              <span>Total Aggregate Capacity</span>
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            </div>
            <div className="text-2xl font-black font-mono text-white">
              ${(totalAggregateLimit / 1000000).toFixed(1)}M
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="text-emerald-400 font-mono font-medium">100% Admitted & Syndicate</span>
              <span>• Across 3 lines</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
              <span>Annual In-Force Premium</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white">
              ${totalAnnualPremium.toLocaleString('en-US')}
            </div>
            <div className="text-[11px] text-slate-400">
              Paid annually via ACH institutional settlement
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
              <span>Certificates (COI) Issued</span>
              <FileCheck className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {cois.length}
            </div>
            <div className="text-[11px] text-slate-400">
              All timestamped with SHA-256 validation
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
              <span>Dedicated Risk Adjuster</span>
              <Phone className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-base font-bold text-white truncate">
              Marcus Vance
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              +1 (800) 492-8812 ext. 402
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === 'policies'
                ? 'bg-[#0E131F] text-white border-t-2 border-[#0284C7] shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span>Active Policies ({policies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cois')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === 'cois'
                ? 'bg-[#0E131F] text-white border-t-2 border-[#38bdf8] shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#38bdf8]" />
            <span>Issued Certificates ({cois.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === 'claims'
                ? 'bg-[#0E131F] text-white border-t-2 border-amber-500 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>FNOL Claims Triage ({claims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('endorsements')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === 'endorsements'
                ? 'bg-[#0E131F] text-white border-t-2 border-emerald-500 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Endorsement Requests ({endorsements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-[#0E131F] text-white border-t-2 border-purple-500 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <FolderLock className="w-4 h-4 text-purple-400" />
            <span>Policy Vault</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE POLICIES */}
        {activeTab === 'policies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Underwritten Policies In Force
              </h3>
              <Link
                to="/quote"
                className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1 font-mono"
              >
                <span>Bind Additional Line of Business</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="p-6 rounded-2xl bg-[#0E131F] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-white bg-white/[0.06] px-2.5 py-1 rounded border border-white/[0.08]">
                          {policy.policy_number}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                          policy.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {policy.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-1.5">
                        {policy.line_of_business}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Carrier Syndicate: <span className="text-slate-200 font-semibold">{policy.carrier_name}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleDownloadBinder(policy)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08] transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Download Policy Binder (PDF)</span>
                      </button>

                      <Link
                        to={`/portal/coi?policyId=${policy.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0284C7]/20 hover:bg-[#0284C7]/30 text-xs font-semibold text-[#38bdf8] border border-[#0284C7]/40 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Generate COI</span>
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedPolicyId(policy.id);
                          setIsEndorsementModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 hover:text-white border border-white/[0.08] transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Endorsement</span>
                      </button>
                    </div>
                  </div>

                  {/* Policy Limit Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Aggregate Limit</div>
                      <div className="text-base font-bold font-mono text-white">
                        ${(policy.aggregate_limit).toLocaleString('en-US')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Each Occurrence</div>
                      <div className="text-base font-bold font-mono text-white">
                        ${(policy.occurrence_limit).toLocaleString('en-US')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Deductible / SIR</div>
                      <div className="text-base font-bold font-mono text-white">
                        ${(policy.deductible).toLocaleString('en-US')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Policy Term</div>
                      <div className="text-xs font-mono text-slate-200">
                        {policy.effective_date} <span className="text-slate-500">to</span> {policy.expiration_date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ISSUED COIs */}
        {activeTab === 'cois' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Live Certificate of Insurance Ledger
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time verifiability with immutable SHA-256 hash stamp for lenders, vendors, and landlords.
                </p>
              </div>
              <Link
                to="/portal/coi"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369a1] text-white text-xs font-bold shadow-md shadow-sky-900/30 hover:scale-[1.02] transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Issue New Certificate</span>
              </Link>
            </div>

            <div className="rounded-2xl bg-[#0E131F] border border-white/[0.08] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] text-slate-400 font-mono uppercase tracking-wider border-b border-white/[0.06]">
                    <tr>
                      <th className="p-4">Certificate Holder</th>
                      <th className="p-4">Underwritten Policy</th>
                      <th className="p-4">Endorsements</th>
                      <th className="p-4">Issued Timestamp</th>
                      <th className="p-4">SHA-256 Hash</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {cois.map((coi) => (
                      <tr key={coi.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white">{coi.holder_name}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{coi.holder_address}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-slate-200 font-medium">{coi.policy_number}</div>
                          <div className="text-[11px] text-slate-400">{coi.carrier_name}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {coi.additional_insured && (
                              <span className="px-2 py-0.5 rounded bg-[#0284C7]/20 text-[#38bdf8] font-mono text-[10px]">
                                Addl Insured
                              </span>
                            )}
                            {coi.waiver_subrogation && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                                Waiver Subr
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          {new Date(coi.issued_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">{coi.verification_hash.slice(0, 10)}...{coi.verification_hash.slice(-6)}</span>
                            <button
                              onClick={() => handleCopyHash(coi.verification_hash)}
                              className="p-1 rounded hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                              title="Copy SHA-256"
                            >
                              {copiedHash === coi.verification_hash ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDownloadCoiPdf(coi)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.08] font-semibold text-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
                            <span>ACORD 25 PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FNOL CLAIMS */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  First Notice of Loss (FNOL) Incident Tracker
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time status tracking from autonomous triage through adjuster investigation and carrier payout.
                </p>
              </div>
              <Link
                to="/claims/file"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-950/30 transition-all hover:scale-[1.02]"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>File New FNOL Claim</span>
              </Link>
            </div>

            <div className="space-y-4">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-6 rounded-2xl bg-[#0E131F] border border-white/[0.08] space-y-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                          {claim.id.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          Policy: <span className="text-white font-semibold">{claim.policy_number}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {claim.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-2">
                        {claim.incident_type} Incident
                      </h4>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4 text-xs font-mono">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">Assigned Adjuster</div>
                        <div className="text-white font-semibold">{claim.assigned_adjuster}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400 text-[10px] uppercase">Adjuster Hotline</div>
                        <div className="text-[#38bdf8] font-semibold">{claim.adjuster_phone}</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Pipeline Stepper */}
                  <div className="relative py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-mono font-bold mb-1.5 text-xs">
                          ✓
                        </div>
                        <span className="font-semibold text-emerald-400">Incident Triaged</span>
                        <span className="text-[10px] font-mono text-slate-400">Immediate</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-mono font-bold mb-1.5 text-xs">
                          ✓
                        </div>
                        <span className="font-semibold text-emerald-400">Adjuster Assigned</span>
                        <span className="text-[10px] font-mono text-slate-400">Under 2 Hours</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-[#0284C7]/20 border-2 border-[#0284C7] text-[#38bdf8] flex items-center justify-center font-mono font-bold mb-1.5 text-xs animate-pulse">
                          3
                        </div>
                        <span className="font-semibold text-[#38bdf8]">Loss Assessment</span>
                        <span className="text-[10px] font-mono text-slate-400">In Progress</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-white/[0.04] border-2 border-white/[0.1] text-slate-500 flex items-center justify-center font-mono font-bold mb-1.5 text-xs">
                          4
                        </div>
                        <span className="font-semibold text-slate-500">Settlement Payout</span>
                        <span className="text-[10px] font-mono text-slate-500">Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Claim Details */}
                  <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] text-xs space-y-2">
                    <div className="text-slate-400 font-mono text-[11px] uppercase">Narrative Description:</div>
                    <p className="text-slate-300 leading-relaxed">
                      {claim.description}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
                      <span>Reported Date: <strong className="text-white">{new Date(claim.reported_date).toLocaleDateString()}</strong></span>
                      <span>Estimated Loss: <strong className="text-emerald-400">${claim.estimated_loss?.toLocaleString('en-US')}</strong></span>
                      <span>Injuries: <strong className={claim.injuries_reported ? "text-rose-400" : "text-slate-300"}>{claim.injuries_reported ? "Yes (Emergency Dispatched)" : "None Reported"}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ENDORSEMENTS */}
        {activeTab === 'endorsements' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Self-Service Endorsement Management
                </h3>
                <p className="text-xs text-slate-400">
                  Submit real-time policy modifications: add vehicles, additional facilities, scheduled equipment, or limit changes.
                </p>
              </div>
              <button
                onClick={() => setIsEndorsementModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/30 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Endorsement Request</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#0E131F] border border-white/[0.08] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] text-slate-400 font-mono uppercase tracking-wider border-b border-white/[0.06]">
                    <tr>
                      <th className="p-4">Request Ref</th>
                      <th className="p-4">Target Policy</th>
                      <th className="p-4">Endorsement Category</th>
                      <th className="p-4">Effective Date</th>
                      <th className="p-4">Specifications</th>
                      <th className="p-4">Underwriting Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {endorsements.map((req) => (
                      <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-mono font-bold text-white">
                          {req.id}
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          {policies.find(p => p.id === req.policyId)?.policy_number || req.policyId}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.06] text-slate-200 font-mono text-[11px]">
                            {req.requestType === 'add_location' && <MapPin className="w-3.5 h-3.5 text-sky-400" />}
                            {req.requestType === 'add_vehicle' && <Truck className="w-3.5 h-3.5 text-amber-400" />}
                            {req.requestType === 'equipment_schedule' && <Laptop className="w-3.5 h-3.5 text-purple-400" />}
                            <span>{req.requestType.replace('_', ' ').toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          {req.effectiveDate}
                        </td>
                        <td className="p-4 text-slate-300 max-w-sm leading-relaxed">
                          {req.details}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                            req.status === 'approved' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            <span>{req.status.replace('_', ' ')}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENT REPOSITORY */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Cryptographically Stamped Document Vault
            </h3>
            <p className="text-xs text-slate-400">
              Download high-fidelity official insurance documents, signed binders, and certified ACORD 25 certificates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policies.map((policy) => (
                <div key={`doc-binder-${policy.id}`} className="p-5 rounded-2xl bg-[#0E131F] border border-white/[0.08] flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] uppercase font-bold">
                        Official Binder
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">{policy.policy_number}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{policy.line_of_business} Commercial Binder</h4>
                    <p className="text-xs text-slate-400">Carrier: {policy.carrier_name}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadBinder(policy)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4 text-[#38bdf8]" />
                    <span>Download Binder PDF</span>
                  </button>
                </div>
              ))}

              {cois.map((coi) => (
                <div key={`doc-coi-${coi.id}`} className="p-5 rounded-2xl bg-[#0E131F] border border-white/[0.08] flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase font-bold">
                        ACORD 25 COI
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">{coi.id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Certificate for {coi.holder_name}</h4>
                    <p className="text-xs text-slate-400">Issued: {new Date(coi.issued_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadCoiPdf(coi)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download ACORD 25 PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ENDORSEMENT REQUEST MODAL */}
      {isEndorsementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E131F] border border-white/[0.12] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsEndorsementModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase">
                <PlusCircle className="w-4 h-4" />
                <span>Policy Service Action</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Submit Endorsement Request</h3>
              <p className="text-xs text-slate-400 mt-1">
                Amend coverage parameters, add scheduled equipment, or update operational locations without mid-term cancellation.
              </p>
            </div>

            {endorsementSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{endorsementSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitEndorsementForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Select Policy to Amend</label>
                <select
                  value={selectedPolicyId}
                  onChange={(e) => setSelectedPolicyId(e.target.value)}
                  className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0284C7] focus:outline-none"
                >
                  {policies.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.policy_number} — {p.line_of_business} ({p.carrier_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Endorsement Type</label>
                  <select
                    value={endorsementType}
                    onChange={(e) => setEndorsementType(e.target.value as EndorsementType)}
                    className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white focus:border-[#0284C7] focus:outline-none"
                  >
                    <option value="add_location">Add New Location / Facility</option>
                    <option value="add_vehicle">Add Vehicle to Auto Schedule</option>
                    <option value="equipment_schedule">Inland Marine Equipment Schedule</option>
                    <option value="change_limits">Limit Increase / Exposure Modification</option>
                    <option value="change_entity">Entity Name / Address Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Requested Effective Date</label>
                  <input
                    type="date"
                    value={endorsementEffectiveDate}
                    onChange={(e) => setEndorsementEffectiveDate(e.target.value)}
                    className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0284C7] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Endorsement Details & Specifications
                </label>
                <textarea
                  value={endorsementDetails}
                  onChange={(e) => setEndorsementDetails(e.target.value)}
                  placeholder="E.g., Add warehouse facility located at 742 Evergreen Terrace, Springfield, OR 97477. Total square footage: 15,000 sq ft, 100% sprinklered."
                  rows={4}
                  className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl p-3 text-white placeholder:text-slate-500 focus:border-[#0284C7] focus:outline-none resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEndorsementModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/30 transition-all"
                >
                  Submit Endorsement Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </main>

      <ValiantFooter />
    </div>
  );
};
