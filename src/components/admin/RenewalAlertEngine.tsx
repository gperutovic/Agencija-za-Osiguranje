import React, { useState } from 'react';
import {
  Bell,
  Send,
  CheckCircle2,
  Mail,
  MessageSquare,
  Search,
  RefreshCw,
} from 'lucide-react';
import { Policy } from '../../types/database';
import { formatCurrency, formatDate } from '../../utils/formatters';
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
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Sustav podsjetnika na obnovu polica</h3>
          <p className="text-xs text-slate-600 mt-1">
            Praćenje isteka polica (30, 15 i 7 dana) i priprema SMS ili e-mail obavijesti klijentima.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleBatchDispatch}
            disabled={batchDispatching || filteredList.length === 0}
            className="text-xs flex items-center gap-2"
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
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Pretraži police koje ističu, klijente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {[
            { id: 'all', label: `Sve ističuće (${expiringPolicies.length})` },
            { id: '7days', label: 'Hitno (≤ 7 dana)' },
            { id: '15days', label: 'Do 15 dana' },
            { id: '30days', label: 'Do 30 dana' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterWindow(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterWindow === tab.id
                  ? 'bg-[#0F2942] text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
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
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm text-slate-900 font-semibold">Nema polica u ovom vremenskom prozoru</p>
              <p className="text-xs text-slate-500 mt-1">Sve klijentske police su uredno obnovljene i važeće.</p>
            </div>
          ) : (
            filteredList.map((p) => {
              const smsSent = sentAlerts.some((a) => a.policyId === p.id && a.type === 'sms');
              const emailSent = sentAlerts.some((a) => a.policyId === p.id && a.type === 'email');

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-900 shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#0F2942]">
                        {p.policyNumber}
                      </span>
                      {getSeverityBadge(p.daysRemaining)}
                      <span className="text-xs text-slate-500 font-medium capitalize">
                        &bull; {p.type} &bull; {p.insurer}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900">{p.insuredName}</h4>

                    <div className="flex items-center gap-4 text-xs text-slate-600 tabular-nums">
                      <span>Istek: <strong className="text-slate-900">{formatDate(p.endDate)}</strong></span>
                      <span>Premija: <strong className="text-[#0F2942]">{formatCurrency(p.premiumAmount)}</strong></span>
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
                      className={`flex items-center gap-1.5 text-xs ${
                        smsSent ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-slate-700'
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
                      className={`flex items-center gap-1.5 text-xs ${
                        emailSent ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-slate-700'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {emailSent ? 'E-mail poslan' : 'E-pošta'}
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSendSingle(p, 'email')}
                      disabled={dispatchingId !== null}
                      className="text-xs"
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
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-900 h-fit space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0F2942]" />
              Pregled obavijesti za klijenta
            </h4>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPreviewChannel('sms')}
                className={`px-2.5 py-0.5 rounded-md font-medium ${
                  previewChannel === 'sms' ? 'bg-[#0F2942] text-white' : 'text-slate-600'
                }`}
              >
                SMS
              </button>
              <button
                type="button"
                onClick={() => setPreviewChannel('email')}
                className={`px-2.5 py-0.5 rounded-md font-medium ${
                  previewChannel === 'email' ? 'bg-[#0F2942] text-white' : 'text-slate-600'
                }`}
              >
                E-pošta
              </button>
            </div>
          </div>

          {previewPolicy ? (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Primatelj
                </span>
                <span className="font-bold text-sm text-slate-900">{previewPolicy.insuredName}</span>
                <span className="text-xs text-[#0F2942] block font-mono">
                  {previewPolicy.policyNumber} &bull; {previewPolicy.insurer}
                </span>
              </div>

              {previewChannel === 'sms' ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                  {generateSmsText(previewPolicy)}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
                  {generateEmailBody(previewPolicy)}
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSendSingle(previewPolicy, previewChannel)}
                className="w-full text-xs"
              >
                Pošalji {previewChannel === 'sms' ? 'SMS podsjetnik' : 'E-mail podsjetnik'}
              </Button>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              Odaberite policu s popisa za pregled personaliziranog predloška poruke.
            </div>
          )}

          {/* Activity Log */}
          {sentAlerts.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Zadnje poslane obavijesti ({sentAlerts.length})
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {sentAlerts.slice(-5).map((log, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-700"
                  >
                    <span>
                      <strong className="text-slate-900">{log.recipient}</strong> ({log.type.toUpperCase()})
                    </span>
                    <span className="tabular-nums text-slate-500 text-[11px]">{log.sentAt}</span>
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
