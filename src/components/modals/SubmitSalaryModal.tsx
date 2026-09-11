import React, { useState } from 'react';
import { X, DollarSign, ShieldCheck, Send, Check } from 'lucide-react';
import { Company, SalaryReport } from '../../types/jobPlatform';
import { jobDataService } from '../../services/jobDataService';

interface SubmitSalaryModalProps {
  company?: Company;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitSalaryModal: React.FC<SubmitSalaryModalProps> = ({ company, onClose, onSuccess }) => {
  const companies = jobDataService.getCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState(company?.id || companies[0]?.id || '');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [level, setLevel] = useState<'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff/Principal' | 'Director'>('Senior');
  const [baseSalary, setBaseSalary] = useState<number>(45000);
  const [bonus, setBonus] = useState<number>(4000);
  const [equity, setEquity] = useState<number>(3000);
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(5);
  const [location, setLocation] = useState('Zagreb, Hrvatska');
  const [currency] = useState<'EUR'>('EUR');

  const totalCompensation = baseSalary + (bonus || 0) + (equity || 0);
  const activeCompany = companies.find((c) => c.id === selectedCompanyId) || company;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany) return;

    const newSalary: SalaryReport = {
      id: `sal-${Date.now()}`,
      companyId: activeCompany.id,
      companyName: activeCompany.name,
      jobTitle: jobTitle || 'Software Engineer',
      department: department || 'Engineering',
      level,
      baseSalary,
      bonus,
      equity,
      totalComp: totalCompensation,
      yearsOfExperience,
      location,
      currency,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    jobDataService.addSalary(newSalary);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c101c] border border-white/[0.1] w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.05] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pb-5 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-bold">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Levels.fyi & Glassdoor Model Kompenzacije</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Unesi plaću i ukupni paket
          </h2>
          <p className="text-xs text-slate-400">
            Doprinesite transparentnosti i saznajte svoju stvarnu tržišnu vrijednost.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-5">
          {/* Company Selection */}
          {!company && (
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Odaberi poslodavca *
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Job Title & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Naziv pozicije / Uloga *
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="npr. Software Engineer"
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Razina senioriteta (Level) *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              >
                <option value="Junior">Junior (0-2 god.)</option>
                <option value="Mid">Mid / Samostalni (2-5 god.)</option>
                <option value="Senior">Senior (5+ god.)</option>
                <option value="Lead">Team Lead / Principal</option>
                <option value="Staff/Principal">Staff / Fellow</option>
                <option value="Director">Engineering Director / VP</option>
              </select>
            </div>
          </div>

          {/* Compensation Breakdown Card (Levels.fyi Style) */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono font-bold uppercase text-slate-300">
                Godišnji paket kompenzacije (Bruto 1 ili Ugovoreno)
              </span>
              <span className="text-xs font-mono font-black text-[#ff7b1a]">
                Ukupno (TC): {totalCompensation.toLocaleString()} € / god.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Osnovna plaća (€/god) *
                </label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                  className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-[#fb6504] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Godišnji bonus (€)
                </label>
                <input
                  type="number"
                  step="500"
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
                  className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-[#fb6504] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Dionice / ESOP (€/god)
                </label>
                <input
                  type="number"
                  step="500"
                  value={equity}
                  onChange={(e) => setEquity(Number(e.target.value))}
                  className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-[#fb6504] focus:outline-none"
                />
              </div>
            </div>

            {/* Visual breakdown bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-3 rounded-full bg-dark-950 overflow-hidden flex">
                <div
                  style={{ width: `${(baseSalary / totalCompensation) * 100}%` }}
                  className="bg-emerald-400 h-full"
                  title="Osnovica"
                />
                <div
                  style={{ width: `${(bonus / totalCompensation) * 100}%` }}
                  className="bg-amber-400 h-full"
                  title="Bonus"
                />
                <div
                  style={{ width: `${(equity / totalCompensation) * 100}%` }}
                  className="bg-cyan-400 h-full"
                  title="Dionice"
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Osnovica ({Math.round((baseSalary / totalCompensation) * 100)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Bonus ({Math.round((bonus / totalCompensation) * 100)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Dionice ({Math.round((equity / totalCompensation) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Experience & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Ukupne godine radnog iskustva *
              </label>
              <input
                type="number"
                min="0"
                max="40"
                required
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Lokacija rada
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Zagreb, Hrvatska ili Remote"
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Anonimna statistika bez osobnih podataka
            </span>
            <div className="flex gap-3">
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
                <span>Pošalji Podatke</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
