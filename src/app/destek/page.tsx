import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumb, ButtonLink, Card, SectionHeading } from "@/components/ui";
import { SITE, whatsappLink } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Destek Merkezi",
  description:
    "Kurulum rehberleri, domain ve hosting bilgileri, lisans kullanımı, güncelleme adımları ve destek talebi oluşturma.",
  alternates: { canonical: `${SITE.url}/destek` },
};

/** Bilgi bankası içeriği. Yönetim panelinden düzenlenebilir sayfalara ek olarak
 *  sık ihtiyaç duyulan adım adım rehberler burada tutulur. */
const GUIDES = [
  {
    id: "kurulum",
    title: "Kurulum rehberi",
    intro:
      "Satın aldığınız ürünü kendi sunucunuza kurmak için izlemeniz gereken adımlar. Kurulumu bizim yapmamızı isterseniz sepete “Profesyonel kurulum” hizmetini ekleyebilirsiniz.",
    steps: [
      "Hesabım > İndirmelerim bölümünden kurulum paketini indirin.",
      "Hosting panelinizde ürünün gerektirdiği sürüm ayarlarını yapın (ürün sayfasındaki teknik gereksinimlere bakın).",
      "Paketi sunucunuza yükleyip arşivi açın.",
      "Veritabanı oluşturun ve kurulum sihirbazını çalıştırın.",
      "Lisans anahtarınızı girin ve alan adınızı Hesabım > Lisanslarım bölümünden tanımlayın.",
      "Yönetim paneline girip içeriklerinizi ekleyin.",
    ],
  },
  {
    id: "domain",
    title: "Domain ve hosting rehberi",
    intro:
      "Alan adınızı sunucunuza yönlendirmek ve SSL sertifikası kurmak için genel adımlar. Sağlayıcınıza göre arayüz farklılık gösterebilir.",
    steps: [
      "Alan adı panelinizde DNS ayarlarına girin.",
      "A kaydını hosting sağlayıcınızın verdiği IP adresine yönlendirin.",
      "www için CNAME kaydı tanımlayın.",
      "DNS değişikliklerinin yayılması için 1–24 saat bekleyin.",
      "Hosting panelinizden ücretsiz SSL sertifikasını etkinleştirin.",
      "Sitenizi https adresiyle açarak sertifikayı doğrulayın.",
    ],
  },
  {
    id: "lisans",
    title: "Lisans kullanımı",
    intro:
      "Lisans anahtarınız satın aldığınız ürünü kullanma hakkınızı belgeler. Lisans türüne göre kullanabileceğiniz domain sayısı değişir.",
    steps: [
      "Lisans anahtarınızı Hesabım > Lisanslarım bölümünde bulun.",
      "Kurulum sırasında istenen alana anahtarı girin.",
      "Kullandığınız alan adını Lisanslarım bölümünden tanımlayın.",
      "Domain değişikliğinde eski domaini kaldırıp yenisini ekleyin.",
      "Lisans koşullarının ayrıntısı için lisans sözleşmesini inceleyin.",
    ],
  },
  {
    id: "guncelleme",
    title: "Güncelleme rehberi",
    intro:
      "Yeni sürümler yayınlandığında Hesabım > Güncellemeler bölümünde listelenir. Güncelleme öncesinde mutlaka yedek alın.",
    steps: [
      "Mevcut kurulumunuzun ve veritabanınızın yedeğini alın.",
      "Hesabım > İndirmelerim bölümünden yeni sürümü indirin.",
      "Değişiklik notlarını okuyup özelleştirmelerinizi kontrol edin.",
      "Dosyaları güncelleyin ve varsa veritabanı güncelleme adımını çalıştırın.",
      "Siteyi test edin; sorun yaşarsanız yedekten geri dönebilirsiniz.",
    ],
  },
  {
    id: "dosya",
    title: "Dosya gönderme rehberi",
    intro:
      "Logo, içerik veya erişim bilgilerinizi güvenli şekilde iletmek için destek talebi kanalını kullanın. Şifrelerinizi e-posta ile göndermemenizi öneririz.",
    steps: [
      "Hesabım > Destek Taleplerim bölümünden yeni talep açın.",
      "Kategori olarak “Kurulum” seçin.",
      "Dosyalarınızı paylaşacağınız güvenli bağlantıyı talebe ekleyin.",
      "Hosting erişimi gerekiyorsa geçici bir kullanıcı oluşturun.",
      "Kurulum tamamlandığında geçici erişimi kapatın.",
    ],
  },
];

