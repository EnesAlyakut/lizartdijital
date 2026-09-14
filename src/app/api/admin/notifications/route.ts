import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [orders, offers, messages, unreadOrdersCount, newOffersCount, unreadMessagesCount] =
    await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          items: { select: { productName: true, licenseName: true }, take: 2 },
        },
      }),
      prisma.offer.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.order.count({ where: { status: "bekliyor" } }),
      prisma.offer.count({ where: { status: "yeni" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

  const totalUnread = unreadOrdersCount + newOffersCount + unreadMessagesCount;

  const notifications = [
    ...orders.map((o) => ({
      id: `order_${o.id}`,
      type: "order" as const,
      title: `Yeni Sipariş #${o.orderNumber}`,
      sender: o.fullName,
      company: o.companyName,
      details:
        o.items.map((i) => i.productName).join(", ") || "Web Sitesi / Hizmet Paketi",
      meta: `${o.total.toLocaleString("tr-TR")} ₺`,
      status: o.status,
      isUnread: o.status === "bekliyor",
      href: `/admin/siparisler/${o.id}`,
      createdAt: o.createdAt.toISOString(),
    })),
    ...offers.map((off) => ({
      id: `offer_${off.id}`,
      type: "offer" as const,
      title: `Teklif Talebi #${off.code}`,
      sender: off.fullName,
      company: off.company,
      details: off.message
        ? off.message.slice(0, 90) + (off.message.length > 90 ? "..." : "")
        : "Özel Proje Teklif Talebi",
      meta: off.budget || "Bütçe belirtilmedi",
      status: off.status,
      isUnread: off.status === "yeni",
      href: `/admin/teklifler/${off.id}`,
      createdAt: off.createdAt.toISOString(),
    })),
    ...messages.map((m) => ({
      id: `msg_${m.id}`,
      type: "message" as const,
      title: `Form Mesajı: ${m.subject}`,
      sender: m.fullName,
      company: null,
      details: m.body.slice(0, 90) + (m.body.length > 90 ? "..." : ""),
      meta: m.department,
      status: m.isRead ? "okundu" : "yeni",
      isUnread: !m.isRead,
      href: `/admin/formlar`,
      createdAt: m.createdAt.toISOString(),
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    ok: true,
    totalUnread,
    counts: {
      orders: unreadOrdersCount,
      offers: newOffersCount,
      messages: unreadMessagesCount,
    },
    notifications: notifications.slice(0, 20),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const type = body.type || "all";

    if (type === "messages" || type === "all") {
      await prisma.contactMessage.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
    }

    if (type === "offers" || type === "all") {
      await prisma.offer.updateMany({
        where: { status: "yeni" },
        data: { status: "incelemede" },
      });
    }

    return NextResponse.json({ ok: true, message: "Bildirimler okundu olarak işaretlendi." });
  } catch (err) {
    console.error("Bildirimler işaretlenirken hata:", err);
    return NextResponse.json({ ok: false, error: "İşlem başarısız" }, { status: 500 });
  }
}
