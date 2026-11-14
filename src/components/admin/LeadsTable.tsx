import React, { useState } from 'react';
import {
  Search,
  Phone,
  Mail,
} from 'lucide-react';
import { QuoteRequest } from '../../types/database';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
      {/* Search and Filters Bar */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50/70">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Pretraži klijente, telefon, e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
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
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-6">Klijent</th>
              <th className="py-3.5 px-6">Vrsta osiguranja</th>
              <th className="py-3.5 px-6">Godišnja premija</th>
              <th className="py-3.5 px-6">Datum upita</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Upravljanje statusom</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredQuotes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500 text-sm">
                  Nema pronađenih upita za odabrane kriterije.
                </td>
              </tr>
            ) : (
              filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {q.customer.fullName}
                      </span>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 tabular-nums">
                        <a
                          href={`tel:${q.customer.phone}`}
                          className="hover:text-[#0F2942] flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-[#0F2942]" />
                          {q.customer.phone}
                        </a>
                        <span>&bull;</span>
                        <a
                          href={`mailto:${q.customer.email}`}
                          className="hover:text-[#0F2942] flex items-center gap-1 transition-colors"
                        >
                          <Mail className="w-3 h-3 text-[#0F2942]" />
                          {q.customer.email}
                        </a>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-medium text-slate-700">
                      {q.type === 'auto'
                        ? 'Auto osiguranje'
                        : q.type === 'property'
                        ? 'Imovina i dom'
                        : q.type === 'life'
                        ? 'Životno'
                        : 'Zdravstveno'}
                    </span>
                  </td>

                  <td className="py-4 px-6 tabular-nums">
                    <div>
                      <span className="font-bold text-[#0F2942]">
                        {formatCurrency(q.calculatedEstimate.annualPremium)}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {formatCurrency(q.calculatedEstimate.monthlyPremium)} / mj.
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-500 tabular-nums">
                    {formatDateTime(q.createdAt)}
                  </td>

                  <td className="py-4 px-6">
                    {getStatusBadge(q.status)}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs">
                      {q.status === 'new' && (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(q.id, 'contacted')}
                          disabled={updatingId === q.id}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                        >
                          Kontaktiraj
                        </button>
                      )}
                      {(q.status === 'new' || q.status === 'contacted') && (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(q.id, 'quoted')}
                          disabled={updatingId === q.id}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#0F2942]/10 text-[#0F2942] hover:bg-[#0F2942]/15 border border-[#0F2942]/20 transition-colors"
                        >
                          Pošalji ponudu
                        </button>
                      )}
                      {q.status === 'quoted' && (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(q.id, 'bound')}
                          disabled={updatingId === q.id}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        >
                          Sklopi policu
                        </button>
                      )}
                      {q.status !== 'lost' && q.status !== 'bound' && (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(q.id, 'lost')}
                          disabled={updatingId === q.id}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
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
