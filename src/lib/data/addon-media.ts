import fs from "node:fs";
import path from "node:path";

export interface AddOnMediaItem {
  image: string;
  gallery: string[];
}

const MEDIA_FILE = path.join(process.cwd(), "src/lib/data/addon-media.json");

export const DEFAULT_ADDON_MEDIA: Record<string, AddOnMediaItem> = {
  "profesyonel-kurulum": {
    image: "/gorseller/ajans/hizmet-web.svg",
    gallery: ["/gorseller/ajans/surec.svg", "/gorseller/ajans/studyo.svg"],
  },
  "domain-baglantisi": {
    image: "/gorseller/ajans/hizmet-web.svg",
    gallery: ["/gorseller/ajans/surec.svg"],
  },
  "hosting-kurulumu": {
    image: "/gorseller/ajans/hizmet-yazilim.svg",
    gallery: ["/gorseller/ajans/surec.svg"],
  },
  "logo-degisimi": {
    image: "/gorseller/ajans/hizmet-marka.svg",
    gallery: ["/lizart-logo-original.png"],
  },
  "renk-duzenleme": {
    image: "/gorseller/ajans/hizmet-marka.svg",
    gallery: ["/gorseller/ajans/hizmet-web.svg"],
  },
  "kurumsal-kimlik-uyarlamasi": {
    image: "/gorseller/ajans/hizmet-marka.svg",
    gallery: ["/gorseller/ajans/studyo.svg", "/lizart-logo-original.png"],
  },
  "icerik-girisi": {
    image: "/gorseller/ajans/hizmet-video-1.svg",
    gallery: ["/gorseller/ajans/surec.svg"],
  },
  "urun-girisi": {
    image: "/gorseller/ajans/hizmet-eticaret.svg",
    gallery: ["/gorseller/ajans/surec.svg"],
  },
  "coklu-dil-kurulumu": {
    image: "/gorseller/ajans/hizmet-web.svg",
    gallery: ["/gorseller/ajans/studyo.svg"],
  },
  "odeme-sistemi-entegrasyonu": {
    image: "/gorseller/ajans/hizmet-eticaret.svg",
    gallery: ["/gorseller/ajans/sonuclar.svg"],
  },
  "kargo-entegrasyonu": {
    image: "/gorseller/ajans/surec.svg",
    gallery: ["/gorseller/ajans/hizmet-eticaret.svg"],
  },
  "ek-sayfa-tasarimi": {
    image: "/gorseller/ajans/hizmet-web.svg",
    gallery: ["/gorseller/ajans/hizmet-marka.svg"],
  },
  "ozel-modul-gelistirme": {
    image: "/gorseller/ajans/hizmet-yazilim.svg",
    gallery: ["/gorseller/ajans/surec.svg", "/gorseller/ajans/studyo.svg"],
  },
  "mobil-uygulama-yayinlama": {
    image: "/gorseller/ajans/hizmet-mobil.svg",
    gallery: ["/gorseller/ajans/sonuclar.svg"],
  },
  "app-store-yayini": {
    image: "/gorseller/ajans/hizmet-mobil.svg",
    gallery: ["/gorseller/ajans/surec.svg"],
  },
  "google-play-yayini": {
    image: "/gorseller/ajans/hizmet-mobil.svg",
    gallery: ["/gorseller/ajans/surec.svg"],
  },
  "egitim-destegi": {
    image: "/gorseller/ajans/studyo.svg",
    gallery: ["/gorseller/ajans/surec.svg", "/gorseller/ajans/hizmet-video-1.svg"],
  },
  "aylik-bakim-paketi": {
    image: "/gorseller/ajans/hizmet-yazilim.svg",
    gallery: ["/gorseller/ajans/surec.svg"],
  },
  "yillik-teknik-destek": {
    image: "/gorseller/ajans/hizmet-seo-analiz-1.svg",
    gallery: ["/gorseller/ajans/surec.svg", "/gorseller/ajans/studyo.svg"],
  },
};

export function getAllAddOnMedia(): Record<string, AddOnMediaItem> {
  try {
    if (fs.existsSync(MEDIA_FILE)) {
      const content = fs.readFileSync(MEDIA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return { ...DEFAULT_ADDON_MEDIA, ...parsed };
    }
  } catch (err) {
    console.error("Error reading addon-media.json:", err);
  }

  // İlk seferde oluştur
  try {
    fs.mkdirSync(path.dirname(MEDIA_FILE), { recursive: true });
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(DEFAULT_ADDON_MEDIA, null, 2), "utf-8");
  } catch {
    // ignore
  }

  return DEFAULT_ADDON_MEDIA;
}

export function getAddOnMedia(idOrSlug: string): AddOnMediaItem {
  const all = getAllAddOnMedia();
  if (all[idOrSlug]) {
    return all[idOrSlug];
  }
  return {
    image: "/gorseller/ajans/hizmet-web.svg",
    gallery: [],
  };
}

export function saveAddOnMedia(
  idOrSlug: string,
  media: { image?: string; gallery?: string[] }
) {
  try {
    const all = getAllAddOnMedia();
    const existing = all[idOrSlug] || {
      image: "/gorseller/ajans/hizmet-web.svg",
      gallery: [],
    };

    all[idOrSlug] = {
      image: media.image ?? existing.image,
      gallery: media.gallery ?? existing.gallery,
    };

    fs.mkdirSync(path.dirname(MEDIA_FILE), { recursive: true });
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(all, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving addon-media.json:", err);
  }
}

export function deleteAddOnMedia(idOrSlug: string) {
  try {
    const all = getAllAddOnMedia();
    if (all[idOrSlug]) {
      delete all[idOrSlug];
      fs.writeFileSync(MEDIA_FILE, JSON.stringify(all, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error deleting from addon-media.json:", err);
  }
}