export default async function SupportCenterPage() {
  const faqs = await prisma.faq.findMany({
    where: { productId: null, category: { in: ["kurulum", "indirme", "guncelleme", "destek"] } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Destek Merkezi" }]} />

      <div className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Destek Merkezi</h1>
        <p className="mt-3 leading-relaxed text-ink-500">
          Kurulumdan güncellemeye kadar en sık ihtiyaç duyulan rehberler. Aradığınızı bulamazsanız destek
          talebi oluşturabilir veya WhatsApp&apos;tan yazabilirsiniz.
        </p>
      </div>

      {/* Hızlı erişim */}
      <nav aria-label="Rehber kısayolları" className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
        {GUIDES.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="whitespace-nowrap rounded-full border border-ink-200 bg-surface px-4 py-2 text-sm font-medium text-ink-700 hover:border-ink-400"
          >
            {g.title}
          </a>
        ))}
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
        <div className="space-y-10">
          {GUIDES.map((guide) => (
            <section key={guide.id} id={guide.id} className="scroll-mt-28">
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">{guide.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-600">{guide.intro}</p>
              <ol className="mt-4 space-y-3">
                {guide.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 rounded-2xl border border-ink-100 bg-surface p-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink-900 text-xs font-semibold text-canvas">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-ink-700">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}

          <section>
            <SectionHeading eyebrow="Sık sorulanlar" title="Destek konularında sık sorulanlar" />
            <Accordion
              className="mt-5"
              items={faqs.map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
            />
            <p className="mt-4 text-sm text-ink-500">
              Tüm sorular için{" "}
              <Link href="/sss" className="text-brand-700 underline">
                SSS sayfasına
              </Link>{" "}
              göz atabilirsiniz.
            </p>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <Card className="p-6">
            <h2 className="font-semibold text-ink-900">Destek talebi oluşturun</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Talepleriniz hesabınız üzerinden takip edilir; yanıtlar aynı ekranda görünür.
            </p>
            <ButtonLink href="/hesabim/destek" className="mt-4 w-full" size="sm">
              Talep oluştur
            </ButtonLink>
            <a
              href={whatsappLink("Merhaba, teknik destek almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block rounded-full border border-ink-200 px-4 py-2.5 text-center text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              WhatsApp desteği
            </a>
            <p className="mt-4 text-xs text-ink-500">{SITE.workingHours}</p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-ink-900">Video eğitimler</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Her ürünün kurulum videosu, satın alma sonrası indirme paketiyle birlikte gelir. Ürünün
              dokümantasyon klasöründe bulabilirsiniz.
            </p>
            <ButtonLink href="/hesabim/indirmelerim" variant="outline" size="sm" className="mt-4 w-full">
              İndirmelerime git
            </ButtonLink>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-ink-900">Yasal metinler</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/kurumsal/lisans-sozlesmesi" className="text-brand-700 hover:underline">
                  Lisans sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/kurumsal/dijital-urun-teslimat-politikasi" className="text-brand-700 hover:underline">
                  Dijital ürün teslimat politikası
                </Link>
              </li>
              <li>
                <Link href="/kurumsal/iptal-ve-iade-politikasi" className="text-brand-700 hover:underline">
                  İptal ve iade politikası
                </Link>
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
