import React, { useId } from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { validateOibWithFeedback, sanitizeOIB } from '../../lib/validation';
import { Tooltip } from './Tooltip';

export interface OibInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  helperText?: string;
}

export const OibInput: React.FC<OibInputProps> = ({
  value,
  onChange,
  label = 'OIB ugovaratelja',
  required = true,
  disabled = false,
  className = '',
  placeholder = 'Unesite 11-znamenkasti OIB',
  helperText,
}) => {
  const id = useId();
  const feedback = validateOibWithFeedback(value);
  const showValidation = value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeOIB(e.target.value);
    const valid = validateOibWithFeedback(sanitized).isValid;
    onChange(sanitized, valid);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>{label}</span>
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Tooltip text="OIB (Osobni identifikacijski broj) je zakonska obveza propisana Zakonom o osiguranju RH za provjeru identiteta i izdavanje police.">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span>Sigurnosna provjera</span>
          </span>
        </Tooltip>
      </div>

      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={11}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-xl font-mono text-sm tracking-widest text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
            !showValidation
              ? 'border-slate-300 dark:border-slate-700 focus:ring-teal-500/50 focus:border-teal-500'
              : feedback.isValid
              ? 'border-emerald-500 focus:ring-emerald-500/40 text-emerald-600 dark:text-emerald-300'
              : 'border-red-500 focus:ring-red-500/40 text-red-600 dark:text-red-200'
          }`}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
          {showValidation && (
            feedback.isValid ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-sans font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Provjeren</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-[11px] font-sans font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{value.length}/11</span>
              </span>
            )
          )}
        </div>
      </div>

      {showValidation ? (
        <p
          className={`text-[11px] font-medium flex items-center gap-1 ${
            feedback.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {feedback.message}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
