"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { ActionResult } from "@/lib/actions/cart";

const COMPARE_COOKIE = "lz_compare";
const MAX_COMPARE = 4;

/* ------------------------------------------------------------- Favoriler */

/** Favoriye ekler/çıkarır. Favoriler hesaba bağlıdır, giriş gerektirir. */
export async function toggleFavorite(productId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Favorilere eklemek için giriş yapmanız gerekiyor." };
  }

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) return { ok: false, error: "Ürün bulunamadı." };

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/hesabim/favorilerim");
    return { ok: true, message: "Favorilerden çıkarıldı." };
  }

  await prisma.favorite.create({ data: { userId: user.id, productId } });
  revalidatePath("/hesabim/favorilerim");
  return { ok: true, message: "Favorilere eklendi." };
}

export async function getFavoriteIds(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const rows = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { productId: true },
  });
  return rows.map((r) => r.productId);
}

/* --------------------------------------------------------- Karşılaştırma */

/**
 * Karşılaştırma listesi. Giriş yapmayan kullanıcılar için de çalışır;
 * liste sunucuda tutulur, çerezde yalnızca anahtar bulunur.
 */
async function ensureComparison() {
  const store = await cookies();
  const existing = store.get(COMPARE_COOKIE)?.value;
  if (existing) {
    const found = await prisma.comparison.findUnique({ where: { token: existing } });
    if (found) return found;
  }
  const token = crypto.randomBytes(18).toString("base64url");
  const created = await prisma.comparison.create({ data: { token } });
  store.set(COMPARE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return created;
}

export async function toggleComparison(productId: string): Promise<ActionResult> {
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) return { ok: false, error: "Ürün bulunamadı." };

  const comparison = await ensureComparison();
  const existing = await prisma.comparisonItem.findUnique({
    where: { comparisonId_productId: { comparisonId: comparison.id, productId } },
  });

  if (existing) {
    await prisma.comparisonItem.delete({
      where: { comparisonId_productId: { comparisonId: comparison.id, productId } },
    });
    revalidatePath("/karsilastir");
    return { ok: true, message: "Karşılaştırmadan çıkarıldı." };
  }

  const count = await prisma.comparisonItem.count({ where: { comparisonId: comparison.id } });
  if (count >= MAX_COMPARE) {
    return { ok: false, error: `En fazla ${MAX_COMPARE} ürün karşılaştırabilirsiniz.` };
  }

  await prisma.comparisonItem.create({ data: { comparisonId: comparison.id, productId } });
  revalidatePath("/karsilastir");
  return { ok: true, message: "Karşılaştırmaya eklendi." };
}

export async function clearComparison(): Promise<ActionResult> {
  const store = await cookies();
  const token = store.get(COMPARE_COOKIE)?.value;
  if (!token) return { ok: true };
  await prisma.comparisonItem.deleteMany({ where: { comparison: { token } } });
  revalidatePath("/karsilastir");
  return { ok: true, message: "Karşılaştırma listesi temizlendi." };
}

export async function getComparisonProductIds(): Promise<string[]> {
  const store = await cookies();
  const token = store.get(COMPARE_COOKIE)?.value;
  if (!token) return [];
  const rows = await prisma.comparisonItem.findMany({
    where: { comparison: { token } },
    select: { productId: true },
  });
  return rows.map((r) => r.productId);
}
