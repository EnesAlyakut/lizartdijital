import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { calculateTotals, getCart, lineTotal } from "@/lib/cart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CouponForm } from "@/components/cart/CouponForm";
import { Breadcrumb, ButtonLink, EmptyState } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { DEFAULT_VAT_RATE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sepetim",
  description: "Sepetinizdeki dijital ürünler, lisanslar ve ek hizmetler.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const cart = await getCart();
  const totals = calculateTotals(cart);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-page py-12">
        <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Sepetim" }]} />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900">Sepetim</h1>
        <div className="mt-8">
          <EmptyState
            title="Sepetiniz henüz boş"
            description="Mağazadan bir ürün seçin veya hangi ürünün size uyduğunu bulmak için sihirbazı kullanın."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <ButtonLink href="/magaza">Mağazaya git</ButtonLink>
                <ButtonLink href="/sihirbaz" variant="outline">
                  Sihirbazı başlat
                </ButtonLink>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  // Her satır için ürünün tüm lisans ve ek hizmet seçenekleri
  const productIds = cart.items.map((i) => i.productId);
  const [licenses, productAddOns] = await Promise.all([
    prisma.productLicense.findMany({
      where: { productId: { in: productIds } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.productAddOn.findMany({
      where: { productId: { in: productIds }, addOn: { isActive: true } },
      include: { addOn: true },
    }),
  ]);

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Sepetim" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900">Sepetim</h1>
      <p className="mt-2 text-ink-500">
        {totals.itemCount} ürün · Tahmini teslim süresi {totals.estimatedDays} iş günü
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
        <div>
          <ul className="rounded-[var(--radius-card)] border border-ink-100 bg-surface px-6">
            {cart.items.map((item) => {
              const selectedIds = new Set(item.addOns.map((a) => a.addOnId));
              const itemAddOns = productAddOns
                .filter((pa) => pa.productId === item.productId)
                .map((pa) => ({
                  id: pa.addOn.id,
                  name: pa.addOn.name,
                  price: pa.addOn.price,
                  extraDays: pa.addOn.extraDays,
                  selected: selectedIds.has(pa.addOn.id),
                }));
              const extraDays = item.addOns.reduce((m, a) => Math.max(m, a.addOn.extraDays), 0);

              return (
                <CartItemRow
                  key={item.id}
                  itemId={item.id}
                  productName={item.product.name}
                  productSlug={item.product.slug}
                  categoryName={item.product.category.name}
                  coverImage={item.product.coverImage}
                  basePrice={item.product.basePrice}
                  quantity={item.quantity}
                  licenseId={item.licenseId}
                  licenses={licenses
                    .filter((l) => l.productId === item.productId)
                    .map((l) => ({ id: l.id, name: l.name, priceDelta: l.priceDelta }))}
                  addOns={itemAddOns}
                  lineTotal={lineTotal(item)}
                  deliveryDays={item.product.deliveryDays + extraDays}
                />
              );
            })}
          </ul>

          <div className="mt-6">
            <ButtonLink href="/magaza" variant="outline">
              Alışverişe devam et
            </ButtonLink>
          </div>
        </div>

        {/* Özet */}
        <aside className="lg:sticky lg:top-24 lg:h-fit" aria-label="Sipariş özeti">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            
            {/* Kart Başlığı */}
            <div className="bg-[#0f1f17] px-6 py-5">
              <h2 className="text-base font-bold text-white">Sipariş Özeti</h2>
              <p className="mt-0.5 text-xs text-white/40">
                {totals.itemCount} ürün · {totals.estimatedDays} iş günü teslimat
              </p>
            </div>

            <div className="p-6">
              {/* Fiyat Detayları */}
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Ara toplam</dt>
                  <dd className="font-semibold text-slate-900">{formatPrice(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-emerald-600 font-medium">İndirim</dt>
                    <dd className="font-bold text-emerald-600">−{formatPrice(totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-400">KDV (%{DEFAULT_VAT_RATE})</dt>
                  <dd className="font-semibold text-slate-900">{formatPrice(totals.vatTotal)}</dd>
                </div>
                <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 text-base">
                  <dt className="font-bold text-slate-900">Genel Toplam</dt>
                  <dd className="font-extrabold text-slate-900">{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              {totals.couponError && (
                <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {totals.couponError}
                </p>
              )}

              {/* Kupon */}
              <div className="mt-5 border-t border-slate-100 pt-5">
                <CouponForm activeCode={totals.couponCode} />
              </div>

              {/* Sipariş Butonları */}
              {(() => {
                const productListText = cart.items
                  .map(item => `- ${item.quantity}x ${item.product.name}`)
                  .join("\n");
                const whatsappMessage = `Merhaba, sepetimdeki ürünlerle ilgileniyorum:\n\n${productListText}\n\nFiyat ve süreç hakkında bilgi alabilir miyim?`;

                return (
                  <div className="mt-5 space-y-3">
                    {/* Güvenli Ödeme ile Satın Al — Ana Buton */}
                    <Link
                      href="/odeme"
                      className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#0f1f17] px-6 py-4 text-sm font-bold text-white transition-all duration-200 hover:bg-[#1a3327] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/10"
                    >
                      <span>🔒</span>
                      <span>Güvenli Ödeme ile Satın Al</span>
                      <span className="text-white/40 transition-transform group-hover:translate-x-1">→</span>
                    </Link>

                    {/* WhatsApp ile Sipariş */}
                    <a
                      href={whatsappLink(whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#1ebd5a] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#25D366]/20"
                    >
                      <svg viewBox="0 0 24 24" className="size-4 fill-white shrink-0">
                        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.179-.176.2-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.235-.245-.587-.494-.508-.678-.517-.176-.009-.376-.01-.577-.01-.201 0-.527.076-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.2 2.122 3.24 5.14 4.544.718.31 1.279.495 1.716.634.722.23 1.379.197 1.9.119.58-.088 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.2-.578-.35z" />
                      </svg>
                      <span>WhatsApp ile Sipariş Ver</span>
                    </a>

                    {/* İletişim Formu */}
                    <a
                      href="/iletisim"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:border-slate-300"
                    >
                      <span>📋</span>
                      <span>İletişim Formu Doldur</span>
                    </a>
                  </div>
                );
              })()}

              {/* Güvence Rozetleri */}
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                {[
                  "Uzman ekip tarafından kişisel destek",
                  "Net kapsam ve sabit fiyat teklifi",
                  "NDA ile fikir ve veri güvencesi",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="size-4 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-[#2d5a41] font-bold text-[10px]">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
