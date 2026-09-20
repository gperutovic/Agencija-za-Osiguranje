import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { twMerge } from 'tailwind-merge';

export interface SliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  formatValue?: (val: number) => string;
  ticks?: { value: number; label: string }[];
  helperText?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit,
  formatValue = (v) => (unit ? `${v} ${unit}` : v.toString()),
  ticks,
  helperText,
  className,
}) => {
  return (
    <div className={twMerge('w-full space-y-2', className)}>
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</label>}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-teal-50 text-teal-700 border border-teal-200/80 shadow-2xs dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800">
          {formatValue(value)}
        </span>
      </div>

      <RadixSlider.Root
        className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
        value={[value]}
        max={max}
        min={min}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
      >
        <RadixSlider.Track className="bg-slate-200 dark:bg-slate-700 relative grow rounded-full h-2">
          <RadixSlider.Range className="absolute bg-gradient-to-r from-teal-600 to-teal-500 rounded-full h-full shadow-teal-glow" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="block w-5 h-5 bg-white border-2 border-teal-600 shadow-md shadow-teal-600/30 rounded-full hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-transform"
          aria-label={label || 'Slider'}
        />
      </RadixSlider.Root>

      {ticks && ticks.length > 0 ? (
        <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          {ticks.map((t, idx) => (
            <span key={idx}>{t.label}</span>
          ))}
        </div>
      ) : (
        <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <span>{formatValue(min)}</span>
          {helperText && <span className="text-slate-500">{helperText}</span>}
          <span>{formatValue(max)}</span>
        </div>
      )}
    </div>
  );
};
