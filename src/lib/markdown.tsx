import type { ReactNode } from "react";

/**
 * Seed ve yönetim panelinden gelen içerikler basit Markdown alt kümesiyle yazılır
 * (## başlık, ### alt başlık, - liste, 1. sıralı liste, > alıntı, **kalın**, paragraf).
 * Harici bir Markdown kütüphanesine bağımlı olmamak için burada işlenir;
 * ham HTML kabul edilmez, bu yüzden XSS riski taşımaz.
 */
export function renderMarkdown(source: string): ReactNode {
  // Başlıkların altındaki paragraflarla yapışmasını önlemek için normalize et
  const normalized = source
    .replace(/^###\s+(.+)$/gm, "\n\n### $1\n\n")
    .replace(/^##\s+(.+)$/gm, "\n\n## $1\n\n")
    .replace(/^>\s+(.+)$/gm, "\n\n> $1\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const blocks = normalized.split(/\n{2,}/);

  return blocks.map((block, i) => {
    const trimmed = block.trim();

    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-8 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {inline(trimmed.slice(4))}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 text-xl font-black tracking-tight text-slate-950 sm:text-2xl lg:text-3xl border-b border-slate-100 pb-2">
          {inline(trimmed.slice(3))}
        </h2>
      );
    }
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote
          key={i}
          className="mt-6 rounded-2xl border-l-4 border-[#1f7a68] bg-[#1f7a68]/5 px-5 py-4 text-sm font-semibold italic leading-relaxed text-slate-800"
        >
          {inline(trimmed.replace(/^> ?/gm, ""))}
        </blockquote>
      );
    }
    if (/^- /m.test(trimmed)) {
      return (
        <ul key={i} className="mt-4 space-y-2">
          {trimmed.split("\n").map((line, j) => {
            const cleanLine = line.replace(/^- /, "").trim();
            if (!cleanLine) return null;
            return (
              <li key={j} className="flex gap-2.5 leading-relaxed text-slate-700 font-medium">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#1f7a68]" aria-hidden />
                <span>{inline(cleanLine)}</span>
              </li>
            );
          })}
        </ul>
      );
    }
    if (/^\d+\. /.test(trimmed)) {
      return (
        <ol key={i} className="mt-4 list-decimal space-y-2 pl-5">
          {trimmed.split("\n").map((line, j) => {
            const cleanLine = line.replace(/^\d+\.\s*/, "").trim();
            if (!cleanLine) return null;
            return (
              <li key={j} className="leading-relaxed text-slate-700 font-medium">
                {inline(cleanLine)}
              </li>
            );
          })}
        </ol>
      );
    }

    if (/^!\[(.*?)\]\((.+?)\)$/.test(trimmed)) {
      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.+?)\)$/);
      if (imgMatch) {
        return (
          <figure key={i} className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgMatch[2]}
              alt={imgMatch[1] || "Görsel"}
              className="w-full max-h-[500px] object-cover"
            />
            {imgMatch[1] && (
              <figcaption className="p-3 text-center text-xs font-bold text-slate-600 bg-white border-t border-slate-100">
                {imgMatch[1]}
              </figcaption>
            )}
          </figure>
        );
      }
    }

    return (
      <p key={i} className="mt-4 leading-relaxed text-slate-700 text-[15px] font-normal">
        {inline(trimmed)}
      </p>
    );
  });
}

/** **kalın**, *italik*, [bağlantı](url) ve ![görsel](url) işaretlerini çözer. */
function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // 1: Resim, 2: URL, 3: Kalın (**), 4: İtalik (* veya _), 5: Link Başlık, 6: Link URL
  const pattern = /!\[(.*?)\]\((.+?)\)|\*\*(.+?)\*\*|\*([^\*\n]+?)\*|_([^_\n]+?)_|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined && match[2]) {
      // Görsel
      parts.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key++}
          src={match[2]}
          alt={match[1] || "Görsel"}
          className="my-3 max-h-96 rounded-xl object-contain border border-slate-200"
        />,
      );
    } else if (match[3]) {
      // Kalın (**metin**)
      parts.push(
        <strong key={key++} className="font-black text-slate-950">
          {match[3]}
        </strong>,
      );
    } else if (match[4] || match[5]) {
      // İtalik (*metin* veya _metin_)
      parts.push(
        <em key={key++} className="italic font-medium text-slate-900">
          {match[4] || match[5]}
        </em>,
      );
    } else if (match[6] && match[7]) {
      // Link (Yazıya basıldığında başka sayfaya gitmesi için)
      let href = match[7].trim();
      if (
        !href.startsWith("http://") &&
        !href.startsWith("https://") &&
        !href.startsWith("/") &&
        !href.startsWith("#") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:")
      ) {
        href = "https://" + href;
      }

      // Sayfa içi çapa (#) değilse her zaman başka sayfada/yeni sekmede açılsın
      const openInNewTab = !href.startsWith("#");

      parts.push(
        <a
          key={key++}
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          title={openInNewTab ? `${match[6]} (Yeni sekmede açılır)` : match[6]}
          className="inline-flex items-center gap-1 font-bold text-[#1f7a68] underline decoration-[#1f7a68]/40 underline-offset-4 transition hover:text-[#176956] hover:decoration-[#176956] cursor-pointer"
        >
          <span>{match[6]}</span>
          {openInNewTab && (
            <svg
              className="inline-block size-3.5 shrink-0 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
        </a>,
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

/** Blog içeriğinden içindekiler listesi çıkarır. */
export function extractHeadings(source: string) {
  return source
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const title = l.slice(3).trim();
      return { title, id: slugifyHeading(title) };
    });
}

export function slugifyHeading(title: string) {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  };
  return title
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
