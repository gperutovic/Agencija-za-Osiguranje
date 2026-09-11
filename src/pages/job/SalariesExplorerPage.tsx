import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Search,
  Building2,
  Sliders,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { SubmitSalaryModal } from '../../components/modals/SubmitSalaryModal';

export const SalariesExplorerPage: React.FC = () => {
  const allSalaries = jobDataService.getSalaries();
  const [roleQuery, setRoleQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const filtered = allSalaries.filter((s) => {
    const matchesRole =
      roleQuery.trim() === '' ||
      s.jobTitle.toLowerCase().includes(roleQuery.toLowerCase()) ||
      s.companyName.toLowerCase().includes(roleQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || s.level === selectedLevel;
    return matchesRole && matchesLevel;
  });

  const totalCompensationAvg =
    filtered.length > 0
      ? Math.round(filtered.reduce((sum, s) => sum + s.totalComp, 0) / filtered.length)
      : 0;

  const baseAvg =
    filtered.length > 0
      ? Math.round(filtered.reduce((sum, s) => sum + s.baseSalary, 0) / filtered.length)
      : 0;

  const bonusAvg =
    filtered.length > 0
      ? Math.round(filtered.reduce((sum, s) => sum + s.bonus, 0) / filtered.length)
      : 0;

  const equityAvg =
    filtered.length > 0
      ? Math.round(filtered.reduce((sum, s) => sum + s.equity, 0) / filtered.length)
      : 0;

  return (
    <div className="space-y-12 pb-24 text-slate-100">
      {/* Header section */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-white/[0.08] bg-gradient-to-b from-[#0a0d16] to-[#06080c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Levels.fyi Standard • Total Comp Transparentnost</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Usporedba plaća, paketa i leveling razina
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Saznajte svoju stvarnu tržišnu vrijednost: stvarni paketi (Base + Bonus + Equity) prijavljeni od strane zaposlenika vodećih IT i enterprise kompanija.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#fb6504]/30 flex items-center gap-2 shrink-0 transition hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Unesi svoju plaću</span>
            </button>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex-1 flex items-center gap-3 p-3 rounded-2xl bg-[#0c101c] border border-white/[0.1]">
              <Search className="w-4 h-4 text-[#ff7b1a] ml-1 shrink-0" />
              <input
                type="text"
                value={roleQuery}
                onChange={(e) => setRoleQuery(e.target.value)}
                placeholder="Pretraži po poziciji ili tvrtki..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              {['all', 'Junior', 'Mid', 'Senior', 'Lead'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition ${
                    selectedLevel === lvl
                      ? 'bg-[#fb6504]/20 text-[#ff7b1a] border border-[#fb6504]/40'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {lvl === 'all' ? 'Sve razine' : lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Aggregate Stats Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <h3 className="text-lg font-black text-white">
                Prosjek za odabrane kriterije ({filtered.length} unosa)
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Godišnji bruto iznosi s uključenim varijabilnim nagradama i dionicama
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-[#ff7b1a] font-mono block">
                {totalCompensationAvg.toLocaleString()} € / god.
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Prosječni Total Compensation (TC)
              </span>
            </div>
          </div>

          {/* Aggregate Waterfall Bar */}
          {totalCompensationAvg > 0 && (
            <div className="space-y-3">
              <div className="w-full h-4 rounded-full bg-dark-950 overflow-hidden flex">
                <div
                  style={{ width: `${(baseAvg / totalCompensationAvg) * 100}%` }}
                  className="bg-emerald-400 h-full"
                  title="Osnovna plaća"
                />
                <div
                  style={{ width: `${(bonusAvg / totalCompensationAvg) * 100}%` }}
                  className="bg-amber-400 h-full"
                  title="Godišnji bonus"
                />
                <div
                  style={{ width: `${(equityAvg / totalCompensationAvg) * 100}%` }}
                  className="bg-cyan-400 h-full"
                  title="Dionice / ESOP"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Prosječna osnovica:
                  </span>
                  <strong className="text-white text-sm">{baseAvg.toLocaleString()} €</strong>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Prosječni bonus:
                  </span>
                  <strong className="text-white text-sm">{bonusAvg.toLocaleString()} €</strong>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Prosječne dionice:
                  </span>
                  <strong className="text-white text-sm">{equityAvg.toLocaleString()} €</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Salaries Breakdown List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <h3 className="text-xl font-black text-white">Pojedinačni izvještaji o plaćama</h3>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((sal) => (
            <div
              key={sal.id}
              className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] hover:border-[#fb6504]/40 backdrop-blur-xl shadow-xl transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/companies/${sal.companyId}?tab=salaries`}
                      className="text-xs font-bold text-slate-400 hover:text-white transition flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{sal.companyName}</span>
                    </Link>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-amber-400 font-mono text-[10px] font-bold border border-white/[0.08]">
                      {sal.level}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-white">{sal.jobTitle}</h4>
                  <p className="text-xs font-mono text-slate-500">
                    {sal.department} • {sal.yearsOfExperience} god. staža • {sal.location} • Prijavljeno {sal.createdAt.split('T')[0]}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-2xl font-black text-[#ff7b1a] font-mono block">
                    {sal.totalComp.toLocaleString()} €
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Ukupni godišnji paket
                  </span>
                </div>
              </div>

              {/* Individual breakdown bar */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-full h-2.5 rounded-full bg-dark-950 overflow-hidden flex">
                  <div
                    style={{ width: `${(sal.baseSalary / sal.totalComp) * 100}%` }}
                    className="bg-emerald-400 h-full"
                    title="Osnovica"
                  />
                  <div
                    style={{ width: `${(sal.bonus / sal.totalComp) * 100}%` }}
                    className="bg-amber-400 h-full"
                    title="Bonus"
                  />
                  <div
                    style={{ width: `${(sal.equity / sal.totalComp) * 100}%` }}
                    className="bg-cyan-400 h-full"
                    title="Dionice"
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Osnovica: <strong className="text-white">{sal.baseSalary.toLocaleString()} €</strong></span>
                  <span>Bonus: <strong className="text-white">{sal.bonus.toLocaleString()} €</strong></span>
                  <span>Dionice: <strong className="text-white">{sal.equity.toLocaleString()} €</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <SubmitSalaryModal
          onClose={() => setModalOpen(false)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};
