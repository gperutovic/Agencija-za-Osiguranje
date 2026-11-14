import React, { useId } from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { validateOibWithFeedback, sanitizeOIB } from '../../utils/oibValidator';
import { Tooltip } from './Tooltip';

interface OibInputProps {
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
    <div className={`space-y-1.5 text-left ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
          <span>{label}</span>
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
        <Tooltip text="OIB (Osobni identifikacijski broj) zakonska je obveza propisana Zakonom o osiguranju RH za identifikaciju ugovaratelja i izdavanje police.">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#0F2942]" />
            <span>Zakonska identifikacija</span>
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
          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg font-mono text-sm tracking-widest text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
            !showValidation
              ? 'border-slate-300 focus:ring-[#0F2942]/15 focus:border-[#0F2942]'
              : feedback.isValid
              ? 'border-emerald-500 focus:ring-emerald-100 text-emerald-900'
              : 'border-red-400 focus:ring-red-100 text-red-900'
          }`}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
          {showValidation &&
            (feedback.isValid ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-sans font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valjan</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-[11px] font-sans font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{value.length}/11</span>
              </span>
            ))}
        </div>
      </div>

      {showValidation ? (
        <p
          className={`text-xs font-medium flex items-center gap-1 ${
            feedback.isValid ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {feedback.message}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
