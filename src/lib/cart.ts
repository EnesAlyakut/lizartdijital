import { cookies } from "next/headers";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { DEFAULT_VAT_RATE } from "@/lib/constants";

const CART_COOKIE = "lz_cart";
const CART_MAX_AGE = 60 * 60 * 24 * 30; // 30 gün

/**
 * Sepet sunucuda tutulur; çerezde yalnızca tahmin edilemez bir anahtar bulunur.
 * Böylece fiyatlar istemciden gelen veriye göre hesaplanmaz.
 */
export async function getCartToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

export async function ensureCart() {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) {
    const cart = await prisma.cart.findUnique({ where: { token: existing } });
    if (cart) return cart;
  }
  const token = crypto.randomBytes(24).toString("base64url");
  const cart = await prisma.cart.create({ data: { token } });
  store.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_MAX_AGE,
  });
  return cart;
}

const cartInclude = {
  coupon: true,
  items: {
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          basePrice: true,
          coverImage: true,
          type: true,
          deliveryDays: true,
          vatRate: true,
          category: { select: { name: true } },
        },
      },
      license: true,
      addOns: { include: { addOn: true } },
    },
  },
} as const;

export async function getCart() {
  const token = await getCartToken();
  if (!token) return null;
  return prisma.cart.findUnique({ where: { token }, include: cartInclude });
}

export type CartWithItems = NonNullable<Awaited<ReturnType<typeof getCart>>>;

export type CartTotals = {
  subtotal: number;
  discount: number;
  vatTotal: number;
  total: number;
  itemCount: number;
  estimatedDays: number;
  couponCode: string | null;
  couponError: string | null;
};

/**
 * Tüm tutarlar veritabanındaki fiyatlardan yeniden hesaplanır.
 * İstemciden gelen hiçbir tutar dikkate alınmaz.
 */
export function calculateTotals(cart: CartWithItems | null): CartTotals {
  const empty: CartTotals = {
    subtotal: 0, discount: 0, vatTotal: 0, total: 0,
    itemCount: 0, estimatedDays: 0, couponCode: null, couponError: null,
  };
  if (!cart || cart.items.length === 0) return empty;

  let subtotal = 0;
  let estimatedDays = 0;

  for (const item of cart.items) {
    const unit = item.license.priceDelta + basePriceOf(item);
    const addOnTotal = item.addOns.reduce((sum, a) => sum + a.addOn.price, 0);
    subtotal += (unit + addOnTotal) * item.quantity;
    const addOnDays = item.addOns.reduce((max, a) => Math.max(max, a.addOn.extraDays), 0);
    estimatedDays = Math.max(estimatedDays, item.product.deliveryDays + addOnDays);
  }

  let discount = 0;
  let couponError: string | null = null;
  const coupon = cart.coupon;
  if (coupon) {
    const now = new Date();
    const expired = coupon.endsAt ? coupon.endsAt < now : false;
    const notStarted = coupon.startsAt ? coupon.startsAt > now : false;
    const exhausted = coupon.maxUses ? coupon.usedCount >= coupon.maxUses : false;
    if (!coupon.isActive || expired || notStarted || exhausted) {
      couponError = "Kupon artık geçerli değil.";
    } else if (subtotal < coupon.minSubtotal) {
      couponError = "Kupon bu sepet tutarı için geçerli değil.";
    } else {
      discount =
        coupon.type === "yuzde"
          ? Math.round((subtotal * coupon.value) / 100)
          : Math.min(coupon.value, subtotal);
    }
  }

  const net = subtotal - discount;
  // Fiyatlar KDV hariç tutulur; KDV toplam üzerinden eklenir.
  const vatTotal = Math.round((net * DEFAULT_VAT_RATE) / 100);

  return {
    subtotal,
    discount,
    vatTotal,
    total: net + vatTotal,
    itemCount: cart.items.reduce((n, i) => n + i.quantity, 0),
    estimatedDays,
    couponCode: couponError ? null : (coupon?.code ?? null),
    couponError,
  };
}

/** Ürünün taban fiyatı — sepette daima veritabanındaki güncel fiyat kullanılır. */
function basePriceOf(item: CartWithItems["items"][number]): number {
  return item.product.basePrice;
}

/** Sepetteki tek bir satırın toplamını hesaplar. */
export function lineTotal(item: CartWithItems["items"][number]) {
  const unit = basePriceOf(item) + item.license.priceDelta;
  const addOns = item.addOns.reduce((s, a) => s + a.addOn.price, 0);
  return (unit + addOns) * item.quantity;
}

export async function cartItemCount(): Promise<number> {
  const token = await getCartToken();
  if (!token) return 0;
  const result = await prisma.cartItem.aggregate({
    where: { cart: { token } },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}
