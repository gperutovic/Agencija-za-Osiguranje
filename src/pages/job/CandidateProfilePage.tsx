import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Clock,
  Trash2,
  Plus,
  Zap,
  Bookmark,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { CandidateProfile } from '../../types/jobPlatform';

export const CandidateProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<CandidateProfile>(jobDataService.getCandidateProfile());
  const applications = jobDataService.getApplications();
  const allJobs = jobDataService.getJobs();

  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const savedJobs = allJobs.filter((j) => profile.savedJobIds.includes(j.id));

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || profile.skills.includes(newSkill.trim())) return;

    const updatedProfile = {
      ...profile,
      skills: [...profile.skills, newSkill.trim()],
    };

    setProfile(updatedProfile);
    jobDataService.updateCandidateProfile(updatedProfile);
    setNewSkill('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedProfile = {
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    };
    setProfile(updatedProfile);
    jobDataService.updateCandidateProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen text-slate-100 pb-24 space-y-8">
      {/* Profile Header */}
      <section className="pt-12 pb-8 border-b border-white/[0.08] bg-gradient-to-b from-[#0a0d16] to-[#06080c]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#fb6504] to-amber-500 p-1 shadow-2xl">
                <div className="w-full h-full bg-[#0a0d16] rounded-[22px] flex items-center justify-center font-mono font-black text-2xl text-[#ff7b1a]">
                  {profile.name.split(' ').map((n) => n[0]).join('')}
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {profile.name}
                </h1>
                <p className="text-xs sm:text-sm font-mono text-[#ff7b1a] font-bold">
                  {profile.title}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {profile.location}
                  </span>
                  <span>•</span>
                  <span>{profile.experienceYears} god. iskustva</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Ciljana plaća: {profile.targetSalary.toLocaleString()} €</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/jobs"
                className="px-4 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold font-mono transition flex items-center gap-1.5"
              >
                <Briefcase className="w-4 h-4" />
                <span>Pregledaj poslove</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Applied Jobs & Saved Jobs (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Applications Tracker */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff7b1a]" /> Moje Prijave ({applications.length})
              </h3>
              <span className="text-xs font-mono text-slate-400">Status u realnom vremenu</span>
            </div>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Trenutačno nemate aktivnih prijava. Prijavite se na otvorene pozicije pomoću 1-klik prijave.
                </p>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={app.companyLogo}
                        alt={app.companyName}
                        className="w-11 h-11 rounded-xl object-cover border border-white/[0.08]"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono text-slate-400">{app.companyName}</span>
                        <h4 className="text-sm font-bold text-white">{app.jobTitle}</h4>
                        <p className="text-[10px] font-mono text-slate-500">
                          Prijavljeno {app.appliedAt.split('T')[0]} • Match: <strong className="text-emerald-400">{app.matchScore}%</strong>
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                        app.status === 'Interviewing'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : app.status === 'Offered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {app.status === 'Interviewing' ? 'Intervju u tijeku' : app.status === 'Applied' ? 'Zaprimljeno' : app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Saved Jobs */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-lg font-black text-white pb-3 border-b border-white/[0.06] flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" /> Spremljeni Oglasi ({savedJobs.length})
            </h3>

            <div className="space-y-3">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono text-slate-400">{job.companyName}</span>
                    <Link to={`/jobs/${job.id}`} className="text-sm font-bold text-white hover:text-[#ff7b1a] block">
                      {job.title}
                    </Link>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {job.salaryMin.toLocaleString()} € - {job.salaryMax.toLocaleString()} €
                    </span>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-200 border border-white/[0.08] transition"
                  >
                    Pogledaj &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Skills Inventory & Bio (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Skills Management */}
          <div className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
                Moje Vještine & Tehnologije
              </h4>
              {savedSuccess && (
                <span className="text-[10px] font-mono text-emerald-400">Ažurirano!</span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Dodajte tehnologije koje poznajete kako bi sustav automatski izračunao točan Match Score za svaki oglas.
            </p>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Dodaj novu vještinu..."
                className="flex-1 bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#fb6504] text-white text-xs font-bold shrink-0"
              >
                Dodaj
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-xl bg-white/[0.04] text-slate-200 text-xs font-mono border border-white/[0.08] flex items-center gap-1.5 group"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-rose-400 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bio Card */}
          <div className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-300 pb-2 border-b border-white/[0.06]">
              O meni
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              {profile.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
