"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpenText,
  ClipboardList,
  Command,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  X,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminNotificationBell } from "@/components/admin/AdminNotificationBell";
import { cn } from "@/lib/utils";

type AdminShellUser = {
  fullName: string;
  email: string;
  role: { key: string; name: string };
};

export function AdminShell({
  user,
  children,
}: {
  user: AdminShellUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Sayfa değiştiğinde mobil menüyü ve mobil aramayı otomatik kapat
  useEffect(() => {
    setSidebarOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  const initials = useMemo(
    () =>
      user.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [user.fullName],
  );

  // Mobil alt menü için aktiflik kontrolü
  const isHomeActive = pathname === "/admin" || pathname === "/yonetim";
  const isOrdersActive = pathname.startsWith("/admin/siparisler") || pathname.startsWith("/yonetim/siparisler");
  const isMessagesActive = pathname.startsWith("/admin/formlar") || pathname.startsWith("/yonetim/formlar");
  const isBlogActive = pathname.startsWith("/admin/blog") || pathname.startsWith("/yonetim/blog");

  return (
    <div className="fixed inset-0 z-[90] min-h-dvh overflow-hidden bg-[#f8f9fc] text-[#1a1a1a]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Mobil ve Masaüstü Sidebar ─── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[18rem] max-w-[85vw] border-r border-slate-200/90 bg-white p-5 shadow-2xl transition-transform duration-300 lg:w-[17.5rem] lg:shadow-xs lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Kapat Butonu */}
          <div className="flex items-center justify-between gap-3 px-1 py-1">
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center gap-3"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-tr from-[#1f7a68] to-[#125245] text-sm font-black text-white shadow-md shadow-[#1f7a68]/25 transition group-hover:scale-105">
                LZ
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="block text-[0.95rem] font-black text-zinc-950">
                    Lizart Dijital
                  </span>
                  <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[10px] font-black text-emerald-800">
                    v2.4
                  </span>
                </div>
                <span className="text-xs font-bold text-zinc-600">
                  Yönetim Portalı
                </span>
              </div>
            </Link>
            <button
              type="button"
              aria-label="Menüyü kapat"
              className="grid size-9 place-items-center rounded-xl text-zinc-500 hover:bg-slate-100 hover:text-zinc-950 lg:hidden cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigasyon Listesi */}
          <div className="no-scrollbar mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <AdminNav
              roleKey={user.role.key}
              surface="light"
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>

          {/* Kullanıcı Bilgi Kartı */}
          <div className="mt-4 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-slate-100/70 p-3.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-[#1f7a68] to-[#125245] text-xs font-black text-white shadow-2xs shrink-0">
                  {initials}
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-zinc-950">{user.fullName}</p>
                  <p className="truncate text-[11px] font-bold text-zinc-600">{user.role.name}</p>
                </div>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  title="Güvenli Çıkış Yap"
                  className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-zinc-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                >
                  <LogOut size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Ana İçerik Alanı ─── */}
      <div className="relative h-dvh overflow-y-auto overflow-x-hidden lg:pl-[17.5rem]">
        {/* Üst Bar (Header) */}
        <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-3 px-3.5 sm:px-6 lg:px-8">
            {/* Sol Kısım: Menü Butonu & Mobil Logo */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                aria-label="Menüyü aç"
                className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition lg:hidden cursor-pointer"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>

              <Link href="/admin" className="flex items-center gap-2 lg:hidden">
                <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-tr from-[#1f7a68] to-[#125245] text-xs font-black text-white">
                  LZ
                </span>
                <span className="text-sm font-black text-slate-900 truncate">
                  Lizart Admin
                </span>
              </Link>
            </div>

            {/* Masaüstü Arama Formu */}
            <form
              action="/admin/urunler"
              className="hidden h-11 min-w-0 flex-1 max-w-lg items-center gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/80 px-4 transition focus-within:border-[#1f7a68] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1f7a68]/10 shadow-2xs md:flex"
            >
              <Search size={17} className="text-slate-400" />
              <input
                name="q"
                type="search"
                placeholder="Ürün, blog, referans veya müşteri ara..."
                className="h-full min-w-0 flex-1 bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
              />
              <span className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-black text-slate-400 xl:inline-flex">
                <Command size={11} />
                K
              </span>
            </form>

            {/* Sağ Araçlar */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Canlı Sistem Durumu Rozeti */}
              <div className="hidden xl:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/80 px-3 py-1 text-xs font-black text-emerald-800 shadow-2xs">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sistem Çevrimiçi</span>
              </div>

              {/* Mobil Arama Açma Butonu */}
              <button
                type="button"
                aria-label="Arama yap"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition md:hidden cursor-pointer"
              >
                <Search size={18} />
              </button>

              {/* Hızlı Ekle Butonu */}
              <Link
                href="/admin/blog"
                className="hidden h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f7a68] to-[#155e4f] px-4 text-xs font-black text-white shadow-sm shadow-[#1f7a68]/25 hover:from-[#176956] hover:to-[#104a3e] transition cursor-pointer sm:inline-flex"
              >
                <Plus size={16} className="stroke-[3]" />
                Hızlı Ekle
              </Link>

              {/* Bildirim Çanı */}
              <AdminNotificationBell />

              {/* Kullanıcı Menüsü */}
              <details className="group relative">
                <summary className="flex h-10 cursor-pointer list-none items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2 pr-2.5 text-slate-900 hover:border-slate-300 transition shadow-2xs">
                  <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-[#125245] text-xs font-black text-white">
                    {initials}
                  </span>
                  <span className="hidden text-left md:block">
                    <span className="block text-xs font-black text-slate-950">{user.fullName}</span>
                    <span className="block text-[10px] font-bold text-slate-400">{user.role.name}</span>
                  </span>
                </summary>
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-black text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut size={15} />
                      Güvenli Çıkış
                    </button>
                  </form>
                </div>
              </details>
            </div>
          </div>

          {/* Mobil Arama Açılır Çubuğu */}
          {mobileSearchOpen && (
            <div className="border-t border-gray-200 bg-[#f8f9fc] p-3 md:hidden animate-in slide-in-from-top-2 duration-150">
              <form
                action="/admin/urunler"
                onSubmit={() => setMobileSearchOpen(false)}
                className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-[#1f7a68]"
              >
                <Search size={17} className="text-slate-400" />
                <input
                  name="q"
                  type="search"
                  autoFocus
                  placeholder="Ürün, blog, müşteri veya teklif ara..."
                  className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700"
                >
                  Kapat
                </button>
              </form>
            </div>
          )}
        </header>

        {/* ─── Ana İçerik ─── */}
        <main className="admin-readable min-h-[calc(100dvh-4rem)] min-w-0 px-3.5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 pb-28 lg:pb-8">
          <div className="mx-auto w-full min-w-0 max-w-[118rem]">{children}</div>
        </main>
      </div>

      {/* ─── Mobil Alt Menü Barı (Native App Dock) ─── */}
      <nav
        aria-label="Mobil hızlı erişim çubuğu"
        className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden"
      >
        {/* Panel */}
        <Link
          href="/admin"
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition",
            isHomeActive
              ? "text-[#1f7a68] font-black"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <LayoutDashboard size={20} className={isHomeActive ? "stroke-[2.5]" : ""} />
          <span>Panel</span>
        </Link>

        {/* Siparişler */}
        <Link
          href="/admin/siparisler"
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition",
            isOrdersActive
              ? "text-[#1f7a68] font-black"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <ClipboardList size={20} className={isOrdersActive ? "stroke-[2.5]" : ""} />
          <span>Siparişler</span>
        </Link>

        {/* Mesajlar */}
        <Link
          href="/admin/formlar"
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition",
            isMessagesActive
              ? "text-[#1f7a68] font-black"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <MessageSquareText size={20} className={isMessagesActive ? "stroke-[2.5]" : ""} />
          <span>Mesajlar</span>
        </Link>

        {/* Blog */}
        <Link
          href="/admin/blog"
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition",
            isBlogActive
              ? "text-[#1f7a68] font-black"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <BookOpenText size={20} className={isBlogActive ? "stroke-[2.5]" : ""} />
          <span>Blog</span>
        </Link>

        {/* Menüyü Aç */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition cursor-pointer",
            sidebarOpen
              ? "text-[#1f7a68] font-black"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Menu size={20} />
          <span>Menü</span>
        </button>
      </nav>
    </div>
  );
}

