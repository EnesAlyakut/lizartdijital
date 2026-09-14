import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { calculateTotals, getCart } from "@/lib/cart";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumb } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { DEFAULT_VAT_RATE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Güvenli ödeme",
  description: "Sipariş bilgilerinizi girin ve ödemeyi güvenle tamamlayın.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  if (process.env.NODE_ENV === "production" && process.env.CHECKOUT_ENABLED !== "true") {
    return (
      <div className="container-page py-16">
        <h1 className="text-3xl font-semibold text-ink-900">Sipariş için bize ulaşın</h1>
        <p className="mt-4 text-ink-500">Online ödeme henüz açılmadı. Seçtiğiniz ürün ve hizmetler için ekibimizle iletişime geçebilirsiniz.</p>
        <Link href="/iletisim" className="mt-6 inline-block text-brand-500 underline">İletişime geç</Link>
      </div>
    );
  }
  const { hata } = await searchParams;
  const cart = await getCart();
  if (!cart || cart.items.length === 0) redirect("/sepet");

  const totals = calculateTotals(cart);

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb
        items={[{ label: "Ana Sayfa", href: "/" }, { label: "Sepetim", href: "/sepet" }, { label: "Ödeme" }]}
      />

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900">Güvenli ödeme</h1>
      <p className="mt-2 text-ink-500">
        Fatura bilgilerinizi girin ve ödeme yöntemini seçin. Kart bilgileriniz sistemimizde saklanmaz.
      </p>

      {hata && (
        <p role="alert" className="mt-6 rounded-2xl border border-[color:var(--color-accent-sale)] bg-[color:var(--color-accent-sale)]/10 px-5 py-4 text-sm text-[color:var(--color-accent-sale)]">
          {hata}
        </p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
        <CheckoutForm />

        {/* Sipariş özeti */}
        <aside className="lg:sticky lg:top-24 lg:h-fit" aria-label="Sipariş özeti">
          <div className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
            <h2 className="text-lg font-semibold text-ink-900">Sipariş özeti</h2>

            <ul className="mt-4 space-y-4 border-b border-ink-100 pb-4">
              {cart.items.map((item) => {
                const addOns = item.addOns.map((a) => a.addOn.name);
                return (
                  <li key={item.id} className="text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="font-medium text-ink-900">
                        {item.product.name}
                        {item.quantity > 1 && ` × ${item.quantity}`}
                      </span>
                      <span className="shrink-0 text-ink-700">
                        {formatPrice((item.product.basePrice + item.license.priceDelta) * item.quantity)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">{item.license.name}</p>
                    {addOns.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 text-xs text-ink-500">
                        {item.addOns.map((a) => (
                          <li key={a.addOnId} className="flex justify-between gap-3">
                            <span>+ {a.addOn.name}</span>
                            <span>{formatPrice(a.addOn.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Ara toplam</dt>
                <dd className="text-ink-900">{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-brand-700">
                  <dt>İndirim {totals.couponCode && `(${totals.couponCode})`}</dt>
                  <dd>−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-500">KDV (%{DEFAULT_VAT_RATE})</dt>
                <dd className="text-ink-900">{formatPrice(totals.vatTotal)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-3 text-base font-semibold text-ink-900">
                <dt>Ödenecek tutar</dt>
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-xs leading-relaxed text-ink-500">
              Tahmini teslim süresi: <strong className="text-ink-800">{totals.estimatedDays} iş günü</strong>.
              Yalnızca dosya teslimi olan ürünler ödeme onayının hemen ardından teslim edilir.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-ink-500">
              <li>🔒 Ödeme lisanslı ödeme kuruluşu üzerinden alınır</li>
              <li>🔒 Kart bilgileri sunucularımıza gelmez</li>
              <li>🔒 Bağlantı SSL ile şifrelenir</li>
            </ul>

            <p className="mt-4 text-xs text-ink-400">
              <Link href="/sepet" className="underline hover:text-ink-700">
                Sepeti düzenle
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
