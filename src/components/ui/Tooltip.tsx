import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

export const INSURANCE_GLOSSARY: Record<string, string> = {
  'franšiza': 'Franšiza je ugovoreni iznos sudjelovanja osiguranika u šteti. Primjerice, uz franšizu od 100 €, manje štete pokrivate sami, a godišnja premija police je znatno niža.',
  'kasko': 'Puni kasko osigurava vaše vozilo od šteta nastalih prometnom nesrećom vašom krivnjom, krađom, požarom, tučom, vandalizmom i padom predmeta.',
  'karenca': 'Karenca je početno razdoblje od ugovaranja police (npr. 15 do 30 dana) tijekom kojeg osiguratelj još ne isplaćuje odštetu radi sprječavanja zlouporaba.',
  'bonus-malus': 'Sustav nagrađivanja savjesnih vozača. Svaka godina bez prijavljene štete donosi vam veći popust (do zakonskih 50% bonusa na AO policu).',
  'ao': 'Obvezno auto osiguranje (AO) zakonski je propisano osiguranje koje pokriva štetu koju vašim vozilom nanesete trećim osobama i njihovoj imovini.',
  'dopunsko': 'Dopunsko zdravstveno osiguranje u potpunosti pokriva troškove participacije u svim javnim zdravstvenim ustanovama (HZZO) bez limita.',
  'ipid': 'IPID (Dokument s informacijama o proizvodu osiguranja) je standardizirani sažetak ključnih pokrića, izuzeća i obveza propisan direktivom EU IDD.',
  'ugovaratelj': 'Fizička ili pravna osoba koja s osiguravajućim društvom sklapa ugovor o osiguranju i obvezuje se plaćati premiju.',
  'osiguranik': 'Osoba čiji su život, zdravlje ili imovina zaštićeni policom osiguranja.',
};

interface TooltipProps {
  term?: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  term,
  text,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const content = text || (term ? INSURANCE_GLOSSARY[term.toLowerCase()] : '');

  return (
    <span
      className={`relative inline-flex items-center gap-1 group cursor-help ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {children ? (
        <span className="border-b border-dashed border-slate-400 group-hover:border-[#1E40AF] transition-colors">
          {children}
        </span>
      ) : null}

      <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />

      {isVisible && content && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs leading-relaxed text-slate-100 bg-[#0F172A] border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-none"
        >
          <span className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{content}</span>
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0F172A]" />
        </span>
      )}
    </span>
  );
};
