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
          className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition-colors"
        >
          <RadixAccordion.Header className="flex">
            <RadixAccordion.Trigger className="flex flex-1 items-center justify-between p-4 text-left text-sm font-bold text-slate-900 transition-all hover:bg-slate-50/80 group">
              <span>{item.title}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-brand-600" />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
            {item.content}
          </RadixAccordion.Content>
          </RadixAccordion.Item>
        );
      })}
    </RadixAccordion.Root>
  );
};
