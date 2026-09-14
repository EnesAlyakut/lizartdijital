import { NextRequest, NextResponse } from "next/server";
import { getStorageProvider } from "@/lib/providers";

/**
 * İmzalı indirme uç noktası.
 * Bağlantı yalnızca createDownloadLink() tarafından üretilir; imza ve son kullanma
 * zamanı burada tekrar doğrulanır. Doğrudan dosya yolu tahmin edilerek erişilemez.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const expires = Number(searchParams.get("expires"));
  const sig = searchParams.get("sig");

  if (!key || !sig || !Number.isFinite(expires)) {
    return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
  }

  const storage = getStorageProvider();
  if (!storage.verifySignature(key, expires, sig)) {
    return NextResponse.json({ error: "Bağlantı geçersiz veya süresi dolmuş" }, { status: 403 });
  }

  try {
    const file = await storage.read(key);
    return new NextResponse(new Uint8Array(file.body), {
      headers: {
        "content-type": file.contentType,
        "content-disposition": `attachment; filename="${file.fileName}"`,
        "cache-control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
  }
}
