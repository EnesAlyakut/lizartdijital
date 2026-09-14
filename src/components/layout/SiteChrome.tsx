"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

type Announcement = { text: string; href: string } | null;

export function SiteChrome({
  announcement,
  cartCount,
}: {
  announcement: Announcement;
  cartCount: number;
}) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/yonetim" || pathname.startsWith("/yonetim/");

  if (isAdmin) return null;

  return (
    <>
      {announcement && <AnnouncementBar text={announcement.text} href={announcement.href} />}
      <Header cartCount={cartCount} />
    </>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/yonetim" || pathname.startsWith("/yonetim/");

  if (isAdmin) return null;

  return (
    <>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
