import React, { useId } from 'react';

export interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  helperText?: string;
  ticks?: Array<{ value: number; label: string }>;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  helperText,
  ticks,
  className = '',
}) => {
  const id = useId();
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`w-full space-y-2 text-left ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-bold text-[#0F2942] tabular-nums">
            {value} {unit}
          </span>
        </div>
      )}

      <div className="relative py-1">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0F2942] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:ring-offset-2"
          style={{
            background: `linear-gradient(to right, #0F2942 0%, #0F2942 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`,
          }}
        />
      </div>

      {ticks && ticks.length > 0 ? (
        <div className="flex justify-between text-[11px] font-medium text-slate-500 px-0.5 select-none">
          {ticks.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(t.value)}
              className={`hover:text-[#0F2942] transition-colors ${
                value === t.value ? 'text-[#0F2942] font-bold' : ''
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex justify-between text-[11px] font-medium text-slate-500 px-0.5 tabular-nums">
          <span>
            {min} {unit}
          </span>
          <span>
            {max} {unit}
          </span>
        </div>
      )}

      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
