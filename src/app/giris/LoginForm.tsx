"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  PanelLeft,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import { submitLogin } from "@/lib/actions/auth";

export function LoginForm({
  redirectTo,
  error,
}: {
  redirectTo: string;
  error?: string;
}) {
  const isAdmin = redirectTo.includes("admin") || redirectTo.includes("yonetim");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="w-full">
      {/* Kart Üst Başlık & Rozet */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-700">
          {isAdmin ? (
            <>
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Yetkili Yönetici Girişi</span>
            </>
          ) : (
            <>
              <Sparkles size={14} className="text-emerald-600" />
              <span>Lizart Dijital Portal</span>
            </>
          )}
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
          {isAdmin ? "Yönetim Paneline Giriş" : "Hesabınıza Giriş Yapın"}
        </h1>
        <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600 max-w-sm mx-auto leading-relaxed">
          {isAdmin
            ? "Site içerikleri, siparişler, teklifler ve raporlara erişmek için oturum açın."
            : "Siparişlerinizi, lisanslarınızı ve taleplerinizi güvenle takip edin."}
        </p>
      </div>

      {/* Hata Bildirimi */}
      {error && (
        <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-bold text-rose-800 animate-in fade-in">
          <span className="size-2 rounded-full bg-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Alanı */}
      <form action={submitLogin} className="mt-6 space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {/* E-posta veya Kullanıcı Adı */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            E-posta veya Kullanıcı Adı
          </label>
          <div className="relative mt-1.5">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={17} />
            </span>
            <input
              name="email"
              type="text"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta veya kullanıcı adınız"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-[#1f7a68] focus:ring-4 focus:ring-[#1f7a68]/10 focus:outline-none transition shadow-2xs"
            />
          </div>
        </div>

        {/* Şifre */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            Şifre
          </label>
          <div className="relative mt-1.5">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={17} />
            </span>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-11 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-[#1f7a68] focus:ring-4 focus:ring-[#1f7a68]/10 focus:outline-none transition shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Giriş Butonu */}
        <button
          type="submit"
          className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1f7a68] to-[#155e4f] text-sm font-black text-white shadow-lg shadow-[#1f7a68]/25 hover:from-[#176956] hover:to-[#104a3e] transition-all cursor-pointer"
        >
          <span>Giriş Yap ve Devam Et</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </form>

      {/* Alt Hızlı Yönlendirmeler */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5 text-xs font-bold text-slate-600">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#1f7a68] transition"
        >
          <PanelLeft size={14} />
          Siteye Dön
        </Link>
        <Link
          href="/magaza"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#1f7a68] transition"
        >
          <ShoppingBag size={14} />
          Mağazaya Git
        </Link>
      </div>
    </div>
  );
}
