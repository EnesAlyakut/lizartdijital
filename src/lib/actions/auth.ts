"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { createSession, destroySession, hashPassword, rateLimit, verifyPassword } from "@/lib/auth";
import { getCartToken } from "@/lib/cart";

export type AuthResult = { ok: false; error: string } | { ok: true; redirectTo: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "E-posta veya kullanıcı adınızı giriniz."),
  password: z.string().min(1, "Şifrenizi giriniz."),
  redirectTo: z.string().optional(),
});

const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, "Ad soyad giriniz.").max(120),
    email: z.string().trim().toLowerCase().email("Geçerli bir e-posta adresi giriniz."),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır.")
      .max(200)
      .regex(/[a-zA-Z]/, "Şifre en az bir harf içermelidir.")
      .regex(/[0-9]/, "Şifre en az bir rakam içermelidir."),
    passwordConfirm: z.string(),
    terms: z.literal("on", { message: "Üyelik sözleşmesini onaylamanız gerekiyor." }),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Şifreler eşleşmiyor.",
    path: ["passwordConfirm"],
  });

/** Giriş. Hatalı denemeler IP bazında sınırlanır ve kullanıcı numaralandırması yapılmaz. */
export async function login(formData: FormData): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const limit = rateLimit(`login:${ip}`, 8, 60_000);
  if (!limit.allowed) {
    return { ok: false, error: "Çok fazla deneme yapıldı. Lütfen bir dakika sonra tekrar deneyin." };
  }

  const email = parsed.data.email === "admin" ? "admin@lizartdijital.com" : parsed.data.email;
  const emailCheck = z.string().email().safeParse(email);
  if (!emailCheck.success) return { ok: false, error: "E-posta veya kullanıcı adı hatalı." };

  const user = await prisma.user.findUnique({ where: { email } });
  // Kullanıcı yoksa da aynı mesaj döner; hesap varlığı sızdırılmaz.
  if (!user || !user.isActive || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { ok: false, error: "E-posta veya şifre hatalı." };
  }

  await createSession(user.id);
  await linkGuestData(user.id, user.email);

  const target = parsed.data.redirectTo?.startsWith("/") ? parsed.data.redirectTo : "/hesabim";
  return { ok: true, redirectTo: target };
}

/** Kayıt. Aynı e-posta varsa hesap oluşturulmaz. */
export async function register(formData: FormData): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { ok: false, error: "Bu e-posta adresiyle bir hesap zaten var. Giriş yapmayı deneyin." };
  }

  const customerRole = await prisma.role.findUnique({ where: { key: "customer" } });
  if (!customerRole) return { ok: false, error: "Kayıt şu anda yapılamıyor. Lütfen sonra tekrar deneyin." };

  const user = await prisma.user.create({
    data: {
      email: data.email,
      fullName: data.fullName,
      phone: data.phone || null,
      passwordHash: await hashPassword(data.password),
      roleId: customerRole.id,
    },
  });

  await createSession(user.id);
  await linkGuestData(user.id, user.email);

  return { ok: true, redirectTo: "/hesabim" };
}

/**
 * Üyeliksiz verilen siparişleri ve misafir sepetini yeni hesaba bağlar.
 * Böylece kullanıcı sipariş sonrası hesap açtığında geçmişini görebilir.
 */
async function linkGuestData(userId: string, email: string) {
  await prisma.order.updateMany({ where: { email, userId: null }, data: { userId } });
  await prisma.licenseKey.updateMany({
    where: { userId: null, order: { email } },
    data: { userId },
  });
  await prisma.download.updateMany({ where: { userId: null, order: { email } }, data: { userId } });

  const cartToken = await getCartToken();
  if (cartToken) {
    await prisma.cart.updateMany({ where: { token: cartToken }, data: { userId } });
  }
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function submitLogin(formData: FormData) {
  const result = await login(formData);
  if (!result.ok) {
    const redirectTo = String(formData.get("redirectTo") ?? "");
    redirect(
      `/giris?hata=${encodeURIComponent(result.error)}${redirectTo ? `&devam=${encodeURIComponent(redirectTo)}` : ""}`,
    );
  }
  redirect(result.redirectTo);
}

export async function submitRegister(formData: FormData) {
  const result = await register(formData);
  if (!result.ok) redirect(`/kayit?hata=${encodeURIComponent(result.error)}`);
  redirect(result.redirectTo);
}
