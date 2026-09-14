"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { productCardSelect, type ProductCardData } from "@/lib/data/products";

const answersSchema = z.object({
  productType: z.enum(["website", "app", "webapp", "system", "service", "bilmiyorum"]),
  sector: z.string().max(60),
  pages: z.enum(["1-5", "6-15", "16-40", "40+"]).optional(),
  features: z.array(z.string().max(40)).max(20).default([]),
  budget: z.enum(["10-25", "25-50", "50-100", "100+", "bilmiyorum"]),
  timeline: z.enum(["hemen", "1-hafta", "1-ay", "esnek"]),
});

export type WizardAnswers = z.infer<typeof answersSchema>;

export type WizardResult = {
  products: ProductCardData[];
  estimateMin: number;
  estimateMax: number;
  needsCustomOffer: boolean;
  note: string;
};

/** Sektör anahtarı → ürün kategorisi eşlemesi. */
const SECTOR_CATEGORIES: Record<string, string[]> = {
  kurumsal: ["kurumsal-web-siteleri", "ajans-siteleri"],
  eticaret: ["eticaret-siteleri", "eticaret-uygulamalari", "pazaryeri-siteleri"],
  restoran: ["restoran-siteleri", "restoran-siparis-uygulamalari"],
  saglik: ["klinik-saglik-siteleri", "klinik-hasta-takip"],
  emlak: ["emlak-siteleri", "emlak-uygulamalari"],
  turizm: ["otel-turizm-siteleri", "rezervasyon-sistemleri"],
  egitim: ["egitim-siteleri", "egitim-uygulamalari"],
  hizmet: ["randevu-sistemleri", "randevu-uygulamalari"],
  yazilim: ["crm-sistemleri", "saas-uygulamalari", "stok-siparis-yonetimi"],
};

/** Özellik anahtarı → ürün alanı filtresi. */
const FEATURE_FILTERS: Record<string, Record<string, boolean>> = {
  panel: { hasAdminPanel: true },
  eticaret: { hasPayment: true },
  "coklu-dil": { multiLanguage: true },
  odeme: { hasPayment: true },
  kurulum: { includesSetup: true },
  "kaynak-kod": { includesSource: true },
};

/**
 * Sihirbaz cevaplarına göre ürün önerir ve tahmini bütçe aralığı hesaplar.
 * Öneriler gerçek katalogdan gelir; uydurma sonuç üretilmez.
 */
export async function findMatchingProducts(input: unknown): Promise<WizardResult> {
  const parsed = answersSchema.safeParse(input);
  if (!parsed.success) {
    return { products: [], estimateMin: 0, estimateMax: 0, needsCustomOffer: true, note: "Cevaplar okunamadı." };
  }
  const a = parsed.data;

  const categorySlugs = SECTOR_CATEGORIES[a.sector] ?? [];
  const featureFilters = a.features.reduce<Record<string, boolean>>(
    (acc, key) => ({ ...acc, ...(FEATURE_FILTERS[key] ?? {}) }),
    {},
  );

  const budgetRange = budgetToRange(a.budget);

  // Önce en dar eşleşme denenir; sonuç yoksa filtreler kademeli gevşetilir.
  const attempts = [
    {
      isPublished: true,
      ...(a.productType !== "bilmiyorum" ? { type: a.productType } : {}),
      ...(categorySlugs.length ? { category: { slug: { in: categorySlugs } } } : {}),
      ...featureFilters,
      ...(budgetRange ? { basePrice: { lte: budgetRange.max } } : {}),
    },
    {
      isPublished: true,
      ...(a.productType !== "bilmiyorum" ? { type: a.productType } : {}),
      ...(categorySlugs.length ? { category: { slug: { in: categorySlugs } } } : {}),
    },
    {
      isPublished: true,
      ...(a.productType !== "bilmiyorum" ? { type: a.productType } : {}),
    },
  ];

  let products: ProductCardData[] = [];
  for (const where of attempts) {
    products = await prisma.product.findMany({
      where,
      select: productCardSelect,
      orderBy: [{ isFeatured: "desc" }, { salesCount: "desc" }],
      take: 3,
    });
    if (products.length > 0) break;
  }

  if (products.length === 0) {
    return {
      products: [],
      estimateMin: 0,
      estimateMax: 0,
      needsCustomOffer: true,
      note: "Verdiğiniz kriterlere uyan hazır bir ürün bulunamadı. Bu ihtiyaç için özel geliştirme öneriyoruz.",
    };
  }

  // Tahmini bütçe: seçilen ürünlerin fiyat aralığı + seçilen ek özelliklerin yaklaşık maliyeti
  const prices = products.map((p) => p.basePrice);
  const addOnEstimate = a.features.length * 150000; // ortalama ek hizmet maliyeti
  const pagesExtra = a.pages === "16-40" ? 400000 : a.pages === "40+" ? 900000 : 0;

  const estimateMin = Math.min(...prices);
  const estimateMax = Math.max(...prices) + addOnEstimate + pagesExtra;

  const overBudget = budgetRange ? estimateMin > budgetRange.max : false;
  const veryLargeScope = a.pages === "40+" && a.productType === "website";

  return {
    products,
    estimateMin,
    estimateMax,
    needsCustomOffer: overBudget || veryLargeScope,
    note: overBudget
      ? "Seçtiğiniz bütçe aralığı, bu ihtiyaca uyan hazır ürünlerin altında kalıyor. Kapsamı birlikte netleştirmek için teklif isteyebilirsiniz."
      : veryLargeScope
        ? "Sayfa sayısı yüksek olduğu için hazır ürünün üzerine ek geliştirme gerekebilir. Kesin fiyat için teklif isteyin."
        : "Aşağıdaki ürünler ihtiyacınıza en yakın seçenekler. Canlı demolarını inceleyip karar verebilirsiniz.",
  };
}

function budgetToRange(budget: WizardAnswers["budget"]) {
  switch (budget) {
    case "10-25":
      return { min: 1000000, max: 2500000 };
    case "25-50":
      return { min: 2500000, max: 5000000 };
    case "50-100":
      return { min: 5000000, max: 10000000 };
    case "100+":
      return { min: 10000000, max: 100000000 };
    default:
      return null;
  }
}
