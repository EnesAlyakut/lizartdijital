"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  CreditCard,
  Download,
  Headphones,
  HelpCircle,
  Layers,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ThumbsUp,
  Wrench,
  X,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/constants";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

interface FaqClientViewProps {
  faqs: FaqItem[];
  categories: { key: string; label: string }[];
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "satin-alma": ShoppingBag,
  odeme: CreditCard,
  lisans: ShieldCheck,
  indirme: Download,
  kurulum: Wrench,
  teslimat: Clock,
  guncelleme: RefreshCw,
  destek: Headphones,
  iade: RotateCcw,
};

export function FaqClientView({ faqs, categories }: FaqClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() => {
    // Open the first question of each category by default
    const initial: Record<string, boolean> = {};
    if (faqs.length > 0) {
      initial[faqs[0].id] = true;
    }
    return initial;
  });
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, boolean>>({});

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markHelpful = (id: string) => {
    setHelpfulFeedback((prev) => ({ ...prev, [id]: true }));
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  // Group filtered faqs by category
  const groupedCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        items: filteredFaqs.filter((f) => f.category === cat.key),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, filteredFaqs]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: faqs.length };
    faqs.forEach((f) => {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });
    return counts;
  }, [faqs]);

  return (
    <div className="space-y-8">
      {/* ─── 1. İNTERAKTİF CANLI ARAMA ÇUBUĞU ─── */}
      <div className="relative mx-auto max-w-3xl">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-5 size-5 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sorunuzu arayın (örn. lisans türleri, fatura, kurulum, iade, taksit...)"
            className="w-full rounded-2xl border border-ink-200 bg-white py-4.5 pl-13 pr-12 text-sm sm:text-base font-medium text-ink-900 placeholder:text-ink-400 shadow-lg shadow-ink-900/5 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 p-1.5 rounded-full text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
              aria-label="Aramayı temizle"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Canlı arama sonuç bilgi rozeti */}
        <div className="mt-2.5 flex items-center justify-between px-2 text-xs font-semibold text-ink-500">
          <span>
            {searchQuery ? (
              <>
                <strong className="text-brand-700">&quot;{searchQuery}&quot;</strong> için {filteredFaqs.length} sonuç bulundu
              </>
            ) : (
              `Toplam ${faqs.length} sık sorulan soru ve yanıt listeleniyor`
            )}
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-brand-600 hover:underline"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {/* ─── 2. KATEGORİ SEÇİM ŞERİDİ ─── */}
      <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {/* Tümü Butonu */}
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4.5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs",
            selectedCategory === "all"
              ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
              : "border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-800"
          )}
        >
          <Layers className="size-3.5" />
          <span>Tümü</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-black",
              selectedCategory === "all"
                ? "bg-white/20 text-white"
                : "bg-ink-100 text-ink-600"
            )}
          >
            {categoryCounts.all}
          </span>
        </button>

        {/* Kategori Butonları */}
        {categories.map((c) => {
          const count = categoryCounts[c.key] || 0;
          if (count === 0) return null;
          const isSelected = selectedCategory === c.key;
          const Icon = CATEGORY_ICONS[c.key] || HelpCircle;

          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelectedCategory(c.key)}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs",
                isSelected
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : "border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-800"
              )}
            >
              <Icon className="size-3.5" />
              <span>{c.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-black",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-ink-100 text-ink-600"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── 3. SORULAR & YANITLAR LİSTESİ ─── */}
      <div className="mx-auto max-w-4xl space-y-10 pt-2">
        {groupedCategories.length > 0 ? (
          groupedCategories.map((group) => {
            const Icon = CATEGORY_ICONS[group.key] || HelpCircle;

            return (
              <section key={group.key} id={group.key} className="scroll-mt-28">
                {/* Kategori Başlık Şeridi */}
                <div className="mb-4 flex items-center justify-between border-b border-ink-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon className="size-4" />
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-ink-900 tracking-tight">
                      {group.label}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-ink-500">
                    {group.items.length} Soru
                  </span>
                </div>

                {/* Akordeon Kartları */}
                <div className="space-y-3">
                  {group.items.map((item) => {
                    const isOpen = Boolean(openIds[item.id]);
                    const isHelpful = Boolean(helpfulFeedback[item.id]);

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "group rounded-2xl border transition-all duration-200 overflow-hidden bg-white",
                          isOpen
                            ? "border-brand-500/60 shadow-md shadow-brand-500/5 ring-1 ring-brand-500/10"
                            : "border-ink-100 hover:border-brand-200 hover:shadow-2xs"
                        )}
                      >
                        <h3>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => toggleAccordion(item.id)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span
                                className={cn(
                                  "grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                                  isOpen
                                    ? "bg-brand-600 text-white"
                                    : "bg-ink-100 text-ink-500 group-hover:bg-brand-100 group-hover:text-brand-700"
                                )}
                              >
                                ?
                              </span>
                              <span
                                className={cn(
                                  "text-sm sm:text-base font-bold leading-snug transition-colors",
                                  isOpen
                                    ? "text-brand-900"
                                    : "text-ink-900 group-hover:text-brand-800"
                                )}
                              >
                                {item.question}
                              </span>
                            </div>

                            <span
                              aria-hidden
                              className={cn(
                                "grid size-8 shrink-0 place-items-center rounded-xl transition-all duration-200",
                                isOpen
                                  ? "bg-brand-600 text-white rotate-180"
                                  : "bg-surface-2 text-ink-500 group-hover:bg-brand-50 group-hover:text-brand-700 rotate-0"
                              )}
                            >
                              <ChevronDown className="size-4 stroke-[2.5]" />
                            </span>
                          </button>
                        </h3>

                        {isOpen && (
                          <div className="border-t border-ink-100/80 bg-surface-2/30 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                            <p className="text-sm leading-relaxed text-ink-700 whitespace-pre-line">
                              {item.answer}
                            </p>

                            {/* Yanıt Altı Geri Bildirim & İpuçları */}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100/60 pt-3 text-xs text-ink-400">
                              <div className="flex items-center gap-2">
                                <span>Bu yanıt yardımcı oldu mu?</span>
                                {isHelpful ? (
                                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                                    <ThumbsUp className="size-3" /> Teşekkürler!
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => markHelpful(item.id)}
                                    className="inline-flex items-center gap-1 rounded-md bg-white border border-ink-200 px-2 py-1 font-medium text-ink-600 hover:border-brand-400 hover:text-brand-700 transition-colors cursor-pointer"
                                  >
                                    <ThumbsUp className="size-3" /> Evet
                                  </button>
                                )}
                              </div>

                              <Link
                                href="/iletisim"
                                className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
                              >
                                <span>Daha fazla detay sor</span>
                                <ArrowUpRight className="size-3" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        ) : (
          /* Boş Durum (Aramada Sonuç Yoksa) */
          <div className="rounded-3xl border border-ink-200 bg-white p-10 text-center shadow-xs">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mb-3">
              <Search className="size-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-ink-900">
              Aradığınız soruya uygun yanıt bulunamadı
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-ink-500 max-w-md mx-auto leading-relaxed">
              Farklı bir kelime deneyebilir veya doğrudan uzman destek ekibimize WhatsApp üzerinden sorabilirsiniz.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-xs font-bold text-ink-700 hover:bg-ink-50 cursor-pointer"
              >
                Filtreleri Temizle
              </button>
              <Link
                href={whatsappLink("Merhaba, sitenizdeki hizmetlerle ilgili bir soru sormak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#128c7e] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#075e54] cursor-pointer"
              >
                <MessageCircle className="size-3.5" />
                <span>WhatsApp&apos;tan Hemen Sor</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
