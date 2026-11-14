import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
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
      className={twMerge('w-full space-y-3 text-left', className)}
    >
      {items.map((item, index) => {
        const itemId = item.id || `accordion-item-${index}`;
        return (
          <RadixAccordion.Item
            key={itemId}
            value={itemId}
            className="border border-slate-200 data-[state=open]:border-slate-300 rounded-xl bg-white overflow-hidden shadow-subtle transition-all"
          >
            <RadixAccordion.Header className="flex">
              <RadixAccordion.Trigger className="flex flex-1 items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 group">
                <span className="group-data-[state=open]:text-[#0F2942] transition-colors pr-4">
                  {item.title}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-[#0F2942]" />
              </RadixAccordion.Trigger>
            </RadixAccordion.Header>
            <RadixAccordion.Content className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
              {item.content}
            </RadixAccordion.Content>
          </RadixAccordion.Item>
        );
      })}
    </RadixAccordion.Root>
  );
};
