import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  Building2,
  Plus,
  ThumbsUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { AddInterviewModal } from '../../components/modals/AddInterviewModal';

export const InterviewsDatabasePage: React.FC = () => {
  const allInterviews = jobDataService.getInterviews();
  const companies = jobDataService.getCompanies();

  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [modalCompanyId, setModalCompanyId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const filtered = allInterviews.filter((i) => {
    const matchesSearch =
      search.trim() === '' ||
      i.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      i.companyName.toLowerCase().includes(search.toLowerCase()) ||
      i.questions.some((q) => q.question.toLowerCase().includes(search.toLowerCase()));

    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      (selectedDifficulty === 'easy' && i.difficulty < 2.5) ||
      (selectedDifficulty === 'avg' && i.difficulty >= 2.5 && i.difficulty < 4.0) ||
      (selectedDifficulty === 'hard' && i.difficulty >= 4.0);

    return matchesSearch && matchesDifficulty;
  });

  const activeModalCompany = companies.find((c) => c.id === modalCompanyId) || companies[0];

  return (
    <div className="space-y-12 pb-24 text-slate-100">
      {/* Header section */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-white/[0.08] bg-gradient-to-b from-[#0a0d16] to-[#06080c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold text-cyan-400">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Glassdoor Baza Pitanja & Selekcijskih Postupaka</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Pripremite se za intervju uz stvarna pitanja
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Iskustva s razgovora za posao, tehnički zadaci, arhitektonska pitanja i ocjene težine selekcijskog procesa u vodećim kompanijama.
              </p>
            </div>

            <button
              onClick={() => setModalCompanyId(companies[0]?.id || 'comp-infobip')}
              className="px-5 py-3 rounded-2xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#fb6504]/30 flex items-center gap-2 shrink-0 transition hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Podijeli svoje iskustvo</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex-1 flex items-center gap-3 p-3 rounded-2xl bg-[#0c101c] border border-white/[0.1]">
              <Search className="w-4 h-4 text-[#ff7b1a] ml-1 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pretraži pitanja s intervjua ili naziv posla..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              {[
                { id: 'all', label: 'Sve težine' },
                { id: 'easy', label: 'Lagano (< 2.5)' },
                { id: 'avg', label: 'Prosječno (2.5 - 4.0)' },
                { id: 'hard', label: 'Zahtjevno (4.0+)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition ${
                    selectedDifficulty === item.id
                      ? 'bg-[#fb6504]/20 text-[#ff7b1a] border border-[#fb6504]/40'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interviews List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="text-xl font-black text-white">
            Prijavljeni selekcijski procesi ({filtered.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filtered.map((intv) => (
            <div
              key={intv.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] hover:border-[#fb6504]/40 backdrop-blur-xl shadow-xl transition-all space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/companies/${intv.companyId}?tab=interviews`}
                      className="text-xs font-bold text-slate-400 hover:text-white transition flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{intv.companyName}</span>
                    </Link>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-slate-400">{intv.department}</span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-black text-white">
                    {intv.jobTitle}
                  </h4>

                  <p className="text-xs font-mono text-slate-500">
                    Izvor: {intv.applicationSource} • Trajanje: {intv.processLength} • {intv.createdAt.split('T')[0]}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
                    <span className="text-base font-black text-[#ff7b1a] block">
                      {intv.difficulty.toFixed(1)} / 5.0
                    </span>
                    <span className="text-[10px] text-slate-400">Težina</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
                    <span className="text-base font-black text-emerald-400 block">
                      {intv.offerOutcome}
                    </span>
                    <span className="text-[10px] text-slate-400">Ishod</span>
                  </div>
                </div>
              </div>

              {/* Stages */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  Faze razgovora:
                </span>
                <div className="flex flex-wrap gap-2">
                  {intv.stages.map((stg, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs font-mono bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.06]"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#fb6504]/20 text-[#ff7b1a] text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-slate-200">{stg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real questions */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-mono uppercase font-bold text-cyan-400">
                  Postavljena pitanja:
                </span>
                <div className="space-y-2">
                  {intv.questions.map((q) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold">
                          {q.type}
                        </span>
                        <p className="text-slate-100 font-medium pt-1">"{q.question}"</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {q.helpfulCount} glasova
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              {intv.advice && (
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300">
                  <strong className="text-white font-mono uppercase text-[10px] block mb-1">
                    Savjet kandidata:
                  </strong>
                  <p className="font-light leading-relaxed">{intv.advice}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {modalCompanyId && activeModalCompany && (
        <AddInterviewModal
          company={activeModalCompany}
          onClose={() => setModalCompanyId(null)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};
