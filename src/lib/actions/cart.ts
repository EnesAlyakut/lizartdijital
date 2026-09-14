"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ensureCart, getCartToken } from "@/lib/cart";

export type ActionResult = {
  ok: true;
  message?: string;
  slug?: string;
  id?: string;
  name?: string;
} | { ok: false; error: string };

const addToCartSchema = z.object({
  productId: z.string().min(1),
  licenseId: z.string().min(1),
  addOnIds: z.array(z.string()).max(20).default([]),
});

/**
 * Sepete ekleme. Ürün, lisans ve ek hizmetlerin gerçekten var olduğu ve
 * birbirleriyle ilişkili olduğu sunucuda doğrulanır.
 */
export async function addToCart(input: unknown): Promise<ActionResult> {
  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz istek. Lütfen sayfayı yenileyin." };
  const { productId, licenseId, addOnIds } = parsed.data;

  const license = await prisma.productLicense.findFirst({
    where: { id: licenseId, productId },
  });
  if (!license) return { ok: false, error: "Seçilen lisans bu ürüne ait değil." };

  // Yalnızca bu ürüne tanımlı ek hizmetler kabul edilir.
  const validAddOns = addOnIds.length
    ? await prisma.productAddOn.findMany({
        where: { productId, addOnId: { in: addOnIds }, addOn: { isActive: true } },
        select: { addOnId: true },
      })
    : [];

  const cart = await ensureCart();

  // Aynı ürün + aynı lisans varsa adet artırılır.
  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, licenseId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        licenseId,
        addOns: { create: validAddOns.map((a) => ({ addOnId: a.addOnId })) },
      },
    });
  }

  revalidatePath("/sepet");
  revalidatePath("/", "layout");
  return { ok: true, message: "Ürün sepete eklendi." };
}

async function ownedItem(itemId: string) {
  const token = await getCartToken();
  if (!token) return null;
  return prisma.cartItem.findFirst({ where: { id: itemId, cart: { token } } });
}

export async function updateQuantity(itemId: string, quantity: number): Promise<ActionResult> {
  const item = await ownedItem(itemId);
  if (!item) return { ok: false, error: "Sepet satırı bulunamadı." };
  const qty = Math.min(Math.max(1, Math.trunc(quantity)), 20);
  await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: qty } });
  revalidatePath("/sepet");
  return { ok: true };
}

export async function removeItem(itemId: string): Promise<ActionResult> {
  const item = await ownedItem(itemId);
  if (!item) return { ok: false, error: "Sepet satırı bulunamadı." };
  await prisma.cartItem.delete({ where: { id: item.id } });
  revalidatePath("/sepet");
  revalidatePath("/", "layout");
  return { ok: true, message: "Ürün sepetten çıkarıldı." };
}

export async function changeLicense(itemId: string, licenseId: string): Promise<ActionResult> {
  const item = await ownedItem(itemId);
  if (!item) return { ok: false, error: "Sepet satırı bulunamadı." };
  const license = await prisma.productLicense.findFirst({
    where: { id: licenseId, productId: item.productId },
  });
  if (!license) return { ok: false, error: "Seçilen lisans bu ürüne ait değil." };
  await prisma.cartItem.update({ where: { id: item.id }, data: { licenseId } });
  revalidatePath("/sepet");
  return { ok: true, message: "Lisans güncellendi." };
}

export async function toggleItemAddOn(itemId: string, addOnId: string): Promise<ActionResult> {
  const item = await ownedItem(itemId);
  if (!item) return { ok: false, error: "Sepet satırı bulunamadı." };

  const allowed = await prisma.productAddOn.findFirst({
    where: { productId: item.productId, addOnId, addOn: { isActive: true } },
  });
  if (!allowed) return { ok: false, error: "Bu ek hizmet seçilen ürün için sunulmuyor." };

  const existing = await prisma.cartItemAddOn.findUnique({
    where: { cartItemId_addOnId: { cartItemId: item.id, addOnId } },
  });
  if (existing) {
    await prisma.cartItemAddOn.delete({
      where: { cartItemId_addOnId: { cartItemId: item.id, addOnId } },
    });
  } else {
    await prisma.cartItemAddOn.create({ data: { cartItemId: item.id, addOnId } });
  }
  revalidatePath("/sepet");
  return { ok: true };
}

export async function applyCoupon(code: string): Promise<ActionResult> {
  const token = await getCartToken();
  if (!token) return { ok: false, error: "Sepetiniz boş." };
  const cleaned = code.trim().toUpperCase().slice(0, 32);
  if (!cleaned) return { ok: false, error: "Kupon kodu giriniz." };

  const coupon = await prisma.coupon.findUnique({ where: { code: cleaned } });
  if (!coupon || !coupon.isActive) return { ok: false, error: "Kupon kodu geçersiz." };

  const now = new Date();
  if (coupon.endsAt && coupon.endsAt < now) return { ok: false, error: "Kuponun süresi dolmuş." };
  if (coupon.startsAt && coupon.startsAt > now) return { ok: false, error: "Kupon henüz başlamadı." };
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
    return { ok: false, error: "Kupon kullanım limiti dolmuş." };

  await prisma.cart.update({ where: { token }, data: { couponId: coupon.id } });
  revalidatePath("/sepet");
  return { ok: true, message: "Kupon uygulandı." };
}

export async function removeCoupon(): Promise<ActionResult> {
  const token = await getCartToken();
  if (!token) return { ok: false, error: "Sepetiniz boş." };
  await prisma.cart.update({ where: { token }, data: { couponId: null } });
  revalidatePath("/sepet");
  return { ok: true, message: "Kupon kaldırıldı." };
}
