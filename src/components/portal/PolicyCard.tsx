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
    <Card className="p-6 transition-all hover:shadow-lg border-slate-200 bg-white">
      {/* Top Bar: Icon, Policy Type, Number, Status */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
            {getTypeIcon(policy.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-base capitalize">
                {policy.type === 'auto'
                  ? 'Kasko & AO Osiguranje'
                  : policy.type === 'property'
                  ? 'Osiguranje Doma i Imovine'
                  : policy.type === 'life'
                  ? 'Životno Osiguranje'
                  : 'Dodatno Zdravstveno Osiguranje'}
              </h4>
            </div>
            <p className="font-mono text-xs text-slate-500 font-semibold tracking-wider">
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
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Polica ističe za <strong>{daysRemaining} dana</strong> ({formatDate(policy.endDate)}).
            </span>
          </div>
          {onRenew && (
            <button
              onClick={() => onRenew(policy.id)}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline ml-2 whitespace-nowrap"
            >
              Obnovi odmah
            </button>
          )}
        </div>
      )}

      {/* Grid of details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
        <div>
          <span className="text-slate-500 block mb-0.5">Ugovaratelj / Osiguranik</span>
          <span className="font-semibold text-slate-800 line-clamp-1">{policy.insuredName}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Osiguratelj</span>
          <span className="font-semibold text-slate-800">{policy.insurer}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Trajanje pokrića</span>
          <span className="font-semibold text-slate-800">
            do {formatDate(policy.endDate)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Premija ({getFrequencyLabel(policy.paymentFrequency)})</span>
          <span className="font-bold text-slate-900 text-sm">
            {formatCurrency(policy.premiumAmount)}
          </span>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 text-xs text-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Certifikat (PDF)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/stete?policyId=${policy.id}`)}
            className="flex items-center gap-1.5 text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
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
            className="text-xs"
          >
            Obnovi policu
          </Button>
        )}
      </div>
    </Card>
  );
};
