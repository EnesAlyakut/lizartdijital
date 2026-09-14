/**
 * Word Tarzı Doküman Düzenleyici (WYSIWYG) ile Veritabanı Markdown Formatı Arasında
 * İki Yönlü Çevirici Motor (Bidirectional Markdown <-> Word HTML Converter).
 */

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Markdown inline etiketlerini (kalın, italik, link, görsel) HTML'e çevirir */
function inlineMarkdownToHtml(text: string): string {
  // Önce HTML özel karakterlerini koru
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 1. Markdown Resim: ![alt](url)
  safe = safe.replace(/!\[(.*?)\]\((.+?)\)/g, (_match, alt, src) => {
    return `<img src="${src}" alt="${alt}" class="word-inline-img inline-block max-h-48 rounded-lg border border-slate-200 align-middle my-1" />`;
  });

  // 2. Kalın: **metin**
  safe = safe.replace(/\*\*(.+?)\*\*/g, (_match, boldText) => {
    return `<strong class="font-black text-black">${boldText}</strong>`;
  });

  // 3. İtalik: *metin* veya _metin_
  safe = safe.replace(/\*([^*\n]+?)\*/g, (_match, italicText) => {
    return `<em class="italic text-black font-medium">${italicText}</em>`;
  });
  safe = safe.replace(/_([^_\n]+?)_/g, (_match, italicText) => {
    return `<em class="italic text-black font-medium">${italicText}</em>`;
  });

  // 4. Link: [metin](url)
  safe = safe.replace(/\[(.+?)\]\((.+?)\)/g, (_match, linkText, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="word-doc-link text-[#1f7a68] underline decoration-[#1f7a68]/50 underline-offset-4 font-bold hover:text-[#176956] cursor-pointer">${linkText}</a>`;
  });

  return safe;
}

/**
 * Veritabanındaki Markdown içeriğini Word Doküman Tuvalinde görüntülenecek
 * zengin HTML yapısına dönüştürür.
 */
export function markdownToWordHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) {
    return "<p class='word-doc-p my-3.5 text-black'><br></p>";
  }

  const lines = markdown.split("\n");
  const result: string[] = [];

  let inUl = false;
  let inOl = false;
  let inQuote = false;
  let quoteBuffer: string[] = [];

  const closeList = () => {
    if (inUl) {
      result.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      result.push("</ol>");
      inOl = false;
    }
  };

  const closeQuote = () => {
    if (inQuote) {
      result.push(
        `<blockquote class="word-doc-quote my-4 rounded-xl border-l-4 border-[#1f7a68] bg-[#1f7a68]/5 px-5 py-3.5 italic text-black font-medium">${quoteBuffer
          .map(inlineMarkdownToHtml)
          .join("<br>")}</blockquote>`
      );
      inQuote = false;
      quoteBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Liste: Madde İmli (- item)
    if (/^- /.test(trimmed)) {
      closeQuote();
      if (inOl) closeList();
      if (!inUl) {
        result.push('<ul class="word-doc-ul list-disc pl-7 my-3 space-y-1.5 text-black">');
        inUl = true;
      }
      result.push(`<li>${inlineMarkdownToHtml(trimmed.slice(2))}</li>`);
      continue;
    }

    // 2. Liste: Numaralı (1. item)
    if (/^\d+\.\s+/.test(trimmed)) {
      closeQuote();
      if (inUl) closeList();
      if (!inOl) {
        result.push('<ol class="word-doc-ol list-decimal pl-7 my-3 space-y-1.5 text-black">');
        inOl = true;
      }
      const itemText = trimmed.replace(/^\d+\.\s+/, "");
      result.push(`<li>${inlineMarkdownToHtml(itemText)}</li>`);
      continue;
    }

    // Liste bitti
    closeList();

    // 3. Alıntı Kutusu (> alıntı)
    if (trimmed.startsWith(">")) {
      inQuote = true;
      quoteBuffer.push(trimmed.replace(/^>\s*/, ""));
      continue;
    } else {
      closeQuote();
    }

    // 4. Başlıklar (##, ###, #)
    if (trimmed.startsWith("### ")) {
      result.push(
        `<h3 class="word-doc-h3 text-xl sm:text-2xl font-black text-black mt-6 mb-2 tracking-tight">${inlineMarkdownToHtml(
          trimmed.slice(4)
        )}</h3>`
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      result.push(
        `<h2 class="word-doc-h2 text-2xl sm:text-3xl font-black text-black mt-8 mb-3 pb-2 border-b border-slate-200 tracking-tight">${inlineMarkdownToHtml(
          trimmed.slice(3)
        )}</h2>`
      );
      continue;
    }
    if (trimmed.startsWith("# ")) {
      result.push(
        `<h1 class="word-doc-h1 text-3xl sm:text-4xl font-black text-black mt-8 mb-4 tracking-tight">${inlineMarkdownToHtml(
          trimmed.slice(2)
        )}</h1>`
      );
      continue;
    }

    // 5. Bağımsız Görsel Bloğu: ![alt](url)
    const imgBlockMatch = trimmed.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (imgBlockMatch) {
      const alt = imgBlockMatch[1];
      const src = imgBlockMatch[2];
      result.push(
        `<figure class="word-doc-figure my-6 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3 text-center shadow-xs select-none relative group" contenteditable="false" data-word-img="true">` +
          `<div class="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition z-10" data-ignore-markdown="true">` +
          `<button type="button" data-del-img="true" title="Görseli Belgeden Kaldır" class="inline-flex items-center gap-1 rounded-xl bg-red-600/90 hover:bg-red-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-md cursor-pointer transition">🗑️ Görseli Sil</button>` +
          `</div>` +
          `<img src="${src}" alt="${escapeHtml(alt)}" class="mx-auto max-h-[460px] rounded-xl object-contain border border-slate-200/90 shadow-2xs" />` +
          `<figcaption contenteditable="true" class="mt-2.5 text-center text-xs font-bold text-slate-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1f7a68]/40 rounded-lg p-1 transition empty:before:content-['Fotoğraf_açıklaması_yazın...'] empty:before:text-slate-400">${escapeHtml(
            alt || ""
          )}</figcaption>` +
          `</figure>`
      );
      continue;
    }

    // 6. Boş Satır
    if (!trimmed) {
      continue;
    }

    // 7. Normal Paragraf
    result.push(
      `<p class="word-doc-p text-base sm:text-[17px] leading-[1.85] text-black font-normal my-3.5">${inlineMarkdownToHtml(
        trimmed
      )}</p>`
    );
  }

  closeList();
  closeQuote();

  return result.join("") || "<p class='word-doc-p my-3.5 text-black'><br></p>";
}

/**
 * Word Doküman Tuvali içindeki DOM elemanlarını temiz Markdown sözdizimine dönüştürür.
 */
export function wordDomToMarkdown(container: HTMLElement): string {
  const parts: string[] = [];

  const serializeInline = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue || "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    // Görsel kartı veya bağımsız görsel
    if (el.getAttribute("data-word-img") === "true" || tag === "figure") {
      const img = el.querySelector("img");
      if (img) {
        const src = img.getAttribute("src") || "";
        const alt = img.getAttribute("alt") || el.querySelector("figcaption")?.textContent?.trim() || "";
        return `\n\n![${alt}](${src})\n\n`;
      }
      return "";
    }

    if (tag === "img") {
      const src = el.getAttribute("src") || "";
      const alt = el.getAttribute("alt") || "";
      return `![${alt}](${src})`;
    }

    if (tag === "strong" || tag === "b") {
      const inner = Array.from(el.childNodes).map(serializeInline).join("").trim();
      return inner ? `**${inner}**` : "";
    }

    if (tag === "em" || tag === "i") {
      const inner = Array.from(el.childNodes).map(serializeInline).join("").trim();
      return inner ? `*${inner}*` : "";
    }

    if (tag === "a") {
      const href = el.getAttribute("href") || "#";
      const inner = Array.from(el.childNodes).map(serializeInline).join("").trim();
      return `[${inner || "Link"}](${href})`;
    }

    if (tag === "br") {
      return "\n";
    }

    return Array.from(el.childNodes).map(serializeInline).join("");
  };

  const children = Array.from(container.childNodes);

  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.nodeValue?.trim();
      if (text) {
        parts.push(text);
      }
      continue;
    }

    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    const el = child as HTMLElement;
    const tag = el.tagName.toLowerCase();

    // Resim Kartı / Figure
    if (el.getAttribute("data-word-img") === "true" || tag === "figure") {
      const img = el.querySelector("img");
      if (img) {
        const src = img.getAttribute("src") || "";
        const alt = img.getAttribute("alt") || el.querySelector("figcaption")?.textContent?.trim() || "";
        if (src) {
          parts.push(`![${alt}](${src})`);
        }
      }
      continue;
    }

    if (tag === "h1") {
      const text = el.textContent?.trim();
      if (text) parts.push(`# ${text}`);
      continue;
    }

    if (tag === "h2") {
      const text = el.textContent?.trim();
      if (text) parts.push(`## ${text}`);
      continue;
    }

    if (tag === "h3") {
      const text = el.textContent?.trim();
      if (text) parts.push(`### ${text}`);
      continue;
    }

    if (tag === "blockquote") {
      const text = Array.from(el.childNodes).map(serializeInline).join("").trim();
      if (text) {
        const lines = text.split("\n").map((l) => `> ${l}`).join("\n");
        parts.push(lines);
      }
      continue;
    }

    if (tag === "ul") {
      const lis = Array.from(el.querySelectorAll(":scope > li"));
      const listItems = lis
        .map((li) => `- ${Array.from(li.childNodes).map(serializeInline).join("").trim()}`)
        .filter((l) => l !== "- ");
      if (listItems.length > 0) {
        parts.push(listItems.join("\n"));
      }
      continue;
    }

    if (tag === "ol") {
      const lis = Array.from(el.querySelectorAll(":scope > li"));
      const listItems = lis
        .map((li, idx) => `${idx + 1}. ${Array.from(li.childNodes).map(serializeInline).join("").trim()}`)
        .filter((l) => !/^\d+\.\s*$/.test(l));
      if (listItems.length > 0) {
        parts.push(listItems.join("\n"));
      }
      continue;
    }

    // Paragraf veya Div
    const inlineContent = Array.from(el.childNodes).map(serializeInline).join("").trim();
    if (inlineContent) {
      parts.push(inlineContent);
    }
  }

  return parts.join("\n\n");
}
