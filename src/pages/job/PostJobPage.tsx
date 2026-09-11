import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  DollarSign,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  Plus,
  Trash2,
  MapPin,
  Zap
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { Job, WorkplaceType, JobType, ExperienceLevel } from '../../types/jobPlatform';

export const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const companies = jobDataService.getCompanies();

  const [step, setStep] = useState(1);

  // Form State
  const [companyId, setCompanyId] = useState(companies[0]?.id || 'comp-infobip');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Zagreb, Hrvatska');
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>('Hybrid');
  const [type, setType] = useState<JobType>('Full-time');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Senior');
  const [salaryMin, setSalaryMin] = useState(42000);
  const [salaryMax, setSalaryMax] = useState(60000);
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    'Arhitektura i razvoj skalabilnih servisa\nMentoriranje inženjera i provođenje code reviewa\nOptimizacija performansi i smanjenje latencije'
  );
  const [requirementsText, setRequirementsText] = useState(
    'Minimalno 4 godine iskustva u razvoju softvera\nPoznavanje cloud i kontejnerskih tehnologija\nIskustvo u radu s relacijskim bazama podataka'
  );
  const [skillsInput, setSkillsInput] = useState('Java, Spring Boot, Docker, Kubernetes, PostgreSQL');
  const [easyApply, setEasyApply] = useState(true);

  const selectedCompany = companies.find((c) => c.id === companyId) || companies[0];

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const responsibilities = responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const requirements = requirementsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newJob: Job = {
      id: `job-${Date.now()}`,
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      companyLogo: selectedCompany.logoUrl,
      companyRating: selectedCompany.rating,
      title,
      department,
      location,
      workplaceType,
      type,
      experienceLevel,
      salaryMin,
      salaryMax,
      currency: 'EUR',
      description,
      responsibilities,
      requirements,
      skills,
      perks: ['Fleksibilno radno vrijeme', 'Edukacijski budžet', 'Privatno zdravstveno'],
      easyApply,
      applicantCount: 0,
      responseSLA: 'Tipičan odgovor unutar 24 sata',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'active',
      featured: true,
    };

    jobDataService.addJob(newJob);
    navigate(`/jobs/${newJob.id}`);
  };

  return (
    <div className="min-h-screen text-slate-100 pb-24 space-y-8">
      {/* Header */}
      <section className="pt-12 pb-8 border-b border-white/[0.08] bg-gradient-to-b from-[#0a0d16] to-[#06080c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fb6504]/10 border border-[#fb6504]/20 text-xs font-mono font-bold text-[#ff7b1a]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>B2B Portal za Poslodavce</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Objavite oglas za posao
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Dosegnite tisuće provjerenih softverskih inženjera i IT talenata uz maksimalnu transparentnost.
          </p>

          {/* Stepper */}
          <div className="flex items-center gap-2 pt-4 font-mono text-xs">
            {[
              { num: 1, label: 'Osnovno' },
              { num: 2, label: 'Uvjeti & Plaća' },
              { num: 3, label: 'Opis & Vještine' },
              { num: 4, label: 'Pregled' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition ${
                  step === s.num
                    ? 'bg-[#fb6504] text-white font-bold'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                    : 'bg-white/[0.03] text-slate-500'
                }`}
              >
                <span>{s.num}. {s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <form onSubmit={handlePublish} className="p-6 sm:p-10 rounded-3xl bg-[#0a0d16]/95 border border-white/[0.1] backdrop-blur-xl shadow-2xl space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-lg font-black text-white pb-3 border-b border-white/[0.06]">
                Korak 1: Podaci o poziciji i tvrtki
              </h3>

              <div>
                <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  Poslodavac / Tvrtka *
                </label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  Naziv radnog mjesta *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="npr. Senior Full Stack Engineer (React & Go)"
                  className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    Odjel / Područje
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="npr. Core Infrastructure"
                    className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    Lokacija
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="npr. Zagreb, Hrvatska ili Remote"
                    className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    Model rada
                  </label>
                  <select
                    value={workplaceType}
                    onChange={(e) => setWorkplaceType(e.target.value as any)}
                    className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                  >
                    <option value="Remote">Potpuno Remote</option>
                    <option value="Hybrid">Hibridno</option>
                    <option value="Onsite">Iz ureda (Onsite)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    Vrsta zaposlenja
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                  >
                    <option value="Full-time">Puno radno vrijeme</option>
                    <option value="Part-time">Nepuno radno vrijeme</option>
                    <option value="Contract">B2B Ugovor / Paušal</option>
                    <option value="Internship">Praksa</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    Senioritet
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead / Principal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={!title.trim()}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  <span>Dalje: Kompenzacija</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-black text-white pb-3 border-b border-white/[0.06]">
                Korak 2: Transparentna kompenzacija (EU Direktiva 2026)
              </h3>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Oglasi s transparentnim rasponom plaća ostvaruju 3.8x više kvalitetnih prijava.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    Minimalna godišnja plaća (€)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white font-mono font-bold focus:border-[#fb6504] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    Maksimalna godišnja plaća (€)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white font-mono font-bold focus:border-[#fb6504] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Omogući 1-Klik Easy Apply</span>
                  <p className="text-[11px] text-slate-400 font-mono">Kandidati se mogu prijaviti sa spremljenim KarijereHub profilom</p>
                </div>
                <input
                  type="checkbox"
                  checked={easyApply}
                  onChange={(e) => setEasyApply(e.target.checked)}
                  className="w-5 h-5 accent-[#fb6504] rounded"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-bold text-slate-300"
                >
                  Natrag
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold flex items-center gap-2"
                >
                  <span>Dalje: Opis & Vještine</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-lg font-black text-white pb-3 border-b border-white/[0.06]">
                Korak 3: Opis posla, odgovornosti i tražene vještine
              </h3>

              <div>
                <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  Kratki sažetak uloge *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Opišite zašto je ova uloga uzbudljiva i koji je njezin utjecaj na poslovanje..."
                  className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  Odgovornosti (jedna stavka po retku)
                </label>
                <textarea
                  rows={3}
                  value={responsibilitiesText}
                  onChange={(e) => setResponsibilitiesText(e.target.value)}
                  className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl p-3 text-xs text-white font-mono focus:border-[#fb6504] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  Zahtjevi (jedna stavka po retku)
                </label>
                <textarea
                  rows={3}
                  value={requirementsText}
                  onChange={(e) => setRequirementsText(e.target.value)}
                  className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl p-3 text-xs text-white font-mono focus:border-[#fb6504] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  Ključne vještine & tagovi (odvojeni zarezom) *
                </label>
                <input
                  type="text"
                  required
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="npr. React, TypeScript, GraphQL, Docker, Tailwind"
                  className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-bold text-slate-300"
                >
                  Natrag
                </button>
                <button
                  type="button"
                  disabled={!description.trim()}
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  <span>Pregled oglasa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW & PUBLISH */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-white pb-3 border-b border-white/[0.06]">
                Korak 4: Pregled prije objave
              </h3>

              {/* Card Preview */}
              <div className="p-6 rounded-3xl bg-[#0c101c] border border-[#fb6504]/40 shadow-2xl space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={selectedCompany.logoUrl}
                    alt={selectedCompany.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/[0.1]"
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400">{selectedCompany.name}</span>
                    <h4 className="text-xl font-black text-white">{title || 'Naziv Pozicije'}</h4>
                    <p className="text-xs font-mono text-slate-400">
                      {location} ({workplaceType}) • <strong className="text-emerald-400">{salaryMin.toLocaleString()} € - {salaryMax.toLocaleString()} €</strong>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-2">
                  {description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {skillsInput.split(',').map((s) => s.trim()).filter(Boolean).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 font-mono text-[10px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-bold text-slate-300"
                >
                  Uredi detalje
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-2xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-extrabold shadow-xl shadow-[#fb6504]/30 flex items-center gap-2 transition hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Objavi oglas na KarijereHubu</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
