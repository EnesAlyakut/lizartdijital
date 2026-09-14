/**
 * Gerçek referans projeleri.
 *
 * Ekran görüntüleri müşterilerin yayındaki sitelerinden alınır ve
 * public/gorseller/referanslar/ altında saklanır.
 *
 * Kanat Müşavirlik: Kocaeli Gebze merkezli Mali Müşavirlik & Danışmanlık ofisi.
 */

export type Reference = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  /** Portföy filtresi: web | eticaret | mobil | yazilim | saglik | seo | sosyal | reklam | marka */
  category: string;
  liveUrl: string;
  summary: string;
  problem: string;
  solution: string;
  services: string[];
  technologies: string[];
  /** Teslim edilen somut çıktılar — rakam değil, iş kalemi. */
  deliverables: string[];
  isFeatured: boolean;
  /** public/gorseller/referanslar/ altındaki dosya öneki */
  shot: string;
  gallery?: string[];
};

export const REFERENCES: Reference[] = [
  {
    slug: "zenit-dental-agiz-ve-dis-sagligi-web-sitesi",
    title: "Zenit Dental — Ağız ve Diş Sağlığı Poliklinikleri Web Sitesi",
    client: "Zenit Dental Ağız ve Diş Sağlığı Poliklinikleri",
    sector: "Sağlık & Diş Hekimliği",
    category: "saglik",
    liveUrl: "https://zenitdent.com/",
    summary:
      "Kocaeli Gebze merkezli, uluslararası sağlık turizmi ve ileri diş hekimliği standartlarında hizmet sunan Zenit Dental Poliklinikleri için; cerrahi tedaviler, dijital estetik gülüş tasarımı, çoklu şube ve online randevu odaklı kurumsal sağlık portalı.",
    problem:
      "Hastaların Gebze ve şubelerindeki modern cerrahi, implantoloji, ortodonti ve çene eklemi tedavilerini detaylıca inceleyebileceği; sağlık turizmi hastalarına ve yerel ziyaretçilere güven veren, tek tıkla şube bazlı randevu ve mesaj iletimi sağlayan kurumsal bir web deneyimi kurgulanması gerekiyordu.",
    solution:
      "Sıcak pudra-bej ve modern rose-gold kurumsal renk paletiyle premium bir sağlık arayüzü tasarlandı. 6 ana cerrahi ve estetik tedavi başlığı (Ağız ve Çene Cerrahisi, Çene Eklemi, Diş Beyazlatma, Ortodonti, Diş Eti Hastalıkları, Diş Protezleri), hekim kadrosu ve sağlık turizmi modülleri, interaktif şube seçimi ve online randevu formu hem masaüstü hem de mobil cihazlar için kusursuz optimize edildi.",
    services: [
      "Klinik Web Sitesi & Portal Tasarımı",
      "Tedavi & Cerrahi Kataloğu Mimarisi",
      "Şube Seçimli Online Randevu & İletişim Sistemi",
      "Uluslararası Sağlık Turizmi Bilgi Altyapısı",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Medikal SEO & Yerel Klinik Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern diş polikliniği web portalı",
      "Cerrahi, ortodonti ve estetik diş tedavileri detay sayfaları",
      "Sağlık turizmi, hekim kadrosu ve klinik tedavi vitrini",
      "Şube seçimli interaktif randevu alma ve WhatsApp iletişim entegrasyonu",
      "Yüksek hızlı yükleme ve medikal SEO odaklı içerik mimarisi",
    ],
    isFeatured: true,
    shot: "zenitdent",
    gallery: [
      "/gorseller/referanslar/zenitdent-hero-pc.png",
      "/gorseller/referanslar/zenitdent-tedaviler-pc.png",
      "/gorseller/referanslar/zenitdent-hero-mobil.png",
      "/gorseller/referanslar/zenitdent-hakkimizda-mobil.png",
      "/gorseller/referanslar/zenitdent-randevu-mobil.png",
    ],
  },
  {
    slug: "solodent-agiz-ve-dis-sagligi-web-sitesi",
    title: "SoloDent — Ağız ve Diş Sağlığı Polikliniği Web Sitesi",
    client: "SoloDent Ağız ve Diş Sağlığı Polikliniği",
    sector: "Sağlık & Diş Hekimliği",
    category: "saglik",
    liveUrl: "https://dentsolo.com/",
    summary:
      "Modern diş hekimliği teknolojileriyle donatılmış SoloDent Ağız ve Diş Sağlığı Polikliniği için Invisalign (şeffaf plak), implantoloji, estetik diş hekimliği ve online randevu odaklı, mobil öncelikli kurumsal klinik web sitesi.",
    problem:
      "Hastaların kliniğin modern olanaklarını, Invisalign şeffaf plak tedavilerini, implantoloji ve panoramik röntgen altyapısını güvenle inceleyebileceği; hekim kadrosunu görebileceği ve tek tıkla online randevu / WhatsApp danışma hattına ulaşabileceği bir dijital klinik deneyimi hedeflendi.",
    solution:
      "Ferah beyaz ve canlı turkuaz tonlarında güven verici kurumsal sağlık arayüzü inşa edildi. Invisalign şeffaf plak tedavisi ve estetik diş uygulamaları detay sayfaları, 4 ana tedavi kategorisi (İmplantoloji, Panoramik Röntgen, Protez Diş, Çocuk Diş Hekimliği), klinik tedavi ortamı vitrini, ağız ve diş sağlığı blog rehberi ve doğrudan WhatsApp/randevu hatları masaüstü ve mobil ekranlar için kusursuz optimize edildi.",
    services: [
      "Klinik Web Sitesi Tasarımı",
      "Invisalign & Tedavi Kataloğu Mimarisi",
      "Online Randevu & WhatsApp Entegrasyonu",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Diş Sağlığı Blog & Hasta Rehberi",
      "Medikal SEO ve Yerel Harita Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern diş polikliniği web sitesi",
      "Invisalign şeffaf plak ve implantoloji tedavi detay modülleri",
      "Klinik hekimleri, teknolojik ekipman ve hasta tedavi ortamı vitrini",
      "Ağız ve diş sağlığı blogu ve hasta bilgilendirme makaleleri",
      "Tek tıkla online randevu alma ve WhatsApp danışma hattı",
    ],
    isFeatured: true,
    shot: "dentsolo",
    gallery: [
      "/gorseller/referanslar/dentsolo-hero-pc.png",
      "/gorseller/referanslar/dentsolo-invisalign-pc.png",
      "/gorseller/referanslar/dentsolo-tedaviler-mobil.png",
      "/gorseller/referanslar/dentsolo-hekim-mobil.png",
      "/gorseller/referanslar/dentsolo-blog-mobil.png",
    ],
  },
  {
    slug: "akn-akpinar-hafriyat-web-sitesi",
    title: "AKN Akpınar Hafriyat — Kiralık İş Makinesi & Hafriyat Web Sitesi",
    client: "AKN Akpınar Hafriyat & İş Makineleri",
    sector: "Hafriyat & İş Makineleri",
    category: "web",
    liveUrl: "https://www.akpinarhafriyat.com/",
    summary:
      "Arnavutköy ve çevre ilçelerde 25 yıllık tecrübeyle JCB, kato, kepçe, mini ekskavatör ve kiralık iş makineleri çözümleri sunan AKN Akpınar Hafriyat için doğrudan çağrı ve WhatsApp odaklı, mobil öncelikli kurumsal web sitesi.",
    problem:
      "İnşaat ve şantiye yöneticilerinin acil iş makinesi kiralama taleplerinde saatlik, günlük veya haftalık makine parkurunu (JCB, kepçe, kato, mini ekskavatör) rahatça inceleyebileceği, sahada çalışan makineleri gösteren galeriye bakabileceği ve 7/24 tek tıkla arayabileceği hızlı bir arayüz ihtiyacı vardı.",
    solution:
      "Güçlü sarı ve antrasit inşaat/makine renk paletiyle şantiye sahasında dahi tek elle kolayca kullanılabilecek mobil öncelikli arayüz kurgulandı. Büyük yeşil 'Hemen Ara' butonu, 7/24 WhatsApp hattı, makine filosu tanıtımı (Ekskavatör, Beko Loder, Telehandler) ve gerçek şantiye operasyon fotoğrafları galerisi entegre edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "İş Makinesi Filo Kataloğu",
      "Hızlı Çağrı & 'Hemen Ara' Dönüşüm Modülü",
      "Mobil Öncelikli (Responsive) Tasarım",
      "Şantiye Operasyon Galerisi",
      "Yerel SEO ve Google Harita Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern iş makinesi kiralama web sitesi",
      "Tek tıkla telefon araması ve WhatsApp teklif butonları",
      "JCB, kepçe, kato ve mini ekskavatör araç tanıtım kartları",
      "Gerçek şantiye hafriyat operasyonları fotoğraf galerisi",
      "7/24 kesintisiz hizmet ve acil kiralama iletişim paneli",
    ],
    isFeatured: true,
    shot: "akpinarhafriyat",
    gallery: [
      "/gorseller/referanslar/akpinarhafriyat-hero-pc.png",
      "/gorseller/referanslar/akpinarhafriyat-araclar-pc.png",
      "/gorseller/referanslar/akpinarhafriyat-hero-mobil.png",
      "/gorseller/referanslar/akpinarhafriyat-galeri-pc.png",
    ],
  },
  {
    slug: "salkim-sogut-sigorta-web-sitesi",
    title: "Salkım Söğüt Sigorta — Bireysel & Kurumsal Sigorta Acenteliği Web Sitesi",
    client: "Salkım Söğüt Sigorta Aracılık Hizmetleri",
    sector: "Sigortacılık & Finans",
    category: "web",
    liveUrl: "https://salkimsogutsigorta.com/tr/ana-sayfa/",
    summary:
      "Bireyler, aileler ve işletmeler için kapsamlı sigorta çözümleri sunan Salkım Söğüt Sigorta için modern poliçe kataloğu, hasar anında destek modülü, sektörel blog ve mobil öncelikli kurumsal acente web sitesi.",
    problem:
      "Özel sağlık sigortası, tamamlayıcı sağlık, işyeri, kasko ve konut sigortalarının anlaşılır ve güven verici bir arayüzle sunulması; hasar anında acil yardım hattına tek tıkla ulaşım ve sigorta rehberi blog içerikleri hedeflendi.",
    solution:
      "Ferah gökyüzü mavisi ve kurumsal lacivert tonlarında prestijli bir finans/sigorta arayüzü inşa edildi. 6 ana branşta poliçe hizmetleri vitrini, modern acente ofisi ve uzman danışman kadrosu tanıtımı, İMM ve kasko rehberi blogu ve doğrudan WhatsApp/çağrı destek hatları masaüstü ve mobil ekranlar için optimize edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "Poliçe & Hizmet Kataloğu Mimarisi",
      "Hasar Anında Destek & Acil Hat",
      "Sigorta Rehberi & Blog Altyapısı",
      "Mobil Öncelikli (Responsive) Tasarım",
      "SEO ve Dönüşüm Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern sigorta acentesi web sitesi",
      "Özel sağlık, tamamlayıcı sağlık, kasko ve işyeri poliçe modülleri",
      "Hasar anında hızlı yardım ve acil telefon / WhatsApp entegrasyonu",
      "Sektörel sigorta blogu ve bilgilendirici makaleler modülü",
      "Acente ofisi ve uzman kadro kurumsal tanıtım sayfası",
    ],
    isFeatured: true,
    shot: "salkimsogut",
    gallery: [
      "/gorseller/referanslar/salkimsogut-hizmetler-pc.png",
      "/gorseller/referanslar/salkimsogut-ofis-pc.png",
      "/gorseller/referanslar/salkimsogut-hizmetler-mobil.png",
      "/gorseller/referanslar/salkimsogut-blog-pc.png",
      "/gorseller/referanslar/salkimsogut-blog-mobil.png",
    ],
  },
  {
    slug: "ndn-arsa-yatirim-web-sitesi",
    title: "NDN Arsa — Arsa & Gayrimenkul Yatırım A.Ş. Web Sitesi",
    client: "NDN Arsa Yatırım A.Ş.",
    sector: "Gayrimenkul & Arsa Yatırımı",
    category: "web",
    liveUrl: "https://ndnarsa.com/",
    summary:
      "Türkiye genelinde imarlı, tapulu ve yasal güvenceli arsa portföyleri sunan NDN Arsa Yatırım A.Ş. için interaktif arsa filtreleme modüllü, güven veren ve mobil öncelikli kurumsal yatırım web sitesi.",
    problem:
      "Yatırımcılara kurumsal güven veren modern bir dille; onaylı imarlı arsa kategorilerinin, tapu durumlarının ve arsa türlerinin kolayca filtrelenmesi, arsa yatırım rehberi makalelerinin ve doğrudan WhatsApp arsa danışmanlık hattının hızlıca sunulması hedeflendi.",
    solution:
      "Doğal yeşil ve ferah gökyüzü tonlarında kurumsal bir gayrimenkul görsel dili inşa edildi. Ana sayfa karşılama ekranında anlık arsa arama/filtreleme motoru (Kategoriler, Tapu Durumu, Arsa Türü), kurumsal şeffaflık ve güvence ilkeleri, sektörel blog rehberi ve tek tıkla WhatsApp iletişim hatları masaüstü ve mobil cihazlar için kusursuz optimize edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "İnteraktif Arsa Filtreleme Modülü",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Gayrimenkul Blog & Yatırım Rehberi",
      "WhatsApp & Hızlı İletişim Entegrasyonu",
      "SEO ve Performans Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern arsa yatırım web sitesi",
      "Kategori, tapu durumu ve arsa türüne göre anlık filtreleme motoru",
      "Yasal güvenceli ve tapulu arsa portföyü kurumsal sayfaları",
      "Sektörel arsa yatırımı rehberi blog modülü",
      "Tek tıkla WhatsApp ve doğrudan iletişim kanalları",
    ],
    isFeatured: true,
    shot: "ndnarsa",
    gallery: [
      "/gorseller/referanslar/ndnarsa-hero-pc.png",
      "/gorseller/referanslar/ndnarsa-hakkimizda-pc.png",
      "/gorseller/referanslar/ndnarsa-hero-mobil.png",
      "/gorseller/referanslar/ndnarsa-hakkimizda-mobil.png",
      "/gorseller/referanslar/ndnarsa-blog-pc.png",
    ],
  },
  {
    slug: "mac-mekanik-ve-insaat-web-sitesi",
    title: "MAC Mekanik & İnşaat — Mekanik Tesisat & Modern Konut Projeleri Web Sitesi",
    client: "MAC Mekanik & İnşaat A.Ş.",
    sector: "Mekanik Mühendislik & İnşaat",
    category: "web",
    liveUrl: "https://macmekanik.com/",
    summary:
      "Endüstriyel mekanik tesisat mühendisliği ve modern konut inşaat projelerinde faaliyet gösteren MAC Mekanik & İnşaat için modern, çift branş odaklı (Mekanik / İnşaat) ve mobil öncelikli kurumsal web sitesi.",
    problem:
      "Şirketin hem endüstriyel mekanik tesisat (havalandırma, ısıtma-soğutma, yangın tesisatı, hidrofor sistemleri) mühendisliğini hem de Kartal ve Üsküdar konut projelerini tek bir güçlü, prestijli ve kurumsal dijital kimlik altında müşterilere aktarması gerekiyordu.",
    solution:
      "Mekanik ve inşaat faaliyet kollarını tek tıkla ayrıştıran modern ve çift dinamikli kurumsal arayüz inşa edildi. Endüstriyel tesisat hizmet portföyü, konut şantiye ve mimari proje galerileri, mobil öncelikli hızlı gezinti ve doğrudan WhatsApp/teklif iletişim hatları optimize edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "Mekanik & İnşaat Çift Sektör Mimarisi",
      "Proje & Şantiye Portföy Galerisi",
      "Mobil Öncelikli (Responsive) Tasarım",
      "Endüstriyel Hizmet Kataloğu",
      "SEO ve Performans Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Mekanik tesisat ve inşaat projelerini tanıtan çift branşlı kurumsal web sitesi",
      "Kartal Soğanlık ve Üsküdar Zeynep Kamil konut projeleri galeri sayfaları",
      "Endüstriyel mekanik tesisat, kazan dairesi ve havalandırma hizmet modülleri",
      "Mobil uyumlu kurumsal hakkımızda, referanslar ve iletişim modülü",
      "Tek tıkla WhatsApp ve doğrudan kurumsal teklif formu",
    ],
    isFeatured: true,
    shot: "macmekanik",
    gallery: [
      "/gorseller/referanslar/macmekanik-hero-pc.png",
      "/gorseller/referanslar/macmekanik-villa-pc.png",
      "/gorseller/referanslar/macmekanik-hizmet-mobil.png",
      "/gorseller/referanslar/macmekanik-proje-pc.png",
      "/gorseller/referanslar/macmekanik-proje-mobil.png",
    ],
  },
  {
    slug: "kosuyolu-rezonans-merkezi-web-sitesi",
    title: "Koşuyolu Rezonans — Bütüncül Sağlık & Biorezonans Terapisi",
    client: "Koşuyolu Rezonans Merkezi",
    sector: "Sağlık & Bütüncül Terapi",
    category: "saglik",
    liveUrl: "https://kosuyolurezonans.com/",
    summary:
      "İstanbul Koşuyolu'nda 7 yılda 10.000+ danışana hizmet veren Koşuyolu Rezonans için modern, randevu odaklı, interaktif bağımlılık testi modüllü ve mobil öncelikli sağlık merkezi web sitesi.",
    problem:
      "Alman teknolojisi biorezonans terapilerinin (sigara bırakma, zayıflama/kilo verme, ruhsal dengeleme), 7 yıllık kurumsal uzmanlığın ve 10.000+ mutlu danışan güveninin hastalara net, şeffaf ve prestijli bir dijital deneyimle sunulması; interaktif testler ve tek tıkla online randevu/WhatsApp kanallarına erişimin sağlanması hedeflendi.",
    solution:
      "Canlı kırmızı ve sıcak medikal tonlarla enerji veren, yüksek prestijli bir sağlık arayüzü inşa edildi. İnteraktif Sigara Bağımlılık Testi, online randevu motoru, uzman hekim ve psikolog kadrosu tanıtımı, 10.000+ danışan başarı istatistikleri ve WhatsApp hızlı destek modülleri masaüstü ve mobil ekranlar için kusursuz optimize edildi.",
    services: [
      "Sağlık & Terapi Web Sitesi Tasarımı",
      "İnteraktif Bağımlılık Testi Altyapısı",
      "Online Randevu & WhatsApp Entegrasyonu",
      "Mobil Öncelikli (Responsive) Arayüz",
      "SEO & Medikal İçerik Mimarisi",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern sağlık merkezi arayüzü",
      "İnteraktif Sigara Bağımlılık Testi modülü",
      "Zayıflama, sigara bırakma ve ruhsal dengeleme hizmet sayfaları",
      "7 Yılda 10.000+ mutlu danışan itibar bölümü",
      "Tek tıkla randevu alma ve WhatsApp danışma hattı",
    ],
    isFeatured: true,
    shot: "kosuyolurezonans",
    gallery: [
      "/gorseller/referanslar/kosuyolurezonans-masaustu.png",
      "/gorseller/referanslar/kosuyolurezonans-mobil.png",
      "/gorseller/referanslar/kosuyolurezonans-tedaviler-masaustu.png",
      "/gorseller/referanslar/kosuyolurezonans-tedaviler-mobil.png",
      "/gorseller/referanslar/kosuyolurezonans-slide2-mobil.png",
    ],
  },
  {
    slug: "kuruoglu-kerestecilik-ve-dis-ticaret-web-sitesi",
    title: "Kuruoğlu Kerestecilik — Orman Ürünleri & Dış Ticaret Web Sitesi",
    client: "Kuruoğlu Kerestecilik ve Dış Tic. A.Ş.",
    sector: "Orman Ürünleri & Dış Ticaret",
    category: "web",
    liveUrl: "https://www.kuruoglukerestecilik.com/",
    summary:
      "Türkiye'nin köklü ahşap ve kereste ihracatçısı Kuruoğlu Kerestecilik A.Ş. için çok dilli (TR/EN), geniş ürün kataloglu ve mobil öncelikli kurumsal sanayi web sitesi.",
    problem:
      "Kayın, meşe, çam kereste, masif panel, kaplama, kapı sereni, lambri ve kontrplak gibi 60'ı aşkın sanayi ürün grubunun hem yurt içi hem yurt dışı müşterilere kurumsal güvenle sunulması; fabrika üretim tesisleri ve kereste stok galerisinin sergilenmesi hedeflendi.",
    solution:
      "Doğal ahşap ve sıcak kahve-antrasit tonlarında kurumsal bir sanayi görsel dili kurgulandı. Kategorize edilmiş 67+ ürünlük detaylı ahşap kataloğu, fabrika ve tomruk üretim galerisi, sektörel kereste rehberi blogu ve doğrudan WhatsApp/teklif iletişim hatları masaüstü ve mobil ekranlar için kusursuz optimize edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "Geniş Ürün Katalog Mimarisi",
      "Mobil Öncelikli (Responsive) Tasarım",
      "Çok Dilli (TR/EN) Altyapı",
      "Fabrika & Stok Galeri Modülü",
      "SEO Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu sanayi & dış ticaret web sitesi",
      "60+ ürünlük ahşap ve kereste katalog filtreleme modülü",
      "Fabrika ve üretim parkuru fotoğraf galerisi",
      "Sektörel ahşap ve kereste rehberi blog sayfaları",
      "Tek tıkla WhatsApp ve teklif talep formu",
    ],
    isFeatured: true,
    shot: "kuruoglukerestecilik",
    gallery: [
      "/gorseller/referanslar/kuruoglukerestecilik-masaustu.png",
      "/gorseller/referanslar/kuruoglukerestecilik-mobil.png",
      "/gorseller/referanslar/kuruoglukerestecilik-urunler-masaustu.png",
      "/gorseller/referanslar/kuruoglukerestecilik-galeri-masaustu.png",
      "/gorseller/referanslar/kuruoglukerestecilik-blog-mobil.png",
    ],
  },
  {
    slug: "itcdent-agiz-ve-dis-sagligi-web-sitesi",
    title: "ItcDent — Ağız ve Diş Sağlığı Kliniği Web Sitesi",
    client: "ItcDent Diş Kliniği",
    sector: "Sağlık & Diş Hekimliği",
    category: "saglik",
    liveUrl: "https://itcdent.com/",
    summary:
      "İstanbul Eyüpsultan merkezli ItcDent Ağız ve Diş Sağlığı Kliniği için modern, hekim ve tedavi odaklı, mobil öncelikli kurumsal klinik web sitesi.",
    problem:
      "Zirkonyum kaplama, implant tedavisi, estetik gülüş tasarımı, lamine kaplama, diş beyazlatma ve cerrahi tedavilerin hastalara detaylı ve güven verici bir dille sunulması; hekim kadrosunun tanıtılması ve hızlı randevu kanallarının (telefon, WhatsApp) kolayca erişilebilir olması hedeflendi.",
    solution:
      "Klinik hekimlerinin ve modern kliniğin ön planda olduğu, prestijli mavi-lacivert ve beyaz renk paletiyle yüksek güven veren bir sağlık arayüzü inşa edildi. Tedavilerimiz vitrini (Zirkonyum, Gülüş Tasarımı, İmplant, All On 4/6, Lamine, Kanal Tedavisi), sektörel diş sağlığı blog rehberi, randevu modülleri ve doğrudan WhatsApp danışma butonları masaüstü ve mobil cihazlar için kusursuz optimize edildi.",
    services: [
      "Klinik Web Sitesi Tasarımı",
      "Tedavi & Hizmet Kataloğu Mimarisi",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Diş Sağlığı Blog & Rehber Altyapısı",
      "Online Randevu & WhatsApp Entegrasyonu",
      "SEO & Medikal İçerik Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern klinik arayüzü",
      "Zirkonyum kaplama ve implant tedavi detay sayfaları",
      "Klinik hekimleri ve kurumsal hakkımızda bölümü",
      "Diş sağlığı blogu ve hasta bilgilendirme makaleleri",
      "Tek tıkla randevu alma ve WhatsApp danışma hattı",
    ],
    isFeatured: true,
    shot: "itcdent",
    gallery: [
      "/gorseller/referanslar/itcdent-masaustu.png",
      "/gorseller/referanslar/itcdent-mobil.png",
      "/gorseller/referanslar/itcdent-tedaviler-masaustu.png",
      "/gorseller/referanslar/itcdent-blog-mobil.png",
    ],
  },
  {
    slug: "gis-dental-agiz-dis-sagligi-web-sitesi",
    title: "GİS Dental — Ağız ve Diş Sağlığı Polikliniği Web Sitesi",
    client: "GİS Dental Polikliniği",
    sector: "Sağlık & Diş Hekimliği",
    category: "saglik",
    liveUrl: "https://gisdental.com/",
    summary:
      "İstanbul Ataşehir'de faaliyet gösteren GİS Dental Ağız ve Diş Sağlığı Polikliniği için modern, randevu odaklı ve mobil öncelikli kurumsal klinik web sitesi.",
    problem:
      "İmplant, estetik gülüş tasarımı, pedodonti, ortodonti ve diş eti tedavileri gibi çok yönlü hizmetlerin hastalara güven verici ve estetik bir dille sunulması, tek tıkla online randevu ve WhatsApp iletişim kanallarına hızlıca ulaşılabilmesi gerekiyordu.",
    solution:
      "Koyu lacivert ve medikal fuşya-pembe vurgularla estetik ve güven veren bir görsel kimlik kurgulandı. Tedavilerimiz vitrini (Gülüş Tasarımı, İmplant, Pedodonti, Diş Eti Hastalıkları, Dolgu, Kanal Tedavisi), kurumsal hakkımızda bölümü, hasta randevu formu ve tek tıkla arama/WhatsApp iletişim hatları masaüstü ve mobil ekranlar için kusursuz optimize edildi.",
    services: [
      "Klinik Web Sitesi Tasarımı",
      "Tedavi & Hizmet Kataloğu Mimarisi",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Online Randevu & WhatsApp Entegrasyonu",
      "SEO & Medikal İçerik Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern klinik arayüzü",
      "Gülüş tasarımı, implant ve cerrahi tedavi sayfaları",
      "Kurumsal poliklinik ve uzman hekim tanıtımı",
      "Hızlı online randevu formu ve WhatsApp hasta danışma hattı",
      "Yüksek hızlı açılış ve medikal arama motoru optimizasyonu",
    ],
    isFeatured: true,
    shot: "gisdental",
    gallery: [
      "/gorseller/referanslar/gisdental-masaustu.png",
      "/gorseller/referanslar/gisdental-mobil.png",
      "/gorseller/referanslar/gisdental-tedaviler-masaustu.png",
      "/gorseller/referanslar/gisdental-hakkimizda-masaustu.png",
      "/gorseller/referanslar/gisdental-tedaviler-mobil.png",
    ],
  },
  {
    slug: "gebze-cimnastik-akademi-web-sitesi",
    title: "Gebze Cimnastik Akademi — Spor Kulübü Web Sitesi",
    client: "Gebze Cimnastik Akademi",
    sector: "Spor & Eğitim",
    category: "web",
    liveUrl: "",
    summary: "Gebze Cimnastik Akademi için kulüp tanıtımını, salonunu ve spor çalışmalarını öne çıkaran, masaüstü ve mobil uyumlu web sitesi.",
    problem: "Kulübün kimliğini, cimnastik eğitimlerini ve salonunu ziyaretçilere anlaşılır bir yapıda sunmak ve iletişim kanallarına erişimi kolaylaştırmak.",
    solution: "Siyah zemin ve markanın pembe vurguları üzerine kurulan görsel tasarım; ana sayfa, hakkımızda ve salon tanıtımıyla tamamlandı. Masaüstü menü ve mobil gezinme düzenleriyle içerikler farklı ekranlara uyarlandı.",
    services: ["Kurumsal Web Tasarım", "Mobil Uyumlu Tasarım", "Kulüp ve Salon Tanıtımı"],
    technologies: [],
    deliverables: ["Masaüstü ve mobil ana sayfa", "Hakkımızda sayfası", "Salon tanıtımı", "Galeri ve iletişim bağlantıları"],
    isFeatured: true,
    shot: "gebze-cimnastik",
    gallery: ["masaustu", "mobil", "hakkimizda-mobil", "salonumuz-mobil"].map(name => "/gorseller/referanslar/gebze-cimnastik-" + name + ".webp"),
  },
  {
    slug: "kanat-musavirlik-web-sitesi",
    title: "Kanat Müşavirlik — Mali Müşavirlik & Danışmanlık Web Sitesi",
    client: "Kanat Mali Müşavirlik",
    sector: "Mali Müşavirlik & Finans",
    category: "web",
    liveUrl: "https://kanatmusavirlik.com.tr/",
    summary:
      "Kocaeli Gebze'de faaliyet gösteren Serbest Muhasebeci Mali Müşavir Tuğba Kanat için modern, kurumsal, hem mobil hem masaüstü cihazlarla tam uyumlu web sitesi.",
    problem:
      "Mali müşavirlik, vergi, bordro, şirket kuruluşu ve finansal danışmanlık gibi çok yönlü hizmetlerin anlaşılır, kurumsal güven veren ve mobil öncelikli bir dijital yapıda sunulması gerekiyordu. Ziyaretçilerin doğrudan hizmet detaylarına ve yetkili iletişim kanallarına kolayca ulaşabilmesi hedeflendi.",
    solution:
      "Kurumsal yeşil ve altın tonlarında prestijli bir görsel dil kurgulandı. Hizmetler (Muhasebe, Personel ve Bordro, Beyanname ve Vergi, Şirket Kuruluş, Denetim, E-Dönüşüm, Teşvik ve Finansal Danışmanlık) ayrı ayrı yapılandırılarak detaylandırıldı. Mobil ve masaüstü ekranlar için optimize edilmiş akıcı gezinme ve iletişim butonları eklendi.",
    services: [
      "Kurumsal Web Tasarım",
      "Mobil Öncelikli (Responsive) Tasarım",
      "Hizmet Mimarisi & İçerik Yönetimi",
      "Kurumsal Kimlik & İletişim Entegrasyonu",
      "SEO Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu kurumsal arayüz",
      "Hukuki ve mali hizmetler katalog sayfası",
      "Hakkımızda ve kurucu tanıtım bölümü",
      "Tek tıkla arama ve WhatsApp iletişim yönlendirmeleri",
      "Hızlı açılış ve arama motoru optimizasyonu",
    ],
    isFeatured: true,
    shot: "kanat-musavirlik",
  },
  {
    slug: "ada-motor-istanbul-eticaret-sitesi",
    title: "Ada Motor İstanbul — Motosiklet & Ekipman E-Ticaret Mağazası",
    client: "Ada Motor İstanbul",
    sector: "Motosiklet & E-Ticaret",
    category: "eticaret",
    liveUrl: "https://adamotoristanbul.com/",
    summary:
      "İstanbul merkezli motosiklet bayisi ve aksesuar mağazası için bütçeye uygun taksit seçenekleri, zengin ürün kataloğu ve mobil öncelikli e-ticaret altyapısı.",
    problem:
      "Geniş motosiklet modelleri (Yamaha, Bajaj, Mondial, SYM vb.) ile kask ve koruyucu ekipmanların tek çatı altında modern filtrelerle sunulması, taksit avantajlarının vurgulanması ve müşterilerin kolayca sipariş verip danışabilmesi gerekiyordu.",
    solution:
      "Sportif ve dinamik kırmızı-siyah konseptte yüksek hızlı bir e-ticaret arayüzü hazırlandı. Motosiklet ve aksesuar kategorileri, ürün filtreleme, doğrudan WhatsApp destek hattı ve mobil öncelikli sepet akışları eksiksiz devreye alındı.",
    services: [
      "E-Ticaret Web Sitesi Tasarımı",
      "Motosiklet & Ekipman Ürün Kataloğu",
      "Mobil Öncelikli (Responsive) Arayüz",
      "WhatsApp Sipariş & İletişim Entegrasyonu",
      "SEO & Hızlı Açılış Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu mağaza tasarımı",
      "Motosiklet modelleri ve teknik detay sayfaları",
      "Kask ve aksesuar kategori filtreleri",
      "Taksit ve bütçe dostu ödeme bilgilendirme alanları",
      "Sepet ve tek tıkla arama/WhatsApp yönlendirmeleri",
    ],
    isFeatured: true,
    shot: "adamotor",
  },
  {
    slug: "ans-sigorta-aracilik-web-sitesi",
    title: "ANS Sigorta — Sigorta Aracılık Hizmetleri & Teklif Platformu",
    client: "ANS Sigorta Aracılık Hizmetleri",
    sector: "Sigorta & Finansal Hizmetler",
    category: "web",
    liveUrl: "https://www.anssigortaaracilik.com/",
    summary:
      "Trafik sigortası, kasko, DASK ve sağlık sigortalarında avantajlı teklifler, hasar anı desteği ve müşteri odaklı çözümler sunan modern sigorta web sitesi.",
    problem:
      "Ziyaretçilerin trafik, kasko ve DASK gibi temel sigorta branşlarını kolayca inceleyebileceği, tek tıkla online fiyat teklifi alabileceği, kurumsal güven veren ve hasar anında doğrudan yetkiliye ulaşabileceği mobil öncelikli bir sigorta platformu gerekiyordu.",
    solution:
      "Koyu ve kurumsal yeşil-siyah tonlarda prestijli bir sigorta arayüzü kurgulandı. Sigorta ürünleri (Trafik, Kasko, DASK), 'Neden Bizi Seçmelisiniz?' kurumsal güven blokları, tamamlayıcı sağlık rehberi ve 7/24 hızlı teklif alma butonları hem mobil hem masaüstü cihazlar için özel olarak optimize edildi.",
    services: [
      "Kurumsal Sigorta Web Sitesi",
      "Online Fiyat & Teklif Alma Mimarisi",
      "Mobil Öncelikli (Responsive) Tasarım",
      "Hizmet Kataloğu & Bilgi Bankası",
      "SEO & Hızlı Açılış Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern sigorta arayüzü",
      "Trafik sigortası, kasko ve DASK hizmet kartları",
      "Neden bizi seçmelisiniz güven ve avantaj modülü",
      "Tamamlayıcı sağlık sigortası ve rehber blog sayfaları",
      "Hemen teklif al ve hızlı WhatsApp/arama yönlendirmeleri",
    ],
    isFeatured: true,
    shot: "anssigorta",
  },
  {
    slug: "curecare-ilac-saglik-web-sitesi",
    title: "CureCare — İlaç & Sağlık Çözümleri Kurumsal Web Sitesi",
    client: "CureCare İlaç & Sağlık",
    sector: "Sağlık & İlaç Endüstrisi",
    category: "saglik",
    liveUrl: "https://curecare.com.tr/",
    summary:
      "\"Önce Koru Sonra İyileştir\" vizyonuyla faaliyet gösteren CureCare için modern, sağlık regülasyonlarına tam uyumlu ve geniş ürün kataloglu kurumsal web sitesi.",
    problem:
      "Geniş ilaç ve sağlık ürünleri portföyünün mevzuat standartlarına uygun şekilde hekimlere, eczacılara ve kullanıcılara sunulması, kurumsal güvenin ve iş ortaklıklarının net biçimde aktarılması gerekiyordu.",
    solution:
      "Lacivert ve medikal mor-mavi renk paletiyle kurumsal ve prestijli bir tasarım dili kurgulandı. Kategori ve etken maddeye göre filtreleme yapılabilen dinamik ilaç kataloğu, 'Önce Koru Sonra İyileştir' felsefesini yansıtan hakkımızda bölümü ve iş ortakları vitrini hem mobil hem masaüstü cihazlar için özel olarak optimize edildi.",
    services: [
      "Medikal & İlaç Web Sitesi Tasarımı",
      "İlaç ve Sağlık Ürünleri Kataloğu",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Mevzuat & Sağlık Regülasyonu Uyumu",
      "SEO & Kurumsal İletişim Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern sağlık arayüzü",
      "İlaç ve takviye edici ürünler katalog sayfası",
      "Kategori ve etken maddeye göre filtreleme modülü",
      "Kurumsal hakkımızda, misyon ve değerler bölümü",
      "İletişim formu, iş ortakları ve harita entegrasyonu",
    ],
    isFeatured: true,
    shot: "curecare",
  },
  {
    slug: "ena-tabela-reklam-web-sitesi",
    title: "Ena Reklam — Tabela, Dijital Baskı & Cephe Giydirme Web Sitesi",
    client: "ENA Tabela & Reklam",
    sector: "Tabela, Reklam & Dijital Baskı",
    category: "reklam",
    liveUrl: "https://www.enareklam.com.tr/",
    summary:
      "Kocaeli Gebze merkezli ENA Reklam için tabela, ışıklı kutu harf, araç ve cephe giydirme çözümlerini sergileyen modern, dinamik ve mobil öncelikli kurumsal web sitesi.",
    problem:
      "Işıklı kutu harf, totem tabela, cephe giydirme, araç kaplama ve pleksi ürünler gibi çok geniş üretim kalemlerinin kurumsal referanslarla (TÜBİTAK, Hasçelik, İTOSB vb.) birlikte estetik, hızlı ve mobil uyumlu bir vitrinde sunulması gerekiyordu.",
    solution:
      "Canlı kırmızı ve beyaz marka renklerine sahip yüksek hızlı bir kurumsal arayüz inşa edildi. Uygulanan projelerden (cephe, araç, tabela) oluşan zengin görsel portföy, sektörel blog ve hızlı WhatsApp/arama butonları hem mobil hem masaüstü cihazlar için özel olarak optimize edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "Tabela & Reklam Portföy Mimarisi",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Sektörel Blog & İçerik Yönetimi",
      "SEO & Hızlı İletişim Entegrasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu tabela & reklam vitrini",
      "Kutu harf, cephe ve araç giydirme portföyü",
      "TÜBİTAK, Hasçelik gibi kurumsal müşteri logoları bölümü",
      "Baskı ve reklam sektörel rehber blog sayfaları",
      "Tek tıkla WhatsApp ve doğrudan arama yönlendirmeleri",
    ],
    isFeatured: true,
    shot: "enareklam",
  },
  {
    slug: "everydent-agiz-dis-sagligi-web-sitesi",
    title: "EveryDent — Ağız ve Diş Sağlığı Polikliniği Web Sitesi",
    client: "EveryDent Özel Ağız ve Diş Sağlığı Polikliniği",
    sector: "Diş Sağlığı & Klinik Hizmetleri",
    category: "saglik",
    liveUrl: "https://everydent.com.tr/",
    summary:
      "İmplant, zirkonyum kaplama, diş beyazlatma, gülüş tasarımı ve çocuk diş hekimliği tedavilerini sunan modern, randevu odaklı poliklinik web sitesi.",
    problem:
      "Kapsamlı diş tedavilerinin (implant, zirkonyum, ortodonti, pedodonti), sağlık turizmi hizmetlerinin ve zengin diş sağlığı blog rehberinin hastalar için anlaşılır, güven verici ve hızlı randevu alınabilir mobil öncelikli bir yapıda sunulması gerekiyordu.",
    solution:
      "Zarif altın/bronz ve beyaz medikal tonlarda güven veren bir klinik arayüzü inşa edildi. Tedavi sayfaları, görsel gülüş tasarımı örnekleri, çok dilli sağlık turizmi altyapısı, zengin ağız ve diş sağlığı blogu ile tek tıkla online randevu alma modülleri hem mobil hem masaüstü cihazlar için özel olarak optimize edildi.",
    services: [
      "Diş Kliniği Web Sitesi Tasarımı",
      "Online Randevu Mimarisi",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Sağlık Turizmi & Tedavi Kataloğu",
      "Ağız & Diş Sağlığı Blog Rehberi",
      "SEO & Çok Dilli Altyapı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu klinik & poliklinik arayüzü",
      "İmplant, zirkonyum ve estetik diş tedavileri sayfaları",
      "Pediatrik diş hekimliği ve gülüş tasarımı tanıtımı",
      "Diş sağlığı rehberi ve uzman hekim blog makaleleri",
      "Online randevu al ve WhatsApp hasta danışma hattı",
    ],
    isFeatured: true,
    shot: "everydent",
  },
  {
    slug: "fms-hukuk-danismanlik-web-sitesi",
    title: "FMS Hukuk — Hukuk & Danışmanlık Bürosu Web Sitesi",
    client: "FMS Hukuk & Danışmanlık",
    sector: "Hukuk, Danışmanlık & Avukatlık",
    category: "web",
    liveUrl: "https://fmshukuk.com/",
    summary:
      "Avukat Furkan Alyakut liderliğindeki FMS Hukuk için kurumsal hukuk müşavirliği, iş hukuku, ceza ve fikri mülkiyet alanlarında modern, prestijli hukuk bürosu web sitesi.",
    problem:
      "Hukuki uzmanlık alanlarının (kurumsal müşavirlik, işçi-işveren avukatlığı, sözleşmeler, ceza ve dernekler hukuku) müvekkillere güven verici, prestijli ve mobil öncelikli bir arayüzde sunulması; hızlı danışma ve iletişim kanallarının kolayca erişilebilir olması hedeflendi.",
    solution:
      "Zarif altın/bronz ve koyu tonlarda yüksek güvenilirlik sunan avukatlık web tasarımı kurgulandı. Hukuki çözümler ve danışmanlık hizmetleri kataloglandırıldı; kurumsal hakkında, misyon, vizyon bölümleri ile doğrudan randevu ve WhatsApp destek entegrasyonu sağlandı.",
    services: [
      "Hukuk Bürosu Web Tasarımı",
      "Hukuki Hizmetler Katalog Mimarisi",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Kurumsal Kimlik & İletişim Entegrasyonu",
      "SEO & Hızlı Açılış Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu prestijli hukuk bürosu tasarımı",
      "Kurumsal müşavirlik, iş ve ceza hukuku hizmet sayfaları",
      "Avukat Furkan Alyakut ve kurumsal hakkımızda bölümü",
      "Müvekkil başvuru ve hızlı WhatsApp iletişim entegrasyonu",
      "Hızlı açılış ve arama motoru optimizasyonu",
    ],
    isFeatured: true,
    shot: "fmshukuk",
  },
  {
    slug: "gebze-bayrak-web-sitesi",
    title: "Gebze Bayrak — Bayrak İmalatı, Atatürk Posteri & Flama Web Sitesi",
    client: "Gebze Bayrak (ENA Reklam İştiraki)",
    sector: "Bayrak İmalatı, Dijital Baskı & Promosyon",
    category: "reklam",
    liveUrl: "https://www.gebzebayrak.com.tr/",
    summary:
      "Bayrak, flama, afiş, büyük boy Atatürk posterleri, ülke bayrakları ve promosyon ürünleri imalatında öncü Gebze Bayrak için modern ürün vitrini ve kurumsal web sitesi.",
    problem:
      "Geniş bayrak ve flama ürün çeşitlerinin, büyük boy Atatürk posterlerinin ve Türk Bayrak Kanunu tüzüğünün müşterilere şık, anlaşılır ve mobil öncelikli bir katalog yapısında sunulması gerekiyordu.",
    solution:
      "Kırmızı, beyaz ve siyah modern bayrak temasıyla dinamik bir arayüz kurgulandı. Büyük boy Atatürk posterleri manşet alanı, ürün kategorileri, detaylı Türk Bayrak Kanunu mevzuat sayfası ve WhatsApp hızlı sipariş hattı hem mobil hem masaüstü cihazlar için özel olarak optimize edildi.",
    services: [
      "Bayrak & Flama İmalat Web Sitesi",
      "Ürün Kataloğu & Vitrin Mimarisi",
      "Mobil Öncelikli (Responsive) Tasarım",
      "Türk Bayrak Kanunu Bilgi Bankası",
      "Hızlı WhatsApp Teklif & Sipariş Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern bayrak vitrini",
      "Büyük boy Atatürk posterleri ve ülke bayrakları vitrini",
      "Türk Bayrak Kanunu ve mevzuat sayfası",
      "Kurumsal hakkımızda ve ENA Reklam iş ortaklığı bölümü",
      "Hızlı WhatsApp sipariş ve iletişim butonu",
    ],
    isFeatured: true,
    shot: "gebzebayrak",
  },
];
