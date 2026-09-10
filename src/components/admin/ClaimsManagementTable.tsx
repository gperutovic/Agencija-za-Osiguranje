import React, { useState } from 'react';
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  FileText,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { Claim } from '../../types/database';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface ClaimsManagementTableProps {
  claims: Claim[];
  onUpdateStatus: (
    id: string,
    status: Claim['status'],
    notes?: string
  ) => Promise<void>;
}

export const ClaimsManagementTable: React.FC<ClaimsManagementTableProps> = ({
  claims,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [newStatus, setNewStatus] = useState<Claim['status']>('submitted');
  const [brokerNotes, setBrokerNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredClaims = claims.filter((c) => {
    const matchesSearch =
      c.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.incidentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.policyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (claim: Claim) => {
    setSelectedClaim(claim);
    setNewStatus(claim.status);
    setBrokerNotes(claim.brokerNotes || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedClaim) return;
    try {
      setIsUpdating(true);
      await onUpdateStatus(selectedClaim.id, newStatus, brokerNotes);
      setSelectedClaim(null);
    } catch (err) {
      console.error('Failed to update claim:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: Claim['status']) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="info">Zaprimljeno</Badge>;
      case 'under_review':
        return <Badge variant="warning">U obradi</Badge>;
      case 'assessing':
        return <Badge variant="primary">Procjena u tijeku</Badge>;
      case 'approved':
        return <Badge variant="success">Odobreno</Badge>;
      case 'paid':
        return <Badge variant="success">Isplaćeno</Badge>;
      case 'rejected':
        return <Badge variant="danger">Odbijeno</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Filter Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pretraži broj spisa (ST-2026-XXXX) ili lokaciju..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-auto">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Svi statusi odštetnih spisa' },
              { value: 'submitted', label: 'Zaprimljeno' },
              { value: 'under_review', label: 'U obradi' },
              { value: 'assessing', label: 'Procjena u tijeku' },
              { value: 'approved', label: 'Odobreno' },
              { value: 'paid', label: 'Isplaćeno' },
              { value: 'rejected', label: 'Odbijeno' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Broj spisa</th>
              <th className="py-3.5 px-6">Broj police</th>
              <th className="py-3.5 px-6">Datum i mjesto</th>
              <th className="py-3.5 px-6">Procjena štete</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Radnja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClaims.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  Nema odštetnih zahtjeva za prikaz.
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-brand-900">
                    {claim.claimNumber}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-600">
                    {claim.policyId}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {formatDate(claim.incidentDate)}
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1">
                        {claim.incidentLocation}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {claim.estimatedDamage ? formatCurrency(claim.estimatedDamage) : 'Procjena u tijeku'}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(claim.status)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(claim)}
                      className="flex items-center gap-1.5 ml-auto text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Pregled spisa
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Claim Detail & Resolution Modal */}
      {selectedClaim && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedClaim(null)}
          title={`Odštetni spis ${selectedClaim.claimNumber}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Incident Summary */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-slate-500 block">Polica:</span>
                <span className="font-mono font-bold text-slate-800">{selectedClaim.policyId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Datum nezgode:</span>
                <span className="font-semibold text-slate-800">{formatDate(selectedClaim.incidentDate)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mjesto:</span>
                <span className="font-semibold text-slate-800">{selectedClaim.incidentLocation}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Zahtijevani iznos:</span>
                <span className="font-bold text-brand-900">
                  {selectedClaim.estimatedDamage ? formatCurrency(selectedClaim.estimatedDamage) : 'Nije specificirano'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Opis događaja (Izjava osiguranika)
              </label>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedClaim.description}
              </div>
            </div>

            {/* Evidence files preview if any */}
            {selectedClaim.evidenceUrls && selectedClaim.evidenceUrls.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Priloženi dokazi i fotografije ({selectedClaim.evidenceUrls.length})
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {selectedClaim.evidenceUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-slate-200 rounded-xl hover:border-brand-500 flex items-center gap-2 text-xs font-medium text-brand-700 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 text-brand-600 shrink-0" />
                      <span className="truncate">Dokaz #{idx + 1}</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Status Change Selector */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Ažuriraj status odštetnog zahtjeva
                </label>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  options={[
                    { value: 'submitted', label: '1. Zaprimljeno u evidenciju' },
                    { value: 'under_review', label: '2. U administrativnoj obradi' },
                    { value: 'assessing', label: '3. Procjena štete na terenu' },
                    { value: 'approved', label: '4. Odobreno za likvidaciju' },
                    { value: 'paid', label: '5. Isplaćeno na IBAN' },
                    { value: 'rejected', label: 'Odbijeno (Nije pokriveno uvjetima)' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Interna bilješka likvidatora / obrazloženje
                </label>
                <textarea
                  rows={3}
                  value={brokerNotes}
                  onChange={(e) => setBrokerNotes(e.target.value)}
                  placeholder="Unesite zabilješke s uviđaja, broj zapisnika policije ili upute za računovodstvo..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm text-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setSelectedClaim(null)}
              >
                Odustani
              </Button>
              <Button
                variant="primary"
                disabled={isUpdating}
                onClick={handleSaveStatus}
              >
                {isUpdating ? 'Spremanje...' : 'Spremi promjene'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
