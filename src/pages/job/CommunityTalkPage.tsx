import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Building2,
  ShieldCheck,
  Plus,
  Sparkles,
  MessageCircle,
  TrendingUp,
  Tag
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';
import { DiscussionPost } from '../../types/jobPlatform';

export const CommunityTalkPage: React.FC = () => {
  const allDiscussions = jobDataService.getDiscussions();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedCat, setSelectedCat] = useState<'Workplace Talk' | 'Interview Prep' | 'Salary & Negotiations' | 'Career Advice'>('Workplace Talk');
  const [replyOpenPostId, setReplyOpenPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const categories = [
    { id: 'all', label: 'Sve teme' },
    { id: 'Workplace Talk', label: 'Radna atmosfera (Work Talk)' },
    { id: 'Interview Prep', label: 'Priprema za intervju' },
    { id: 'Salary & Negotiations', label: 'Plaće & Pregovori' },
    { id: 'Career Advice', label: 'Karijerni savjeti' },
  ];

  const filtered = allDiscussions.filter(
    (d) => activeCategory === 'all' || d.category === activeCategory
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    jobDataService.addDiscussion({
      id: `disc-${Date.now()}`,
      category: selectedCat,
      title: newTitle,
      content: newContent,
      authorAnonTag: `Anonimni Član #${Math.floor(Math.random() * 899 + 100)}`,
      authorRole: 'Tech Profesionalac',
      isVerifiedEmployee: true,
      upvotes: 1,
      replyCount: 0,
      replies: [],
      createdAt: new Date().toISOString(),
    });

    setNewTitle('');
    setNewContent('');
    setRefreshKey((k) => k + 1);
  };

  const handleAddReply = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    jobDataService.addReply(postId, {
      authorAnonTag: `Korisnik #${Math.floor(Math.random() * 899 + 100)}`,
      authorRole: 'Zajednica',
      content: replyContent,
    });

    setReplyContent('');
    setReplyOpenPostId(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-12 pb-24 text-slate-100">
      {/* Header section */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-white/[0.08] bg-gradient-to-b from-[#0a0d16] to-[#06080c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold text-[#ff7b1a]">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Glassdoor Fishbowl & Blind Format</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Zajednica & Otvoreni Work Talk
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Iskrene, anonimne diskusije profesionalaca o radnim uvjetima, ponudama posla, pregovorima o povišici i dinamici u timovima.
            </p>
          </div>

          {/* Categories bar */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  activeCategory === cat.id
                    ? 'bg-[#fb6504] text-white shadow-lg shadow-[#fb6504]/25'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Create post box */}
        <form
          onSubmit={handleCreatePost}
          className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff7b1a]" /> Pokreni anonimnu raspravu
            </span>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% anonimno
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Naslov teme (npr. Iskustva s ponudama i dionicama u 2026)..."
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
              />
            </div>
            <div>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value as any)}
                className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
              >
                <option value="Workplace Talk">Workplace Talk</option>
                <option value="Interview Prep">Interview Prep</option>
                <option value="Salary & Negotiations">Plaće & Pregovori</option>
                <option value="Career Advice">Karijerni savjeti</option>
              </select>
            </div>
          </div>

          <textarea
            rows={3}
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Napišite pitanje ili zapažanje..."
            className="w-full bg-[#141a29] border border-white/[0.1] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
          />

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-extrabold shadow-lg shadow-[#fb6504]/25 flex items-center gap-1.5 transition"
            >
              <span>Objavi u Zajednici</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Discussions stream */}
        <div className="space-y-4">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] hover:border-white/[0.16] backdrop-blur-xl shadow-xl transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[#ff7b1a] font-bold border border-white/[0.08]">
                    {d.category}
                  </span>
                  {d.companyName && (
                    <span className="text-slate-400 font-bold flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" /> {d.companyName}
                    </span>
                  )}
                </div>
                <span className="text-slate-500">{d.createdAt.split('T')[0]}</span>
              </div>

              <h3 className="text-lg font-black text-white">{d.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {d.content}
              </p>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Objavio: <strong className="text-slate-200">{d.authorAnonTag}</strong> {d.authorRole && `(${d.authorRole})`}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#ff7b1a]" /> {d.upvotes}
                  </span>
                  <button
                    onClick={() => setReplyOpenPostId(replyOpenPostId === d.id ? null : d.id)}
                    className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Odgovori ({d.replies.length})
                  </button>
                </div>
              </div>

              {/* Replies Thread */}
              {d.replies.length > 0 && (
                <div className="space-y-2.5 pt-3 border-t border-white/[0.06] pl-3 sm:pl-6 border-l-2 border-l-white/[0.1]">
                  {d.replies.map((r) => (
                    <div key={r.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="font-bold text-[#ff7b1a]">{r.authorAnonTag} {r.authorRole && `• ${r.authorRole}`}</span>
                        <span>{r.createdAt.split('T')[0]}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{r.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Reply Input */}
              {replyOpenPostId === d.id && (
                <form
                  onSubmit={(e) => handleAddReply(d.id, e)}
                  className="pt-3 border-t border-white/[0.06] flex gap-2"
                >
                  <input
                    type="text"
                    required
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Napišite anonimni odgovor..."
                    className="flex-1 bg-[#141a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#fb6504] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#fb6504] text-white text-xs font-bold shrink-0"
                  >
                    Pošalji
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
