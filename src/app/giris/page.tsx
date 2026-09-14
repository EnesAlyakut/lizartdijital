import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { Shield, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Giriş Yap | Lizart Dijital",
  description: "Lizart Dijital yönetim paneline veya müşteri hesabınıza güvenli giriş yapın.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ devam?: string; hata?: string }>;
}) {
  const { devam, hata } = await searchParams;
  const redirectTo = devam?.startsWith("/") ? devam : "/hesabim";
  const isAdmin = redirectTo.includes("admin") || redirectTo.includes("yonetim");

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 overflow-hidden">
      {/* ─── Arka Plan Yumuşak Işık Efektleri ─── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-gradient-to-tr from-[#1f7a68]/15 via-[#10b981]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 right-10 size-[450px] rounded-full bg-[#1f7a68]/8 blur-3xl" />
      </div>

      {/* ─── Ana Giriş Kartı ─── */}
      <div className="relative w-full max-w-lg">
        {/* Dekoratif Üst Işıltı Çizgisi */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 h-0.5 w-3/4 bg-gradient-to-r from-transparent via-[#1f7a68] to-transparent" />

        <div className="rounded-[2.5rem] border border-slate-200/80 bg-white/95 p-8 sm:p-11 shadow-[0_32px_80px_-20px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          {/* Lizart Logo Başlığı */}
          <div className="flex justify-center mb-4">
            <Link href="/" className="group flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-tr from-[#1f7a68] to-[#145749] text-base font-black text-white shadow-md shadow-[#1f7a68]/30 transition group-hover:scale-105">
                LZ
              </span>
              <div className="text-left">
                <span className="block text-lg font-black tracking-tight text-slate-950">
                  Lizart Dijital
                </span>
                <span className="block text-[11px] font-bold text-slate-500">
                  {isAdmin ? "Yönetim & Kontrol Merkezi" : "Müşteri Portalı"}
                </span>
              </div>
            </Link>
          </div>

          {/* Form Bileşeni */}
          <LoginForm redirectTo={redirectTo} error={hata} />
        </div>

        {/* Alt Güvenlik Bildirimi */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 text-center">
          <Shield size={13} className="text-[#1f7a68]" />
          <span>256-Bit SSL Şifreli Güvenli Bağlantı · Lizart Dijital Altyapısı</span>
        </div>
      </div>
    </div>
  );
}
