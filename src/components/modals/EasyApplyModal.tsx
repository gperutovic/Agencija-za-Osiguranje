import React, { useState } from 'react';
import { X, Zap, CheckCircle2, AlertCircle, FileText, Send, Check } from 'lucide-react';
import { Job, CandidateApplication } from '../../types/jobPlatform';
import { jobDataService } from '../../services/jobDataService';

interface EasyApplyModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

export const EasyApplyModal: React.FC<EasyApplyModalProps> = ({ job, onClose, onSuccess }) => {
  const profile = jobDataService.getCandidateProfile();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState('+385 91 555 1234');
  const [coverNote, setCoverNote] = useState('');

  // Calculate skill match
  const candidateSkills = profile.skills.map((s) => s.toLowerCase());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  job.skills.forEach((skill) => {
    if (candidateSkills.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchScore = Math.round((matchedSkills.length / Math.max(job.skills.length, 1)) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const application: CandidateApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      candidateName: name,
      candidateEmail: email,
      candidatePhone: phone,
      coverNote,
      skillsMatched: matchedSkills,
      skillsMissing: missingSkills,
      matchScore,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
    };

    jobDataService.submitApplication(application);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c101c] border border-white/[0.1] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.05] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pb-5 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fb6504]/10 border border-[#fb6504]/25 text-[#ff7b1a] text-[11px] font-mono font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#ff7b1a]" />
            <span>1-Klik Brza Prijava (Easy Apply)</span>
          </div>
          <h2 className="text-xl font-black text-white">
            Prijava za {job.title}
          </h2>
          <p className="text-xs text-slate-400">
            {job.companyName} • {job.location} • {job.responseSLA}
          </p>
        </div>

        {/* Skill Match Gauge Card */}
        <div className="my-5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-300">
              Podudaranje vaših vještina (Match Score)
            </span>
            <span className={`text-xs font-mono font-black ${matchScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {matchScore}% ({matchedSkills.length} od {job.skills.length})
            </span>
          </div>

          <div className="w-full bg-dark-950 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                matchScore >= 70 ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{ width: `${matchScore}%` }}
            />
          </div>

          <div className="space-y-2 pt-1 text-[11px]">
            {matchedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-slate-400 font-mono text-[10px]">Podudarne:</span>
                {matchedSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                    ✓ {s}
                  </span>
                ))}
              </div>
            )}
            {missingSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-slate-400 font-mono text-[10px]">Preporučeno usavršiti:</span>
                {missingSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                    + {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">
                Ime i Prezime *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">
                Kontakt Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">
              Broj telefona
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">
              Kratka motivacijska poruka (opcionalno)
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Nekoliko rečenica o tome zašto ste idealan kandidat za ovu poziciju..."
              className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3 text-xs text-slate-400">
            <FileText className="w-5 h-5 text-[#ff7b1a] shrink-0" />
            <span>Prilaže se spremljeni životopis i profil s KarijereHuba.</span>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-bold text-slate-300"
            >
              Odustani
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-extrabold shadow-lg shadow-[#fb6504]/25 flex items-center gap-1.5"
            >
              <span>Pošalji 1-Klik Prijavu</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
