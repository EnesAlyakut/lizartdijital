import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { MockPaymentProvider } from "@/lib/providers";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ödeme simülasyonu",
  robots: { index: false, follow: false },
};

/**
 * GELİŞTİRME ORTAMI SAYFASI.
 * Gerçek sağlayıcıda kullanıcı bankanın 3D Secure sayfasına yönlendirilir.
 * Burada aynı akış taklit edilir: onay verildiğinde imzalı bir webhook
 * gönderilir ve sipariş ancak o bildirim doğrulandıktan sonra ödendi sayılır.
 */
export default async function PaymentSimulationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; orderId?: string; amount?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  if (process.env.PAYMENT_PROVIDER && process.env.PAYMENT_PROVIDER !== "mock") notFound();

  const { ref, orderId } = await searchParams;
  if (!ref || !orderId) notFound();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) notFound();

  async function complete(formData: FormData) {
    "use server";
    if (process.env.NODE_ENV === "production") notFound();
    const outcome = formData.get("sonuc") === "basarili" ? "basarili" : "basarisiz";
    const provider = new MockPaymentProvider();
    const body = {
      ref: String(formData.get("ref")),
      orderId: String(formData.get("orderId")),
      amount: Number(formData.get("amount")),
      status: outcome,
      installment: 1,
    };
    const signature = provider.sign(body as unknown as Record<string, unknown>);

    // Gerçek hayatta bu isteği sağlayıcı gönderir; burada aynı uç nokta kullanılır.
    // Origin istek başlıklarından türetilir; böylece farklı portlarda da çalışır.
    const headerList = await headers();
    const host = headerList.get("host") ?? new URL(SITE.url).host;
    const proto = headerList.get("x-forwarded-proto") ?? "http";
    const response = await fetch(`${proto}://${host}/api/odeme/webhook`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-lizart-signature": signature },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const orderNumber = String(formData.get("orderNumber"));
    if (!response.ok || outcome === "basarisiz") {
      redirect(`/siparis/${orderNumber}?durum=basarisiz`);
    }
    redirect(`/siparis/${orderNumber}`);
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-[var(--radius-card)] border border-ink-200 bg-surface p-8 shadow-[var(--shadow-card)]">
        <p className="rounded-xl bg-[color:var(--color-accent-warn)]/10 px-4 py-3 text-xs leading-relaxed text-[color:var(--color-accent-warn)]">
          <strong>Geliştirme ortamı.</strong> Bu sayfa gerçek bir ödeme almaz; kart bilgisi istemez. Gerçek
          kurulumda burada bankanın 3D Secure ekranı açılır.
        </p>

        <h1 className="mt-6 text-xl font-semibold tracking-tight text-ink-900">Ödeme onayı</h1>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">Sipariş</dt>
            <dd className="font-medium text-ink-900">{order.orderNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Tutar</dt>
            <dd className="font-semibold text-ink-900">{formatPrice(order.total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">İşlem no</dt>
            <dd className="font-mono text-xs text-ink-600">{ref}</dd>
          </div>
        </dl>

        <form action={complete} className="mt-8 space-y-3">
          <input type="hidden" name="ref" value={ref} />
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="orderNumber" value={order.orderNumber} />
          <input type="hidden" name="amount" value={order.total} />

          <button
            type="submit"
            name="sonuc"
            value="basarili"
            className="h-12 w-full rounded-full bg-brand-500 font-semibold text-canvas transition-colors hover:bg-brand-400"
          >
            Ödemeyi onayla (başarılı)
          </button>
          <button
            type="submit"
            name="sonuc"
            value="basarisiz"
            className="h-12 w-full rounded-full border border-ink-200 font-medium text-ink-700 transition-colors hover:bg-ink-50"
          >
            Ödemeyi reddet (başarısız)
          </button>
        </form>
      </div>
    </div>
  );
}
