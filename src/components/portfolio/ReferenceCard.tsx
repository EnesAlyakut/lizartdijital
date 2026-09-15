import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ReferenceCardData = {
  id: string;
  slug: string;
  title: string;
  client: string;
  sector: string;
  summary: string;
  coverImage: string;
  mobileImage: string | null;
  liveUrl: string | null;
};

function toFastWebp(src: string): string {
  if (!src) return src;
  if (src.startsWith("/gorseller/referanslar/") && (src.endsWith(".png") || src.endsWith(".jpg"))) {
    return src.replace(/\.(png|jpg)$/i, ".webp");
  }
  return src;
}

export function ReferenceCard({
  project,
  size = "md",
}: {
  project: ReferenceCardData;
  size?: "md" | "lg";
}) {
  const host = project.liveUrl
    ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  const coverSrc = toFastWebp(project.coverImage);
  const mobileSrc = project.mobileImage ? toFastWebp(project.mobileImage) : null;

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-lg border border-[#b9c8b4] bg-white shadow-[0_24px_70px_-56px_rgb(20_31_20/.85)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6f8f68] hover:shadow-[0_36px_86px_-54px_rgb(20_31_20/.95)]">
      <div>
        <div className="relative border-b border-slate-200/80 bg-gradient-to-br from-slate-100/70 via-slate-50 to-slate-100/50 p-4 pb-7 sm:p-6 sm:pb-8">
          <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <div className="flex h-10 items-center justify-between gap-3 border-b border-[#d7e1d2] bg-white px-4">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                <span className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                <span className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
              </div>

              {host && (
                <div className="flex min-w-0 max-w-[260px] items-center gap-1.5 truncate rounded-md border border-[#d7e1d2] bg-[#f6f8f3] px-3 py-1 text-xs font-bold text-[#354238]">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-3 shrink-0 text-[#3f7a44]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  <span className="truncate">{host}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#1fa15a] animate-pulse" />
                <span className="hidden text-xs font-bold text-[#276d38] sm:inline">
                  Canlıda
                </span>
              </div>
            </div>

            <Link
              href={`/projeler/${project.slug}`}
              className="relative block aspect-[1024/538] w-full overflow-hidden bg-[#eef3ea]"
              tabIndex={-1}
              aria-hidden
            >
              <Image
                src={coverSrc}
                alt={project.title}
                fill
                loading="lazy"
                sizes={
                  size === "lg"
                    ? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 680px"
                    : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 480px"
                }
                className="object-contain sm:object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
            </Link>
          </div>

          {mobileSrc && (
            <div
              className={cn(
                "absolute hidden overflow-hidden rounded-lg border-[4px] border-[#111811] bg-[#111811] shadow-[0_24px_44px_-28px_rgb(0_0_0/.95)] ring-1 ring-white/80 sm:block transition-transform duration-500 group-hover:-translate-y-1",
                size === "lg" ? "-bottom-5 right-8 w-28 lg:w-32" : "-bottom-4 right-6 w-24",
              )}
            >
              <div className="flex justify-center bg-[#111811] pb-0.5 pt-1">
                <div className="h-1 w-6 rounded-full bg-white/20" />
              </div>
              <div className="relative aspect-[550/1024] overflow-hidden rounded-md bg-[#0a100b]">
                <Image
                  src={mobileSrc}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="160px"
                  className="object-cover object-top"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-md border border-[#b9c8b4] bg-[#eef3ea] px-3 py-1 text-xs font-bold text-[#244f2a]">
              {project.sector}
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#6d786d]">
              {project.client}
            </span>
          </div>

          <h3 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight text-[#111811] transition-colors group-hover:text-[#244f2a]">
            <Link href={`/projeler/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#354238] sm:text-base line-clamp-2">
            {project.summary}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d7e1d2] bg-[#fbfcfa] px-6 py-5 sm:px-8">
        <Link
          href={`/projeler/${project.slug}`}
          className="inline-flex items-center gap-2 rounded-md bg-[#17331b] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#244f2a]"
        >
          <span>Vaka Çalışmasını İncele</span>
          <span>→</span>
        </Link>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#b9c8b4] bg-white px-3.5 py-2 text-xs font-bold text-[#243024] shadow-2xs transition-colors hover:border-[#244f2a] hover:text-[#244f2a]"
          >
            <span>Canlı Siteyi Aç</span>
            <span className="font-bold text-[#244f2a]">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

export function BrowserFrame(_props: unknown) {
  // Geriye uyumluluk için
  return null;
}
