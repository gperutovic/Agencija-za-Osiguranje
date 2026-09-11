import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Building2,
  Star,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  MapPin,
  Globe,
  Users,
  Briefcase,
  DollarSign,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  MessageSquarePlus,
  Share2,
  CheckCircle2,
  ArrowRight,
  Send,
  Plus
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { WriteReviewModal } from '../../components/modals/WriteReviewModal';
import { AddInterviewModal } from '../../components/modals/AddInterviewModal';
import { SubmitSalaryModal } from '../../components/modals/SubmitSalaryModal';
import { EasyApplyModal } from '../../components/modals/EasyApplyModal';
import { Job } from '../../types/jobPlatform';

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const company = jobDataService.getCompanyById(id || 'comp-infobip');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  // Community discussion input
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 text-slate-100">
        <h2 className="text-2xl font-bold">Tvrtka nije pronađena</h2>
        <Link to="/companies" className="text-[#ff7b1a] hover:underline font-mono">
          &larr; Povratak na popis tvrtki
        </Link>
      </div>
    );
  }

  const reviews = jobDataService.getReviews(company.id);
  const interviews = jobDataService.getInterviews(company.id);
  const salaries = jobDataService.getSalaries(company.id);
  const benefits = jobDataService.getBenefits(company.id);
  const jobs = jobDataService.getJobs().filter((j) => j.companyId === company.id);
  const discussions = jobDataService.getDiscussions(company.id);

  const tabs = [
    { id: 'overview', label: 'Pregled', count: null },
    { id: 'reviews', label: 'Recenzije', count: reviews.length },
    { id: 'salaries', label: 'Plaće & Leveling', count: salaries.length },
    { id: 'interviews', label: 'Intervjui', count: interviews.length },
    { id: 'benefits', label: 'Benefiti', count: benefits.length },
    { id: 'jobs', label: 'Otvoreni Poslovi', count: jobs.length },
    { id: 'community', label: 'Work Talk', count: discussions.length },
  ];

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim()) return;

    jobDataService.addDiscussion({
      id: `disc-${Date.now()}`,
      companyId: company.id,
      companyName: company.name,
      category: 'Workplace Talk',
      title: newDiscussionTitle,
      content: newDiscussionContent,
      authorAnonTag: `Korisnik #${Math.floor(Math.random() * 900 + 100)}`,
      upvotes: 1,
      replyCount: 0,
      replies: [],
      createdAt: new Date().toISOString(),
    });

    setNewDiscussionTitle('');
    setNewDiscussionContent('');
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen text-slate-100 pb-24 space-y-8">
      {/* BANNER & HERO CARD */}
      <div className="relative">
        <div className="h-56 sm:h-72 w-full overflow-hidden relative">
          <img
            src={company.bannerUrl}
            alt={company.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080c] via-[#06080c]/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 z-10">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/95 border border-white/[0.1] backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#0a0d16] bg-black shadow-2xl shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-4xl font-black text-white">
                      {company.name}
                    </h1>
                    {company.verified && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verificirano
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-mono text-slate-300">
                    {company.industry} • Osnovano {company.foundedYear}. • {company.employeeCount}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ff7b1a]" /> {company.headquarters}
                    </span>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-300 hover:text-white hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" /> {company.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-extrabold shadow-lg shadow-[#fb6504]/25 transition flex items-center gap-1.5"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Napiši Recenziju</span>
                </button>
                <button
                  onClick={() => setInterviewModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold border border-white/[0.1] transition flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>Dodaj Intervju</span>
                </button>
                <button
                  onClick={() => setSalaryModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold border border-white/[0.1] transition flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Unesi Plaću</span>
                </button>
              </div>
            </div>

            {/* GLASSDOOR KEY METRICS HIGHLIGHT BAR */}
            <div className="pt-6 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {/* Overall Rating */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-0.5">
                <div className="flex items-center justify-center gap-1.5 text-[#ff7b1a] font-black text-2xl font-mono">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{company.rating}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Ocjena na temelju {company.reviewCount} recenzija
                </p>
              </div>

              {/* Recommend to a friend */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-0.5">
                <span className="text-2xl font-black text-emerald-400 block font-mono">
                  {company.recommendToFriendRate}%
                </span>
                <p className="text-[11px] font-mono text-slate-400">
                  Preporučuje prijatelju
                </p>
              </div>

              {/* CEO Approval Card */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center gap-3 text-left">
                <img
                  src={company.ceo.photoUrl}
                  alt={company.ceo.name}
                  className="w-11 h-11 rounded-full object-cover border border-white/[0.1] shrink-0"
                />
                <div>
                  <span className="text-base font-black text-[#ff7b1a] block font-mono">
                    {company.ceo.approvalRate}% Odobrava
                  </span>
                  <p className="text-[10px] font-mono text-slate-400 leading-tight">
                    CEO {company.ceo.name}
                  </p>
                </div>
              </div>

              {/* Business Outlook */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-0.5">
                <span className="text-2xl font-black text-cyan-400 block font-mono">
                  {company.businessOutlookRate}%
                </span>
                <p className="text-[11px] font-mono text-slate-400">
                  Pozitivan 6-mjesečni trend ↗
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-2 pb-2 border-b border-white/[0.08] scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setSearchParams({ tab: t.id })}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-mono whitespace-nowrap transition flex items-center gap-2 ${
                currentTab === t.id
                  ? 'bg-[#fb6504] text-white shadow-lg shadow-[#fb6504]/20'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
              }`}
            >
              <span>{t.label}</span>
              {t.count !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  currentTab === t.id ? 'bg-black/30 text-white' : 'bg-white/[0.06] text-slate-400'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. OVERVIEW TAB */}
        {currentTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: About & Culture (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* About Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white pb-3 border-b border-white/[0.06]">
                  O tvrtki {company.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {company.about}
                </p>
                <div className="pt-3 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  <span><strong>Lokacije ureda:</strong> {company.officeLocations.join(', ')}</span>
                </div>
              </div>

              {/* Glassdoor Culture Scorecard */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5">
                <h3 className="text-lg font-black text-white pb-3 border-b border-white/[0.06] flex items-center justify-between">
                  <span>Ocjene radne kulture po dimenzijama</span>
                  <span className="text-xs font-mono text-amber-400 font-bold">Maksimalno 5.0 ★</span>
                </h3>

                <div className="space-y-4 text-xs font-mono">
                  {[
                    { label: 'Kultura i vrijednosti', score: company.cultureScores.cultureAndValues },
                    { label: 'Balans posla i privatnog života', score: company.cultureScores.workLifeBalance },
                    { label: 'Senior menadžment i vodstvo', score: company.cultureScores.seniorLeadership },
                    { label: 'Kompenzacija i beneficije', score: company.cultureScores.compAndBenefits },
                    { label: 'Mogućnosti napredovanja u karijeri', score: company.cultureScores.careerOpportunities },
                    { label: 'Raznolikost i inkluzija (DE&I)', score: company.cultureScores.diversityInclusion },
                  ].map((dim) => (
                    <div key={dim.label} className="space-y-1.5">
                      <div className="flex justify-between text-slate-300">
                        <span>{dim.label}</span>
                        <span className="text-[#ff7b1a] font-bold">{dim.score.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="w-full bg-dark-950 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-[#fb6504] h-full rounded-full"
                          style={{ width: `${(dim.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open jobs teaser */}
              <div className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Tražite posao u {company.name}?</h4>
                  <p className="text-xs text-slate-400 font-mono">Trenutačno je aktivno {jobs.length} otvorenih natječaja</p>
                </div>
                <button
                  onClick={() => setSearchParams({ tab: 'jobs' })}
                  className="px-4 py-2 rounded-xl bg-[#fb6504] text-white text-xs font-bold font-mono flex items-center gap-1.5 hover:bg-[#ff7b1a] transition"
                >
                  <span>Pogledaj poslove</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Tech Stack & Perks (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Tech Stack */}
              <div className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-300 pb-3 border-b border-white/[0.06]">
                  Tehnološki Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {company.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] font-mono text-xs font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Perks */}
              <div className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-300 pb-3 border-b border-white/[0.06]">
                  Ključni Benefiti
                </h4>
                <div className="space-y-2.5">
                  {company.perks.map((p, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. REVIEWS TAB */}
        {currentTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-xl font-black text-white">Recenzije zaposlenika ({reviews.length})</h3>
                <p className="text-xs text-slate-400 font-mono">100% anonimne i provjerene recenzije stvarnih zaposlenika</p>
              </div>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold font-mono flex items-center gap-1.5 transition"
              >
                <MessageSquarePlus className="w-4 h-4" /> Napiši Recenziju
              </button>
            </div>

            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5"
                >
                  {/* Review Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-amber-400/10 text-amber-400 font-mono font-black text-xs">
                          ★ {r.rating}.0
                        </span>
                        <h4 className="text-base font-black text-white">{r.title}</h4>
                      </div>
                      <p className="text-xs font-mono text-slate-400">
                        {r.authorRole} • {r.employmentStatus === 'Current' ? 'Trenutni zaposlenik' : 'Bivši zaposlenik'} ({r.yearsAtCompany}) • {r.createdAt.split('T')[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      {r.recommends && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5" /> Preporučuje
                        </span>
                      )}
                      {r.ceoApproval && (
                        <span className="text-[#ff7b1a] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Odobrava CEO-a
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                      <span className="font-mono font-bold uppercase text-emerald-400 text-[10px] block">
                        Prednosti (Pros)
                      </span>
                      <p className="text-slate-200 leading-relaxed">{r.pros}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                      <span className="font-mono font-bold uppercase text-rose-400 text-[10px] block">
                        Nedostaci (Cons)
                      </span>
                      <p className="text-slate-200 leading-relaxed">{r.cons}</p>
                    </div>
                  </div>

                  {/* Advice to management */}
                  {r.adviceToManagement && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300">
                      <strong className="text-white font-mono uppercase text-[10px] block mb-1">
                        Savjet menadžmentu:
                      </strong>
                      <p className="italic font-light">{r.adviceToManagement}</p>
                    </div>
                  )}

                  {/* Official Employer Response (Glassdoor Model) */}
                  {r.employerResponse && (
                    <div className="p-4 rounded-2xl bg-white/[0.03] border-l-4 border-l-[#fb6504] border border-white/[0.06] space-y-1.5 text-xs ml-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{r.employerResponse.author}</span>
                        <span className="px-2 py-0.2 rounded bg-[#fb6504]/20 text-[#ff7b1a] text-[10px] font-mono font-bold">
                          Službeni odgovor poslodavca
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{r.employerResponse.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SALARIES & LEVELING TAB (Levels.fyi + Glassdoor) */}
        {currentTab === 'salaries' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-xl font-black text-white">Usporedba plaća & Leveling ({salaries.length})</h3>
                <p className="text-xs text-slate-400 font-mono">Prikaz osnovice, bonusa i dionica (Total Comp) po razinama senioriteta</p>
              </div>
              <button
                onClick={() => setSalaryModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold font-mono flex items-center gap-1.5 transition"
              >
                <DollarSign className="w-4 h-4" /> Unesi svoju plaću
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {salaries.map((sal) => (
                <div
                  key={sal.id}
                  className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-white">{sal.jobTitle}</h4>
                        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] font-mono text-[11px] text-amber-400 font-bold">
                          {sal.level}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400">
                        {sal.department} • {sal.yearsOfExperience} god. iskustva • {sal.location}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-[#ff7b1a] font-mono block">
                        {sal.totalComp.toLocaleString()} € / god.
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Ukupni paket (TC)
                      </span>
                    </div>
                  </div>

                  {/* Visual Levels.fyi Waterfall Bar */}
                  <div className="space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="w-full h-3 rounded-full bg-dark-950 overflow-hidden flex">
                      <div
                        style={{ width: `${(sal.baseSalary / sal.totalComp) * 100}%` }}
                        className="bg-emerald-400 h-full"
                        title="Osnovica"
                      />
                      <div
                        style={{ width: `${(sal.bonus / sal.totalComp) * 100}%` }}
                        className="bg-amber-400 h-full"
                        title="Bonus"
                      />
                      <div
                        style={{ width: `${(sal.equity / sal.totalComp) * 100}%` }}
                        className="bg-cyan-400 h-full"
                        title="Dionice / ESOP"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Osnovna plaća: <strong className="text-white">{sal.baseSalary.toLocaleString()} €</strong></span>
                      <span>Godišnji bonus: <strong className="text-white">{sal.bonus.toLocaleString()} €</strong></span>
                      <span>Dionice / ESOP: <strong className="text-white">{sal.equity.toLocaleString()} €</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INTERVIEWS TAB */}
        {currentTab === 'interviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-xl font-black text-white">Baza pitanja & Iskustva s intervjua ({interviews.length})</h3>
                <p className="text-xs text-slate-400 font-mono">Težina procesa, stvarna pitanja i savjeti za uspjeh</p>
              </div>
              <button
                onClick={() => setInterviewModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold font-mono flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-4 h-4" /> Dodaj Intervju
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {interviews.map((intv) => (
                <div
                  key={intv.id}
                  className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6"
                >
                  {/* Top Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-black text-white">{intv.jobTitle}</h4>
                      <p className="text-xs font-mono text-slate-400">
                        {intv.department} • Izvor: {intv.applicationSource} • Trajanje: {intv.processLength}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <div className="p-2 rounded-xl bg-white/[0.04] text-center border border-white/[0.08]">
                        <span className="text-[#ff7b1a] font-bold block">{intv.difficulty.toFixed(1)} / 5.0</span>
                        <span className="text-[10px] text-slate-400">Težina</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.04] text-center border border-white/[0.08]">
                        <span className="text-emerald-400 font-bold block">{intv.offerOutcome}</span>
                        <span className="text-[10px] text-slate-400">Ishod</span>
                      </div>
                    </div>
                  </div>

                  {/* Interview Stages Timeline */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      Faze selekcijskog postupka:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {intv.stages.map((stg, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs font-mono bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.06]">
                          <span className="w-5 h-5 rounded-full bg-[#fb6504]/20 text-[#ff7b1a] text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-slate-200">{stg}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real Interview Questions Asked */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-mono uppercase font-bold text-cyan-400">
                      Stvarna pitanja s razgovora:
                    </span>
                    <div className="space-y-2">
                      {intv.questions.map((q) => (
                        <div
                          key={q.id}
                          className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold">
                              {q.type}
                            </span>
                            <p className="text-slate-100 font-medium pt-1">"{q.question}"</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {q.helpfulCount} korisnih glasova
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Candidate Advice */}
                  {intv.advice && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300">
                      <strong className="text-white font-mono uppercase text-[10px] block mb-1">
                        Savjet za pripremu:
                      </strong>
                      <p className="font-light">{intv.advice}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. BENEFITS TAB */}
        {currentTab === 'benefits' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/[0.08]">
              <h3 className="text-xl font-black text-white">Ocjene benefita i pogodnosti ({benefits.length})</h3>
              <p className="text-xs text-slate-400 font-mono">Zaposlenici ocjenjuju kvalitetu zdravstvenog osiguranja, fleksibilnosti i budžeta</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.id}
                  className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-slate-400 text-[10px] font-mono uppercase font-bold border border-white/[0.08]">
                        {b.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{b.name}</h4>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 font-mono font-bold text-sm text-center">
                      ★ {b.rating.toFixed(1)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {b.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    {b.comments.map((comm, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/[0.02] text-[11px] text-slate-400">
                        <p className="italic text-slate-200">"{comm.comment}"</p>
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">— {comm.author}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. OPEN JOBS TAB */}
        {currentTab === 'jobs' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/[0.08]">
              <h3 className="text-xl font-black text-white">Otvorene pozicije ({jobs.length})</h3>
              <p className="text-xs text-slate-400 font-mono">Prijavite se izravno s KarijereHuba uz 1-klik prijavu</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {jobs.length === 0 ? (
                <div className="p-8 text-center rounded-3xl bg-white/[0.02] border border-white/[0.08] text-xs text-slate-400">
                  Tvrtka trenutačno nema otvorenih natječaja.
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] hover:border-[#fb6504]/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <Link to={`/jobs/${job.id}`}>
                        <h4 className="text-base font-bold text-white hover:text-[#ff7b1a] transition">
                          {job.title}
                        </h4>
                      </Link>
                      <p className="text-xs font-mono text-slate-400">
                        {job.location} ({job.workplaceType}) • <span className="text-emerald-400 font-bold">{job.salaryMin.toLocaleString()} € - {job.salaryMax.toLocaleString()} €</span>
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {job.skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-white/[0.03] text-slate-400 font-mono text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedJobForApply(job)}
                        className="px-4 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold font-mono transition"
                      >
                        1-Klik Prijava
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 7. WORK TALK / COMMUNITY TAB (Fishbowl style) */}
        {currentTab === 'community' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/[0.08]">
              <h3 className="text-xl font-black text-white">Work Talk & Pitanja ({discussions.length})</h3>
              <p className="text-xs text-slate-400 font-mono">Anonimni razgovori, savjeti i iskustva zajednice</p>
            </div>

            {/* Create Post */}
            <form onSubmit={handleCreateDiscussion} className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
                Postavite anonimno pitanje zaposlenicima {company.name}
              </h4>
              <input
                type="text"
                required
                value={newDiscussionTitle}
                onChange={(e) => setNewDiscussionTitle(e.target.value)}
                placeholder="Naslov teme (npr. Kakva je dinamika rada u timu ili ima li on-call dežurstava?)"
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
              />
              <textarea
                rows={2}
                required
                value={newDiscussionContent}
                onChange={(e) => setNewDiscussionContent(e.target.value)}
                placeholder="Dodajte detalje..."
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Objavi Pitanje
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {discussions.map((d) => (
                <div key={d.id} className="p-6 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{d.authorAnonTag} {d.authorRole && `(${d.authorRole})`}</span>
                    <span>{d.createdAt.split('T')[0]}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{d.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{d.content}</p>

                  {d.replies.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                      {d.replies.map((rep) => (
                        <div key={rep.id} className="p-3 rounded-2xl bg-white/[0.02] text-xs space-y-1">
                          <div className="flex justify-between font-mono text-[10px] text-slate-400">
                            <span className="font-bold text-[#ff7b1a]">{rep.authorAnonTag} {rep.authorRole && `• ${rep.authorRole}`}</span>
                            <span>{rep.createdAt.split('T')[0]}</span>
                          </div>
                          <p className="text-slate-200">{rep.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {reviewModalOpen && (
        <WriteReviewModal
          company={company}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {interviewModalOpen && (
        <AddInterviewModal
          company={company}
          onClose={() => setInterviewModalOpen(false)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {salaryModalOpen && (
        <SubmitSalaryModal
          company={company}
          onClose={() => setSalaryModalOpen(false)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {selectedJobForApply && (
        <EasyApplyModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};
