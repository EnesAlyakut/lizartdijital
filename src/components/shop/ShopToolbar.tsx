"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Sıralama ve görünüm (grid/liste) kontrolleri. */
export function ShopToolbar({ total, view }: { total: number; view: "grid" | "list" }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    next.set(key, value);
    next.delete("sayfa");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-surface p-4 shadow-xs">
      <p className="text-sm font-medium text-ink-600">
        <strong className="font-bold text-ink-950">{total}</strong> ürün listeleniyor
      </p>

      <div className="flex items-center gap-3">
        <label htmlFor="siralama" className="flex items-center gap-2 text-sm font-bold text-ink-600">
          <SlidersHorizontal className="size-4" />
          Sırala
        </label>
        <select
          id="siralama"
          value={params.get("siralama") ?? "onerilen"}
          onChange={(e) => update("siralama", e.target.value)}
          className="h-10 rounded-xl border border-ink-200 bg-surface-2 px-3 text-sm font-medium text-ink-700 focus:border-brand-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="hidden items-center gap-1 rounded-xl border border-ink-200 bg-surface-2 p-1 sm:flex" role="group" aria-label="Görünüm">
          <button
            type="button"
            aria-pressed={view === "grid"}
            onClick={() => update("gorunum", "grid")}
            className={cn("grid size-8 place-items-center rounded-lg", view === "grid" ? "bg-ink-900 text-white" : "text-ink-500")}
          >
            <Grid3X3 className="size-4" aria-hidden />
            <span className="sr-only">Izgara görünümü</span>
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => update("gorunum", "list")}
            className={cn("grid size-8 place-items-center rounded-lg", view === "list" ? "bg-ink-900 text-white" : "text-ink-500")}
          >
            <List className="size-4" aria-hidden />
            <span className="sr-only">Liste görünümü</span>
          </button>
        </div>
      </div>
    </div>
  );
}
