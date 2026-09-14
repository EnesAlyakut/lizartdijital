import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentProvider } from "@/lib/providers";
import { fulfillOrder } from "@/lib/actions/checkout";
import { getMailProvider } from "@/lib/providers";
import { SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

/**
 * Ödeme sağlayıcısı bildirimi (webhook).
 *
 * Ödeme durumu YALNIZCA burada, imzası doğrulanmış bildirime göre belirlenir.
 * Tarayıcıdan gelen "başarılı" bilgisine asla güvenilmez.
 *
 * Gerçek sağlayıcıya geçiş: provider.verify() içinde sağlayıcının imza
 * doğrulama yöntemi uygulanır; bu dosyada değişiklik gerekmez.
 */
export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz gövde" }, { status: 400 });
  }

  const signature =
    request.headers.get("x-lizart-signature") ?? request.headers.get("x-signature");

  try {
    const provider = getPaymentProvider();
    const result = await provider.verify(payload, signature);

    const order = await prisma.order.findUnique({
      where: { id: result.orderId },
      include: { payments: true },
    });
    if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });

    // Tutar uyuşmazlığı: ödeme kabul edilmez.
    if (result.amount !== order.total) {
      await prisma.payment.updateMany({
        where: { orderId: order.id, providerRef: result.providerRef },
        data: { status: "basarisiz", rawEvent: JSON.stringify({ reason: "tutar-uyusmazligi" }) },
      });
      return NextResponse.json({ error: "Tutar uyuşmuyor" }, { status: 409 });
    }

    if (result.status !== "basarili") {
      await prisma.payment.updateMany({
        where: { orderId: order.id, providerRef: result.providerRef },
        data: { status: "basarisiz", rawEvent: JSON.stringify(result.rawEvent) },
      });
      return NextResponse.json({ ok: true, status: "basarisiz" });
    }

    // Aynı bildirim tekrar gelirse fulfillOrder içinde tekrar işlem yapılmaz.
    await fulfillOrder(order.id, result.providerRef);

    await getMailProvider().send({
      to: order.email,
      subject: `Siparişiniz alındı — ${order.orderNumber}`,
      html: `
        <p>Merhaba ${escapeHtml(order.fullName)},</p>
        <p><strong>${order.orderNumber}</strong> numaralı siparişiniz için ödemeniz alındı.</p>
        <p>Toplam tutar: <strong>${formatPrice(order.total)}</strong></p>
        <p>Lisans anahtarınıza ve indirme bağlantılarınıza aşağıdaki adresten ulaşabilirsiniz:</p>
        <p><a href="${SITE.url}/siparis/${order.orderNumber}">Sipariş detayını görüntüle</a></p>
      `,
    });

    return NextResponse.json({ ok: true, status: "basarili" });
  } catch (error) {
    // Hassas bilgi loglanmaz; yalnızca hata mesajı kaydedilir.
    console.error("[odeme:webhook]", error instanceof Error ? error.message : "bilinmeyen hata");
    return NextResponse.json({ error: "Doğrulama başarısız" }, { status: 400 });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
