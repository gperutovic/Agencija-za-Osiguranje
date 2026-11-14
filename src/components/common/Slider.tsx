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
        {label && <label className="text-xs font-semibold text-slate-300">{label}</label>}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-orange-500/10 text-[#fb6504] border border-orange-500/30 shadow-2xs">
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
        <RadixSlider.Track className="bg-white/10 relative grow rounded-full h-2">
          <RadixSlider.Range className="absolute bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] rounded-full h-full shadow-glow-orange" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="block w-5 h-5 bg-white border-2 border-[#fb6504] shadow-glow-orange rounded-full hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-transform"
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
