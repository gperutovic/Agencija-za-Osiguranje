import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  FileText,
  Download,
  Calendar,
  AlertTriangle,
  Car,
  Home,
  Heart,
  Activity,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Compass,
} from 'lucide-react';
import { Policy } from '../../types/database';
import {
  formatCurrency,
  formatDate,
  generatePolicyCertificatePdf,
  generateGreenCardPdf,
} from '../../utils/formatters';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PolicyEndorsementModal } from './PolicyEndorsementModal';

interface PolicyVaultProps {
  policies: Policy[];
  onRenewPolicy?: (policyId: string) => Promise<void>;
}

export const PolicyVault: React.FC<PolicyVaultProps> = ({ policies, onRenewPolicy }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEndorsementPolicy, setSelectedEndorsementPolicy] = useState<Policy | null>(null);
  const [isEndorsementModalOpen, setIsEndorsementModalOpen] = useState(false);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const getDaysRemaining = (endDateStr: string): number => {
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.insuredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.insurer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || policy.type === typeFilter;

    const days = getDaysRemaining(policy.endDate);
    const isExpiring = days > 0 && days <= 30;
    const isExpired = days <= 0;
    const isActive = days > 30;

    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = isActive;
    else if (statusFilter === 'expiring') matchesStatus = isExpiring;
    else if (statusFilter === 'expired') matchesStatus = isExpired;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate stats
  const activeCount = policies.filter((p) => getDaysRemaining(p.endDate) > 0).length;
  const expiringCount = policies.filter((p) => {
    const d = getDaysRemaining(p.endDate);
    return d > 0 && d <= 30;
  }).length;
  const totalAnnualPremium = policies.reduce((sum, p) => sum + (p.premiumAmount || 0), 0);

  const handleRenew = async (id: string) => {
    if (!onRenewPolicy) return;
    try {
      setRenewingId(id);
      await onRenewPolicy(id);
    } finally {
      setRenewingId(null);
    }
  };

  const openEndorsement = (policy: Policy) => {
    setSelectedEndorsementPolicy(policy);
    setIsEndorsementModalOpen(true);
  };

  const getTypeIcon = (type: Policy['type']) => {
    switch (type) {
      case 'auto':
        return <Car className="w-5 h-5 text-sky-400" />;
      case 'property':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'life':
        return <Heart className="w-5 h-5 text-rose-400" />;
      case 'health':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      default:
        return <Shield className="w-5 h-5 text-[#ff7b1a]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Aktivne police
            </span>
            <p className="text-2xl font-bold font-mono text-white">{activeCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Ističe u 30 dana
            </span>
            <p className="text-2xl font-bold font-mono text-amber-400">{expiringCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#ff7b1a] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Ukupna ugovorena premija
            </span>
            <p className="text-xl font-bold font-mono text-white">
              {formatCurrency(totalAnnualPremium)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-72">
          <Input
            placeholder="Pretraži police, broj, ugovaratelja..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category tabs */}
          <div className="flex items-center bg-white/[0.03] p-1 rounded-2xl border border-white/[0.06] text-xs">
            {[
              { id: 'all', label: 'Sve' },
              { id: 'auto', label: 'Auto' },
              { id: 'property', label: 'Imovina' },
              { id: 'health', label: 'Zdravlje' },
              { id: 'life', label: 'Život' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  typeFilter === tab.id
                    ? 'bg-[#fb6504] text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#fb6504]"
          >
            <option value="all" className="bg-[#0a0d16]">Svi statusi</option>
            <option value="active" className="bg-[#0a0d16]">Aktivne</option>
            <option value="expiring" className="bg-[#0a0d16]">Ističu uskoro</option>
            <option value="expired" className="bg-[#0a0d16]">Istekle</option>
          </select>
        </div>
      </div>

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="p-12 text-center bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-xl">
          <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white text-lg">Nema polica koje odgovaraju odabiru</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6 font-mono">
            Pokušajte prilagoditi kriterije pretrage ili ugovorite novu policu osiguranja.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/quote')}
            className="font-mono text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Pokreni usporedbu i ugovaranje
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPolicies.map((policy) => {
            const daysRemaining = getDaysRemaining(policy.endDate);
            const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30;
            const isExpired = daysRemaining <= 0;

            return (
              <Card
                key={policy.id}
                className="p-6 transition-all hover:border-white/[0.2] border-white/[0.08] bg-[#0a0d16]/90 backdrop-blur-xl text-white shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        {getTypeIcon(policy.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">
                          {policy.type === 'auto'
                            ? 'Kasko & Obvezno AO'
                            : policy.type === 'property'
                            ? 'Osiguranje Doma i Imovine'
                            : policy.type === 'life'
                            ? 'Mješovito Životno Osiguranje'
                            : 'Dopunsko i Dodatno Zdravstveno'}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs text-[#ff7b1a] font-semibold tracking-wider">
                            {policy.policyNumber}
                          </span>
                          <span className="text-slate-500">&bull;</span>
                          <span className="text-xs text-slate-300 font-medium">
                            {policy.insurer}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isExpired ? (
                        <Badge variant="danger">Isteklo</Badge>
                      ) : isExpiringSoon ? (
                        <Badge variant="warning">Ističe za {daysRemaining} d.</Badge>
                      ) : (
                        <Badge variant="success">Aktivno</Badge>
                      )}
                    </div>
                  </div>

                  {/* Expiration warning badge */}
                  {isExpiringSoon && (
                    <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300 font-mono">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          Ističe za <strong>{daysRemaining} dana</strong> ({formatDate(policy.endDate)})
                        </span>
                      </div>
                      {onRenewPolicy && (
                        <button
                          onClick={() => handleRenew(policy.id)}
                          disabled={renewingId === policy.id}
                          className="font-bold text-[#ff7b1a] hover:underline whitespace-nowrap ml-2"
                        >
                          {renewingId === policy.id ? 'Obnavlja se...' : 'Obnovi uz popust'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Ugovaratelj</span>
                      <span className="font-semibold text-white truncate block">
                        {policy.insuredName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Vrijedi do</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {formatDate(policy.endDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Dinamika plaćanja</span>
                      <span className="font-medium text-slate-300 capitalize">
                        {policy.paymentFrequency === 'monthly'
                          ? 'Mjesečno'
                          : policy.paymentFrequency === 'quarterly'
                          ? 'Kvartalno'
                          : 'Godišnje'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Ugovorena premija</span>
                      <span className="font-mono font-bold text-[#ff7b1a] text-sm">
                        {formatCurrency(policy.premiumAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 mt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Official PDF Certificate */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePolicyCertificatePdf(policy)}
                      className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                      title="Preuzmite službenu potvrdu police u PDF formatu"
                    >
                      <Download className="w-3.5 h-3.5 text-[#fb6504]" />
                      Polica (PDF)
                    </Button>

                    {/* European Green Card for Auto */}
                    {policy.type === 'auto' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateGreenCardPdf(policy)}
                        className="flex items-center gap-1 text-[11px] text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10"
                        title="Zelena karta / Međunarodna karta osiguranja za inozemstvo"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Zelena karta
                      </Button>
                    )}

                    {/* Endorsement request */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEndorsement(policy)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Izmjena
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/claims?policyId=${policy.id}`)}
                      className="flex items-center gap-1 text-[11px] text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
                    >
                      Prijavi štetu
                    </Button>

                    {isExpiringSoon && onRenewPolicy && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRenew(policy.id)}
                        disabled={renewingId === policy.id}
                        className="text-[11px] font-mono shadow-[0_0_12px_rgba(251,101,4,0.3)]"
                      >
                        {renewingId === policy.id ? 'Obnavlja se...' : 'Obnovi'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Endorsement Modal */}
      <PolicyEndorsementModal
        policy={selectedEndorsementPolicy}
        isOpen={isEndorsementModalOpen}
        onClose={() => {
          setIsEndorsementModalOpen(false);
          setSelectedEndorsementPolicy(null);
        }}
      />
    </div>
  );
};
