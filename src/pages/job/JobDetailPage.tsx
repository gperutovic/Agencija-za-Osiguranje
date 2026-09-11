import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Star,
  Zap,
  Building2,
  CheckCircle2,
  Share2,
  Bookmark,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Users,
  ChevronRight
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { EasyApplyModal } from '../../components/modals/EasyApplyModal';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const job = jobDataService.getJobById(id || 'job-001');
  const company = job ? jobDataService.getCompanyById(job.companyId) : undefined;
  const profile = jobDataService.getCandidateProfile();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 text-slate-100">
        <h2 className="text-2xl font-bold">Oglas nije pronađen</h2>
        <Link to="/jobs" className="text-[#ff7b1a] hover:underline font-mono">
          &larr; Povratak na pretragu poslova
        </Link>
      </div>
    );
  }

  const isApplied = profile.appliedJobIds.includes(job.id);

  // Skill match calculation
  const candidateSkills = profile.skills.map((s) => s.toLowerCase());
  const matchedSkills = job.skills.filter((s) => candidateSkills.includes(s.toLowerCase()));
  const missingSkills = job.skills.filter((s) => !candidateSkills.includes(s.toLowerCase()));
  const matchScore = Math.round((matchedSkills.length / Math.max(job.skills.length, 1)) * 100);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-slate-100 pb-24 space-y-8">
      {/* Top breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Natrag na sve poslove
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Job Content (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="w-16 h-16 rounded-2xl object-cover border border-white/[0.1] bg-black shrink-0"
                  />
                  <div className="space-y-1">
                    <Link
                      to={`/companies/${job.companyId}`}
                      className="text-xs font-bold text-slate-300 hover:text-[#ff7b1a] transition flex items-center gap-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{job.companyName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 text-[10px] font-mono font-bold">
                        ★ {job.companyRating}
                      </span>
                    </Link>

                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                      {job.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location} ({job.workplaceType})
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">
                        {job.salaryMin.toLocaleString()} € - {job.salaryMax.toLocaleString()} € / god.
                      </span>
                      <span>•</span>
                      <span className="text-cyan-400">{job.responseSLA}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition"
                    title="Kopiraj poveznicu"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {copied && (
                    <span className="text-[10px] font-mono text-emerald-400">Kopirano!</span>
                  )}
                </div>
              </div>

              {/* Call to action apply bar */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock className="w-4 h-4 text-[#ff7b1a]" />
                  <span>Objavljeno prije nekoliko dana • {job.applicantCount} prijava</span>
                </div>

                {isApplied ? (
                  <span className="px-6 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Uspješno ste se prijavili
                  </span>
                ) : (
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#fb6504]/30 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>1-Klik Brza Prijava</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-black text-white pb-3 border-b border-white/[0.06]">
                  Opis pozicije
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-3">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Ključne odgovornosti:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#ff7b1a] font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Što očekujemo od vas:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Tražene tehnologije i alati
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono font-bold text-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Perks */}
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Pogodnosti i benefiti radnog mjesta
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {job.perks.map((p, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Glassdoor Transparency & Match Score (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* LinkedIn-style Skill Match Scorecard */}
            <div className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
                  Usklađenost vašeg profila
                </h4>
                <span className={`text-xs font-mono font-black ${matchScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {matchScore}%
                </span>
              </div>

              <div className="w-full bg-dark-950 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${matchScore >= 70 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${matchScore}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Vaš profil odgovara za {matchedSkills.length} od {job.skills.length} traženih vještina.
              </p>

              <div className="space-y-2 pt-1 text-xs">
                {matchedSkills.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">
                      Podudarne vještine ({matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {matchedSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {missingSkills.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-amber-400 uppercase block mb-1">
                      Preporučeno usavršiti ({missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {missingSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Glassdoor Employer Transparency Card */}
            {company && (
              <div className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/[0.1]"
                  />
                  <div>
                    <h4 className="text-sm font-black text-white">{company.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{company.industry}</p>
                  </div>
                </div>

                {/* Star & Metrics */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-center gap-1 text-[#ff7b1a] font-black text-lg font-mono">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{company.rating}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {company.reviewCount} recenzija
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-lg font-black text-emerald-400 block font-mono">
                      {company.recommendToFriendRate}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Preporuča prijatelju
                    </span>
                  </div>
                </div>

                {/* CEO Approval */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                  <img
                    src={company.ceo.photoUrl}
                    alt={company.ceo.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/[0.1]"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">{company.ceo.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {company.ceo.approvalRate}% odobrava rad CEO-a
                    </p>
                  </div>
                </div>

                <Link
                  to={`/companies/${company.id}`}
                  className="block text-center py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono font-bold text-[#ff7b1a] border border-white/[0.08] transition"
                >
                  Istraži sve recenzije i plaće tvrtke &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {applyModalOpen && (
        <EasyApplyModal
          job={job}
          onClose={() => setApplyModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};
