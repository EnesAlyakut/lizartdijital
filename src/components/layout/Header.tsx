"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronDown,
  FolderGit2,
  Home,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { NAV, SITE, whatsappLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SearchBox } from "@/components/layout/SearchBox";

type NavColumn = { title: string; links: readonly { label: string; href: string }[] };
type NavHighlight = { title: string; body: string; href: string; cta: string };

/**
 * Site başlığı.
 * Masaüstünde menü öğeleri doğrudan yatay şeritte görünür; alt menüsü olanlar
 * hover veya klavye odağıyla açılan geniş panel gösterir. Küçük ekranlarda
 * öğeler açılır menüye toplanır.
 */
export function Header({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sayfa değiştiğinde açık menüler kapanır (render sırasında durum sıfırlama deseni).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setSearchOpen(false);
    setOpenPanel(null);
    setExpandedMobileItem(null);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape tüm açık katmanları kapatır
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenPanel(null);
      setSearchOpen(false);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** Fare panele geçerken menü kapanmasın diye kısa gecikmeli kapanış. */
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenPanel(null), 140);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const solid = scrolled || !isHome || mobileOpen || Boolean(openPanel);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-soft",
        solid
          ? "border-b border-ink-100/80 bg-white/95 shadow-[0_4px_25px_-12px_rgba(20,26,20,0.06)] backdrop-blur-md"
          : "border-b border-ink-100/40 bg-white/90 backdrop-blur-md",
      )}
    >
      <div className="container-page">
        <div className="flex h-20 items-center justify-between gap-4 lg:h-24 lg:gap-8">
          {/* Logo — Büyük, net ve ferah */}
          <Link href="/" className="flex shrink-0 items-center group py-2" aria-label="Lizart Dijital ana sayfa">
            <Image
              src="/logo.svg?v=4"
              alt="Lizart Dijital"
              width={827}
              height={468}
              priority
              className="h-13 sm:h-15 lg:h-16 w-auto mix-blend-multiply transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Masaüstü yatay menü — Ferah, geniş aralıklı ve kapsül aktif duruşlu */}
          <nav aria-label="Ana menü" className="hidden min-w-0 flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-1 xl:gap-2">
              {NAV.map((item) => {
                const columns = ("columns" in item ? item.columns : undefined) as
                  | readonly NavColumn[]
                  | undefined;
                const highlight = ("highlight" in item ? item.highlight : undefined) as
                  | NavHighlight
                  | undefined;
                const active = isActive(item.href);
                const open = openPanel === item.href;

                return (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose();
                      if (columns) setOpenPanel(item.href);
                    }}
                    onMouseLeave={() => columns && scheduleClose()}
                  >
                    <Link
                      href={item.href}
                      aria-expanded={columns ? open : undefined}
                      aria-current={active ? "page" : undefined}
                      onFocus={() => columns && setOpenPanel(item.href)}
                      className={cn(
                        "relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-2xl px-3.5 py-2 text-[0.92rem] font-medium transition-all duration-200 xl:px-4 xl:text-[0.95rem]",
                        active
                          ? "bg-ink-100/75 text-ink-950 font-bold shadow-xs"
                          : "text-ink-700 hover:bg-ink-50/80 hover:text-ink-950",
                      )}
                    >
                      <span>{item.label}</span>
                      {columns && (
                        <svg
                          viewBox="0 0 12 12"
                          className={cn(
                            "size-2.5 fill-current opacity-50 transition-transform duration-200",
                            open && "rotate-180",
                          )}
                          aria-hidden
                        >
                          <path d="M2 4.5L6 8.5L10 4.5z" />
                        </svg>
                      )}
                    </Link>

                    {columns && open && (
                      <MegaPanel
                        columns={columns}
                        highlight={highlight}
                        onClose={() => setOpenPanel(null)}
                        onKeep={cancelClose}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sağ taraf: ferah araçlar ve çağrı */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <IconButton label="Ürün ara" expanded={searchOpen} onClick={() => setSearchOpen((v) => !v)}>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </IconButton>

            <Link
              href="/sepet"
              className="relative grid size-11 place-items-center rounded-2xl bg-ink-100/60 text-ink-700 transition-all hover:bg-ink-100 hover:text-ink-950 shadow-xs"
              aria-label={`Sepetim, ${cartCount} ürün`}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M4 5h2l1.6 9.2a2 2 0 002 1.8h6.8a2 2 0 002-1.7L20 8H7" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="19.5" r="1.3" fill="currentColor" stroke="none" />
                <circle cx="17" cy="19.5" r="1.3" fill="currentColor" stroke="none" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-5 h-5 place-items-center rounded-full bg-brand-500 px-1 text-[0.68rem] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            <a
              href={whatsappLink("Merhaba, bir proje için görüşmek istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-brand ml-1 hidden items-center gap-2 rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-950/15 transition-all hover:-translate-y-0.5 hover:bg-brand-500 xl:inline-flex"
            >
              Başlayalım
            </a>

            {/* Küçük ekran menü düğmesi */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobil-menu"
              aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
              className="grid size-11 place-items-center rounded-2xl bg-ink-100/60 text-ink-800 transition-all hover:bg-ink-100 lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="animate-rise pb-4">
            <SearchBox autoFocus placeholder="Hazır site, uygulama veya hizmet arayın…" />
          </div>
        )}
      </div>

      {/* Mobil Yandan Açılır Menü (Off-Canvas Sheet) - Portal ile body'ye taşınarak tam ekran ve hatasız render edilir */}
      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[99999] lg:hidden transition-all duration-300",
              mobileOpen ? "visible" : "invisible"
            )}
            aria-hidden={!mobileOpen}
          >
            {/* Karartma Katmanı (Backdrop) */}
            <div
              className={cn(
                "fixed inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 ease-out",
                mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Yandan Kayan Panel (Drawer) */}
            <aside
              id="mobil-menu"
              aria-label="Mobil gezinme menüsü"
              className={cn(
                "fixed inset-y-0 right-0 z-10 flex h-[100dvh] w-full max-w-[380px] sm:max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out border-l border-ink-100",
                mobileOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
              )}
            >
              {/* Üst Bar: Logo ve Kapat Butonu */}
              <div className="flex h-18 shrink-0 items-center justify-between border-b border-ink-100 px-5 bg-white">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center group py-2"
                  aria-label="Lizart Dijital ana sayfa"
                >
                  <Image
                    src="/logo.svg?v=4"
                    alt="Lizart Dijital"
                    width={827}
                    height={468}
                    className="h-10 w-auto mix-blend-multiply"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Menüyü kapat"
                  className="grid size-10 place-items-center rounded-full border border-ink-200/80 bg-ink-50/80 text-ink-700 transition-all hover:bg-ink-100 hover:text-ink-950 active:scale-90"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Hızlı Arama & Popüler Etiketler */}
              <div className="shrink-0 border-b border-ink-100/70 bg-ink-50/40 p-3.5 space-y-2.5">
                <form
                  role="search"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem("q") as HTMLInputElement;
                    const q = input?.value.trim();
                    setMobileOpen(false);
                    window.location.href = q ? `/magaza?q=${encodeURIComponent(q)}` : "/magaza";
                  }}
                  className="relative"
                >
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="search"
                    name="q"
                    placeholder="Hazır site, uygulama, hizmet ara…"
                    className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-16 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors"
                  >
                    Ara
                  </button>
                </form>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[11px]">
                  <span className="shrink-0 font-medium text-ink-400">Popüler:</span>
                  {[
                    { label: "E-Ticaret", href: "/magaza?kategori=eticaret" },
                    { label: "Klinik", href: "/magaza?kategori=saglik" },
                    { label: "Mobil App", href: "/magaza/mobil-uygulamalar" },
                    { label: "SEO", href: "/hizmetler/seo-hizmetleri" },
                  ].map((tag) => (
                    <Link
                      key={tag.label}
                      href={tag.href}
                      onClick={() => setMobileOpen(false)}
                      className="shrink-0 rounded-full border border-ink-200 bg-white px-2.5 py-0.5 font-medium text-ink-600 hover:border-brand-300 hover:text-brand-700 transition-colors"
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Kaydırılabilir Navigasyon & Akordeon */}
              <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 no-scrollbar">
                <div>
                  <p className="px-2 pb-2 text-[0.7rem] font-bold uppercase tracking-wider text-ink-400">
                    Ana Menü
                  </p>

                  <ul className="space-y-1.5">
                    {NAV.map((item) => {
                      const columns = ("columns" in item ? item.columns : undefined) as
                        | readonly NavColumn[]
                        | undefined;
                      const highlight = ("highlight" in item ? item.highlight : undefined) as
                        | NavHighlight
                        | undefined;
                      const active = isActive(item.href);
                      const isExpanded = expandedMobileItem === item.href;

                      const Icon =
                        item.href === "/"
                          ? Home
                          : item.href === "/magaza"
                          ? ShoppingBag
                          : item.href === "/hizmetler"
                          ? Sparkles
                          : item.href === "/projeler"
                          ? FolderGit2
                          : item.href === "/hakkimizda"
                          ? Building2
                          : item.href === "/blog"
                          ? BookOpen
                          : Send;

                      if (columns) {
                        return (
                          <li key={item.href} className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-50/40 transition-colors">
                            <button
                              type="button"
                              onClick={() => setExpandedMobileItem((curr) => (curr === item.href ? null : item.href))}
                              className={cn(
                                "flex w-full items-center justify-between px-3.5 py-3 text-left transition-colors",
                                active ? "text-brand-800 font-bold" : "text-ink-900 font-semibold",
                                isExpanded && "bg-ink-100/50"
                              )}
                              aria-expanded={isExpanded}
                            >
                              <span className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    "grid size-8 place-items-center rounded-xl transition-colors",
                                    active
                                      ? "bg-brand-500 text-white"
                                      : "bg-white text-ink-600 border border-ink-100 shadow-2xs"
                                  )}
                                >
                                  <Icon className="size-4" />
                                </span>
                                <span className="text-[0.95rem]">{item.label}</span>
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-bold text-ink-600">
                                  {item.href === "/magaza" ? "6 Ürün Ailesi" : "9 Hizmet"}
                                </span>
                                <ChevronDown
                                  className={cn(
                                    "size-4 text-ink-400 transition-transform duration-200",
                                    isExpanded && "rotate-180 text-brand-600"
                                  )}
                                />
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="border-t border-ink-100 bg-white p-3 space-y-3.5">
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center justify-between rounded-xl bg-brand-50 px-3.5 py-2.5 text-xs font-bold text-brand-800 transition-colors hover:bg-brand-100"
                                >
                                  <span>Tüm {item.label} Kataloğu</span>
                                  <ArrowRight className="size-3.5" />
                                </Link>

                                {columns.map((col) => (
                                  <div key={col.title} className="space-y-1">
                                    <p className="px-2 text-[0.68rem] font-bold uppercase tracking-wider text-ink-400">
                                      {col.title}
                                    </p>
                                    <div className="space-y-0.5">
                                      {col.links.map((link) => (
                                        <Link
                                          key={link.href}
                                          href={link.href}
                                          onClick={() => setMobileOpen(false)}
                                          className={cn(
                                            "flex items-center justify-between rounded-xl px-3 py-2 text-[0.88rem] transition-colors",
                                            isActive(link.href)
                                              ? "bg-brand-50 font-bold text-brand-800"
                                              : "text-ink-700 hover:bg-ink-50 hover:text-ink-950 font-medium"
                                          )}
                                        >
                                          <span>{link.label}</span>
                                          <ArrowRight className="size-3 text-ink-300 opacity-60" />
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}

                                {highlight && (
                                  <div className="rounded-xl border border-brand-200/80 bg-brand-50/60 p-3">
                                    <p className="text-xs font-bold text-brand-900">{highlight.title}</p>
                                    <p className="mt-1 text-[11px] leading-relaxed text-ink-600">
                                      {highlight.body}
                                    </p>
                                    <Link
                                      href={highlight.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
                                    >
                                      {highlight.cta} →
                                    </Link>
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        );
                      }

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center justify-between rounded-2xl px-3.5 py-2.5 transition-colors",
                              active
                                ? "bg-brand-50 text-brand-800 font-bold"
                                : "text-ink-800 hover:bg-ink-50 font-semibold"
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "grid size-8 place-items-center rounded-xl transition-colors",
                                  active
                                    ? "bg-brand-500 text-white"
                                    : "bg-ink-50 text-ink-600 border border-ink-100"
                                )}
                              >
                                <Icon className="size-4" />
                              </span>
                              <span className="text-[0.95rem]">{item.label}</span>
                            </span>
                            <ArrowRight className="size-4 text-ink-300" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Hızlı WhatsApp Destek Kutusu */}
                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-950">WhatsApp Canlı Destek</span>
                    <span className="ml-auto text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Çevrimiçi
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-800">
                    Aklınıza takılan sorular için anında uzman ekibimizle görüşün.
                  </p>
                  <a
                    href={whatsappLink("Merhaba, projeleriniz ve hazır sistemler hakkında bilgi almak istiyorum.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 shadow-2xs"
                  >
                    <MessageCircle className="size-3.5" />
                    <span>WhatsApp Sohbeti Başlat</span>
                  </a>
                </div>

                {/* İletişim Bilgileri */}
                <div className="rounded-2xl border border-ink-100 bg-surface-2 p-3.5">
                  <p className="text-[0.7rem] font-bold uppercase tracking-wider text-ink-400">Doğrudan İletişim</p>
                  <div className="mt-2.5 space-y-2 text-xs text-ink-700">
                    <a href={SITE.phoneHref} className="flex items-center gap-2.5 hover:text-brand-700 transition-colors">
                      <Phone className="size-3.5 text-brand-600" />
                      <span className="font-semibold">{SITE.phone}</span>
                    </a>
                    <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 hover:text-brand-700 transition-colors">
                      <Mail className="size-3.5 text-brand-600" />
                      <span>{SITE.email}</span>
                    </a>
                  </div>
                </div>
              </nav>

              {/* Sabit Alt Bar: Sepet & Teklif CTA */}
              <div className="shrink-0 border-t border-ink-100 bg-white p-4 pb-6 space-y-2 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2">
                  <Link
                    href="/sepet"
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white py-3 text-xs font-bold text-ink-900 shadow-2xs hover:bg-ink-50 transition-colors"
                  >
                    <ShoppingBag className="size-4 text-ink-600" />
                    <span>Sepetim</span>
                    {cartCount > 0 && (
                      <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[10px] text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <a
                    href={whatsappLink("Merhaba, bir proje için görüşmek istiyorum.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
                  >
                    <MessageCircle className="size-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <Link
                  href="/teklif"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 py-3 text-xs font-bold text-white shadow-md shadow-brand-950/15 transition-all active:scale-[0.99]"
                >
                  <span>Hemen Başlayalım / Teklif Al</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </header>
  );
}

/* ------------------------------------------------------------ Açılır panel */

function MegaPanel({
  columns,
  highlight,
  onClose,
  onKeep,
}: {
  columns: readonly NavColumn[];
  highlight?: NavHighlight;
  onClose: () => void;
  onKeep: () => void;
}) {
  return (
    <div
      className="absolute left-0 top-full z-50 w-max pt-3"
      onMouseEnter={onKeep}
      onMouseLeave={onClose}
    >
      <div className="animate-rise overflow-hidden rounded-[var(--radius-card)] border border-ink-100 bg-surface shadow-[var(--shadow-lift)]">
        <div className="flex">
          <div className="grid grid-cols-2 gap-x-8 p-6">
            {columns.map((col) => (
              <div key={col.title} className="min-w-52">
                <p className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-400">
                  {col.title}
                </p>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-sm px-3 py-2 text-sm text-ink-700 transition-soft hover:bg-brand-50 hover:text-brand-800"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {highlight && (
            <div className="w-64 border-l border-ink-100 bg-surface-2 p-6">
              <p className="font-semibold text-ink-900">{highlight.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{highlight.body}</p>
              <Link
                href={highlight.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-soft hover:gap-2.5"
              >
                {highlight.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-ink-100 px-6 py-3">
          <p className="text-xs text-ink-400">Aradığınızı bulamadınız mı?</p>
          <Link href="/teklif" className="text-xs font-medium text-brand-700 hover:underline">
            Özel teklif isteyin →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Yardımcılar */

function IconButton({
  label,
  expanded,
  onClick,
  children,
}: {
  label: string;
  expanded?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={label}
      className="grid size-11 place-items-center rounded-2xl bg-ink-100/60 text-ink-700 transition-all hover:bg-ink-100 hover:text-ink-950 shadow-xs"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {children}
      </svg>
    </button>
  );
}

function IconLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "size-10 place-items-center rounded-sm text-ink-600 transition-soft hover:bg-ink-50 hover:text-ink-900",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        {children}
      </svg>
    </Link>
  );
}
