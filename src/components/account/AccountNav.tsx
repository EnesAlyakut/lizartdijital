"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    title: "Genel",
    items: [
      { href: "/hesabim", label: "Genel Bakış" },
      { href: "/hesabim/siparislerim", label: "Siparişlerim" },
      { href: "/hesabim/faturalarim", label: "Faturalarım" },
    ],
  },
  {
    title: "Ürünlerim",
    items: [
      { href: "/hesabim/urunlerim", label: "Satın Aldıklarım" },
      { href: "/hesabim/lisanslarim", label: "Lisanslarım" },
      { href: "/hesabim/indirmelerim", label: "İndirmelerim" },
      { href: "/hesabim/guncellemeler", label: "Güncellemeler" },
    ],
  },
  {
    title: "Projeler ve destek",
    items: [
      { href: "/hesabim/projelerim", label: "Projelerim" },
      { href: "/hesabim/destek", label: "Destek Taleplerim" },
      { href: "/hesabim/tekliflerim", label: "Tekliflerim" },
    ],
  },
  {
    title: "Kaydettiklerim",
    items: [
      { href: "/hesabim/favorilerim", label: "Favorilerim" },
      { href: "/karsilastir", label: "Karşılaştırmalarım" },
      { href: "/hesabim/kuponlarim", label: "Kuponlarım" },
    ],
  },
  {
    title: "Hesap",
    items: [
      { href: "/hesabim/adreslerim", label: "Adreslerim" },
      { href: "/hesabim/ayarlar", label: "Hesap Ayarları" },
    ],
  },
];

/** Hesabım bölümü yan menüsü. Mobilde yatay kaydırılabilir şerit olur. */
export function AccountNav({ isStaff }: { isStaff: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Hesap menüsü" className="lg:sticky lg:top-24 lg:h-fit">
      {/* Mobil: yatay şerit */}
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:hidden">
        {GROUPS.flatMap((g) => g.items).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm",
              pathname === item.href
                ? "border-ink-900 bg-ink-900 text-canvas"
                : "border-ink-200 bg-surface text-ink-700",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Masaüstü: gruplu liste */}
      <div className="hidden space-y-6 lg:block">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">
              {group.title}
            </p>
            <ul className="mt-2 space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "block rounded-xl px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-ink-900 font-medium text-canvas"
                        : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {isStaff && (
          <div className="border-t border-ink-100 pt-5">
            <Link
              href="/yonetim"
              className="block rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-800 hover:bg-brand-100"
            >
              Yönetim paneline git →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
