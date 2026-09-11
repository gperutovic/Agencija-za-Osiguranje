import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Star,
  Search,
  Users,
  MapPin,
  ThumbsUp,
  TrendingUp,
  MessageSquarePlus,
  Briefcase,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { WriteReviewModal } from '../../components/modals/WriteReviewModal';
import { Company } from '../../types/jobPlatform';

export const CompaniesListPage: React.FC = () => {
  const allCompanies = jobDataService.getCompanies();
  const [search, setSearch] = useState('');
  const [selectedCompanyForReview, setSelectedCompanyForReview] = useState<Company | null>(null);

  const filteredCompanies = allCompanies.filter((c) =>
    search.trim() === '' ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase()) ||
    c.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-12 pb-24 text-slate-100">
      {/* Header section */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-white/[0.08] bg-gradient-to-b from-[#0a0d16] to-[#06080c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold text-[#ff7b1a]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verificirani Poslodavci & Transparentnost</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Istražite tvrtke, stvarne ocjene i kulturu
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Usporedite vodeće poslodavce prema ocjenama zaposlenika, odobrenju uprave, razini stresa i paketima pogodnosti.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl flex items-center gap-3 p-2.5 rounded-2xl bg-[#0c101c] border border-white/[0.1] shadow-xl">
            <Search className="w-5 h-5 text-[#ff7b1a] ml-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži po nazivu tvrtke, industriji ili tehnologiji..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Companies List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCompanies.map((c) => (
            <div
              key={c.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] hover:border-[#fb6504]/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all space-y-6 group flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Company Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={c.logoUrl}
                      alt={c.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/[0.1] bg-black shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link to={`/companies/${c.id}`}>
                          <h3 className="text-lg font-black text-white group-hover:text-[#ff7b1a] transition-colors">
                            {c.name}
                          </h3>
                        </Link>
                        {c.verified && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                            Verificirano
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 font-mono">
                        {c.industry} • {c.employeeCount}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-600" /> {c.headquarters}
                      </p>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="p-2.5 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-center shrink-0">
                    <div className="flex items-center justify-center gap-1 text-[#ff7b1a] font-black text-base font-mono">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{c.rating}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {c.reviewCount} ocjena
                    </span>
                  </div>
                </div>

                {/* About snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">
                  {c.about}
                </p>

                {/* Glassdoor Key Indicator Trio */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center text-xs font-mono">
                  <div>
                    <span className="text-sm font-black text-emerald-400 block">
                      {c.recommendToFriendRate}%
                    </span>
                    <span className="text-[10px] text-slate-400">Preporuka</span>
                  </div>
                  <div>
                    <span className="text-sm font-black text-[#ff7b1a] block">
                      {c.ceo.approvalRate}%
                    </span>
                    <span className="text-[10px] text-slate-400">CEO ({c.ceo.name.split(' ')[0]})</span>
                  </div>
                  <div>
                    <span className="text-sm font-black text-cyan-400 block">
                      {c.businessOutlookRate}%
                    </span>
                    <span className="text-[10px] text-slate-400">Izgledi ↗</span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {c.techStack.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 font-mono text-[10px] border border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                  {c.techStack.length > 6 && (
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-500 font-mono text-[10px]">
                      +{c.techStack.length - 6}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <Link
                  to={`/companies/${c.id}?tab=jobs`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 hover:text-white"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#ff7b1a]" />
                  <span>{c.openRolesCount} otvorenih pozicija</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCompanyForReview(c)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 hover:text-white border border-white/[0.08] transition flex items-center gap-1"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Ocijeni</span>
                  </button>

                  <Link
                    to={`/companies/${c.id}`}
                    className="px-4 py-1.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>Profil</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review modal */}
      {selectedCompanyForReview && (
        <WriteReviewModal
          company={selectedCompanyForReview}
          onClose={() => setSelectedCompanyForReview(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};
