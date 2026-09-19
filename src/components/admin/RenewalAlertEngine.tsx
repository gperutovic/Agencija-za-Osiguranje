import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  Send,
  CheckCircle2,
  Mail,
  MessageSquare,
  Shield,
  FileText,
  User,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Policy } from '../../types/database';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface RenewalAlertEngineProps {
  policies: Policy[];
}

interface AlertLog {
  policyId: string;
  type: 'sms' | 'email';
  sentAt: string;
  recipient: string;
}

export const RenewalAlertEngine: React.FC<RenewalAlertEngineProps> = ({ policies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWindow, setFilterWindow] = useState<'all' | '7days' | '15days' | '30days'>('all');
  const [sentAlerts, setSentAlerts] = useState<AlertLog[]>([]);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [batchDispatching, setBatchDispatching] = useState(false);
  const [previewPolicy, setPreviewPolicy] = useState<Policy | null>(null);
  const [previewChannel, setPreviewChannel] = useState<'sms' | 'email'>('sms');

  const getDaysRemaining = (endDateStr: string): number => {
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  // Filter policies expiring in next 30 days or already expired
  const expiringPolicies = policies
    .map((p) => ({ ...p, daysRemaining: getDaysRemaining(p.endDate) }))
    .filter((p) => p.daysRemaining <= 30)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const filteredList = expiringPolicies.filter((p) => {
    const matchesSearch =
      p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.insuredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.insurer.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterWindow === '7days') return matchesSearch && p.daysRemaining <= 7;
    if (filterWindow === '15days') return matchesSearch && p.daysRemaining <= 15;
    if (filterWindow === '30days') return matchesSearch && p.daysRemaining <= 30;
    return matchesSearch;
  });

  const getSeverityBadge = (days: number) => {
    if (days <= 0) {
      return <Badge variant="danger">Isteklo ({Math.abs(days)} d)</Badge>;
    }
    if (days <= 7) {
      return <Badge variant="danger">Kritično ({days} d)</Badge>;
    }
    if (days <= 15) {
      return <Badge variant="warning">Hitno ({days} d)</Badge>;
    }
    return <Badge variant="info">Uskoro ({days} d)</Badge>;
  };

  const handleSendSingle = async (policy: Policy, channel: 'sms' | 'email') => {
    setDispatchingId(`${policy.id}-${channel}`);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setSentAlerts((prev) => [
      ...prev,
      {
        policyId: policy.id,
        type: channel,
        sentAt: new Date().toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' }),
        recipient: policy.insuredName,
      },
    ]);
    setDispatchingId(null);
  };

  const handleBatchDispatch = async () => {
    setBatchDispatching(true);
    for (const p of filteredList) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setSentAlerts((prev) => [
        ...prev,
        {
          policyId: p.id,
          type: 'email',
          sentAt: new Date().toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' }),
          recipient: p.insuredName,
        },
      ]);
    }
    setBatchDispatching(false);
  };

  const generateSmsText = (p: Policy) =>
    `Postovani ${p.insuredName}, Vasa polica ${p.policyNumber} (${p.insurer}) istice ${formatDate(
      p.endDate
    )}. Obnovite na vrijeme bez prekida pokrica na: agencija-za-osiguranje.web.app/portal ili nazovite 01 4800 120. Agencija Zivot`;

  const generateEmailBody = (p: Policy) => `
Poštovani/a ${p.insuredName},

Obavještavamo Vas da Vaša polica osiguranja uskoro ističe. Kako biste osigurali neprekinutu zaštitu i zadržali stečene bonuse, preporučujemo pravovremenu obnovu pokrića.

SAŽETAK POLICE:
• Broj police: ${p.policyNumber}
• Vrsta osiguranja: ${p.type.toUpperCase()}
• Osiguratelj: ${p.insurer}
• Datum isteka pokrića: ${formatDate(p.endDate)}
• Ugovorena premija: ${formatCurrency(p.premiumAmount)}

Zahtjev za obnovom možete pokrenuti jednim klikom putem našeg digitalnog portala:
https://agencija-za-osiguranje.web.app/portal

Ukoliko su Vam potrebne dodatne informacije ili izmjena uvjeta na polici, naš tim Vam stoji na raspolaganju svakim radnim danom od 08:00 do 17:00 sati na telefonu +385 1 4800 120.

Srdačan pozdrav,
Vaša Agencija Život d.o.o.
Ovlašteni partner osiguratelja
Zagreb, Junija Palmotića 76
  `;

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats & Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-bento flex flex-col md:flex-row md:items-center justify-between gap-6 text-slate-900 dark:text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sustav automatiziranih obnova polica</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automatsko praćenje isteka polica (30, 15 i 7 dana) i višekanalno slanje podsjetnika klijentima.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleBatchDispatch}
            disabled={batchDispatching || filteredList.length === 0}
            className="font-mono text-xs flex items-center gap-2 shadow-md shadow-teal-600/20"
          >
            {batchDispatching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Slanje obavijesti...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Pošalji podsjetnike svima ({filteredList.length})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-bento flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pretraži police koje ističu, klijente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs">
          {[
            { id: 'all', label: `Sve ističuće (${expiringPolicies.length})` },
            { id: '7days', label: 'Hitno (≤ 7 dana)' },
            { id: '15days', label: 'Do 15 dana' },
            { id: '30days', label: 'Do 30 dana' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterWindow(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                filterWindow === tab.id
                  ? 'bg-teal-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Policies List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl text-slate-500 font-mono shadow-bento">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-slate-900 dark:text-white font-semibold">Nema polica u ovom vremenskom prozoru</p>
              <p className="text-xs text-slate-400 mt-1">Sve klijentske police su uredno obnovljene i važeće.</p>
            </div>
          ) : (
            filteredList.map((p) => {
              const smsSent = sentAlerts.some((a) => a.policyId === p.id && a.type === 'sms');
              const emailSent = sentAlerts.some((a) => a.policyId === p.id && a.type === 'email');

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-900 dark:text-white"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-400">
                        {p.policyNumber}
                      </span>
                      {getSeverityBadge(p.daysRemaining)}
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
                        &bull; {p.type} &bull; {p.insurer}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-white">{p.insuredName}</h4>

                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span>Istek: <strong className="text-slate-700 dark:text-slate-200">{formatDate(p.endDate)}</strong></span>
                      <span>Premija: <strong className="text-teal-700 dark:text-teal-400">{formatCurrency(p.premiumAmount)}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewPolicy(p);
                        setPreviewChannel('sms');
                      }}
                      disabled={dispatchingId === `${p.id}-sms`}
                      className={`flex items-center gap-1.5 text-xs font-mono ${
                        smsSent ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {smsSent ? 'SMS poslan' : 'SMS'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewPolicy(p);
                        setPreviewChannel('email');
                      }}
                      disabled={dispatchingId === `${p.id}-email`}
                      className={`flex items-center gap-1.5 text-xs font-mono ${
                        emailSent ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {emailSent ? 'Email poslan' : 'E-pošta'}
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSendSingle(p, 'email')}
                      disabled={dispatchingId !== null}
                      className="font-mono text-xs shadow-md shadow-teal-600/20"
                    >
                      Pošalji odmah
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Preview Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-bento text-slate-900 dark:text-white h-fit space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Pregled obavijesti za klijenta
            </h4>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
              <button
                onClick={() => setPreviewChannel('sms')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  previewChannel === 'sms' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                SMS
              </button>
              <button
                onClick={() => setPreviewChannel('email')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  previewChannel === 'email' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Email
              </button>
            </div>
          </div>

          {previewPolicy ? (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Primatelj
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{previewPolicy.insuredName}</span>
                <span className="text-xs text-teal-700 dark:text-teal-400 block font-mono font-semibold">
                  {previewPolicy.policyNumber} &bull; {previewPolicy.insurer}
                </span>
              </div>

              {previewChannel === 'sms' ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed shadow-inner">
                  {generateSmsText(previewPolicy)}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto shadow-inner">
                  {generateEmailBody(previewPolicy)}
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSendSingle(previewPolicy, previewChannel)}
                className="w-full font-mono text-xs shadow-md shadow-teal-600/20"
              >
                Pošalji {previewChannel === 'sms' ? 'SMS podsjetnik' : 'E-mail podsjetnik'}
              </Button>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 font-mono">
              Odaberite policu s popisa za pregled personaliziranog predloška poruke.
            </div>
          )}

          {/* Activity Log */}
          {sentAlerts.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Zadnje poslane obavijesti ({sentAlerts.length})
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {sentAlerts.slice(-5).map((log, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-[11px] flex items-center justify-between text-slate-600 dark:text-slate-300"
                  >
                    <span>
                      <strong className="text-slate-900 dark:text-white">{log.recipient}</strong> ({log.type.toUpperCase()})
                    </span>
                    <span className="font-mono text-slate-400 dark:text-slate-500 text-[10px]">{log.sentAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
