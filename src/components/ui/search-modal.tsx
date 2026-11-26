'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from './dialog';

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  href?: string;
}

interface SearchModalProps {
  children: React.ReactNode;
  data: CommandItem[];
}

export function SearchModal({ children, data }: SearchModalProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 border-4 border-chocolate shadow-sticker rounded-2xl">
        <CommandPrimitive className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-chewy [&_[cmdk-group-heading]]:text-chocolate [&_[cmdk-group]]:p-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12">
          <div className="flex items-center border-b-4 border-chocolate px-3">
            <Search className="mr-2 h-5 w-5 shrink-0 text-chocolate/70" />
            <CommandPrimitive.Input
              placeholder="Search for cookies..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 font-fredoka text-chocolate placeholder:text-chocolate/50 outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandPrimitive.List className="max-h-[300px] overflow-y-auto p-2">
            <CommandPrimitive.Empty className="py-6 text-center font-fredoka text-chocolate/70">
              No cookies found.
            </CommandPrimitive.Empty>
            {data.map((item) => (
              <CommandPrimitive.Item
                key={item.id}
                value={`${item.title} ${item.description || ''} ${item.category || ''}`}
                onSelect={() => {
                  setOpen(false);
                  if (item.href) {
                    router.push(item.href);
                  } else {
                    router.push('/order');
                  }
                }}
                className="relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2.5 font-fredoka text-chocolate outline-none hover:bg-pastel-pink/50 data-[selected]:bg-pastel-pink/50"
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{item.title}</span>
                  {item.description && (
                    <span className="text-sm text-chocolate/70">{item.description}</span>
                  )}
                </div>
                {item.category && (
                  <span className="ml-auto rounded-lg bg-pastel-peach px-2 py-0.5 text-xs font-medium text-chocolate">
                    {item.category}
                  </span>
                )}
              </CommandPrimitive.Item>
            ))}
          </CommandPrimitive.List>
        </CommandPrimitive>
        <DialogTitle className="sr-only">Search cookies</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
