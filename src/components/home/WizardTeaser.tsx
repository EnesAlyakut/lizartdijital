import { ButtonLink, SectionHeading } from "@/components/ui";

const WIZARD_STEPS = [
  { q: "Neye ihtiyacınız var?", a: "Web sitesi, uygulama, sistem veya hizmet" },
  { q: "Hangi sektördesiniz?", a: "15 sektör seçeneği" },
  { q: "Hangi özellikler gerekli?", a: "E-ticaret, randevu, çoklu dil, ödeme…" },
  { q: "Bütçeniz ve süreniz?", a: "Size uygun ürünleri listeleyelim" },
];

/** İhtiyaca göre ürün bulma sihirbazının ana sayfadaki tanıtımı. */
export function WizardTeaser() {
  return (
    <section className="container-page py-14 lg:py-20">
      <div className="grid gap-10 rounded-[2rem] border border-ink-100 bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:p-14">
        <div>
          <SectionHeading
            eyebrow="Ürün bulma sihirbazı"
            title="Hangi ürünün size uyduğunu bilmiyor musunuz?"
            description="Dört kısa adımda ihtiyacınızı anlatın; size uygun ürünleri ve tahmini fiyatı gösterelim. Hazır ürün uymuyorsa özel teklif için yönlendirelim."
          />
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/sihirbaz" size="lg">
              Sihirbazı başlat
            </ButtonLink>
            <ButtonLink href="/teklif" variant="outline" size="lg">
              Doğrudan teklif iste
            </ButtonLink>
          </div>
        </div>

        <ol className="space-y-3">
          {WIZARD_STEPS.map((step, i) => (
            <li
              key={step.q}
              className="flex items-start gap-4 rounded-2xl border border-ink-100 bg-surface-2 p-5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-ink-900">{step.q}</p>
                <p className="mt-1 text-sm text-ink-500">{step.a}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
