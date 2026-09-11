import React, { useState } from 'react';
import { X, HelpCircle, ShieldCheck, Plus, Trash2, Send, Check } from 'lucide-react';
import { Company, Interview, InterviewExperience, OfferOutcome } from '../../types/jobPlatform';
import { jobDataService } from '../../services/jobDataService';

interface AddInterviewModalProps {
  company: Company;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddInterviewModal: React.FC<AddInterviewModalProps> = ({ company, onClose, onSuccess }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [difficulty, setDifficulty] = useState<number>(3.5);
  const [experience, setExperience] = useState<InterviewExperience>('Positive');
  const [offerOutcome, setOfferOutcome] = useState<OfferOutcome>('Accepted');
  const [processLength, setProcessLength] = useState('3 tjedna');
  const [applicationSource, setApplicationSource] = useState<'Online Application' | 'Recruiter Reachout' | 'Employee Referral' | 'Campus' | 'Agency'>('Online Application');
  const [advice, setAdvice] = useState('');

  // Questions
  const [questions, setQuestions] = useState<Array<{ question: string; type: 'Behavioral' | 'Technical' | 'System Design' | 'Take-Home' | 'Culture Fit' }>>([
    { question: '', type: 'Technical' }
  ]);

  const addQuestionField = () => {
    setQuestions([...questions, { question: '', type: 'Technical' }]);
  };

  const removeQuestionField = (idx: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== idx));
    }
  };

  const updateQuestion = (idx: number, field: 'question' | 'type', value: string) => {
    const updated = [...questions];
    if (field === 'question') updated[idx].question = value;
    else updated[idx].type = value as any;
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validQuestions = questions
      .filter((q) => q.question.trim().length > 0)
      .map((q, idx) => ({
        id: `q-${Date.now()}-${idx}`,
        question: q.question.trim(),
        type: q.type,
        helpfulCount: 0,
        answersCount: 0,
      }));

    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      companyId: company.id,
      companyName: company.name,
      jobTitle: jobTitle || 'Software Engineer',
      department: department || 'Engineering',
      difficulty,
      experience,
      offerOutcome,
      processLength,
      applicationSource,
      stages: ['Inicijalni razgovor', 'Tehnički zadatak', 'Razgovor s timom'],
      questions: validQuestions,
      advice,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };

    jobDataService.addInterview(newInterview);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c101c] border border-white/[0.1] w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.05] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pb-5 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Iskustvo sa Selekcijskog Postupka</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Dodaj intervju za {company.name}
          </h2>
          <p className="text-xs text-slate-400">
            Podijelite kakva su bila pitanja, trajanje i težina razgovora za posao.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-5">
          {/* Job & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Naziv pozicije za koju ste se natjecali *
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="npr. Frontend Developer"
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Odjel / Tim
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="npr. R&D / Web Platforms"
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
              />
            </div>
          </div>

          {/* Difficulty & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Težina intervjua: <span className="text-[#ff7b1a]">{difficulty.toFixed(1)} / 5.0</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {difficulty < 2 ? 'Vrlo lagano' : difficulty < 3 ? 'Prosječno' : difficulty < 4 ? 'Izazovno' : 'Vrlo teško'}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={difficulty}
                onChange={(e) => setDifficulty(parseFloat(e.target.value))}
                className="w-full accent-[#fb6504] cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-2">
                Cjelokupni dojam
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Positive', 'Neutral', 'Negative'] as InterviewExperience[]).map((exp) => (
                  <button
                    type="button"
                    key={exp}
                    onClick={() => setExperience(exp)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition ${
                      experience === exp
                        ? exp === 'Positive'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : exp === 'Neutral'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-white/[0.04] text-slate-400'
                    }`}
                  >
                    {exp === 'Positive' ? 'Pozitivan' : exp === 'Neutral' ? 'Neutralan' : 'Negativan'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outcome & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Ishod natječaja
              </label>
              <select
                value={offerOutcome}
                onChange={(e) => setOfferOutcome(e.target.value as any)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              >
                <option value="Accepted">Prihvaćena ponuda</option>
                <option value="Declined">Odbijena ponuda</option>
                <option value="No Offer">Bez ponude</option>
                <option value="Pending">Čeka se ishod</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Trajanje procesa
              </label>
              <select
                value={processLength}
                onChange={(e) => setProcessLength(e.target.value)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              >
                <option value="1 tjedan">1 tjedan</option>
                <option value="2-3 tjedna">2-3 tjedna</option>
                <option value="1 mjesec">1 mjesec</option>
                <option value="Preko mjesec dana">Preko mjesec dana</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Kako ste došli do razgovora?
              </label>
              <select
                value={applicationSource}
                onChange={(e) => setApplicationSource(e.target.value as any)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              >
                <option value="Online Application">Online prijava na oglas</option>
                <option value="Recruiter Reachout">Javio se regruter</option>
                <option value="Employee Referral">Preporuka zaposlenika</option>
                <option value="Campus">Fakultet / Karijerni dani</option>
                <option value="Agency">Agencija za zapošljavanje</option>
              </select>
            </div>
          </div>

          {/* Real Questions */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase">
                Stvarna pitanja koja su vam postavili na intervjuu
              </label>
              <button
                type="button"
                onClick={addQuestionField}
                className="text-xs font-mono font-bold text-[#ff7b1a] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Dodaj pitanje
              </button>
            </div>

            {questions.map((q, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                  placeholder="npr. Kako biste riješili caching problem ili ispričajte o konfliktnoj situaciji..."
                  className="flex-1 bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
                />
                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(idx, 'type', e.target.value)}
                  className="bg-[#141a29] border border-white/[0.1] rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:border-[#fb6504] focus:outline-none"
                >
                  <option value="Technical">Tehničko</option>
                  <option value="System Design">Arhitektura</option>
                  <option value="Behavioral">Situacijsko</option>
                  <option value="Take-Home">Zadatak</option>
                </select>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestionField(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Advice */}
          <div>
            <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
              Savjet za buduće kandidate
            </label>
            <textarea
              rows={2}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="Na što obratiti pozornost, koje teme obnoviti..."
              className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Podaci su potpuno anonimizirani
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
                <span>Objavi Intervju</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
