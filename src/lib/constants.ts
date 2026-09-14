/**
 * Site genelinde kullanılan sabit taksonomiler ve navigasyon tanımları.
 * Kategoriler veritabanından gelir; buradaki listeler menü/etiket eşlemesi içindir.
 */

export const SITE = {
  name: "Lizart Dijital",
  tagline: "Hazır web siteleri, uygulamalar ve dijital hizmetler",
  description:
    "İşletmeniz için hazır web siteleri, mobil ve web uygulamaları. Canlı demoları inceleyin, ihtiyacınıza uygun dijital ürünü seçin ve güvenle satın alın.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lizartdijital.com",
  email: "info@lizartdijital.com",
  phone: "0 262 301 01 34",
  phoneHref: "tel:+902623010134",
  whatsapp: "902623010134",
  address: "Mustafapaşa, 717. Sk. No:25, 41400 Gebze / Kocaeli",
  workingHours: "Hafta içi 09:00 – 18:30",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Ürün üst türleri — mağaza filtrelerinde ve menüde kullanılır. */
export const PRODUCT_TYPES = [
  { key: "website", label: "Hazır Web Siteleri", href: "/magaza/hazir-web-siteleri" },
  { key: "app", label: "Mobil Uygulamalar", href: "/magaza/mobil-uygulamalar" },
  { key: "webapp", label: "Web Uygulamaları", href: "/magaza/web-uygulamalari" },
  { key: "system", label: "Hazır Sistemler", href: "/magaza/hazir-sistemler" },
  { key: "template", label: "Tema ve Şablonlar", href: "/magaza/tema-sablonlar" },
  { key: "service", label: "Hizmet Paketleri", href: "/magaza/hizmet-paketleri" },
] as const;

export type ProductTypeKey = (typeof PRODUCT_TYPES)[number]["key"];

export const PRODUCT_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  PRODUCT_TYPES.map((t) => [t.key, t.label.replace(/^Hazır /, "")]),
);

export const DESIGN_STYLES = [
  { key: "minimal", label: "Minimal" },
  { key: "kurumsal", label: "Kurumsal" },
  { key: "renkli", label: "Renkli" },
  { key: "koyu", label: "Koyu Tema" },
  { key: "premium", label: "Premium" },
] as const;

export const LICENSE_KEYS = ["standart", "genisletilmis", "ozel"] as const;
export const LICENSE_LABELS: Record<string, string> = {
  standart: "Standart Lisans",
  genisletilmis: "Genişletilmiş Lisans",
  ozel: "Size Özel Lisans",
};

