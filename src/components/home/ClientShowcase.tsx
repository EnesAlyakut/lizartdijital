"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Lock,
  Globe2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Building2,
  Stethoscope,
  Factory,
  Scale,
  ShoppingBag,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ClientItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  sector: string;
  category?: string;
  summary?: string;
  coverImage: string;
  liveUrl?: string | null;
  technologies?: string;
  isFeatured?: boolean;
}

const SECTOR_GROUPS = [
  { key: "all", label: "Tüm Markalar", icon: Layers },
  { key: "saglik", label: "Sağlık & Klinik", icon: Stethoscope },
  { key: "sanayi", label: "Sanayi & İnşaat", icon: Factory },
  { key: "finans", label: "Finans, Sigorta & Hukuk", icon: Scale },
  { key: "ticaret", label: "E-Ticaret & Hizmet", icon: ShoppingBag },
] as const;

function getGroupKey(sector: string, category?: string): string {
  const s = (sector || "").toLowerCase();
  const c = (category || "").toLowerCase();

  if (s.includes("sağlık") || s.includes("diş") || s.includes("klinik") || s.includes("ilaç") || s.includes("rezonans") || c === "saglik") {
    return "saglik";
  }
  if (s.includes("hafriyat") || s.includes("mekanik") || s.includes("inşaat") || s.includes("orman") || s.includes("kereste") || s.includes("arsa") || s.includes("gayrimenkul")) {
    return "sanayi";
  }
  if (s.includes("sigorta") || s.includes("finans") || s.includes("müşavirlik") || s.includes("hukuk") || s.includes("avukat")) {
    return "finans";
  }
  return "ticaret";
}

