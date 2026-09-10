import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (val: number) => string;
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
  formatValue = (v) => v.toString(),
  helperText,
  className,
}) => {
  return (
    <div className={twMerge('w-full space-y-2', className)}>
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-brand-50 text-brand-700 border border-brand-200 shadow-2xs">
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
        <RadixSlider.Track className="bg-slate-200 relative grow rounded-full h-2">
          <RadixSlider.Range className="absolute bg-gradient-to-r from-brand-600 to-teal-500 rounded-full h-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="block w-5 h-5 bg-white border-2 border-brand-600 shadow-md rounded-full hover:scale-110 focus:outline-hidden focus:ring-4 focus:ring-brand-500/20 transition-transform"
          aria-label={label || 'Slider'}
        />
      </RadixSlider.Root>

      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
        <span>{formatValue(min)}</span>
        {helperText && <span className="text-slate-500">{helperText}</span>}
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};