export const SORT_OPTIONS = [
  { key: "onerilen", label: "Önerilen" },
  { key: "yeni", label: "Yeni eklenenler" },
  { key: "cok-satan", label: "Çok satanlar" },
  { key: "puan", label: "En yüksek puan" },
  { key: "incelenen", label: "En çok incelenen" },
  { key: "indirimli", label: "İndirim oranı" },
  { key: "fiyat-artan", label: "Fiyat: düşükten yükseğe" },
  { key: "fiyat-azalan", label: "Fiyat: yüksekten düşüğe" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["key"];

/** Proje takip aşamaları — sipariş sonrası hizmet süreci. */
export const PROJECT_STAGES = [
  { key: "odeme-alindi", name: "Ödeme alındı" },
  { key: "bilgi-bekleniyor", name: "Bilgiler bekleniyor" },
  { key: "planlandi", name: "Proje planlandı" },
  { key: "tasarim", name: "Tasarım hazırlanıyor" },
  { key: "onay-bekliyor", name: "Müşteri onayı bekleniyor" },
  { key: "revizyon", name: "Revizyon yapılıyor" },
  { key: "gelistirme", name: "Geliştirme aşamasında" },
  { key: "son-kontrol", name: "Son kontroller" },
  { key: "teslim", name: "Teslim edildi" },
  { key: "destek", name: "Teknik destek dönemi" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  bekliyor: "Ödeme bekleniyor",
  odendi: "Ödeme alındı",
  hazirlaniyor: "Hazırlanıyor",
  teslim: "Teslim edildi",
  iptal: "İptal edildi",
  iade: "İade edildi",
};

export const FAQ_CATEGORIES = [
  { key: "satin-alma", label: "Satın Alma" },
  { key: "odeme", label: "Ödeme" },
  { key: "lisans", label: "Lisans" },
  { key: "indirme", label: "İndirme" },
  { key: "kurulum", label: "Kurulum" },
  { key: "teslimat", label: "Teslimat" },
  { key: "guncelleme", label: "Güncelleme" },
  { key: "destek", label: "Teknik Destek" },
  { key: "ozellestirme", label: "Özelleştirme" },
  { key: "iade", label: "İptal ve İade" },
] as const;

/** Ana navigasyon — masaüstü mega menü ve mobil menü aynı kaynaktan beslenir. */
/**
 * Ana navigasyon.
 * Masaüstünde doğrudan yatay şerit olarak görünür; alt menüsü olan öğeler
 * üzerine gelindiğinde açılır panel gösterir.
 */
export const NAV = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Web Sitesi Satın Al",
    href: "/magaza",
    /** Açılır panelde gösterilecek gruplar */
    columns: [
      {
        title: "Ürün aileleri",
        links: PRODUCT_TYPES.map((t) => ({ label: t.label, href: t.href })),
      },
      {
        title: "Satın almadan önce",
        links: [
          { label: "Canlı Demo Merkezi", href: "/demo-merkezi" },
          { label: "Ürün bulma sihirbazı", href: "/sihirbaz" },
          { label: "Ürün karşılaştırma", href: "/karsilastir" },
          { label: "Sık sorulan sorular", href: "/sss" },
        ],
      },
    ],
    /** Panelin sağındaki vurgulu kart */
    highlight: {
      title: "Ne alacağınızı görün",
      body: "Her ürünün canlı demosunu ve yönetim panelini satın almadan önce inceleyin.",
      href: "/demo-merkezi",
      cta: "Demo Merkezini aç",
    },
  },
  {
    label: "Hizmetler",
    href: "/hizmetler",
    columns: [
      {
        title: "Geliştirme",
        links: [
          { label: "Web Sitesi Kurulumu", href: "/hizmetler/web-sitesi-kurulumu" },
          { label: "E-Ticaret Çözümleri", href: "/hizmetler/eticaret-cozumleri" },
          { label: "Mobil Uygulama Geliştirme", href: "/hizmetler/mobil-uygulama-gelistirme" },
          { label: "Özel Yazılım Geliştirme", href: "/hizmetler/ozel-yazilim-gelistirme" },
        ],
      },
      {
        title: "Büyüme ve tasarım",
        links: [
          { label: "SEO Hizmetleri", href: "/hizmetler/seo-hizmetleri" },
          { label: "Google Ads Yönetimi", href: "/hizmetler/google-ads-yonetimi" },
          { label: "Meta Reklam Yönetimi", href: "/hizmetler/meta-reklam-yonetimi" },
          { label: "Sosyal Medya Yönetimi", href: "/hizmetler/sosyal-medya-yonetimi" },
          { label: "Kurumsal Kimlik", href: "/hizmetler/kurumsal-kimlik" },
        ],
      },
    ],
    highlight: {
      title: "Sağlık turizmi çözümleri",
      body: "Çok dilli site, hasta adayı akışı ve hedef ülke reklamları tek pakette.",
      href: "/hizmetler/saglik-turizmi-cozumleri",
      cta: "Paketi incele",
    },
  },
  { label: "Referanslarımız", href: "/projeler" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
] as const;

export const FOOTER_LEGAL = [
  { label: "Gizlilik Politikası", href: "/kurumsal/gizlilik-politikasi" },
  { label: "KVKK Aydınlatma Metni", href: "/kurumsal/kvkk-aydinlatma-metni" },
  { label: "Çerez Politikası", href: "/kurumsal/cerez-politikasi" },
  { label: "Kullanım Koşulları", href: "/kurumsal/kullanim-kosullari" },
  { label: "Mesafeli Satış Sözleşmesi", href: "/kurumsal/mesafeli-satis-sozlesmesi" },
  { label: "Ön Bilgilendirme Formu", href: "/kurumsal/on-bilgilendirme-formu" },
  { label: "İptal ve İade Politikası", href: "/kurumsal/iptal-ve-iade-politikasi" },
  { label: "Dijital Ürün Teslimat Politikası", href: "/kurumsal/dijital-urun-teslimat-politikasi" },
  { label: "Lisans Sözleşmesi", href: "/kurumsal/lisans-sozlesmesi" },
  { label: "Üyelik Sözleşmesi", href: "/kurumsal/uyelik-sozlesmesi" },
  { label: "Açık Rıza Metni", href: "/kurumsal/acik-riza-metni" },
] as const;

/** Sepet ve fiyat hesaplarında kullanılan varsayılan KDV oranı (%). */
export const DEFAULT_VAT_RATE = 20;

export const ADDON_GROUPS: { key: string; label: string }[] = [
  { key: "kurulum", label: "Kurulum" },
  { key: "icerik", label: "İçerik ve Tasarım" },
  { key: "entegrasyon", label: "Entegrasyonlar" },
  { key: "yayin", label: "Mağaza Yayını" },
  { key: "destek", label: "Eğitim ve Destek" },
];
