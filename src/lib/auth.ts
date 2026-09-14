import { cookies, headers } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "lz_session";
const SESSION_DAYS = 30;

/** Çerezdeki token'ın kendisi değil, SHA-256 özeti saklanır. */
function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** IP adresi düz metin loglanmaz; yalnızca özeti tutulur. */
function hashIp(ip: string | null) {
  if (!ip) return null;
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  const headerList = await headers();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000);

  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      userAgent: headerList.get("user-agent")?.slice(0, 300) ?? null,
      ipHash: hashIp(headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null),
      expiresAt,
    },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
    store.delete(SESSION_COOKIE);
  }
}

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  customerType: string;
  companyName: string | null;
  role: { key: string; name: string; permissions: string[] };
};

/** Oturumdaki kullanıcıyı döner; oturum yoksa null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { role: true } } },
  });

  if (!session || session.expiresAt < new Date() || !session.user.isActive) return null;

  const user = session.user;
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    customerType: user.customerType,
    companyName: user.companyName,
    role: {
      key: user.role.key,
      name: user.role.name,
      permissions: safePermissions(user.role.permissions),
    },
  };
}

function safePermissions(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Belirli bir yetkinin olup olmadığını kontrol eder. "*" tüm yetkileri kapsar. */
export function hasPermission(user: SessionUser | null, permission: string) {
  if (!user) return false;
  return user.role.permissions.includes("*") || user.role.permissions.includes(permission);
}

/** Yönetim paneline erişebilecek roller. */
export function isStaff(user: SessionUser | null) {
  return Boolean(user && ["admin", "editor", "support"].includes(user.role.key));
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

/**
 * Basit bellek içi hız sınırlama (giriş ve form denemeleri için).
 * Üretimde birden fazla sunucu çalıştırılıyorsa Redis tabanlı bir sayaçla değiştirilmelidir.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  entry.count += 1;
  if (entry.count > max) return { allowed: false, remaining: 0 };
  return { allowed: true, remaining: max - entry.count };
}
