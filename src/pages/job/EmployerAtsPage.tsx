import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  Plus
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { CandidateApplication } from '../../types/jobPlatform';

export const EmployerAtsPage: React.FC = () => {
  const [applications, setApplications] = useState<CandidateApplication[]>(jobDataService.getApplications());
  const jobs = jobDataService.getJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [activeStage, setActiveStage] = useState<string>('all');

  const filtered = applications.filter((app) => {
    const matchesJob = selectedJobId === 'all' || app.jobId === selectedJobId;
    const matchesStage = activeStage === 'all' || app.status === activeStage;
    return matchesJob && matchesStage;
  });

  const stages: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'Sve faze' },
    { id: 'Applied', label: 'Zaprimljeno' },
    { id: 'Reviewing', label: 'U obradi' },
    { id: 'Interviewing', label: 'Intervju' },
    { id: 'Offered', label: 'Ponuda' },
    { id: 'Rejected', label: 'Odbijeno' },
  ];

  return (
    <div className="min-h-screen text-slate-100 pb-24 space-y-8">
      {/* Header */}
      <section className="pt-12 pb-8 border-b border-white/[0.08] bg-gradient-to-b from-[#0a0d16] to-[#06080c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fb6504]/10 border border-[#fb6504]/20 text-xs font-mono font-bold text-[#ff7b1a]">
                <Users className="w-3.5 h-3.5" />
                <span>ATS Sustav & Selekcijski Cjevovod</span>
              </div>
              <h1 className="text-3xl font-black text-white">
                Nadzorna ploča za poslodavce (ATS)
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Upravljajte prijavama kandidata, pregledajte Match Score i organizirajte faze selekcije.
              </p>
            </div>

            <Link
              to="/post-a-job"
              className="px-5 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold font-mono flex items-center gap-2 shadow-lg shadow-[#fb6504]/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Novi oglas</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters & Pipeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0a0d16]/90 border border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2">Faza kandidata:</span>
            {stages.map((stg) => (
              <button
                key={stg.id}
                type="button"
                onClick={() => setActiveStage(stg.id)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition ${
                  activeStage === stg.id
                    ? 'bg-[#fb6504] text-white'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {stg.label}
              </button>
            ))}
          </div>

          <div>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#fb6504] focus:outline-none"
            >
              <option value="all">Svi aktivni oglasi ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title} ({j.companyName})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/[0.08] text-xs text-slate-400">
              Nema prijava za odabrane kriterije.
            </div>
          ) : (
            filtered.map((app) => (
              <div
                key={app.id}
                className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{app.candidateName}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-bold border border-emerald-500/20">
                        {app.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-400">
                      Pozicija: <strong className="text-slate-200">{app.jobTitle}</strong> ({app.companyName})
                    </p>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500 pt-1">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {app.candidateEmail}</span>
                      {app.candidatePhone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {app.candidatePhone}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={app.status}
                      onChange={(e) => {
                        const updated = applications.map((a) =>
                          a.id === app.id ? { ...a, status: e.target.value as any } : a
                        );
                        setApplications(updated);
                      }}
                      className="bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:border-[#fb6504] focus:outline-none"
                    >
                      <option value="Applied">Zaprimljeno</option>
                      <option value="Reviewing">U obradi</option>
                      <option value="Interviewing">Intervju</option>
                      <option value="Offered">Ponuđen ugovor</option>
                      <option value="Rejected">Odbijeno</option>
                    </select>
                  </div>
                </div>

                {/* Skills comparison */}
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Podudarne vještine kandidata:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {app.skillsMatched.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                        ✓ {s}
                      </span>
                    ))}
                    {app.skillsMissing.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px]">
                        ✗ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {app.coverNote && (
                  <div className="text-xs text-slate-300 italic p-3 rounded-xl bg-white/[0.01]">
                    "{app.coverNote}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
