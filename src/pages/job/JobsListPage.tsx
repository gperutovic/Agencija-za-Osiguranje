import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Star,
  Zap,
  Building2,
  DollarSign,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { Job, WorkplaceType } from '../../types/jobPlatform';
import { EasyApplyModal } from '../../components/modals/EasyApplyModal';

export const JobsListPage: React.FC = () => {
  const allJobs = jobDataService.getJobs();
  const profile = jobDataService.getCandidateProfile();

  const [query, setQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [workplaceFilter, setWorkplaceFilter] = useState<string>('all');
  const [easyApplyOnly, setEasyApplyOnly] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(profile.savedJobIds);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const filteredJobs = allJobs.filter((job) => {
    const matchesQuery =
      query.trim() === '' ||
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.companyName.toLowerCase().includes(query.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));

    const matchesLocation =
      locationFilter.trim() === '' ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesWorkplace =
      workplaceFilter === 'all' || job.workplaceType === workplaceFilter;

    const matchesEasyApply = !easyApplyOnly || job.easyApply;

    return matchesQuery && matchesLocation && matchesWorkplace && matchesEasyApply;
  });

  return (
    <div className="space-y-12 pb-24 text-slate-100">
      {/* HERO SEARCH SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-white/[0.08] bg-gradient-to-b from-[#0a0d16] via-[#06080c] to-[#06080c]">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#fb6504]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
              <span className="text-white">Glassdoor Model Karijerne Transparentnosti</span>
              <span className="text-slate-500">•</span>
              <span className="text-[#ff7b1a]">Provjerene Plaće & Intervjui</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Pronađite posao uz{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fb6504] via-[#ff7b1a] to-amber-400">
                stvaran uvid
              </span>{' '}
              u plaće i kulturu.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Otkrijte otvorene pozicije u vodećim kompanijama uz anonimne recenzije zaposlenika, transparentne raspone plaća i pitanja s razgovora za posao.
            </p>
          </div>

          {/* GLASS-CARD SEARCH ENGINE */}
          <div className="max-w-4xl mx-auto bg-[#0c101c]/90 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-white/[0.1] shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Keyword */}
              <div className="sm:col-span-5 flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Search className="w-5 h-5 text-[#ff7b1a] shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Naziv posla, tehnologija ili tvrtka..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Location */}
              <div className="sm:col-span-4 flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Grad, regija ili Remote..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <div className="sm:col-span-3">
                <button
                  type="button"
                  className="w-full py-3 rounded-2xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#fb6504]/30 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Traži poslove</span>
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-white/[0.06] text-xs">
              <span className="text-slate-400 font-mono text-[11px] mr-1">Filteri:</span>

              {['all', 'Remote', 'Hybrid', 'Onsite'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWorkplaceFilter(type)}
                  className={`px-3 py-1 rounded-xl font-bold font-mono transition ${
                    workplaceFilter === type
                      ? 'bg-[#fb6504]/20 text-[#ff7b1a] border border-[#fb6504]/40'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {type === 'all' ? 'Svi modeli rada' : type}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setEasyApplyOnly(!easyApplyOnly)}
                className={`ml-auto px-3 py-1 rounded-xl font-bold font-mono transition flex items-center gap-1.5 ${
                  easyApplyOnly
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Samo 1-Klik Easy Apply</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2 text-center text-xs font-mono">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-xl font-black text-white block">{allJobs.length}</span>
              <span className="text-slate-400">Aktivnih IT & Tech oglasa</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-xl font-black text-emerald-400 block">100%</span>
              <span className="text-slate-400">Javni rasponi plaća</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-xl font-black text-[#ff7b1a] block">92%</span>
              <span className="text-slate-400">Prosječno odobrenje CEO-a</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-xl font-black text-cyan-400 block">&lt; 24h</span>
              <span className="text-slate-400">Brzina odgovora poslodavca</span>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS LISTING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Preporučene pozicije ({filteredJobs.length})
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Prikazuju se oglasi s verificiranim rasponima plaća i ocjenama zaposlenika
            </p>
          </div>

          <Link
            to="/salaries"
            className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-[#ff7b1a] hover:underline"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Istraži Leveling i Plaće po Ulogama &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-6">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Nema pronađenih oglasa</h3>
              <p className="text-xs text-slate-400">
                Pokušajte promijeniti ključnu riječ ili uklonite aktivne filtere.
              </p>
              <button
                type="button"
                onClick={() => { setQuery(''); setLocationFilter(''); setWorkplaceFilter('all'); setEasyApplyOnly(false); }}
                className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-bold text-slate-300 hover:text-white"
              >
                Poništi filtere
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              // Calculate skill match
              const candidateSkills = profile.skills.map((s) => s.toLowerCase());
              const matchedCount = job.skills.filter((s) => candidateSkills.includes(s.toLowerCase())).length;
              const matchPercent = Math.round((matchedCount / Math.max(job.skills.length, 1)) * 100);
              const isApplied = profile.appliedJobIds.includes(job.id);
              const isBookmarked = bookmarkedIds.includes(job.id);

              return (
                <div
                  key={job.id}
                  className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] hover:border-[#fb6504]/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    {/* Left: Company Logo & Info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-14 h-14 rounded-2xl object-cover border border-white/[0.1] bg-black/40 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/companies/${job.companyId}`}
                            className="text-xs font-bold text-slate-300 hover:text-[#ff7b1a] transition flex items-center gap-1"
                          >
                            <span>{job.companyName}</span>
                            <span className="px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-0.5">
                              ★ {job.companyRating}
                            </span>
                          </Link>
                          <span className="text-slate-600">•</span>
                          <span className="text-[11px] font-mono text-emerald-400">
                            {job.responseSLA}
                          </span>
                        </div>

                        <Link to={`/jobs/${job.id}`}>
                          <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-[#ff7b1a] transition-colors">
                            {job.title}
                          </h3>
                        </Link>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {job.location} ({job.workplaceType})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            {job.salaryMin.toLocaleString()} € - {job.salaryMax.toLocaleString()} € / god.
                          </span>
                          <span>•</span>
                          <span className="text-slate-500">
                            {job.applicantCount} prijavljenih
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions & Match Score */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                      {/* Skill Match Badge */}
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono">
                        <span className="text-slate-400">Podudaranje:</span>
                        <span className={`font-bold ${matchPercent >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {matchPercent}% ({matchedCount}/{job.skills.length})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(job.id, e)}
                          className={`p-2.5 rounded-xl border transition ${
                            isBookmarked
                              ? 'bg-[#fb6504]/20 border-[#fb6504]/40 text-[#ff7b1a]'
                              : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
                          }`}
                          title="Spremi oglas"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>

                        {isApplied ? (
                          <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Prijavljeno
                          </span>
                        ) : job.easyApply ? (
                          <button
                            type="button"
                            onClick={() => setSelectedJobForApply(job)}
                            className="px-4 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-extrabold shadow-md shadow-[#fb6504]/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>1-Klik Prijava</span>
                          </button>
                        ) : (
                          <Link
                            to={`/jobs/${job.id}`}
                            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold border border-white/[0.1]"
                          >
                            Pogledaj oglas &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-white/[0.06]">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.03] text-slate-300 font-mono text-[11px] border border-white/[0.06]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Easy Apply Modal */}
      {selectedJobForApply && (
        <EasyApplyModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            // Re-render
          }}
        />
      )}
    </div>
  );
};
