import React, { useState } from 'react';
import { X, Star, ShieldCheck, ThumbsUp, ThumbsDown, Send, Check } from 'lucide-react';
import { Company, Review } from '../../types/jobPlatform';
import { jobDataService } from '../../services/jobDataService';

interface WriteReviewModalProps {
  company: Company;
  onClose: () => void;
  onSuccess: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ company, onClose, onSuccess }) => {
  const [rating, setRating] = useState<number>(5);
  const [authorRole, setAuthorRole] = useState<string>('');
  const [employmentStatus, setEmploymentStatus] = useState<'Current' | 'Former'>('Current');
  const [yearsAtCompany, setYearsAtCompany] = useState<string>('1-2 godine');
  const [title, setTitle] = useState<string>('');
  const [pros, setPros] = useState<string>('');
  const [cons, setCons] = useState<string>('');
  const [adviceToManagement, setAdviceToManagement] = useState<string>('');
  const [recommends, setRecommends] = useState<boolean>(true);
  const [ceoApproval, setCeoApproval] = useState<boolean>(true);
  const [businessOutlook, setBusinessOutlook] = useState<'Positive' | 'Neutral' | 'Negative'>('Positive');

  // Subratings
  const [cultureAndValues, setCultureAndValues] = useState<number>(5);
  const [workLifeBalance, setWorkLifeBalance] = useState<number>(4);
  const [seniorLeadership, setSeniorLeadership] = useState<number>(4);
  const [compAndBenefits, setCompAndBenefits] = useState<number>(4);
  const [careerOpportunities, setCareerOpportunities] = useState<number>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      companyId: company.id,
      companyName: company.name,
      rating,
      subRatings: {
        cultureAndValues,
        workLifeBalance,
        seniorLeadership,
        compAndBenefits,
        careerOpportunities,
      },
      title,
      pros,
      cons,
      adviceToManagement: adviceToManagement.trim() || undefined,
      authorRole: authorRole || 'Zaposlenik',
      employmentStatus,
      yearsAtCompany,
      recommends,
      ceoApproval,
      businessOutlook,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      verifiedEmployee: true,
    };

    jobDataService.addReview(newReview);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Anonimna Recenzija Zaposlenika</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Ocijeni poslodavca {company.name}
          </h2>
          <p className="text-xs text-slate-400">
            Podijelite svoje iskustvo i pomozite kolegama u donošenju informiranih odluka o karijeri.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-5">
          {/* Overall Rating */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase">
              Ukupna ocjena poslodavca *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:text-amber-400 transition"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-base font-black text-amber-400 ml-2 font-mono">
                {rating}.0 / 5.0
              </span>
            </div>
          </div>

          {/* Subratings */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
              Ocjene po dimenzijama radne kulture
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Kultura i vrijednosti</span>
                <select
                  value={cultureAndValues}
                  onChange={(e) => setCultureAndValues(Number(e.target.value))}
                  className="bg-[#141a29] border border-white/[0.1] rounded-lg px-2 py-1 text-amber-400 font-mono font-bold"
                >
                  {[5, 4, 3, 2, 1].map((v) => <option key={v} value={v}>{v}.0 ★</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Balans posla i života</span>
                <select
                  value={workLifeBalance}
                  onChange={(e) => setWorkLifeBalance(Number(e.target.value))}
                  className="bg-[#141a29] border border-white/[0.1] rounded-lg px-2 py-1 text-amber-400 font-mono font-bold"
                >
                  {[5, 4, 3, 2, 1].map((v) => <option key={v} value={v}>{v}.0 ★</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Vodstvo & Menadžment</span>
                <select
                  value={seniorLeadership}
                  onChange={(e) => setSeniorLeadership(Number(e.target.value))}
                  className="bg-[#141a29] border border-white/[0.1] rounded-lg px-2 py-1 text-amber-400 font-mono font-bold"
                >
                  {[5, 4, 3, 2, 1].map((v) => <option key={v} value={v}>{v}.0 ★</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Kompenzacija & Benefiti</span>
                <select
                  value={compAndBenefits}
                  onChange={(e) => setCompAndBenefits(Number(e.target.value))}
                  className="bg-[#141a29] border border-white/[0.1] rounded-lg px-2 py-1 text-amber-400 font-mono font-bold"
                >
                  {[5, 4, 3, 2, 1].map((v) => <option key={v} value={v}>{v}.0 ★</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Glassdoor Sentiment Toggles: Recommend, CEO, Outlook */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Recommend */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 block">
                Preporučio prijatelju?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRecommends(true)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    recommends
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Da
                </button>
                <button
                  type="button"
                  onClick={() => setRecommends(false)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    !recommends
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" /> Ne
                </button>
              </div>
            </div>

            {/* CEO Approval */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 block">
                Odobravaš CEO-a ({company.ceo.name})?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCeoApproval(true)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    ceoApproval
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Da
                </button>
                <button
                  type="button"
                  onClick={() => setCeoApproval(false)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    !ceoApproval
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" /> Ne
                </button>
              </div>
            </div>

            {/* Business Outlook */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 block">
                Izgledi u idućih 6 mj.?
              </span>
              <select
                value={businessOutlook}
                onChange={(e) => setBusinessOutlook(e.target.value as any)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-xs text-white font-medium"
              >
                <option value="Positive">Pozitivno ↗</option>
                <option value="Neutral">Neutralno →</option>
                <option value="Negative">Negativno ↘</option>
              </select>
            </div>
          </div>

          {/* Role and Employment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Vaša uloga / Pozicija *
              </label>
              <input
                type="text"
                required
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="npr. Senior Java Dev"
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Status zaposlenja
              </label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value as any)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              >
                <option value="Current">Trenutno zaposlen</option>
                <option value="Former">Bivši zaposlenik</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
                Radni staž u tvrtki
              </label>
              <select
                value={yearsAtCompany}
                onChange={(e) => setYearsAtCompany(e.target.value)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              >
                <option value="Manje od 1 godine">Manje od 1 god.</option>
                <option value="1-2 godine">1-2 god.</option>
                <option value="3-5 godina">3-5 god.</option>
                <option value="Više od 5 godina">Više od 5 god.</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
              Naslov recenzije *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Jedna rečenica koja sažima vaše iskustvo..."
              className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
            />
          </div>

          {/* Pros */}
          <div>
            <label className="text-xs font-mono font-bold text-emerald-400 uppercase block mb-1.5">
              Prednosti (Pros) *
            </label>
            <textarea
              rows={3}
              required
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              placeholder="Što vam se najviše sviđa? Atmosfera, tim, tehnologije, fleksibilnost, oprema..."
              className="w-full bg-[#141a29] border border-emerald-500/30 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Cons */}
          <div>
            <label className="text-xs font-mono font-bold text-rose-400 uppercase block mb-1.5">
              Nedostaci (Cons) *
            </label>
            <textarea
              rows={3}
              required
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              placeholder="Što bi se moglo poboljšati? Procesi, komunikacija, tempo, birokracija..."
              className="w-full bg-[#141a29] border border-rose-500/30 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Advice to Management */}
          <div>
            <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1.5">
              Savjet menadžmentu (opcionalno)
            </label>
            <textarea
              rows={2}
              value={adviceToManagement}
              onChange={(e) => setAdviceToManagement(e.target.value)}
              placeholder="Konkretan savjet upravi tvrtke za poboljšanje radnog okruženja..."
              className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Vaš identitet i email ostaju skriveni
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
                <span>Objavi Recenziju</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
