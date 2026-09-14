"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      {/* Küçük ekran menüsü */}
      {mobileOpen && (
        <div
          id="mobil-menu"
          className="animate-rise max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-ink-100 bg-canvas lg:hidden"
        >
          <nav aria-label="Mobil menü" className="container-page py-6">
            <SearchBox placeholder="Ürün ara…" />

            <ul className="mt-5 space-y-1">
              {NAV.map((item) => {
                const columns = ("columns" in item ? item.columns : undefined) as
                  | readonly NavColumn[]
                  | undefined;
                return (
                  <li key={item.href} className="border-b border-ink-100 pb-2 last:border-0">
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-sm px-3 py-3 text-[1.05rem] font-medium transition-soft",
                        isActive(item.href) ? "text-brand-700" : "text-ink-900 hover:bg-ink-50",
                      )}
                    >
                      {item.label}
                    </Link>
                    {columns && (
                      <div className="ml-3 grid gap-x-6 border-l border-ink-100 pl-4 sm:grid-cols-2">
                        {columns.map((col) => (
                          <div key={col.title} className="py-1">
                            <p className="px-1 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">
                              {col.title}
                            </p>
                            <ul>
                              {col.links.map((c) => (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    className="block rounded-lg px-1 py-1.5 text-sm text-ink-600 transition-soft hover:text-brand-700"
                                  >
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 rounded-[var(--radius-card)] border border-ink-100 bg-surface p-5">
              <p className="text-sm font-semibold text-ink-900">Bize ulaşın</p>
              <div className="mt-3 space-y-2 text-sm">
                <a href={SITE.phoneHref} className="block text-ink-700 hover:text-brand-700">
                  {SITE.phone}
                </a>
                <a href={`mailto:${SITE.email}`} className="block text-ink-700 hover:text-brand-700">
                  {SITE.email}
                </a>
                <p className="text-ink-500">{SITE.address}</p>
              </div>
              <a
                href={whatsappLink("Merhaba, bir proje için görüşmek istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-sm bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-canvas hover:bg-brand-500"
              >
                Başlayalım
              </a>
            </div>
          </nav>
        </div>
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
