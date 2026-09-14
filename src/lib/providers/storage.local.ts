import crypto from "node:crypto";
import path from "node:path";
import { promises as fs } from "node:fs";
import type { StorageProvider } from "./types";

/**
 * Yerel depolama sağlayıcısı.
 * Dijital ürün dosyaları public/ altında DEĞİL, proje kökündeki private-files/
 * klasöründe tutulur; erişim yalnızca imzalı ve süreli bağlantıyla yapılır.
 *
 * Gerçek servise geçiş: S3/R2 için aynı arayüzü uygulayan storage.s3.ts yazılır,
 * signedDownloadUrl içinde getSignedUrl() çağrılır.
 */
export class LocalStorageProvider implements StorageProvider {
  readonly name = "local";

  private get root() {
    return path.join(process.cwd(), process.env.PRIVATE_FILES_DIR ?? "private-files");
  }

  private get secret() {
    return process.env.DOWNLOAD_SIGNING_SECRET ?? "dev-download-secret";
  }

  /** key + son kullanma zamanı üzerinden HMAC imzası üretir. */
  static signature(key: string, expires: number, secret: string) {
    return crypto.createHmac("sha256", secret).update(`${key}:${expires}`).digest("hex");
  }

  async signedDownloadUrl(key: string, expiresInSeconds: number) {
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const sig = LocalStorageProvider.signature(key, expires, this.secret);
    const params = new URLSearchParams({ key, expires: String(expires), sig });
    return `/api/indir?${params.toString()}`;
  }

  verifySignature(key: string, expires: number, sig: string) {
    if (expires < Math.floor(Date.now() / 1000)) return false;
    const expected = LocalStorageProvider.signature(key, expires, this.secret);
    if (expected.length !== sig.length) return false;
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  }

  async read(key: string) {
    // Dizin dışına çıkma (path traversal) girişimlerini engelle
    const safeKey = key.split("\\").join("/").replace(/\.\.+/g, "");
    const full = path.join(this.root, safeKey);
    if (!full.startsWith(this.root)) throw new Error("Geçersiz dosya anahtarı.");
    const body = await fs.readFile(full);
    return {
      body,
      contentType: "application/zip",
      fileName: path.basename(full),
    };
  }
}
