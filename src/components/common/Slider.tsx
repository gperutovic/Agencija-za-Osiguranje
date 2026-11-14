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
    <div className={twMerge('w-full space-y-2.5 text-left', className)}>
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold tabular-nums bg-slate-100 text-[#0F2942] border border-slate-200">
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
          <RadixSlider.Range className="absolute bg-[#0F2942] rounded-full h-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="block w-5 h-5 bg-white border-2 border-[#0F2942] shadow-sm rounded-full hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#0F2942]/15 transition-transform"
          aria-label={label || 'Vrijednost'}
        />
      </RadixSlider.Root>

      <div className="flex justify-between items-center text-[11px] text-slate-500 tabular-nums">
        <span>{formatValue(min)}</span>
        {helperText && <span className="text-slate-500">{helperText}</span>}
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};
