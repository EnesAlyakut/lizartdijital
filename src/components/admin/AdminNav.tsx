"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  ClipboardList,
  FolderKanban,
  Image,
  Layers3,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareText,
  Package,
  PanelTop,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    title: "Genel",
    items: [
      { href: "/yonetim", label: "Panel", icon: LayoutDashboard, roles: ["admin", "editor", "support"] },
      { href: "/yonetim/raporlar", label: "Analitik", icon: BarChart3, roles: ["admin"] },
    ],
  },
  {
    title: "Gelen Bildirimler",
    items: [
      {
        href: "/yonetim/siparisler",
        label: "Siparişler",
        icon: ClipboardList,
        roles: ["admin", "support", "editor"],
        badgeKey: "orders",
      },
      {
        href: "/yonetim/teklifler",
        label: "Teklif Talepleri",
        icon: MessageSquareText,
        roles: ["admin", "support"],
        badgeKey: "offers",
      },
      {
        href: "/yonetim/formlar",
        label: "Form Mesajları",
        icon: MessageSquareText,
        roles: ["admin", "support"],
        badgeKey: "messages",
      },
    ],
  },
  {
    title: "İçerik",
    items: [
      { href: "/yonetim/blog", label: "Blog Yönetimi", icon: BookOpenText, roles: ["admin", "editor"] },
      { href: "/yonetim/kategoriler", label: "Blog Kategorileri", icon: Tags, roles: ["admin", "editor"] },
      { href: "/yonetim/hizmetler", label: "Hizmetler", icon: BriefcaseBusiness, roles: ["admin", "editor"] },
      { href: "/yonetim/portfoy", label: "Referanslar", icon: FolderKanban, roles: ["admin", "editor"] },
      { href: "/yonetim/medya", label: "Medya Kütüphanesi", icon: Image, roles: ["admin", "editor"] },
    ],
  },
  {
    title: "Satış",
    items: [
      { href: "/yonetim/urunler", label: "Ürünler / Paketler", icon: Package, roles: ["admin", "editor"] },
      { href: "/yonetim/ek-hizmetler", label: "Ek Hizmetler", icon: Layers3, roles: ["admin"] },
      { href: "/yonetim/kuponlar", label: "Kuponlar", icon: Tags, roles: ["admin"] },
    ],
  },
  {
    title: "Operasyon",
    items: [
      { href: "/yonetim/projeler", label: "Projeler", icon: FolderKanban, roles: ["admin", "support"] },
      { href: "/yonetim/destek", label: "Destek Talepleri", icon: LifeBuoy, roles: ["admin", "support"] },
      { href: "/yonetim/yorumlar", label: "Yorumlar", icon: MessageSquareText, roles: ["admin", "editor"] },
    ],
  },
];

export function AdminNav({
  roleKey,
  onNavigate,
}: {
  roleKey: string;
  surface?: "light" | "dark";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<{ orders: number; offers: number; messages: number }>({
    orders: 0,
    offers: 0,
    messages: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/admin/notifications", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (json.ok && json.counts) {
          setCounts(json.counts);
        }
      } catch {
        // ignore fetch error
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Bildirimler temizlendiğinde veya kullanıcı bildirimlere baktığında
  useEffect(() => {
    const handleCleared = () => {
      setCounts({ orders: 0, offers: 0, messages: 0 });
    };
    window.addEventListener("admin_notifications_cleared", handleCleared);
    return () => window.removeEventListener("admin_notifications_cleared", handleCleared);
  }, []);

  // Kullanıcı ilgili bildirim sayfasına girdiğinde o bildirimi sıfırla ve veritabanında okundu yap
  useEffect(() => {
    if (pathname.includes("/formlar")) {
      setCounts((prev) => ({ ...prev, messages: 0 }));
      fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "messages" }),
      }).catch(() => {});
    } else if (pathname.includes("/teklifler")) {
      setCounts((prev) => ({ ...prev, offers: 0 }));
      fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "offers" }),
      }).catch(() => {});
    } else if (pathname.includes("/siparisler")) {
      setCounts((prev) => ({ ...prev, orders: 0 }));
    }
  }, [pathname]);

  const groups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.roles.includes(roleKey)),
  })).filter((g) => g.items.length > 0);

  return (
    <nav aria-label="Yönetim menüsü">
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[11px] font-black uppercase tracking-wider text-zinc-800">
              {group.title}
            </p>
            <ul className="mt-2 space-y-1">
              {group.items.map((item) => {
                const href = item.href.replace(/^\/yonetim/, "/admin");
                const active =
                  pathname === item.href ||
                  pathname === href ||
                  (item.href !== "/yonetim" && pathname.startsWith(item.href)) ||
                  (href !== "/admin" && pathname.startsWith(href));
                const Icon = item.icon;

                // Kırmızı bildirim sayısı
                let badgeCount = 0;
                if ("badgeKey" in item) {
                  if (item.badgeKey === "orders") badgeCount = counts.orders;
                  if (item.badgeKey === "offers") badgeCount = counts.offers;
                  if (item.badgeKey === "messages") badgeCount = counts.messages;

                  // Kullanıcı o sayfaya baktığında yandaki kırmızı işaret hemen kaybolsun
                  if (
                    (item.badgeKey === "messages" && pathname.includes("/formlar")) ||
                    (item.badgeKey === "offers" && pathname.includes("/teklifler")) ||
                    (item.badgeKey === "orders" && pathname.includes("/siparisler"))
                  ) {
                    badgeCount = 0;
                  }
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      onClick={() => onNavigate?.()}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-black transition-all duration-150",
                        active
                          ? "bg-gradient-to-r from-[#1f7a68] to-[#176253] text-white shadow-sm shadow-[#1f7a68]/30 font-black"
                          : "text-zinc-900 hover:bg-zinc-100 hover:text-black",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-lg transition-colors duration-150",
                          active
                            ? "bg-white/20 text-white"
                            : "bg-zinc-100 text-zinc-700 group-hover:bg-[#1f7a68]/15 group-hover:text-[#1f7a68]",
                        )}
                      >
                        <Icon size={16} strokeWidth={2.4} />
                      </span>
                      <span className="min-w-0 truncate tracking-tight">{item.label}</span>

                      {/* Bildirim Rozeti */}
                      {badgeCount > 0 && (
                        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs shadow-rose-500/40 animate-pulse">
                          {badgeCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="border-t border-slate-200/80 pt-4">
          <Link
            href="/"
            target="_blank"
            onClick={() => onNavigate?.()}
            className="group flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-black text-zinc-900 hover:bg-zinc-100 hover:text-black transition"
          >
            <span className="grid size-7 place-items-center rounded-lg bg-zinc-100 text-zinc-700 group-hover:bg-[#1f7a68]/15 group-hover:text-[#1f7a68] transition">
              <PanelTop size={16} strokeWidth={2.2} />
            </span>
            <span className="tracking-tight">Mağazayı Görüntüle</span>
            <span className="ml-auto text-[11px] font-bold text-zinc-500 group-hover:text-black">↗</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
