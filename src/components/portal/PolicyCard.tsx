import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  FileText,
  AlertTriangle,
  Clock,
  Download,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Car,
  Home,
  Heart,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { Policy } from '../../types/database';
import { formatCurrency, formatDate, generatePolicyCertificatePdf } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface PolicyCardProps {
  policy: Policy;
  onRenew?: (policyId: string) => void;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onRenew }) => {
  const navigate = useNavigate();

  const getDaysRemaining = (endDateStr: string): number => {
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = getDaysRemaining(policy.endDate);
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30;
  const isExpired = daysRemaining <= 0;

  const getTypeIcon = (type: Policy['type']) => {
    switch (type) {
      case 'auto':
        return <Car className="w-5 h-5 text-blue-600" />;
      case 'property':
        return <Home className="w-5 h-5 text-amber-600" />;
      case 'life':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'health':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      default:
        return <Shield className="w-5 h-5 text-brand-600" />;
    }
  };

  const getFrequencyLabel = (freq: Policy['paymentFrequency']) => {
    switch (freq) {
      case 'monthly':
        return 'Mjesečno';
      case 'quarterly':
        return 'Kvartalno';
      case 'annually':
        return 'Godišnje';
      default:
        return freq;
    }
  };

  const handleDownloadPdf = () => {
    generatePolicyCertificatePdf(policy);
  };

  return (
    <Card className="p-6 transition-all hover:border-white/[0.2] border-white/[0.08] bg-[#0a0d16]/90 backdrop-blur-xl text-white shadow-2xl">
      {/* Top Bar: Icon, Policy Type, Number, Status */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            {getTypeIcon(policy.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-base capitalize">
                {policy.type === 'auto'
                  ? 'Kasko & AO Osiguranje'
                  : policy.type === 'property'
                  ? 'Osiguranje Doma i Imovine'
                  : policy.type === 'life'
                  ? 'Životno Osiguranje'
                  : 'Dodatno Zdravstveno Osiguranje'}
              </h4>
            </div>
            <p className="font-mono text-xs text-[#ff7b1a] font-semibold tracking-wider">
              {policy.policyNumber}
            </p>
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

      {/* Expiry Warning Callout */}
      {isExpiringSoon && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300 font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Polica ističe za <strong>{daysRemaining} dana</strong> ({formatDate(policy.endDate)}).
            </span>
          </div>
          {onRenew && (
            <button
              onClick={() => onRenew(policy.id)}
              className="text-xs font-bold text-[#ff7b1a] hover:underline ml-2 whitespace-nowrap"
            >
              Obnovi odmah
            </button>
          )}
        </div>
      )}

      {/* Grid of details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Ugovaratelj / Osiguranik</span>
          <span className="font-semibold text-white line-clamp-1">{policy.insuredName}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Osiguratelj</span>
          <span className="font-semibold text-white">{policy.insurer}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Trajanje pokrića</span>
          <span className="font-semibold text-slate-300 font-mono">
            do {formatDate(policy.endDate)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Premija ({getFrequencyLabel(policy.paymentFrequency)})</span>
          <span className="font-bold text-[#ff7b1a] text-sm font-mono">
            {formatCurrency(policy.premiumAmount)}
          </span>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 text-[#fb6504]" />
            Certifikat (PDF)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/claims?policyId=${policy.id}`)}
            className="flex items-center gap-1.5 text-xs text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Prijavi štetu
          </Button>
        </div>

        {isExpiringSoon && onRenew && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRenew(policy.id)}
            className="text-xs shadow-[0_0_15px_#fb6504]"
          >
            Obnovi policu
          </Button>
        )}
      </div>
    </Card>
  );
};
