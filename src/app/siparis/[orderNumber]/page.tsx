import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DownloadButton } from "@/components/order/DownloadButton";
import { Badge, Breadcrumb, ButtonLink, Card } from "@/components/ui";
import { ORDER_STATUS_LABELS, PROJECT_STAGES, SITE, whatsappLink } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sipariş özeti",
  robots: { index: false, follow: false },
};

export default async function OrderResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ durum?: string }>;
}) {
  const { orderNumber } = await params;
  const { durum } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          addOns: true,
          product: { select: { name: true, slug: true, coverImage: true, type: true } },
        },
      },
      invoices: true,
      licenseKeys: { include: { product: { select: { name: true } } } },
      downloads: { include: { file: { include: { product: { select: { name: true } } } } } },
      projects: { include: { stages: { orderBy: { sortOrder: "asc" } } } },
      payments: true,
    },
  });
  if (!order) notFound();

  const paid = order.status !== "bekliyor" && order.status !== "iptal";
  const failed = durum === "basarisiz";

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: `Sipariş ${order.orderNumber}` }]} />

      {/* Durum başlığı */}
      <div
        className={`mt-6 rounded-[2rem] border p-8 sm:p-10 ${
          failed
            ? "border-[color:var(--color-accent-sale)] bg-[color:var(--color-accent-sale)]/10"
            : paid
              ? "border-brand-200 bg-brand-50"
              : "border-ink-200 bg-surface"
        }`}
      >
        <p className="text-sm font-medium text-ink-500">Sipariş numarası</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-900">{order.orderNumber}</p>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          {failed
            ? "Ödeme tamamlanamadı"
            : paid
              ? "Siparişiniz Alındı — Sizinle İletişime Geçeceğiz"
              : "Siparişiniz Oluşturuldu — Sizinle İletişime Geçeceğiz"}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-600">
          {failed
            ? "Ödeme sırasında bir sorun oluştu ve tutar tahsil edilmedi. Dilerseniz tekrar deneyebilir veya havale/EFT ile ödeyebilirsiniz."
            : "Bilgileriniz yetkili müşteri temsilcimize başarıyla iletildi. Ekibimiz siparişinizi inceleyip verdiğiniz telefon numarası veya WhatsApp üzerinden sizi arayacak/mesaj atarak teslimat ve kurulum detaylarını sizinle birlikte tamamlayacaktır."}
        </p>

        {/* Bilgilendirme Kartı */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-300 bg-brand-100/50 p-4 text-sm text-brand-900">
          <span className="text-xl">📞</span>
          <div>
            <p className="font-semibold">Biz Sizi Arayacağız</p>
            <p className="mt-0.5 text-xs text-brand-800 leading-relaxed">
              Herhangi bir hesap açma veya panel takibi yapmanıza gerek yoktur. Siparişinizle ilgili tüm aşamalarda doğrudan telefon veya mesaj yoluyla bilgilendirileceksiniz.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge tone={paid ? "brand" : failed ? "sale" : "neutral"}>
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </Badge>
          <span className="text-sm text-ink-500">{formatDate(order.createdAt)}</span>
        </div>

        {failed && (
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/sepet">Sepete dön</ButtonLink>
            <ButtonLink href="/iletisim" variant="outline">
              Destek ekibine yaz
            </ButtonLink>
          </div>
        )}
        {!paid && !failed && (
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={`/siparis/${order.orderNumber}/havale`}>Havale bilgilerini gör</ButtonLink>
            <ButtonLink href="/iletisim" variant="outline">Bize Ulaşın</ButtonLink>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-10">
        <div className="space-y-8">
          {/* Satın alınan ürünler */}
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink-900">Satın alınan ürünler</h2>
            <ul className="mt-4 space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-5">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <Link href={`/urun/${item.product.slug}`} className="font-semibold text-ink-900 hover:text-brand-700">
                        {item.productName}
                      </Link>
                      <p className="mt-0.5 text-sm text-ink-500">{item.licenseName}</p>
                    </div>
                    <p className="font-semibold text-ink-900">{formatPrice(item.lineTotal)}</p>
                  </div>
                  {item.addOns.length > 0 && (
                    <ul className="mt-3 space-y-1 border-t border-ink-100 pt-3 text-sm text-ink-600">
                      {item.addOns.map((a) => (
                        <li key={a.id} className="flex justify-between gap-3">
                          <span>+ {a.name}</span>
                          <span>{formatPrice(a.price)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Lisans anahtarları */}
          {paid && order.licenseKeys.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">Lisans anahtarlarınız</h2>
              <ul className="mt-4 space-y-3">
                {order.licenseKeys.map((k) => (
                  <li key={k.id} className="rounded-2xl border border-ink-100 bg-surface p-5">
                    <p className="text-sm text-ink-500">{k.product.name}</p>
                    <p className="mt-1.5 select-all font-mono text-sm font-semibold tracking-wide text-ink-900">
                      {k.key}
                    </p>
                    <p className="mt-2 text-xs text-ink-500">
                      {k.domainLimit >= 999 ? "Sınırsız domain" : `${k.domainLimit} domain`} ·
                      {k.validUntil ? ` güncelleme erişimi ${formatDate(k.validUntil)} tarihine kadar` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* İndirmeler */}
          {paid && order.downloads.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">İndirmeler</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                İndirme bağlantıları süreli ve imzalıdır; dosyalar herkese açık adreslerde tutulmaz. Her
                indirme işlemi kayıt altına alınır.
              </p>
              <ul className="mt-4 space-y-3">
                {order.downloads.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-surface p-5"
                  >
                    <div>
                      <p className="font-medium text-ink-900">{d.file.label}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {(d.file.sizeBytes / 1024).toFixed(1)} KB · kalan hak {d.maxCount - d.usedCount}/
                        {d.maxCount} · son kullanma {formatDate(d.expiresAt)}
                      </p>
                    </div>
                    <DownloadButton downloadId={d.id} disabled={d.usedCount >= d.maxCount} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Proje takibi */}
          {order.projects.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">Proje süreci</h2>
              <p className="mt-2 text-sm text-ink-500">
                Kurulum ve hizmet içeren siparişinizin aşamalarını buradan izleyebilirsiniz.
              </p>
              {order.projects.map((project) => (
                <ol key={project.id} className="mt-4 space-y-0">
                  {(project.stages.length > 0 ? project.stages : PROJECT_STAGES.map((s, i) => ({ id: s.key, key: s.key, name: s.name, sortOrder: i, completedAt: null, note: null }))).map(
                    (stage, i, arr) => {
                      const done = Boolean(stage.completedAt);
                      const current = project.currentStage === stage.key;
                      return (
                        <li key={stage.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <span
                              className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                                done
                                  ? "bg-brand-500 text-canvas"
                                  : current
                                    ? "border-2 border-brand-600 bg-surface text-brand-700"
                                    : "border border-ink-200 bg-surface text-ink-400"
                              }`}
                            >
                              {done ? "✓" : i + 1}
                            </span>
                            {i < arr.length - 1 && <span className="my-1 w-px flex-1 bg-ink-200" />}
                          </div>
                          <div className="pb-6">
                            <p className={`font-medium ${done || current ? "text-ink-900" : "text-ink-400"}`}>
                              {stage.name}
                            </p>
                            {stage.completedAt && (
                              <p className="mt-0.5 text-xs text-ink-500">{formatDate(stage.completedAt)}</p>
                            )}
                          </div>
                        </li>
                      );
                    },
                  )}
                </ol>
              ))}
              <ButtonLink
                href={whatsappLink(`Merhaba, ${order.orderNumber} numaralı siparişim hakkında görüşmek istiyorum.`)}
                variant="outline"
                size="sm"
                className="mt-2"
                target="_blank"
              >
                WhatsApp&apos;tan bilgi al
              </ButtonLink>
            </section>
          )}
        </div>

        {/* Özet */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <Card className="p-6">
            <h2 className="font-semibold text-ink-900">Ödeme özeti</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Ara toplam</dt>
                <dd className="text-ink-900">{formatPrice(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-brand-700">
                  <dt>İndirim</dt>
                  <dd>−{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-500">KDV</dt>
                <dd className="text-ink-900">{formatPrice(order.vatTotal)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-3 font-semibold text-ink-900">
                <dt>Toplam</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>

            {order.invoices.length > 0 && (
              <p className="mt-4 border-t border-ink-100 pt-4 text-sm text-ink-600">
                Fatura no: <strong className="text-ink-900">{order.invoices[0].number}</strong>
                <br />
                <span className="text-xs text-ink-500">
                  E-fatura/e-arşiv belgeniz e-posta adresinize gönderilir.
                </span>
              </p>
            )}

            <p className="mt-4 text-sm text-ink-600">
              Tahmini teslim: <strong className="text-ink-900">{order.estimatedDays} iş günü</strong>
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-ink-900">Yardıma mı ihtiyacınız var?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Kurulum, lisans veya indirme ile ilgili sorularınız için destek ekibimize ulaşın.
            </p>
            <ButtonLink href="/destek" className="mt-4 w-full" size="sm" variant="outline">
              Destek Merkezi
            </ButtonLink>
            <a
              href={whatsappLink(`Merhaba, ${order.orderNumber} numaralı siparişim hakkında yardım almak istiyorum.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block rounded-full bg-brand-500 px-4 py-2.5 text-center text-sm font-semibold text-canvas hover:bg-brand-400"
            >
              WhatsApp&apos;tan yaz
            </a>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-ink-900">Kurulum dokümanları</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/destek#kurulum" className="text-brand-700 hover:underline">
                  Kurulum rehberi
                </Link>
              </li>
              <li>
                <Link href="/destek#domain" className="text-brand-700 hover:underline">
                  Domain ve hosting rehberi
                </Link>
              </li>
              <li>
                <Link href="/kurumsal/lisans-sozlesmesi" className="text-brand-700 hover:underline">
                  Lisans kullanımı
                </Link>
              </li>
              <li>
                <Link href="/destek#guncelleme" className="text-brand-700 hover:underline">
                  Güncelleme rehberi
                </Link>
              </li>
            </ul>
          </Card>

          <p className="text-center text-xs text-ink-400">
            Bu sayfayı yer imlerinize ekleyebilirsiniz: {SITE.url}/siparis/{order.orderNumber}
          </p>
        </aside>
      </div>
    </div>
  );
}
