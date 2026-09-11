import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const JobFooter: React.FC = () => {
  return (
    <footer className="bg-[#04060a] border-t border-white/[0.08] text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/jobs" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#fb6504] to-amber-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0d16] rounded-[10px] flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-[#ff7b1a]" />
                </div>
              </div>
              <span className="text-base font-black text-white tracking-tight">
                KARIJERE<span className="text-[#ff7b1a]">HUB</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Vodeća platforma za transparentnost radnih mjesta, provjerene recenzije zaposlenika, uvid u stvarne plaće i pitanja s intervjua po uzoru na Glassdoor, Levels.fyi i Wellfound.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Anonimnost zajamčena enkripcijom</span>
            </div>
          </div>

          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Za Tražitelje Posla
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link to="/jobs" className="hover:text-white transition">Pretraži poslove</Link></li>
              <li><Link to="/companies" className="hover:text-white transition">Recenzije poslodavaca</Link></li>
              <li><Link to="/salaries" className="hover:text-white transition">Usporedba plaća (Leveling)</Link></li>
              <li><Link to="/interviews" className="hover:text-white transition">Pitanja s intervjua</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">Praćenje prijava</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Za Poslodavce
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link to="/post-a-job" className="hover:text-white transition">Objavi oglas za posao</Link></li>
              <li><Link to="/companies" className="hover:text-white transition">Upravljanje profilom tvrtke</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-white transition">ATS & Prijave kandidata</Link></li>
              <li><Link to="/community" className="hover:text-white transition">Employer Branding Hub</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Transparentnost
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link to="/community" className="hover:text-white transition">Zajednica & Work Talk</Link></li>
              <li><span className="text-slate-500">Smjernice za recenzije</span></li>
              <li><span className="text-slate-500">Privatnost i anonimnost</span></li>
              <li><span className="text-slate-500">Metodologija izračuna plaća</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 KarijereHub. Sva prava pridržana. Izgrađeno prema standardima Glassdoora i modernih platformi.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Firebase: agencija-za-osiguranje</span>
            <span>•</span>
            <span className="text-slate-400">Verzija: 2.4-Enterprise</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
