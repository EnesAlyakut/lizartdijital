import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { dataPath } from "@/lib/production-data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!isStaff(user)) {
      return NextResponse.json(
        { ok: false, error: "Bu işlem için yönetim yetkisi gereklidir." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "Yüklenecek dosya bulunamadı." },
        { status: 400 }
      );
    }

    // Dosya türü kontrolü
    const mime = file.type;
    const isImageExt = file.name.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i);
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
    ];
    if (!allowedMimes.includes(mime) && !isImageExt) {
      return NextResponse.json(
        {
          ok: false,
          error: "Yalnızca JPG, PNG, WEBP, SVG veya GIF formatında görsel yükleyebilirsiniz.",
        },
        { status: 400 }
      );
    }

    // Maksimum boyut: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "Görsel boyutu en fazla 10MB olabilir." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = process.env.LIZART_DATA_DIR ? dataPath("uploads") : path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const rawExt = path.extname(file.name) || ".png";
    const ext = rawExt.toLowerCase();
    const baseClean = path
      .basename(file.name, rawExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 30);
    const fileName = `${baseClean || "gorsel"}-${Date.now()}${ext}`;
    const targetPath = path.join(uploadsDir, fileName);

    await writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({ ok: true, url: publicUrl, fileName });
  } catch (err: unknown) {
    console.error("Görsel yükleme hatası:", err);
    return NextResponse.json(
      { ok: false, error: "Görsel yüklenirken bir hata meydana geldi." },
      { status: 500 }
    );
  }
}
