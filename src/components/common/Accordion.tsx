import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AccordionItemData {
  id?: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  type?: 'single' | 'multiple';
  defaultValue?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = 'single',
  defaultValue,
  className,
}) => {
  return (
    <RadixAccordion.Root
      type={type as any}
      defaultValue={defaultValue}
      collapsible={true}
      className={twMerge('w-full space-y-3', className)}
    >
      {items.map((item, index) => {
        const itemId = item.id || `accordion-item-${index}`;
        return (
          <RadixAccordion.Item
            key={itemId}
            value={itemId}
            className="border border-slate-200 dark:border-slate-800 data-[state=open]:border-teal-500/40 rounded-2xl bg-white dark:bg-slate-900 data-[state=open]:bg-teal-50/50 dark:data-[state=open]:bg-teal-950/20 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <RadixAccordion.Header className="flex">
              <RadixAccordion.Trigger className="flex flex-1 items-center justify-between p-4.5 text-left text-sm font-bold text-slate-900 dark:text-white transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                <span className="group-data-[state=open]:text-teal-700 dark:group-data-[state=open]:text-teal-400 transition-colors">{item.title}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-teal-600" />
              </RadixAccordion.Trigger>
            </RadixAccordion.Header>
            <RadixAccordion.Content className="p-4.5 pt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              {item.content}
            </RadixAccordion.Content>
          </RadixAccordion.Item>
        );
      })}
    </RadixAccordion.Root>
  );
};
