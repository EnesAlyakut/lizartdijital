"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type DemoImage = { id: string; url: string; alt: string; viewport: string };

const DEVICES = [
  { key: "desktop", label: "Masaüstü", frame: "w-full", ratio: "aspect-[16/10]" },
  { key: "tablet", label: "Tablet", frame: "mx-auto w-[70%] max-w-2xl", ratio: "aspect-[4/3]" },
  { key: "mobile", label: "Mobil", frame: "mx-auto w-[280px]", ratio: "aspect-[9/18]" },
] as const;

/**
 * Demo görüntüleyici.
 * Ürün demosu dış bir alan adında yayınlandığı için sayfa içine gömülmez
 * (üçüncü taraf çerçeve engellemeleri ve güvenlik nedeniyle); bunun yerine
 * seçilen cihaz boyutunda ekran görüntüsü gösterilir ve demo yeni sekmede açılır.
 */
export function DemoViewer({
  demoUrl,
  adminDemoUrl,
  images,
  coverImage,
  name,
}: {
  demoUrl: string;
  adminDemoUrl: string | null;
  images: DemoImage[];
  coverImage: string;
  name: string;
}) {
  const [device, setDevice] = useState<(typeof DEVICES)[number]["key"]>("desktop");
  const [showAdmin, setShowAdmin] = useState(false);

  const adminImage = images.find((i) => i.viewport === "admin");
  const deviceImage = images.find((i) => i.viewport === device);
  const current = showAdmin && adminImage ? adminImage : (deviceImage ?? { url: coverImage, alt: name, viewport: device, id: "cover" });
  const config = DEVICES.find((d) => d.key === device)!;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Cihaz görünümü">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => {
                setDevice(d.key);
                setShowAdmin(false);
              }}
              aria-pressed={device === d.key && !showAdmin}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                device === d.key && !showAdmin
                  ? "border-ink-900 bg-ink-900 text-canvas"
                  : "border-ink-200 bg-surface text-ink-700 hover:border-ink-400",
              )}
            >
              {d.label}
            </button>
          ))}
          {adminImage && (
            <button
              type="button"
              onClick={() => setShowAdmin(true)}
              aria-pressed={showAdmin}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                showAdmin
                  ? "border-brand-600 bg-brand-500 text-canvas"
                  : "border-ink-200 bg-surface text-ink-700 hover:border-ink-400",
              )}
            >
              Yönetim paneli
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-brand-400"
          >
            Canlı demoyu aç
          </a>
          {adminDemoUrl && (
            <a
              href={adminDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              Panel demosu
            </a>
          )}
        </div>
      </div>

      {/* Cihaz çerçevesi */}
      <div className="mt-6 rounded-[var(--radius-card)] border border-ink-100 bg-surface-2 p-6 sm:p-10">
        <div className={cn("overflow-hidden rounded-2xl border-4 border-ink-800 bg-ink-800 shadow-[var(--shadow-lift)]", config.frame)}>
          {device !== "mobile" && (
            <div className="flex h-7 items-center gap-1.5 bg-ink-700 px-3">
              <span className="size-2 rounded-full bg-ink-600" />
              <span className="size-2 rounded-full bg-ink-600" />
              <span className="size-2 rounded-full bg-ink-600" />
              <span className="ml-3 truncate text-[0.65rem] text-ink-400">{showAdmin ? adminDemoUrl : demoUrl}</span>
            </div>
          )}
          <div className={cn("relative bg-surface", showAdmin ? "aspect-[16/10]" : config.ratio)}>
            <Image
              src={current.url}
              alt={current.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover object-top"
            />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-ink-400">
          Ekran görüntüsü {config.label.toLowerCase()} görünümünü temsil eder. Etkileşimli deneyim için
          “Canlı demoyu aç” butonunu kullanın.
        </p>
      </div>
    </div>
  );
}
