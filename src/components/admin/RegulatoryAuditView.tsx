import React from 'react';
import {
  ShieldCheck,
  Award,
  FileCheck,
  UserCheck,
  CheckCircle2,
  Download,
  AlertCircle,
  Building,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const RegulatoryAuditView: React.FC = () => {
  const licensedAgents = [
    {
      name: 'Marija Šarić',
      role: 'Ovlašteni zastupnik u osiguranju (Broker)',
      license: 'HR-HANFA-2024-88912',
      status: 'Aktivna licenca',
      validUntil: '31.12.2028.',
      annualCpdHours: '15 / 15 sati (Završeno)',
    },
    {
      name: 'Ivan Radić',
      role: 'Glavni procjenitelj šteta i broker',
      license: 'HR-HANFA-2023-41094',
      status: 'Aktivna licenca',
      validUntil: '30.06.2027.',
      annualCpdHours: '16 / 15 sati (Završeno)',
    },
    {
      name: 'Ana Horvat',
      role: 'Zastupnik za životna osiguranja',
      license: 'HR-HANFA-2025-10294',
      status: 'Aktivna licenca',
      validUntil: '15.04.2029.',
      annualCpdHours: '15 / 15 sati (Završeno)',
    },
  ];

  const iddComplianceChecks = [
    {
      requirement: 'IPID Dokumentacija (Informativni dokument o proizvodu)',
      legalRef: 'Zakon o osiguranju čl. 381 / IDD Direktiva EU 2016/97',
      status: 'Potpuno usklađeno',
      detail: 'Automatski se generira i uručuje prije sklapanja svakog ugovora.',
    },
    {
      requirement: 'Analiza potreba i zahtjeva klijenta (Demands & Needs Test)',
      legalRef: 'IDD Direktiva čl. 20 / Pravilnik HANFA',
      status: 'Potpuno usklađeno',
      detail: 'Kalkulatori i upitnici provjeravaju prikladnost prije izdavanja ponude.',
    },
    {
      requirement: 'Polica osiguranja od profesionalne odgovornosti',
      legalRef: 'Zakon o osiguranju čl. 404 (Minimalno 1.300.380 € po odštetnom zahtjevu)',
      status: 'Aktivno pokriće',
      detail: 'Polica br. GEN-PI-2026-001 sklopljena s Generali osiguranje d.d.',
    },
    {
      requirement: 'Registar aktivnosti obrade podataka (GDPR čl. 30)',
      legalRef: 'Uredba (EU) 2016/679 / AZOP smjernice',
      status: 'Ažurirano',
      detail: 'Enkriptirana pohrana, pravo na brisanje i uvid u korisničkom profilu.',
    },
    {
      requirement: 'Sprječavanje pranja novca i financiranja terorizma (SPNFT)',
      legalRef: 'Zakon o SPNFT (NN 108/17, 39/19) / Provjera OIB i PEP lista',
      status: 'Automatizirano',
      detail: 'Algoritam ISO 7064 Mod 11,10 verificira OIB u realnom vremenu.',
    },
  ];

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Agency Identity */}
      <div className="relative p-6 sm:p-8 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl text-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fb6504]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#ff7b1a]">
                HANFA Nadzorni i Regulatorni Status
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ŽIVOT d.o.o. za poslove zastupanja u osiguranju
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Usklađenost s regulativom Hrvatske agencije za nadzor financijskih usluga (HANFA) i Direktivom o distribuciji osiguranja (IDD EU 2016/97).
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handlePrintAudit}
            className="bg-white/[0.05] hover:bg-white/[0.1] text-white border-white/[0.15] self-start md:self-auto text-xs font-mono"
          >
            <Download className="w-4 h-4 mr-2" />
            Ispiši revizorsko izvješće
          </Button>
        </div>

        {/* Agency Registry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.08] text-xs relative z-10">
          <div>
            <span className="text-slate-400 font-mono block mb-0.5">MBS / Sudski registar</span>
            <span className="font-mono font-bold text-white">080514170</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono block mb-0.5">OIB Agencije</span>
            <span className="font-mono font-bold text-white">14329077049</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono block mb-0.5">Rješenje HANFA</span>
            <span className="font-mono font-bold text-[#ff7b1a]">UP/I-983-02/24-01/12</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono block mb-0.5">Strateški partner</span>
            <span className="font-bold text-white">Generali osiguranje d.d.</span>
          </div>
        </div>
      </div>

      {/* Certified Agents List */}
      <Card className="p-6 sm:p-8 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#ff7b1a] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">
              Registar ovlaštenih zastupnika u osiguranju
            </h4>
            <p className="text-xs text-slate-400">
              Svi djelatnici posjeduju važeću licencu HANFA-e s položenim stručnim ispitom i minimalno 15 sati godišnjeg stručnog usavršavanja (CPD).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {licensedAgents.map((agent) => (
            <div
              key={agent.license}
              className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] transition-all flex flex-col justify-between gap-3 shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="success">HANFA Licenciran</Badge>
                  <span className="text-[11px] font-mono text-slate-400">
                    {agent.validUntil}
                  </span>
                </div>
                <h5 className="font-bold text-white text-sm group-hover:text-[#ff7b1a] transition-colors">{agent.name}</h5>
                <p className="text-xs text-slate-400 mt-0.5">{agent.role}</p>
                <p className="text-xs font-mono text-cyan-400 font-semibold mt-2">
                  Broj licence: {agent.license}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>CPD edukacija: {agent.annualCpdHours}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* IDD & Regulatory Compliance Checklist */}
      <Card className="p-6 sm:p-8 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">
              Evidencija regulatorne usklađenosti (IDD & HANFA)
            </h4>
            <p className="text-xs text-slate-400">
              Usklađenost procesa distribucije i ugovaranja osiguranja prema zahtjevima EU Direktive 2016/97.
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {iddComplianceChecks.map((item, index) => (
            <div key={index} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h5 className="text-sm font-bold text-white">{item.requirement}</h5>
                </div>
                <p className="text-xs text-slate-400">{item.detail}</p>
                <span className="text-[11px] font-mono text-slate-500 block">
                  Regulatorni temelj: {item.legalRef}
                </span>
              </div>

              <div className="self-start sm:self-center">
                <Badge variant="success">{item.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