function cleanDomain(url?: string | null): string {
  if (!url) return "canli-site.com";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

export function ClientShowcase({ clients }: { clients: ClientItem[] }) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showAll, setShowAll] = useState<boolean>(false);

  // Filtrelenmiş liste
  const filteredClients = useMemo(() => {
    if (activeTab === "all") return clients;
    return clients.filter((c) => getGroupKey(c.sector, c.category) === activeTab);
  }, [clients, activeTab]);

  // Sayfayı boğmamak için ilk etapta 8 kart gösterilir; "Daha fazla" veya filtreyle genişler
  const visibleClients = useMemo(() => {
    if (showAll || activeTab !== "all") {
      return filteredClients;
    }
    return filteredClients.slice(0, 8);
  }, [filteredClients, showAll, activeTab]);

  const countsByGroup = useMemo(() => {
    const counts: Record<string, number> = { all: clients.length };
    clients.forEach((c) => {
      const g = getGroupKey(c.sector, c.category);
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  }, [clients]);

  if (!clients || clients.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-b border-ink-200/80 bg-gradient-to-b from-[#f8faf7] via-[#ffffff] to-[#f4f7f2] py-16 sm:py-20 lg:py-24">
      {/* Arka plan zarif mesh efektleri */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-200/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-emerald-100/30 blur-[120px]" />

      <div className="container-page relative">
        {/* --- 1. ÜST BAŞLIK & İSTATİSTİK ŞERİDİ --- */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-ink-200/70 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-300/80 bg-brand-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-800 shadow-2xs backdrop-blur-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-600" />
              </span>
              LİZART PORTFÖY AĞI · {clients.length}+ GÜVENİLİR MARKA
            </div>

            <h2 className="mt-3.5 text-2.5xl sm:text-3.5xl lg:text-4xl font-extrabold tracking-tight text-ink-950 leading-[1.15]">
              Birlikte Başarıya Ulaştığımız{" "}
              <span className="bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Kurumsal Markalar
              </span>
            </h2>

            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-ink-600 max-w-xl">
              Sağlıktan sanayiye, finanstan e-ticarete Türkiye&apos;nin öncü işletmelerine özel dijital mimariler, yüksek performanslı web siteleri ve kurumsal yazılımlar geliştirdik.
            </p>
          </div>

          {/* İstatistik Göstergeleri */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-start lg:self-auto">
            <div className="rounded-2xl border border-ink-200/90 bg-white/80 px-4 py-2.5 shadow-xs backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-ink-950">
                {clients.length}<span className="text-brand-600">+</span>
              </div>
              <div className="text-[0.68rem] font-bold uppercase tracking-wider text-ink-400">
                Canlı Kurumsal Referans
              </div>
            </div>

            <div className="rounded-2xl border border-ink-200/90 bg-white/80 px-4 py-2.5 shadow-xs backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-brand-700">
                %100
              </div>
              <div className="text-[0.68rem] font-bold uppercase tracking-wider text-ink-400">
                Özel Mimari & Lisans
              </div>
            </div>

            <div className="rounded-2xl border border-brand-200 bg-brand-50/70 px-4 py-2.5 shadow-xs backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-800">
                48 Saat
              </div>
              <div className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-700">
                Ortalama Teslimat
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. İNTERAKTİF SEKTÖR FİLTRELEME BUTONLARI --- */}
        <div className="mt-7 flex flex-wrap items-center gap-2 sm:gap-2.5">
          {SECTOR_GROUPS.map((group) => {
            const Icon = group.icon;
            const count = countsByGroup[group.key] || 0;
            const isActive = activeTab === group.key;

            return (
              <button
                key={group.key}
                type="button"
                onClick={() => {
                  setActiveTab(group.key);
                  setShowAll(true);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs",
                  isActive
                    ? "bg-brand-900 text-white shadow-md shadow-brand-950/20 scale-[1.02]"
                    : "bg-white border border-ink-200/90 text-ink-700 hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-900"
                )}
              >
                <Icon className={cn("size-3.5", isActive ? "text-brand-300" : "text-ink-400")} />
                <span>{group.label}</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[0.65rem] font-black",
                    isActive ? "bg-white/20 text-white" : "bg-ink-100 text-ink-600"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* --- 3. GÖRSEL MOCKUP KARTLARI GRİDİ (VAY ANASINA TASARIM) --- */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleClients.map((client, idx) => {
            const domain = cleanDomain(client.liveUrl);

            return (
              <div
                key={client.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ink-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-400/90 hover:shadow-xl hover:shadow-brand-950/10"
              >
                {/* Kart Üst Başlık Şeridi (Tarayıcı Barı Görünümü) */}
                <div className="flex h-8 items-center justify-between border-b border-ink-100 bg-surface-2/80 px-3 text-[0.65rem] text-ink-500">
                  <div className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#ff5f56]" />
                    <span className="size-2 rounded-full bg-[#ffbd2e]" />
                    <span className="size-2 rounded-full bg-[#27c93f]" />
                  </div>

                  <div className="flex max-w-[130px] items-center gap-1 truncate rounded bg-white px-2 py-0.5 font-mono text-[0.62rem] text-ink-600 border border-ink-100/80 shadow-2xs">
                    <Lock className="size-2.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{domain}</span>
                  </div>

                  <span className="font-mono text-[0.62rem] font-bold text-ink-400">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Görsel Vitrini (Canlı Ekran Görüntüsü Mockup'ı) */}
                <Link
                  href={`/projeler/${client.slug}`}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-ink-100/60 block"
                >
                  <Image
                    src={client.coverImage}
                    alt={`${client.client} web sitesi`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* İnce degrade & Canlı rozeti */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute left-2.5 top-2.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[0.62rem] font-bold text-ink-800 shadow-sm backdrop-blur-xs">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Yayında
                    </span>
                  </div>
                </Link>

                {/* Kart İçerik Bilgileri */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    {/* Sektör Etiketi */}
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block size-1.5 rounded-full bg-brand-600" />
                      <span className="text-[0.7rem] font-bold uppercase tracking-wider text-brand-700">
                        {client.sector}
                      </span>
                    </div>

                    {/* Müşteri / Proje Adı */}
                    <h3 className="mt-2 text-[0.98rem] font-bold tracking-tight text-ink-950 group-hover:text-brand-700 transition-colors line-clamp-1">
                      <Link href={`/projeler/${client.slug}`}>
                        {client.client}
                      </Link>
                    </h3>

                    {/* Kısa Vurgu */}
                    {client.title && (
                      <p className="mt-1 text-xs text-ink-500 line-clamp-2 leading-relaxed">
                        {client.title.replace(`${client.client} — `, "")}
                      </p>
                    )}
                  </div>

                  {/* Alt Butonlar & Canlı Link Şeridi */}
                  <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
                    <Link
                      href={`/projeler/${client.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-ink-700 group-hover:text-brand-700 transition-colors"
                    >
                      <span>Vaka Analizi</span>
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>

                    {client.liveUrl ? (
                      <a
                        href={client.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors bg-emerald-50 hover:bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200/70"
                        title={`${client.client} canlı sitesini yeni sekmede aç`}
                      >
                        <Globe2 className="size-3" />
                        <span>Canlı Site</span>
                      </a>
                    ) : (
                      <span className="text-[0.68rem] font-medium text-ink-400">
                        Özel Portalı
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- 4. DAHA FAZLA GÖSTER & TÜMÜNÜ İNCELE AKSİYONU --- */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-brand-200/90 bg-gradient-to-r from-brand-50/90 via-white to-emerald-50/70 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-brand-200 shadow-sm">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink-950">
                Tüm siteler 100% yayında, test edilmiş ve aktif işletmeler tarafından kullanılmaktadır.
              </div>
              <div className="text-xs text-ink-600">
                Sözleşmeli lisans devri, Google PageSpeed 99+ garantisi ve kurumsal teknik destek.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {activeTab === "all" && clients.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-ink-300 bg-white px-4 py-2 text-xs font-bold text-ink-800 shadow-xs hover:bg-ink-50 transition-all cursor-pointer"
              >
                {showAll ? (
                  <>
                    <span>Daha Az Göster</span>
                    <ChevronUp className="size-3.5" />
                  </>
                ) : (
                  <>
                    <span>Kalan {clients.length - 8} Markayı Göster</span>
                    <ChevronDown className="size-3.5" />
                  </>
                )}
              </button>
            )}

            <Link
              href="/projeler"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition-all"
            >
              <span>Vaka Çalışmaları Kataloğu</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
