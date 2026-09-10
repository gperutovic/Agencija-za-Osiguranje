import React, { useState } from 'react';
import {
  Search,
  Filter,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  ArrowRight,
  User,
  Shield,
  FileText,
} from 'lucide-react';
import { QuoteRequest } from '../../types/database';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

interface LeadsTableProps {
  quotes: QuoteRequest[];
  onStatusChange: (id: string, status: QuoteRequest['status']) => Promise<void>;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ quotes, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesType = typeFilter === 'all' || q.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusUpdate = async (id: string, newStatus: QuoteRequest['status']) => {
    try {
      setUpdatingId(id);
      await onStatusChange(id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="info">Novi upit</Badge>;
      case 'contacted':
        return <Badge variant="warning">Kontaktiran</Badge>;
      case 'quoted':
        return <Badge variant="primary">Ponuda poslana</Badge>;
      case 'bound':
        return <Badge variant="success">Polica ugovorena</Badge>;
      case 'lost':
        return <Badge variant="danger">Odbijeno</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="bg-[#0a0d16]/90 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-2xl overflow-hidden text-white">
      {/* Search and Filters Bar */}
      <div className="p-5 border-b border-white/[0.08] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pretraži klijente, telefon, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Svi statusi' },
              { value: 'new', label: 'Novi upiti' },
              { value: 'contacted', label: 'U kontaktu' },
              { value: 'quoted', label: 'Poslane ponude' },
              { value: 'bound', label: 'Sklopljene police' },
              { value: 'lost', label: 'Arhivirano / Izgubljeno' },
            ]}
          />

          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Sve vrste osiguranja' },
              { value: 'auto', label: 'Auto (AO/Kasko)' },
              { value: 'property', label: 'Imovina i dom' },
              { value: 'life', label: 'Životno' },
              { value: 'health', label: 'Zdravstveno' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/[0.08] text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Klijent</th>
              <th className="py-3.5 px-6">Vrsta osiguranja</th>
              <th className="py-3.5 px-6">Godišnja premija</th>
              <th className="py-3.5 px-6">Datum upita</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Upravljanje statusom</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filteredQuotes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500 font-mono">
                  Nema pronađenih upita za odabrane kriterije.
                </td>
              </tr>
            ) : (
              filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-semibold text-white block">
                        {q.customer.fullName}
                      </span>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-mono">
                        <a
                          href={`tel:${q.customer.phone}`}
                          className="hover:text-[#fb6504] flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-[#fb6504]" />
                          {q.customer.phone}
                        </a>
                        <span>•</span>
                        <a
                          href={`mailto:${q.customer.email}`}
                          className="hover:text-[#fb6504] flex items-center gap-1 transition-colors"
                        >
                          <Mail className="w-3 h-3 text-[#fb6504]" />
                          {q.customer.email}
                        </a>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="capitalize font-medium text-slate-300">
                      {q.type === 'auto'
                        ? 'Auto osiguranje'
                        : q.type === 'property'
                        ? 'Imovina i dom'
                        : q.type === 'life'
                        ? 'Životno'
                        : 'Zdravstveno'}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div>
                      <span className="font-bold text-[#ff7b1a] font-mono">
                        {formatCurrency(q.calculatedEstimate.annualPremium)}
                      </span>
                      <span className="block text-xs text-slate-500 font-mono">
                        {formatCurrency(q.calculatedEstimate.monthlyPremium)} / mj.
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                    {formatDateTime(q.createdAt)}
                  </td>

                  <td className="py-4 px-6">
                    {getStatusBadge(q.status)}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
                      {q.status === 'new' && (
                        <button
                          onClick={() => handleStatusUpdate(q.id, 'contacted')}
                          disabled={updatingId === q.id}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                        >
                          Kontaktiraj
                        </button>
                      )}
                      {(q.status === 'new' || q.status === 'contacted') && (
                        <button
                          onClick={() => handleStatusUpdate(q.id, 'quoted')}
                          disabled={updatingId === q.id}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                        >
                          Pošalji ponudu
                        </button>
                      )}
                      {q.status === 'quoted' && (
                        <button
                          onClick={() => handleStatusUpdate(q.id, 'bound')}
                          disabled={updatingId === q.id}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-[#2dd4bf] hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                        >
                          Sklopi policu
                        </button>
                      )}
                      {q.status !== 'lost' && q.status !== 'bound' && (
                        <button
                          onClick={() => handleStatusUpdate(q.id, 'lost')}
                          disabled={updatingId === q.id}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          Arhiviraj
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
