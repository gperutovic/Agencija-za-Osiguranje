import React, { useState, useEffect } from 'react';
import {
  Inbox,
  PhoneCall,
  Send,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MessageSquare,
  Search,
  Download,
  ArrowRight,
  ArrowLeft,
  Car,
  Home,
  Heart,
  Activity,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { LeadRecord } from '../../types/database';
import { leadService } from '../../services/firebase';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ColumnDef {
  id: 'new' | 'contacted' | 'quoted' | 'bound' | 'lost';
  title: string;
  icon: React.ElementType;
  headerColor: string;
}

const COLUMNS: ColumnDef[] = [
  {
    id: 'new',
    title: 'Novi upiti',
    icon: Inbox,
    headerColor: 'border-sky-200 text-sky-900 bg-sky-50',
  },
  {
    id: 'contacted',
    title: 'U obradi / Kontakt',
    icon: PhoneCall,
    headerColor: 'border-amber-200 text-amber-900 bg-amber-50',
  },
  {
    id: 'quoted',
    title: 'Ponuda poslana',
    icon: Send,
    headerColor: 'border-[#0F2942]/20 text-[#0F2942] bg-[#0F2942]/5',
  },
  {
    id: 'bound',
    title: 'Sklopljena polica',
    icon: CheckCircle2,
    headerColor: 'border-emerald-200 text-emerald-900 bg-emerald-50',
  },
  {
    id: 'lost',
    title: 'Arhivirano / Odbijeno',
    icon: XCircle,
    headerColor: 'border-slate-200 text-slate-700 bg-slate-100',
  },
];

export const LeadPipelineKanban: React.FC = () => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeLeadNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    void activeLeadNotes;
    // Subscribe to live Firestore leads collection
    const unsubscribe = leadService.subscribeToLeads((items: LeadRecord[]) => {
      setLeads(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: LeadRecord['status'],
    brokerNotes?: string
  ) => {
    try {
      setUpdatingId(id);
      await leadService.updateLeadStatus(id, newStatus, brokerNotes);
    } catch (err) {
      console.error('Failed to update lead status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStatus = (current: LeadRecord['status']): LeadRecord['status'] | null => {
    switch (current) {
      case 'new':
        return 'contacted';
      case 'contacted':
        return 'quoted';
      case 'quoted':
        return 'bound';
      default:
        return null;
    }
  };

  const getPrevStatus = (current: LeadRecord['status']): LeadRecord['status'] | null => {
    switch (current) {
      case 'bound':
        return 'quoted';
      case 'quoted':
        return 'contacted';
      case 'contacted':
        return 'new';
      default:
        return null;
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    const leadDisplayName = lead.fullName || lead.name || '';
    const matchesSearch =
      leadDisplayName.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.phone.toLowerCase().includes(term) ||
      (lead.oib && lead.oib.includes(term));

    const matchesProduct = productFilter === 'all' || lead.productType === productFilter;
    return matchesSearch && matchesProduct;
  });

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'auto':
        return <Car className="w-3.5 h-3.5 text-[#0F2942]" />;
      case 'property':
        return <Home className="w-3.5 h-3.5 text-amber-700" />;
      case 'health':
        return <Activity className="w-3.5 h-3.5 text-emerald-700" />;
      case 'life':
        return <Heart className="w-3.5 h-3.5 text-rose-700" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-[#0F2942]" />;
    }
  };

  // Export leads to CSV file
  const exportToCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      'ID',
      'Ime i Prezime',
      'OIB',
      'Email',
      'Telefon',
      'Proizvod',
      'Status',
      'Odabrani Osiguratelj',
      'Godišnja Premija (EUR)',
      'Datum Upita',
    ];

    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName || l.name || ''}"`,
      l.oib || '',
      l.email,
      l.phone,
      l.productType,
      l.status,
      `"${l.selectedInsurer || l.data?.insurer || ''}"`,
      l.annualPremium || l.data?.annualPremium || 0,
      formatDate(l.createdAt),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Leads_Agencija_Zivot_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Pretraži klijente, OIB, telefon, e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0F2942]"
          >
            <option value="all">Svi proizvodi</option>
            <option value="auto">Auto (AO &amp; Kasko)</option>
            <option value="property">Imovina i dom</option>
            <option value="health">Dopunsko i dodatno</option>
            <option value="life">Životno osiguranje</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="flex items-center gap-1.5 text-xs text-slate-700"
          >
            <Download className="w-4 h-4 text-[#0F2942]" />
            Izvoz u CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2942]" />
          <p className="text-sm">Sinkronizacija kontakata iz baze...</p>
        </div>
      ) : (
        /* Kanban Columns Container */
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[1100px]">
            {COLUMNS.map((col) => {
              const colLeads = filteredLeads.filter((l) => l.status === col.id);
              const totalColSum = colLeads.reduce(
                (sum, l) => sum + (l.annualPremium || l.data?.annualPremium || 0),
                0
              );
              const Icon = col.icon;

              return (
                <div
                  key={col.id}
                  className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[750px] shadow-sm"
                >
                  {/* Column Header */}
                  <div className={`p-4 border-b rounded-t-2xl ${col.headerColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <h4 className="font-bold text-xs uppercase tracking-wider">{col.title}</h4>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-white text-slate-900 border border-slate-200 text-xs tabular-nums font-bold flex items-center justify-center">
                        {colLeads.length}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-600 tabular-nums">
                      Suma: <strong className="text-slate-900">{formatCurrency(totalColSum)}</strong>
                    </div>
                  </div>

                  {/* Cards Scroll Area */}
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-slate-50/50">
                    {colLeads.length === 0 ? (
                      <div className="h-40 flex items-center justify-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
                        Nema upita u ovoj fazi
                      </div>
                    ) : (
                      colLeads.map((lead) => {
                        const next = getNextStatus(lead.status);
                        const prev = getPrevStatus(lead.status);
                        const phoneFormatted = lead.phone.replace(/[^0-9+]/g, '');
                        const cardName = lead.fullName || lead.name;
                        const cardInsurer = lead.selectedInsurer || lead.data?.insurer;
                        const cardPremium = lead.annualPremium || lead.data?.annualPremium;

                        return (
                          <div
                            key={lead.id}
                            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-3 text-slate-900 shadow-sm"
                          >
                            {/* Card Header: Product & Date */}
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700 border border-slate-200">
                                {getProductIcon(lead.productType)}
                                <span className="capitalize">{lead.productType}</span>
                              </span>
                              <span className="text-slate-500 tabular-nums text-[11px]">
                                {formatDateTime(lead.createdAt)}
                              </span>
                            </div>

                            {/* Client Name & OIB */}
                            <div>
                              <h5 className="font-bold text-sm text-slate-900">{cardName}</h5>
                              {lead.oib && (
                                <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                                  OIB: <span className="text-slate-800 font-medium">{lead.oib}</span>
                                </p>
                              )}
                              {cardInsurer && (
                                <p className="text-xs text-[#0F2942] font-semibold mt-0.5">
                                  Odabir: {cardInsurer}
                                </p>
                              )}
                            </div>

                            {/* Estimated Premium */}
                            {cardPremium ? (
                              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs tabular-nums">
                                <span className="text-slate-600">Godišnja premija:</span>
                                <span className="font-bold text-[#0F2942]">
                                  {formatCurrency(cardPremium)}
                                </span>
                              </div>
                            ) : null}

                            {/* Quick Action Buttons (Call, WhatsApp, Email) */}
                            <div className="grid grid-cols-3 gap-1.5 pt-1">
                              <a
                                href={`tel:${phoneFormatted}`}
                                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#0F2942] flex items-center justify-center transition-colors border border-slate-200"
                                title={`Nazovi: ${lead.phone}`}
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${phoneFormatted.replace('+', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-emerald-700 flex items-center justify-center transition-colors border border-slate-200"
                                title="Pošalji WhatsApp poruku"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`mailto:${lead.email}`}
                                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors border border-slate-200"
                                title={`E-mail: ${lead.email}`}
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            {/* Staff notes display */}
                            {lead.notes && (
                              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                                <strong>Bilješka:</strong> {lead.notes}
                              </div>
                            )}

                            {/* Stage Move Controls */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              {prev ? (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(lead.id, prev)}
                                  disabled={updatingId === lead.id}
                                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                                >
                                  <ArrowLeft className="w-3 h-3" /> Nazad
                                </button>
                              ) : (
                                <div />
                              )}

                              {next ? (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(lead.id, next)}
                                  disabled={updatingId === lead.id}
                                  className="text-xs font-semibold text-[#0F2942] hover:underline flex items-center gap-1 transition-colors ml-auto"
                                >
                                  Pomakni <ArrowRight className="w-3 h-3" />
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
