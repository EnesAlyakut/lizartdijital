import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";

const serviceLinks = [
  { label: "Web Sitesi Kurulumu", href: "/hizmetler/web-sitesi-kurulumu" },
  { label: "E-Ticaret Çözümleri", href: "/hizmetler/eticaret-cozumleri" },
  { label: "Özel Yazılım Geliştirme", href: "/hizmetler/ozel-yazilim-gelistirme" },
  { label: "Mobil Uygulama", href: "/hizmetler/mobil-uygulama-gelistirme" },
  { label: "SEO & Arama Optimizasyonu", href: "/hizmetler/seo-hizmetleri" },
  { label: "Kurumsal Kimlik & Tasarım", href: "/hizmetler/kurumsal-kimlik" },
];

const solutionLinks = [
  { label: "Hazır Web Paketleri", href: "/magaza/hazir-web-siteleri" },
  { label: "Kurumsal Web Siteleri", href: "/magaza/kurumsal" },
  { label: "E-Ticaret Sistemleri", href: "/magaza/hazir-sistemler" },
  { label: "Mobil Uygulamalar", href: "/magaza/mobil-uygulamalar" },
  { label: "Canlı Demo Merkezi", href: "/demo-merkezi" },
  { label: "Proje Teklif Sihirbazı", href: "/teklif" },
];

const companyLinks = [
  { label: "Şirket Profili", href: "/hakkimizda" },
  { label: "Sürdürülebilirlik & Kalite", href: "/kurumsal/gizlilik-politikasi" },
  { label: "Hizmet Yaklaşımımız", href: "/hizmetler" },
  { label: "Portfolyo & Referanslar", href: "/projeler" },
  { label: "Bilgi Merkezi & Blog", href: "/blog" },
  { label: "Sıkça Sorulanlar", href: "/sss" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[#1e3d2f] bg-gradient-to-b from-[#12281e] to-[#0a1711] text-white">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-16">
          <div className="space-y-6 lg:max-w-xl">
            <Link href="/" className="inline-block group py-1" aria-label="Lizart Dijital">
              <Image
                src="/logo-white.svg"
                alt="Lizart Dijital Logo"
                width={200}
                height={58}
                priority
                className="h-14 sm:h-16 w-auto object-contain opacity-95 transition-all group-hover:opacity-100 group-hover:scale-[1.02]"
              />
            </Link>
            <p className="text-base sm:text-lg leading-relaxed text-white font-normal max-w-xl">
              Özel web yazılımlarından e-ticaret altyapılarına, mobil uygulamalardan kurumsal sistemlere kadar geniş portföyümüzle bireysel ve kurumsal dijital çözümler sunuyoruz.
            </p>
          </div>

          <div className="lg:w-[420px] rounded-3xl border border-[#2a4d3a] bg-[#0d2117]/50 p-7 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col space-y-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5c8a6f] flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Doğrudan İletişim
              </span>
              
              <a
                href={SITE.phoneHref}
                className="text-3xl sm:text-4xl font-semibold tracking-tight text-white hover:text-emerald-300 transition-colors"
              >
                {SITE.phone}
              </a>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={whatsappLink("Merhaba, web siteniz üzerinden ulaşıyorum. Bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1e3d2f] hover:bg-[#2a4d3a] border border-[#3b5e4c] px-4 py-2 text-[13px] font-semibold text-white transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="size-4 text-emerald-400" />
                  WhatsApp
                </a>
                
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#1e3d2f] bg-transparent hover:bg-[#1e3d2f] px-4 py-2 text-[13px] font-medium text-[#9fb8a9] hover:text-white transition-all"
                >
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Orta Bölüm: Menüler */}
        <div className="border-t border-[#1e3d2f] pt-16 pb-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5c8a6f]">
                Hizmetlerimiz
              </h4>
              <ul className="space-y-3 text-[13px] font-medium text-[#9fb8a9]">
                {serviceLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-emerald-300 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5c8a6f]">
                Çözümler & Mağaza
              </h4>
              <ul className="space-y-3 text-[13px] font-medium text-[#9fb8a9]">
                {solutionLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-emerald-300 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#5c8a6f]">
                Kurumsal
              </h4>
              <ul className="space-y-3 text-[13px] font-medium text-[#9fb8a9]">
                {companyLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-emerald-300 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Alt Bölüm: Telif ve Yasal Linkler */}
        <div className="border-t border-[#1e3d2f] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-[11px] font-medium text-[#7a9988]">
            <span>© {new Date().getFullYear()} LİZART DİJİTAL A.Ş.</span>
            <span className="hidden md:inline text-[#3b5e4c]">•</span>
            <span>Mersis: 0621132487300001</span>
            <span className="hidden md:inline text-[#3b5e4c]">•</span>
            <span>Sicil No: 1154685</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-[#7a9988]">
            <Link href="/kurumsal/kvkk-aydinlatma-metni" className="hover:text-white transition-colors">
              KVKK Aydınlatma
            </Link>
            <Link href="/kurumsal/gizlilik-politikasi" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/kurumsal/kullanim-kosullari" className="hover:text-white transition-colors">
              Kullanım Koşulları
            </Link>
            <Link href="/iletisim" className="hover:text-white transition-colors">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
