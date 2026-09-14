import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Timer } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumb } from "@/components/ui";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "İletişim & Ofisimiz",
  description: "Lizart Dijital ile iletişime geçin: telefon, e-posta, WhatsApp ve Gebze ofisimiz.",
  alternates: { canonical: `${SITE.url}/iletisim` },
};

export default function ContactPage() {
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    SITE.address
  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const googleMapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    SITE.address
  )}`;

  return (
    <div className="container-page py-8 lg:py-14">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "İletişim" }]} />

      {/* ─── SAYFA BAŞLIĞI — ÇOK ÇOK HAFİF YEŞİLLİK & FISTIK YEŞİLİ TONU ─── */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-[#d6e5d5] bg-gradient-to-b from-[#f2f7f1] via-[#f7faf6] to-[#ffffff] py-12 sm:py-16 text-center shadow-xs">
        {/* Çok hafif fıstık yeşili & adaçayı ortam ışığı */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-5%,rgba(142,207,137,0.18),transparent_65%),radial-gradient(ellipse_50%_40%_at_90%_90%,rgba(182,216,180,0.15),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-96 rounded-full bg-[#82cf7f]/10 blur-3xl"
        />

        <div className="relative px-6">
          {/* Rozet */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cfe2ce] bg-[#edf5ec]/90 px-4 py-1.5 text-xs font-semibold text-[#2b4e2f] shadow-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#82cf7f] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#468644]" />
            </span>
            <span>Lizart İletişim · Aktif Destek</span>
          </div>

          {/* Ana başlık */}
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-[1.15] tracking-tight text-ink-950 sm:text-4xl lg:text-5xl">
            Projenizi konuşalım,{" "}
            <span className="text-[#326138]">net bir yol haritası</span>{" "}
            çıkaralım.
          </h1>

          {/* Alt açıklama */}
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink-600 sm:text-base font-normal">
            Web siteleri, özel yazılımlar ve dijital büyüme çözümleri hakkında her şeyi sorabilirsiniz.
            Form, telefon veya WhatsApp üzerinden dilediğiniz an ulaşabilirsiniz.
          </p>

          {/* Aksiyon butonları */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappLink("Merhaba, web siteniz üzerinden ulaşıyorum. Projem hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#223d26] hover:bg-[#2b4c30] px-6 text-sm font-bold text-white shadow-md shadow-[#223d26]/15 transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="size-4 text-[#82cf7f]" />
              WhatsApp ile Mesaj
            </a>
            <a
              href={SITE.phoneHref}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#cfe0ce] bg-white/95 px-6 text-sm font-bold text-ink-800 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#396b40] hover:text-[#223d26]"
            >
              <Phone className="size-4 text-[#396b40]" />
              {SITE.phone}
            </a>
          </div>

          {/* Yanıt süresi */}
          <p className="mt-5 text-xs font-medium text-ink-500">
            <span className="inline-block size-2 rounded-full bg-[#82cf7f] mr-1.5 align-middle" />
            Ortalama yanıt süresi: <strong className="font-semibold text-ink-900">15 dakika</strong>
          </p>
        </div>
      </section>

      {/* ─── HIZLI İLETİŞİM ŞERİDİ ─── */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Telefon */}
        <a
          href={SITE.phoneHref}
          className="group flex items-center gap-4 rounded-2xl border border-[#dce8dc] bg-[#fbfdfb] px-5 py-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#82cf7f]/60 hover:bg-[#f4f8f3]"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ec] text-[#2d5232] transition-colors group-hover:bg-[#223d26] group-hover:text-white">
            <Phone className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Telefon</p>
            <p className="mt-0.5 text-sm font-bold text-ink-900 group-hover:text-[#223d26] transition-colors">{SITE.phone}</p>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappLink("Merhaba, web siteniz üzerinden ulaşıyorum. Bilgi almak istiyorum.")}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-[#dce8dc] bg-[#fbfdfb] px-5 py-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#82cf7f]/60 hover:bg-[#f4f8f3]"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ec] text-[#2d5232] transition-colors group-hover:bg-[#223d26] group-hover:text-white">
            <MessageCircle className="size-4.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">WhatsApp</p>
            <p className="mt-0.5 text-sm font-bold text-ink-900 group-hover:text-[#223d26] transition-colors">Mesaj Gönderin</p>
          </div>
        </a>

        {/* E-posta */}
        <a
          href={`mailto:${SITE.email}`}
          className="group flex items-center gap-4 rounded-2xl border border-[#dce8dc] bg-[#fbfdfb] px-5 py-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#82cf7f]/60 hover:bg-[#f4f8f3]"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ec] text-[#2d5232] transition-colors group-hover:bg-[#223d26] group-hover:text-white">
            <Mail className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">E-posta</p>
            <p className="mt-0.5 truncate text-sm font-bold text-ink-900 group-hover:text-[#223d26] transition-colors">{SITE.email}</p>
          </div>
        </a>

        {/* Çalışma Saatleri */}
        <div className="flex items-center gap-4 rounded-2xl border border-[#dce8dc] bg-[#fbfdfb] px-5 py-4 shadow-xs">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ec] text-[#2d5232]">
            <Timer className="size-4.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Çalışma Saatleri</p>
            <p className="mt-0.5 text-sm font-bold text-ink-900">{SITE.workingHours}</p>
          </div>
        </div>
      </div>


      {/* Form ve Harita Grid Alanı */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-14">
        {/* Sol Sütun: Modern Form */}
        <div>
          <div className="rounded-3xl border border-[#dce8dc] bg-[#fcfdfb] p-6 sm:p-9 shadow-xs">
            <div className="mb-7 border-b border-[#e2ece2] pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2d5232]">Bize Ulaşın</span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-ink-900">Bize Mesaj Gönderin</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 font-normal">
                Aşağıdaki formu doldurarak projenizin detaylarını iletin. Uzman temsilcimiz en geç 15 dakika içerisinde sizinle iletişime geçecektir.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>

        {/* Sağ Sütun: Kaliteli İnteraktif Harita & Ofis Detayları */}
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-[#dce8dc] bg-[#fcfdfb] shadow-xs">
            {/* Canlı Google Harita Görünümü */}
            <div className="relative aspect-[16/11] w-full bg-ink-100">
              <iframe
                title="Lizart Dijital Ofis Konumu"
                src={mapEmbedUrl}
                className="size-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Ofis Adres Bilgisi ve Yol Tarifi Butonları */}
            <div className="p-7">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ec] text-[#2d5232] border border-[#cfe2ce]">
                  <MapPin className="size-5 text-[#396b40]" />
                </div>
                <div>
                  <h3 className="font-bold text-ink-900 text-base">Merkez Ofisimiz</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{SITE.address}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={googleMapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#223d26] hover:bg-[#2b4c30] px-5 py-3 text-xs font-bold text-white shadow-xs transition-all hover:-translate-y-0.5"
                >
                  <MapPin className="size-4 text-[#82cf7f]" />
                  <span>Yol Tarifi Al</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#cfe0ce] bg-white px-5 py-3 text-xs font-bold text-ink-700 transition-colors hover:bg-[#f4f8f3] hover:border-[#223d26]"
                >
                  <span>Google Haritalar&apos;da Aç ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Destek & Çağrı Bilgilendirmesi */}
          <div className="rounded-3xl border border-[#d2e4d0] bg-gradient-to-br from-[#f2f7f1] via-[#f7faf6] to-[#ffffff] p-7 shadow-xs">
            <h4 className="font-bold text-ink-900 text-base flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#82cf7f] animate-pulse" />
              Birebir Görüşme &amp; Kahve
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 font-normal">
              Projenizi detaylıca yüz yüze görüşmek isterseniz ofisimizde ağırlamaktan memnuniyet duyarız.
              Öncesinde telefon veya WhatsApp üzerinden randevu oluşturmanız yeterlidir.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
