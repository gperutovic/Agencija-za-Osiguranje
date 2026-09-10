import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  value,
  onValueChange,
  className,
}) => {
  return (
    <RadixTabs.Root
      value={value}
      onValueChange={onValueChange}
      className={twMerge('w-full space-y-6', className)}
    >
      <RadixTabs.List className="flex p-1.5 bg-slate-100/80 backdrop-blur-xs rounded-2xl border border-slate-200/80 gap-1 overflow-x-auto">
        {items.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className={clsx(
              'flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 select-none shrink-0',
              value === tab.value
                ? 'bg-white text-brand-900 shadow-xs border border-slate-200/60 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {items.map((tab) => (
        <RadixTabs.Content
          key={tab.value}
          value={tab.value}
          className="focus:outline-hidden animate-in fade-in-50 duration-200"
        >
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
};
