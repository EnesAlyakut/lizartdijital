"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Modern kart tasarımlı, klavye uyumlu açılır akordeon bileşeni. */
export function Accordion({
  items,
  className,
  defaultOpenIndex = 0,
}: {
  items: { id: string; title: string; content: string }[];
  className?: string;
  defaultOpenIndex?: number | null;
}) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenIndex !== null && items[defaultOpenIndex] ? items[defaultOpenIndex].id : null
  );
  const baseId = useId();

  return (
    <div className={cn("space-y-3.5", className)}>
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "group rounded-2xl border transition-all duration-200 overflow-hidden",
              open
                ? "border-brand-400/50 bg-white shadow-sm ring-1 ring-brand-500/10"
                : "border-ink-100 bg-white hover:border-brand-200/80 hover:bg-slate-50/50 hover:shadow-2xs"
            )}
          >
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${baseId}-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-4.5 text-left transition-colors"
              >
                <span
                  className={cn(
                    "text-[0.95rem] font-bold leading-snug transition-colors",
                    open ? "text-brand-900" : "text-ink-900 group-hover:text-brand-800"
                  )}
                >
                  {item.title}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-xl transition-all duration-200",
                    open
                      ? "bg-brand-700 text-white shadow-xs rotate-180"
                      : "bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-800 rotate-0"
                  )}
                >
                  <ChevronDown size={16} strokeWidth={2.5} />
                </span>
              </button>
            </h3>
            {open && (
              <div
                id={`${baseId}-${item.id}`}
                className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm leading-relaxed text-ink-600 border-t border-slate-100 animate-in fade-in-50 duration-150"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
