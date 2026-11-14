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
        return <Car className="w-5 h-5 text-[#0F2942]" />;
      case 'property':
        return <Home className="w-5 h-5 text-amber-700" />;
      case 'life':
        return <Heart className="w-5 h-5 text-rose-700" />;
      case 'health':
        return <Activity className="w-5 h-5 text-emerald-700" />;
      default:
        return <Shield className="w-5 h-5 text-[#0F2942]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F2942]/5 border border-[#0F2942]/15 text-[#0F2942] flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Aktivne police
            </span>
            <p className="text-2xl font-bold tabular-nums text-slate-900">{activeCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ističe u 30 dana
            </span>
            <p className="text-2xl font-bold tabular-nums text-amber-700">{expiringCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ukupna ugovorena premija
            </span>
            <p className="text-xl font-bold tabular-nums text-slate-900">
              {formatCurrency(totalAnnualPremium)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-72">
          <Input
            placeholder="Pretraži police, broj, ugovaratelja..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {[
              { id: 'all', label: 'Sve' },
              { id: 'auto', label: 'Auto' },
              { id: 'property', label: 'Imovina' },
              { id: 'health', label: 'Zdravlje' },
              { id: 'life', label: 'Život' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  typeFilter === tab.id
                    ? 'bg-[#0F2942] text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
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
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0F2942]"
          >
            <option value="all">Svi statusi</option>
            <option value="active">Aktivne</option>
            <option value="expiring">Ističu uskoro</option>
            <option value="expired">Istekle</option>
          </select>
        </div>
      </div>

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-lg">Nema polica koje odgovaraju odabiru</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Pokušajte prilagoditi kriterije pretrage ili zatražite novu ponudu osiguranja.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/auto-osiguranje')}
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Usporedi ponude i ugovori policu
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
                className="p-6 transition-all hover:border-slate-300 border-slate-200 bg-white text-slate-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        {getTypeIcon(policy.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">
                          {policy.type === 'auto'
                            ? 'Kasko & Obvezno AO'
                            : policy.type === 'property'
                            ? 'Osiguranje doma i imovine'
                            : policy.type === 'life'
                            ? 'Životno osiguranje'
                            : 'Dopunsko i dodatno zdravstveno'}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs text-[#0F2942] font-semibold tracking-wider">
                            {policy.policyNumber}
                          </span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-xs text-slate-600 font-medium">
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
                    <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          Ističe za <strong>{daysRemaining} dana</strong> ({formatDate(policy.endDate)})
                        </span>
                      </div>
                      {onRenewPolicy && (
                        <button
                          type="button"
                          onClick={() => handleRenew(policy.id)}
                          disabled={renewingId === policy.id}
                          className="font-semibold text-[#0F2942] hover:underline whitespace-nowrap ml-2"
                        >
                          {renewingId === policy.id ? 'Obnavlja se...' : 'Obnovi policu'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Ugovaratelj</span>
                      <span className="font-semibold text-slate-900 truncate block">
                        {policy.insuredName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Vrijedi do</span>
                      <span className="tabular-nums font-semibold text-slate-800">
                        {formatDate(policy.endDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Dinamika plaćanja</span>
                      <span className="font-medium text-slate-700 capitalize">
                        {policy.paymentFrequency === 'monthly'
                          ? 'Mjesečno'
                          : policy.paymentFrequency === 'quarterly'
                          ? 'Kvartalno'
                          : 'Godišnje'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Ugovorena premija</span>
                      <span className="tabular-nums font-bold text-[#0F2942] text-sm">
                        {formatCurrency(policy.premiumAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 mt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Official PDF Certificate */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePolicyCertificatePdf(policy)}
                      className="flex items-center gap-1 text-[11px] text-slate-700"
                      title="Preuzmite službenu potvrdu police u PDF formatu"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0F2942]" />
                      Polica (PDF)
                    </Button>

                    {/* European Green Card for Auto */}
                    {policy.type === 'auto' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateGreenCardPdf(policy)}
                        className="flex items-center gap-1 text-[11px] text-emerald-800 border-emerald-200 hover:bg-emerald-50"
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
                      className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Izmjena
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/prijava-stete?policyId=${policy.id}`)}
                      className="flex items-center gap-1 text-[11px] text-rose-700 border-rose-200 hover:bg-rose-50"
                    >
                      Prijavi štetu
                    </Button>

                    {isExpiringSoon && onRenewPolicy && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRenew(policy.id)}
                        disabled={renewingId === policy.id}
                        className="text-[11px]"
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
