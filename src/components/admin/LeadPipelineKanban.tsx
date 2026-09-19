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
  Filter,
  ArrowRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Clock,
  Car,
  Home,
  Heart,
  Activity,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { LeadRecord, QuoteRequest } from '../../types/database';
import { leadService } from '../../services/firebase';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ColumnDef {
  id: 'new' | 'contacted' | 'quoted' | 'bound' | 'lost';
  title: string;
  icon: React.ElementType;
  badgeVariant: 'info' | 'warning' | 'primary' | 'success' | 'danger';
  headerColor: string;
}

const COLUMNS: ColumnDef[] = [
  {
    id: 'new',
    title: 'Novi upiti',
    icon: Inbox,
    badgeVariant: 'info',
    headerColor: 'border-cyan-500 text-cyan-400 bg-cyan-500/10',
  },
  {
    id: 'contacted',
    title: 'U obradi / Kontakt',
    icon: PhoneCall,
    badgeVariant: 'warning',
    headerColor: 'border-amber-500 text-amber-400 bg-amber-500/10',
  },
  {
    id: 'quoted',
    title: 'Ponuda poslana',
    icon: Send,
    badgeVariant: 'primary',
    headerColor: 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40',
  },
  {
    id: 'bound',
    title: 'Sklopljena polica',
    icon: CheckCircle2,
    badgeVariant: 'success',
    headerColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
  },
  {
    id: 'lost',
    title: 'Arhivirano / Odbijeno',
    icon: XCircle,
    badgeVariant: 'danger',
    headerColor: 'border-slate-600 text-slate-400 bg-white/[0.02]',
  },
];

export const LeadPipelineKanban: React.FC = () => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeLeadNotes, setActiveLeadNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
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
        return <Car className="w-3.5 h-3.5 text-sky-400" />;
      case 'property':
        return <Home className="w-3.5 h-3.5 text-amber-400" />;
      case 'health':
        return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
      case 'life':
        return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
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
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-bento flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="Pretraži klijente, OIB, telefon, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          >
            <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Svi proizvodi</option>
            <option value="auto" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Auto (AO & Kasko)</option>
            <option value="property" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Imovina i Dom</option>
            <option value="health" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Dopunsko i Dodatno</option>
            <option value="life" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Životno osiguranje</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="flex items-center gap-1.5 font-mono text-xs text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white"
          >
            <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Izvoz u CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400 font-mono">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-teal-600 dark:text-teal-400" />
          <p className="text-sm">Sinkronizacija kontakata iz Firestore baze...</p>
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
                  className="bg-slate-50/70 dark:bg-slate-900/70 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col h-[750px] shadow-sm"
                >
                  {/* Column Header */}
                  <div className={`p-4 border-b border-slate-200/80 dark:border-slate-800 rounded-t-3xl ${col.headerColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <h4 className="font-bold text-xs uppercase tracking-wider">{col.title}</h4>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-white/40 dark:bg-white/10 text-xs font-mono font-bold flex items-center justify-center">
                        {colLeads.length}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                      Suma: <strong>{formatCurrency(totalColSum)}</strong>
                    </div>
                  </div>

                  {/* Cards Scroll Area */}
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {colLeads.length === 0 ? (
                      <div className="h-40 flex items-center justify-center text-slate-400 text-xs font-mono border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
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
                            className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all space-y-3 text-slate-900 dark:text-white group shadow-sm"
                          >
                            {/* Card Header: Product & Date */}
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 font-mono font-medium text-slate-600 dark:text-slate-300">
                                {getProductIcon(lead.productType)}
                                <span className="capitalize">{lead.productType}</span>
                              </span>
                              <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                                {formatDateTime(lead.createdAt)}
                              </span>
                            </div>

                            {/* Client Name & OIB */}
                            <div>
                              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{cardName}</h5>
                              {lead.oib && (
                                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                  OIB: <span className="text-slate-700 dark:text-slate-300">{lead.oib}</span>
                                </p>
                              )}
                              {cardInsurer && (
                                <p className="text-[11px] text-teal-700 dark:text-teal-400 font-mono font-semibold mt-0.5">
                                  Odabir: {cardInsurer}
                                </p>
                              )}
                            </div>

                            {/* Estimated Premium */}
                            {cardPremium ? (
                              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-500 dark:text-slate-400">Godišnja premija:</span>
                                <span className="font-bold text-teal-700 dark:text-teal-400">
                                  {formatCurrency(cardPremium)}
                                </span>
                              </div>
                            ) : null}

                            {/* Quick Action Buttons (Call, WhatsApp, Email) */}
                            <div className="grid grid-cols-3 gap-1.5 pt-1">
                              <a
                                href={`tel:${phoneFormatted}`}
                                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700"
                                title={`Nazovi: ${lead.phone}`}
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${phoneFormatted.replace('+', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700"
                                title="Pošalji WhatsApp poruku"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`mailto:${lead.email}`}
                                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700"
                                title={`Email: ${lead.email}`}
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            {/* Broker notes display */}
                            {lead.notes && (
                              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-[10px] text-amber-800 dark:text-amber-200">
                                <strong>Bilješka:</strong> {lead.notes}
                              </div>
                            )}

                            {/* Stage Move Controls */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                              {prev ? (
                                <button
                                  onClick={() => handleStatusChange(lead.id, prev)}
                                  disabled={updatingId === lead.id}
                                  className="text-[10px] font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
                                >
                                  <ArrowLeft className="w-3 h-3" /> Nazad
                                </button>
                              ) : (
                                <div />
                              )}

                              {next ? (
                                <button
                                  onClick={() => handleStatusChange(lead.id, next)}
                                  disabled={updatingId === lead.id}
                                  className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 transition-colors ml-auto"
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
