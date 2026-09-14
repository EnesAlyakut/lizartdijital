"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type React from "react";
import { useCallback, useState } from "react";
import { BadgePercent, CreditCard, Filter, KeyRound, Languages, LayoutDashboard, Smartphone, Wrench, X } from "lucide-react";
import { DESIGN_STYLES, PRODUCT_TYPES } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";

export type FilterOptions = {
  categories: { slug: string; name: string; kind: string; _count: { products: number } }[];
  technologies: { slug: string; name: string; group: string; _count: { products: number } }[];
  platforms: { slug: string; name: string; _count: { products: number } }[];
  minPrice: number;
  maxPrice: number;
};

const FLAG_FILTERS = [
  { key: "panel", label: "Yönetim paneli var", icon: LayoutDashboard },
  { key: "kurulum", label: "Kurulum dahil", icon: Wrench },
  { key: "kaynak", label: "Kaynak kod dahil", icon: KeyRound },
  { key: "dil", label: "Çoklu dil desteği", icon: Languages },
  { key: "odeme", label: "Ödeme altyapısı hazır", icon: CreditCard },
  { key: "mobil", label: "Mobil uyumlu", icon: Smartphone },
  { key: "indirimli", label: "Yalnızca indirimliler", icon: BadgePercent },
];

export function ShopFilters({ options, resultCount }: { options: FilterOptions; resultCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const push = useCallback(
    (next: URLSearchParams) => {
      next.delete("sayfa");
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      const current = next.getAll(key);
      next.delete(key);
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updated.forEach((v) => next.append(key, v));
      push(next);
    },
    [params, push],
  );

  const setSingle = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      push(next);
    },
    [params, push],
  );

  const has = (key: string, value: string) => params.getAll(key).includes(value);

  const activeCount = [
    "tur",
    "kategori",
    "teknoloji",
    "platform",
    "stil",
    ...FLAG_FILTERS.map((f) => f.key),
    "teslim",
    "minFiyat",
    "maxFiyat",
    "q",
  ].reduce((n, key) => n + params.getAll(key).length, 0);

  const websiteCategories = options.categories.filter((c) => c.kind === "website");
  const appCategories = options.categories.filter((c) => ["app", "system", "webapp"].includes(c.kind));

  const panel = (
    <div className="space-y-6 rounded-2xl border border-ink-200 bg-white p-5 shadow-[0_24px_70px_-58px_rgb(20_31_20/.85)]">
      <div className="flex items-center justify-between border-b border-ink-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl border border-ink-200 bg-surface-2 text-brand-700">
            <Filter className="size-4" />
          </span>
          <p className="text-sm font-extrabold text-ink-950">Filtreler</p>
          {activeCount > 0 && (
            <span className="rounded-xl bg-ink-900 px-2 py-0.5 text-[0.65rem] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-xs font-bold text-brand-700 transition-colors hover:text-ink-950"
          >
            Temizle
          </button>
        )}
      </div>

      <FilterGroup title="Ürün Türü">
        <div className="space-y-1">
          {PRODUCT_TYPES.map((t) => (
            <CheckRow
              key={t.key}
              label={t.label}
              checked={has("tur", t.key)}
              onChange={() => toggleMulti("tur", t.key)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Web Sitesi Kategorileri" collapsible defaultOpen={false}>
        <div className="space-y-1">
          {websiteCategories.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.name}
              count={c._count.products}
              checked={has("kategori", c.slug)}
              onChange={() => toggleMulti("kategori", c.slug)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Uygulama & Panel Kategorileri" collapsible defaultOpen={false}>
        <div className="space-y-1">
          {appCategories.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.name}
              count={c._count.products}
              checked={has("kategori", c.slug)}
              onChange={() => toggleMulti("kategori", c.slug)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Platform">
        <div className="space-y-1">
          {options.platforms.map((p) => (
            <CheckRow
              key={p.slug}
              label={p.name}
              count={p._count.products}
              checked={has("platform", p.slug)}
              onChange={() => toggleMulti("platform", p.slug)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Tasarım Stili" collapsible defaultOpen={false}>
        <div className="space-y-1">
          {DESIGN_STYLES.map((s) => (
            <CheckRow
              key={s.key}
              label={s.label}
              checked={has("stil", s.key)}
              onChange={() => toggleMulti("stil", s.key)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Fiyat Aralığı (TL)">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[0.68rem] font-bold text-ink-500 uppercase" htmlFor="min-fiyat">
              En Az (₺)
            </label>
            <input
              id="min-fiyat"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder={String(Math.floor(options.minPrice / 100))}
              defaultValue={params.get("minFiyat") ?? ""}
              onBlur={(e) => setSingle("minFiyat", e.target.value || null)}
              className="mt-1 h-9 w-full rounded-xl border border-ink-200 bg-surface-2 px-2.5 text-xs text-ink-950 focus:border-brand-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[0.68rem] font-bold text-ink-500 uppercase" htmlFor="max-fiyat">
              En Çok (₺)
            </label>
            <input
              id="max-fiyat"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder={String(Math.ceil(options.maxPrice / 100))}
              defaultValue={params.get("maxFiyat") ?? ""}
              onBlur={(e) => setSingle("maxFiyat", e.target.value || null)}
              className="mt-1 h-9 w-full rounded-xl border border-ink-200 bg-surface-2 px-2.5 text-xs text-ink-950 focus:border-brand-700 focus:outline-none"
            />
          </div>
        </div>
        <p className="mt-2 text-[0.68rem] text-ink-500">
          Aralık: {formatPrice(options.minPrice)} – {formatPrice(options.maxPrice)}
        </p>
      </FilterGroup>

      <FilterGroup title="Özellikler & Altyapı">
        <div className="space-y-1">
          {FLAG_FILTERS.map((f) => (
            <CheckRow
              key={f.key}
              label={f.label}
              icon={f.icon}
              checked={params.get(f.key) === "1"}
              onChange={() => setSingle(f.key, params.get(f.key) === "1" ? null : "1")}
            />
          ))}
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <>
      {/* Mobil filtre butonu */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-5 py-3 text-sm font-bold text-ink-950 shadow-xs lg:hidden"
      >
        <Filter className="size-4" />
        <span>Filtreleri Aç</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-brand-700 px-2 py-0.5 text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Filtreler">
          <button
            type="button"
            aria-label="Filtreleri kapat"
            className="flex-1 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="h-full w-[88%] max-w-sm overflow-y-auto bg-surface-2 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-ink-100 pb-3">
              <p className="text-base font-extrabold text-ink-950">Filtreler</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-ink-700 hover:text-ink-950"
              >
                <X className="size-3.5" /> Kapat
              </button>
            </div>
            {panel}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mt-6 w-full rounded-xl bg-ink-900 px-5 py-3 text-sm font-bold text-white shadow-lg"
            >
              {resultCount} Ürünü Göster
            </button>
          </div>
        </div>
      )}

      <aside className="hidden lg:block lg:sticky lg:top-24 lg:h-fit" aria-label="Ürün filtreleri">
        {panel}
      </aside>
    </>
  );
}

function FilterGroup({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink-100 pb-5 last:border-0 last:pb-0">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-ink-800 transition-colors hover:text-brand-700"
        >
          <span>{title}</span>
          <span className="text-base font-normal text-ink-500">
            {open ? "−" : "+"}
          </span>
        </button>
      ) : (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-ink-800">{title}</p>
      )}
      {open && <div className="mt-2.5 max-h-64 overflow-y-auto pr-1">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  count,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs transition-all duration-150",
        checked
          ? "border border-ink-200 bg-surface-2 font-bold text-brand-700"
          : "text-ink-700 hover:bg-surface-2 hover:text-ink-950",
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-3.5 rounded-sm border-ink-300 accent-[var(--color-brand-600)]"
        />
        {Icon && <Icon className="size-3.5 shrink-0 text-ink-400" />}
        <span className="truncate">{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.2 text-[0.65rem] font-semibold",
            checked ? "bg-brand-200/80 text-brand-900" : "bg-ink-100 text-ink-500",
          )}
        >
          {count}
        </span>
      )}
    </label>
  );
}
