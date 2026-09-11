import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, FileText, ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';

export const ValiantFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.07] bg-[#06080c] relative overflow-hidden">
      {/* Top Ambient Orange Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#fb6504]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Branding & HANFA Disclosures */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#fb6504] to-[#ea580c] text-white shadow-[0_0_15px_-3px_rgba(251,101,4,0.4)]">
                <img src="/logo.svg" alt="Agencija Život" className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white">AGENCIJA ŽIVOT</span>
                <span className="font-mono text-xs ml-2 text-[#fb6504] font-bold">HRVATSKA</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              ŽIVOT d.o.o. za poslove zastupanja u osiguranju je ovlaštena i licencirana agencija pod neposrednim nadzorom Hrvatske agencije za nadzor financijskih usluga (HANFA, Klasa: UP/I-983-02/24-01/12). 
              Pružamo najmodernija digitalna rješenja usporedbe, ugovaranja i brze isplate šteta u partnerstvu s vodećim osigurateljima u RH: Croatia Osiguranje, Allianz, Generali, Wiener i Grawe.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>HANFA Licenca UP/I-983-02</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>ISO 27001 & GDPR</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <FileText className="w-3.5 h-3.5 text-[#fb6504]" />
                <span>IPID & EU Direktiva IDD</span>
              </span>
            </div>
          </div>

          {/* Col 3: Digitalne Usluge */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Digitalne Usluge
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/quote" className="hover:text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>Maya 90-Sekundni Izračun</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>The Zebra Usporedba Polica</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/claims/file" className="hover:text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>AI Jim Prijava Štete (FNOL)</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/portal/coi" className="hover:text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>Potvrda o Osiguranju & Zelena Karta</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>Moj Život Klijentski Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Programi Osiguranja */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Programi u RH
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Auto Osiguranje (AO) & Puni Kasko</li>
              <li>Osiguranje Doma & Stvari od Potresa</li>
              <li>Životno Osiguranje ŽIVOT+ (Štednja)</li>
              <li>Dopunsko i Dodatno Zdravstveno</li>
              <li>Poslovno Osiguranje & Odgovornost (D&O)</li>
              <li>Osiguranje Zaposlenika od Nezgode</li>
              <li>Putno Zdravstveno Osiguranje s COVID pokrićem</li>
            </ul>
          </div>

          {/* Col 5: Kontakt & Sjedište Zagreb */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Sjedište i Podrška
            </h4>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <div className="text-white font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#fb6504]" />
                <span>Zagreb Ured</span>
              </div>
              <div>Junija Palmotića 76, 10000 Zagreb</div>
              <div>Republika Hrvatska</div>
              
              <div className="pt-2 font-mono text-[11px] text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+385 1 4800 120</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>kontakt@agencija-zivot.hr</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 font-mono">
                OIB: 14329077049 • MBS: 080514170
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright and Legal Notice */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ŽIVOT d.o.o. za poslove zastupanja u osiguranju. Sva prava pridržana. Licenca HANFA RH.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-slate-400 cursor-pointer">Pravne Obavijesti</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Zaštita Podataka (GDPR)</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">IPID Dokumenti</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">HANFA Registar</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
