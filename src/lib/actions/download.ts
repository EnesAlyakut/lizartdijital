"use server";

import { prisma } from "@/lib/db";
import { getStorageProvider } from "@/lib/providers";

export type DownloadResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Süreli ve imzalı indirme bağlantısı üretir.
 *
 * Kontroller:
 *  - İndirme kaydı var mı?
 *  - Siparişin ödemesi tamamlanmış mı?
 *  - Süre dolmuş mu?
 *  - İndirme limiti aşılmış mı?
 *
 * Dosyanın kendisi public klasöründe tutulmaz; erişim yalnızca bu akışla mümkündür.
 */
export async function createDownloadLink(downloadId: string): Promise<DownloadResult> {
  const download = await prisma.download.findUnique({
    where: { id: downloadId },
    include: { file: true, order: true },
  });

  if (!download) return { ok: false, error: "İndirme kaydı bulunamadı." };
  if (download.order.status === "bekliyor" || download.order.status === "iptal") {
    return { ok: false, error: "Bu siparişin ödemesi tamamlanmadı." };
  }
  if (download.expiresAt < new Date()) {
    return { ok: false, error: "İndirme süresi doldu. Hesabınızdan yeni bağlantı oluşturabilirsiniz." };
  }
  if (download.usedCount >= download.maxCount) {
    return { ok: false, error: "İndirme limitiniz doldu. Destek ekibiyle iletişime geçin." };
  }

  const storage = getStorageProvider();
  const ttl = Number(process.env.DOWNLOAD_URL_TTL_SECONDS ?? 300);
  const url = await storage.signedDownloadUrl(download.file.storageKey, ttl);

  // Her bağlantı üretimi kayıt altına alınır.
  await prisma.$transaction([
    prisma.download.update({
      where: { id: download.id },
      data: { usedCount: { increment: 1 }, lastAt: new Date() },
    }),
    prisma.auditLog.create({
      data: {
        action: "download.link_created",
        entity: "Download",
        entityId: download.id,
        meta: JSON.stringify({ fileId: download.fileId, orderId: download.orderId }),
      },
    }),
  ]);

  return { ok: true, url };
}
