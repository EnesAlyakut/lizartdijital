"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createBlogPost,
  deleteBlogPost,
  toggleBlogPublished,
  updateBlogPost,
  createBlogCategory,
} from "@/lib/actions/admin";
import { ActionButton, AdminForm } from "@/components/admin/ui";
import { renderMarkdown } from "@/lib/markdown";
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Sparkles,
  Search,
  Eye,
  Tag,
  CheckCircle2,
  Layers,
  FileText,
  Edit3,
  Trash2,
  HelpCircle,
  Calendar,
  ExternalLink,
  Archive,
  X,
  UploadCloud,
  ArrowLeft,
  Clock,
  Save,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Check,
  Globe,
  Settings,
  RefreshCw,
  FileSpreadsheet,
  Undo2,
  Redo2,
  Type,
  Unlink,
  Plus,
} from "lucide-react";
import {
  escapeHtml,
  markdownToWordHtml,
  wordDomToMarkdown,
} from "@/lib/wordConverter";

const QUICK_LINKS = [
  { label: "Hizmetlerimiz", url: "/hizmetler" },
  { label: "Projeler / Referanslar", url: "/projeler" },
  { label: "Blog Yazıları", url: "/blog" },
  { label: "İletişim", url: "/iletisim" },
  { label: "Demolar", url: "/demo-merkezi" },
  { label: "Hakkımızda", url: "/kurumsal/hakkimizda" },
  { label: "Paketler & Fiyatlar", url: "/magaza" },
];

export function BlogCreateForm({
  categories,
  post,
  redirectTo = "/admin/blog",
}: {
  categories: { id: string; name: string }[];
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    coverImage: string;
    authorName: string;
    authorTitle?: string | null;
    categoryId: string;
    publishedAt?: Date | string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    isPublished: boolean;
  } | null;
  redirectTo?: string;
}) {
  const router = useRouter();
  const isEditing = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(
    post?.body ??
      "## Giriş\n\nBu yazıda dijital dünyada işletmenizi öne çıkaracak en kritik stratejileri ele alıyoruz.\n\n## Temel İpuçları\n\n- Hızlı ve modern web arayüzleri\n- Güçlü SEO mimarisi ve zengin içerikler\n- Dönüşüm odaklı kullanıcı deneyimi\n\n## Sonuç\n\nDoğru dijital altyapı ile sürdürülebilir büyüme yakalayabilirsiniz."
  );
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "/logo.svg");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? "");
  const [keywords, setKeywords] = useState(post?.authorTitle ?? "web tasarım, seo, kurumsal web");
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt
      ? new Date(post.publishedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? true);
  const [showAdvancedSeo, setShowAdvancedSeo] = useState(false);
  const [categoryList, setCategoryList] = useState(categories);
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? categories[0]?.id ?? "");

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  // Hızlı Kategori Ekleme Modal Durumları
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  async function handleCreateQuickCategory(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!newCategoryName.trim()) {
      setCategoryError("Lütfen bir kategori adı giriniz.");
      return;
    }
    setIsCreatingCategory(true);
    setCategoryError("");
    try {
      const formData = new FormData();
      formData.set("name", newCategoryName.trim());
      formData.set("slug", slugify(newCategoryName.trim()));
      const res = (await createBlogCategory(formData)) as {
        ok: boolean;
        id?: string;
        name?: string;
        slug?: string;
        error?: string;
      };
      if (!res.ok) {
        setCategoryError(res.error || "Kategori oluşturulamadı.");
        return;
      }
      const newCat = {
        id: res.id || String(Date.now()),
        name: newCategoryName.trim(),
      };
      setCategoryList((prev) => {
        if (prev.some((c) => c.name.toLowerCase() === newCat.name.toLowerCase())) {
          return prev;
        }
        return [...prev, newCat];
      });
      setCategoryId(newCat.id);
      setNewCategoryName("");
      setNewCategoryModalOpen(false);
    } catch (err: unknown) {
      setCategoryError(err instanceof Error ? err.message : "Kategori eklenirken bir hata oluştu.");
    } finally {
      setIsCreatingCategory(false);
    }
  }

  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Başlık alanı otomatik yükseklik
  const adjustTitleHeight = () => {
    const el = titleTextareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(48, el.scrollHeight)}px`;
  };

  useEffect(() => {
    adjustTitleHeight();
  }, [title]);

  // ─── WORD BELGE DÜZENLEYİCİ DURUMLARI ───
  const editorRef = useRef<HTMLDivElement>(null);
  const savedWordRangeRef = useRef<Range | null>(null);
  const savedWordTextRef = useRef<string>("");
  const hasInitializedWordRef = useRef(false);

  // Yazı içine link ekleme modal durumları
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(true);
  const activeLinkElementRef = useRef<HTMLAnchorElement | null>(null);
  const [isEditingExistingLink, setIsEditingExistingLink] = useState(false);

  // Yüzen link balonu (tıklanan linkin hemen üstünde çıkan mini araç kutusu)
  const [floatingLinkBubble, setFloatingLinkBubble] = useState<{
    visible: boolean;
    x: number;
    y: number;
    url: string;
    text: string;
    element: HTMLAnchorElement | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    url: "",
    text: "",
    element: null,
  });

  // Belge tuvali üzerine sürükle-bırak görsel bırakma durumu
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Yazı içine görsel ekleme modal durumları
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageSourceTab, setImageSourceTab] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [imageSelectionText, setImageSelectionText] = useState("");
  const [isUploadingModalImage, setIsUploadingModalImage] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Cihazdan Kapak Görseli Yükleme Durumu
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState(false);
  const coverImageFileInputRef = useRef<HTMLInputElement>(null);

  // Word Belge Tuvalini yüklemede veritabanındaki içerik ile başlat
  useEffect(() => {
    if (editorRef.current && (!hasInitializedWordRef.current || !editorRef.current.innerHTML.trim())) {
      if (body) {
        editorRef.current.innerHTML = markdownToWordHtml(body);
        hasInitializedWordRef.current = true;
      }
    }
  }, [body]);

  // Word Tuvali seçim ve imleç konumunu kaydet (element ve text node uyumlu)
  const saveWordSelection = useCallback(() => {
    if (typeof window === "undefined" || !editorRef.current) return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const isInside =
        editorRef.current === container ||
        editorRef.current.contains(container) ||
        (container.nodeType === Node.TEXT_NODE &&
          container.parentNode &&
          editorRef.current.contains(container.parentNode));

      if (isInside) {
        savedWordRangeRef.current = range.cloneRange();
        savedWordTextRef.current = sel.toString();

        // İmleç veya seçim bir bağlantının (<a>) üzerinde mi?
        let anchor: HTMLAnchorElement | null = null;
        if (container.nodeType === Node.ELEMENT_NODE && (container as HTMLElement).tagName === "A") {
          anchor = container as HTMLAnchorElement;
        } else if (container.parentNode && (container.parentNode as HTMLElement).tagName === "A") {
          anchor = container.parentNode as HTMLAnchorElement;
        } else {
          const startEl = range.startContainer.parentElement;
          if (startEl) {
            anchor = startEl.closest("a");
          }
        }

        if (anchor && editorRef.current.contains(anchor)) {
          activeLinkElementRef.current = anchor;
          setIsEditingExistingLink(true);
        } else {
          activeLinkElementRef.current = null;
          setIsEditingExistingLink(false);
        }
      }
    }
  }, []);

  // Belge genelinde imleç veya seçim her değiştiğinde konumu anlık yakala
  useEffect(() => {
    const handleSelectionChange = () => {
      saveWordSelection();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [saveWordSelection]);

  // Word Tuvali içerisindeki değişiklikleri anında Markdown formatına senkronize et
  const syncFromWordEditor = () => {
    if (!editorRef.current) return;
    const md = wordDomToMarkdown(editorRef.current);
    setBody(md);
  };

  // Otomatik slugify fonksiyonu
  function slugify(text: string) {
    const trMap: Record<string, string> = {
      ç: "c",
      Ç: "c",
      ğ: "g",
      Ğ: "g",
      ı: "i",
      İ: "i",
      ö: "o",
      Ö: "o",
      ş: "s",
      Ş: "s",
      ü: "u",
      Ü: "u",
    };
    return text
      .split("")
      .map((char) => trMap[char] || char)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 100);
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
    if (!metaTitle || metaTitle === title) {
      setMetaTitle(val.slice(0, 70));
    }
  }

  function handleExcerptChange(val: string) {
    setExcerpt(val);
    if (!metaDescription || metaDescription === excerpt) {
      setMetaDescription(val.slice(0, 160));
    }
  }

  // 1. Kalın Yapma / Kaldırma (Word belgesinde seçilen yazıyı anında görsel kalın yapar)
  function handleBold() {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand("bold", false);
    syncFromWordEditor();
    saveWordSelection();
  }

  // 2. İtalik Yapma / Kaldırma (Word belgesinde seçilen yazıyı anında görsel italik yapar)
  function handleItalic() {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand("italic", false);
    syncFromWordEditor();
    saveWordSelection();
  }

  // 3. Başlık Yapma (H2 / H3)
  function handleHeading(level: 2 | 3) {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const tag = level === 2 ? "<h2>" : "<h3>";
    document.execCommand("formatBlock", false, tag);
    syncFromWordEditor();
    saveWordSelection();
  }

  // 4. Paragraf (Normal Metin) Yapma
  function handleParagraph() {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand("formatBlock", false, "<p>");
    syncFromWordEditor();
    saveWordSelection();
  }

  // 5. Madde İmli Liste
  function handleBulletList() {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand("insertUnorderedList", false);
    syncFromWordEditor();
    saveWordSelection();
  }

  // 6. Numaralı Liste
  function handleNumberedList() {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand("insertOrderedList", false);
    syncFromWordEditor();
    saveWordSelection();
  }

  // 7. Alıntı Kutusu
  function handleQuote() {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand("formatBlock", false, "<blockquote>");
    syncFromWordEditor();
    saveWordSelection();
  }

  // 8. Geri Al / Yinele
  function handleUndo() {
    document.execCommand("undo", false);
    syncFromWordEditor();
  }
  function handleRedo() {
    document.execCommand("redo", false);
    syncFromWordEditor();
  }

  // ─── LİNK EKLEME / DÜZENLEME MODALI AÇMA ───
  function handleAddLink(targetAnchor?: HTMLAnchorElement | null) {
    saveWordSelection();
    const anchor = targetAnchor || activeLinkElementRef.current;

    if (anchor && editorRef.current?.contains(anchor)) {
      // Var olan linki düzenleme modu
      activeLinkElementRef.current = anchor;
      setIsEditingExistingLink(true);
      setLinkText(anchor.textContent || "");
      setLinkUrl(anchor.getAttribute("href") || "");
      setLinkOpenInNewTab(anchor.getAttribute("target") !== "_self");
    } else {
      // Yeni link ekleme modu
      activeLinkElementRef.current = null;
      setIsEditingExistingLink(false);
      const sel = typeof window !== "undefined" ? window.getSelection() : null;
      const liveSelected = sel && sel.toString() ? sel.toString() : "";
      const selected = (liveSelected || savedWordTextRef.current || "").trim();
      setLinkText(selected);
      setLinkUrl("https://");
      setLinkOpenInNewTab(true);
    }
    setFloatingLinkBubble((prev) => ({ ...prev, visible: false }));
    setLinkModalOpen(true);
  }

  // ─── BAĞLANTIYI KALDIR (UNLINK) ───
  function handleUnlink(anchorElement?: HTMLAnchorElement | null) {
    const targetA = anchorElement || activeLinkElementRef.current;
    if (!targetA || !editorRef.current || !editorRef.current.contains(targetA)) return;

    const text = targetA.textContent || "";
    const textNode = document.createTextNode(text);
    targetA.parentNode?.replaceChild(textNode, targetA);

    syncFromWordEditor();
    setFloatingLinkBubble({ visible: false, x: 0, y: 0, url: "", text: "", element: null });
    setLinkModalOpen(false);
    activeLinkElementRef.current = null;
    setIsEditingExistingLink(false);
  }

  // ─── LİNKİ KAYDETME / GÜNCELLEME ───
  function handleSaveLink(e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) {
    if (e) e.preventDefault();
    let finalUrl = linkUrl.trim();
    if (!finalUrl || finalUrl === "https://" || finalUrl === "http://") {
      alert("Lütfen geçerli bir web adresi veya link giriniz (Örn: https://google.com veya /hizmetler).");
      return;
    }

    finalUrl = finalUrl.replace(/^(https?:\/\/)+/, "https://");

    if (
      !finalUrl.startsWith("http://") &&
      !finalUrl.startsWith("https://") &&
      !finalUrl.startsWith("/") &&
      !finalUrl.startsWith("#") &&
      !finalUrl.startsWith("mailto:") &&
      !finalUrl.startsWith("tel:")
    ) {
      finalUrl = "https://" + finalUrl;
    }

    const displayText = linkText.trim() || savedWordTextRef.current || finalUrl;

    if (!editorRef.current) {
      setLinkModalOpen(false);
      return;
    }

    editorRef.current.focus();
    const sel = window.getSelection();

    // 1. Var olan link güncelleniyorsa
    if (activeLinkElementRef.current && editorRef.current.contains(activeLinkElementRef.current)) {
      const a = activeLinkElementRef.current;
      a.href = finalUrl;
      a.textContent = displayText;
      if (linkOpenInNewTab) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      } else {
        a.removeAttribute("target");
        a.removeAttribute("rel");
      }
      a.className =
        "word-doc-link text-[#1f7a68] underline decoration-[#1f7a68]/50 underline-offset-4 font-bold hover:text-[#176956] cursor-pointer";
      syncFromWordEditor();
      setLinkModalOpen(false);
      activeLinkElementRef.current = null;
      return;
    }

    // 2. Yeni link oluşturuluyorsa
    const a = document.createElement("a");
    a.href = finalUrl;
    if (linkOpenInNewTab) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    a.className =
      "word-doc-link text-[#1f7a68] underline decoration-[#1f7a68]/50 underline-offset-4 font-bold hover:text-[#176956] cursor-pointer";
    a.textContent = displayText;

    // Link sonrasına boşluk ekle ki yazarken metin linkin içine sıkışmasın
    const spaceNode = document.createTextNode("\u00A0");

    let range = savedWordRangeRef.current;
    if (!range && sel && sel.rangeCount > 0) {
      const currentSelRange = sel.getRangeAt(0);
      if (
        editorRef.current === currentSelRange.commonAncestorContainer ||
        editorRef.current.contains(currentSelRange.commonAncestorContainer)
      ) {
        range = currentSelRange;
      }
    }

    if (
      range &&
      (editorRef.current === range.commonAncestorContainer ||
        editorRef.current.contains(range.commonAncestorContainer))
    ) {
      try {
        range.deleteContents();
        range.insertNode(spaceNode);
        range.insertNode(a);

        // İmleci spaceNode sonrasına taşı
        const nextRange = document.createRange();
        nextRange.setStartAfter(spaceNode);
        nextRange.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(nextRange);
        savedWordRangeRef.current = nextRange.cloneRange();
      } catch {
        editorRef.current.appendChild(a);
        editorRef.current.appendChild(spaceNode);
      }
    } else {
      editorRef.current.appendChild(a);
      editorRef.current.appendChild(spaceNode);
    }

    syncFromWordEditor();
    setLinkModalOpen(false);
    activeLinkElementRef.current = null;
  }

  // ─── GÖRSEL ELEMANI OLUŞTURMA YARDIMCISI ───
  function createFigureElement(src: string, altText: string) {
    const figure = document.createElement("figure");
    figure.className =
      "word-doc-figure my-6 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3 text-center shadow-xs select-none relative group transition-all hover:border-[#1f7a68]/40";
    figure.setAttribute("contenteditable", "false");
    figure.setAttribute("data-word-img", "true");

    const topBar = document.createElement("div");
    topBar.className =
      "absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition z-10";
    topBar.setAttribute("data-ignore-markdown", "true");

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.setAttribute("data-del-img", "true");
    deleteBtn.title = "Görseli Belgeden Kaldır";
    deleteBtn.className =
      "inline-flex items-center gap-1 rounded-xl bg-red-600/90 hover:bg-red-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-md cursor-pointer transition";
    deleteBtn.innerHTML = `<span>🗑️ Görseli Sil</span>`;
    topBar.appendChild(deleteBtn);
    figure.appendChild(topBar);

    const img = document.createElement("img");
    img.src = src;
    img.alt = altText || "Görsel";
    img.className =
      "mx-auto max-h-[460px] rounded-xl object-contain border border-slate-200/90 shadow-2xs";
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.setAttribute("contenteditable", "true");
    figcaption.className =
      "mt-2.5 text-center text-xs font-bold text-slate-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1f7a68]/40 rounded-lg p-1 transition empty:before:content-['Fotoğraf_açıklaması_yazın...'] empty:before:text-slate-400";
    figcaption.textContent = altText;
    figure.appendChild(figcaption);

    return figure;
  }

  // ─── WORD BELGE TUVALİNDE İMLECİN TAM BULUNDUĞU NOKTAYA GÖRSEL YERLEŞTİRME ───
  function insertFigureAtRange(figureNode: HTMLElement, targetRange: Range | null) {
    if (!editorRef.current) return;

    // Görselin altına kullanıcının yazmaya devam edebileceği yeni paragraf
    const nextP = document.createElement("p");
    nextP.className = "word-doc-p text-base sm:text-[17px] leading-[1.85] text-black my-3.5";
    nextP.innerHTML = "<br>";

    // İmleci elemana odaklama yardımcısı
    const placeCursorIn = (node: HTMLElement) => {
      setTimeout(() => {
        try {
          const sel = window.getSelection();
          const r = document.createRange();
          r.selectNodeContents(node);
          r.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(r);
          savedWordRangeRef.current = r.cloneRange();
        } catch {}
      }, 40);
    };

    if (!targetRange) {
      editorRef.current.appendChild(figureNode);
      editorRef.current.appendChild(nextP);
      placeCursorIn(nextP);
      return;
    }

    const container: Node = targetRange.commonAncestorContainer;

    // Eğer doğrudan editorRef seçiliyse (boş alana veya iki blok arasına tıklandıysa)
    if (container === editorRef.current) {
      const childNodes = Array.from(editorRef.current.childNodes);
      const offset = Math.min(targetRange.startOffset, childNodes.length);
      const refNode = childNodes[offset] || null;
      if (refNode) {
        editorRef.current.insertBefore(figureNode, refNode);
        editorRef.current.insertBefore(nextP, refNode);
      } else {
        editorRef.current.appendChild(figureNode);
        editorRef.current.appendChild(nextP);
      }
      placeCursorIn(nextP);
      return;
    }

    // editorRef'in doğrudan çocuğu olan ata bloğu bul
    let topBlock: Node | null = container;
    while (topBlock && topBlock.parentNode && topBlock.parentNode !== editorRef.current) {
      topBlock = topBlock.parentNode;
    }

    if (!topBlock || topBlock.parentNode !== editorRef.current) {
      editorRef.current.appendChild(figureNode);
      editorRef.current.appendChild(nextP);
      placeCursorIn(nextP);
      return;
    }

    // Seçili metin varsa kaldır
    if (!targetRange.collapsed) {
      try {
        targetRange.deleteContents();
      } catch {}
    }

    // topBlock bir P (paragraf) ise
    if (topBlock.nodeName === "P") {
      const pText = topBlock.textContent || "";
      const isBlankP = !pText.trim() || pText === "\n";

      if (isBlankP) {
        // Boş satırın yerine doğrudan görseli koy
        editorRef.current.replaceChild(figureNode, topBlock);
        editorRef.current.insertBefore(nextP, figureNode.nextSibling);
        placeCursorIn(nextP);
        return;
      }

      // Paragraf içinde imleç neredeyse oradan sonrasını böl ve yeni paragrafa taşı
      try {
        const splitRange = document.createRange();
        splitRange.setStart(targetRange.endContainer, targetRange.endOffset);
        splitRange.setEndAfter(topBlock.lastChild || topBlock);
        const extractedFragment = splitRange.extractContents();

        if (extractedFragment && extractedFragment.textContent && extractedFragment.textContent.trim().length > 0) {
          nextP.innerHTML = "";
          nextP.appendChild(extractedFragment);
        }
      } catch {}

      if (topBlock.nextSibling) {
        editorRef.current.insertBefore(figureNode, topBlock.nextSibling);
        editorRef.current.insertBefore(nextP, figureNode.nextSibling);
      } else {
        editorRef.current.appendChild(figureNode);
        editorRef.current.appendChild(nextP);
      }
      placeCursorIn(nextP);
      return;
    }

    // Başlık, liste, alıntı veya diğer bloklar
    if (topBlock.nextSibling) {
      editorRef.current.insertBefore(figureNode, topBlock.nextSibling);
      editorRef.current.insertBefore(nextP, figureNode.nextSibling);
    } else {
      editorRef.current.appendChild(figureNode);
      editorRef.current.appendChild(nextP);
    }
    placeCursorIn(nextP);
  }

  // Belirli konuma görsel ekleme
  function insertImageAtLocation(src: string, altText: string, targetRange: Range | null) {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const figure = createFigureElement(src, altText);
    insertFigureAtRange(figure, targetRange);
    syncFromWordEditor();
  }

  // ─── GÖRSEL EKLEME MODALI AÇMA ───
  function handleOpenImageModal() {
    saveWordSelection();
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    const liveSelected = sel && sel.toString() ? sel.toString() : "";
    const selected = (liveSelected || savedWordTextRef.current || "").trim();
    setImageSelectionText(selected);
    setImageAltText(selected);
    setImageUrl("");
    setImageSourceTab("upload");
    setImageModalOpen(true);
  }

  // Modal içinden cihazdan dosya yükleme
  async function handleModalFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingModalImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Görsel yüklenemedi.");
      }

      setImageUrl(data.url);
      if (!imageAltText) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .trim();
        setImageAltText(savedWordTextRef.current || cleanName || "Görsel");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Görsel yüklenirken bir hata oluştu.";
      alert(msg);
    } finally {
      setIsUploadingModalImage(false);
      if (modalFileInputRef.current) {
        modalFileInputRef.current.value = "";
      }
    }
  }

  // ─── GÖRSELİ MAKALE SAYFASINA (İMLECİN TAM OLDUĞU YERE) EKLEME ───
  function handleSaveImage(e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) {
    if (e) e.preventDefault();
    if (!imageUrl.trim()) return;

    const alt = imageAltText.trim() || savedWordTextRef.current || "Görsel";
    insertImageAtLocation(imageUrl.trim(), alt, savedWordRangeRef.current);
    setImageModalOpen(false);
  }

  // ─── BELGE TUVALİ SÜRÜKLE-BIRAK GÖRSEL YÜKLEME ───
  const handleEditorDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleEditorDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Sadece tuval dışına çıkıldığında kaldır
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleEditorDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        e.preventDefault();
        e.stopPropagation();

        // İmleç konumunu farenin bırakıldığı noktaya ayarla
        let dropRange: Range | null = null;
        if (document.caretRangeFromPoint) {
          dropRange = document.caretRangeFromPoint(e.clientX, e.clientY);
        } else if ((document as unknown as { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } }).caretPositionFromPoint) {
          const pos = (document as unknown as { caretPositionFromPoint: (x: number, y: number) => { offsetNode: Node; offset: number } }).caretPositionFromPoint(e.clientX, e.clientY);
          if (pos) {
            dropRange = document.createRange();
            dropRange.setStart(pos.offsetNode, pos.offset);
            dropRange.collapse(true);
          }
        }

        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            throw new Error(data.error || "Görsel yüklenemedi.");
          }

          const cleanName = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ")
            .trim();
          insertImageAtLocation(data.url, cleanName, dropRange || savedWordRangeRef.current);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Görsel yüklenirken bir hata oluştu.";
          alert(msg);
        }
      }
    }
  };

  // ─── PANODAN GÖRSEL YAPIŞTIRMA (Ctrl + V / Ekran Görüntüsü) ───
  const handleEditorPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            e.stopPropagation();
            try {
              const formData = new FormData();
              formData.append("file", file);
              const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              if (!res.ok || !data.ok) {
                throw new Error(data.error || "Görsel yüklenemedi.");
              }

              insertImageAtLocation(data.url, "Ekran Görüntüsü", savedWordRangeRef.current);
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Görsel yapıştırılamadı.";
              alert(msg);
            }
            return;
          }
        }
      }
    }
  };

  // ─── TUVAL ÜZERİNDEKİ TIKLAMALARI YAKALAMA (Görsel Silme & Link Popover) ───
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // 1. Görsel silme butonuna tıklandıysa
    const delBtn = target.closest("[data-del-img]");
    if (delBtn) {
      e.preventDefault();
      e.stopPropagation();
      const fig = delBtn.closest("figure");
      if (fig) {
        fig.remove();
        syncFromWordEditor();
      }
      return;
    }

    // 2. Bir linke (<a>) tıklandıysa
    const anchor = target.closest("a") as HTMLAnchorElement | null;
    if (anchor && editorRef.current?.contains(anchor)) {
      e.preventDefault();
      e.stopPropagation();

      const rect = anchor.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();

      activeLinkElementRef.current = anchor;
      setIsEditingExistingLink(true);

      setFloatingLinkBubble({
        visible: true,
        x: rect.left - editorRect.left + rect.width / 2,
        y: rect.top - editorRect.top - 6,
        url: anchor.getAttribute("href") || "",
        text: anchor.textContent || "",
        element: anchor,
      });
      return;
    } else {
      if (floatingLinkBubble.visible) {
        setFloatingLinkBubble((prev) => ({ ...prev, visible: false }));
      }
    }

    saveWordSelection();
  };

  // Word Tuvalinde Klavye Kısayolları (Ctrl+B, Ctrl+I, Ctrl+K)
  const handleWordKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleBold();
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        handleItalic();
      } else if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleAddLink();
      }
    }
  };

  // Cihazdan kapak görseli yükleme fonksiyonu
  async function handleCoverImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCoverImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Kapak görseli yüklenemedi.");
      }

      setCoverImage(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Görsel yüklenirken bir hata oluştu.";
      alert(msg);
    } finally {
      setIsUploadingCoverImage(false);
      if (coverImageFileInputRef.current) {
        coverImageFileInputRef.current.value = "";
      }
    }
  }

  // Canlı kelime ve okuma süresi hesaplama
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  // Anahtar kelime listesi
  const keywordList = keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  // Form gönderilmeden önce en güncel Word içeriğini, özeti ve slug'ı DOM üzerinde garanti et
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 1. Word tuvalindeki en güncel metni ve DOM'u anında markdown yap ve gizli input'a aktar
    if (editorRef.current) {
      const md = wordDomToMarkdown(editorRef.current);
      setBody(md);
      const bodyInput = e.currentTarget.elements.namedItem("body") as HTMLInputElement;
      if (bodyInput) {
        bodyInput.value = md;
      }
    }

    // 2. Eğer özet boş bırakıldıysa, içerikten ve başlıktan otomatik üret
    const excerptInput = e.currentTarget.elements.namedItem("excerpt") as HTMLTextAreaElement;
    if (excerptInput && (!excerptInput.value || excerptInput.value.trim().length < 3)) {
      const rawText = editorRef.current?.innerText?.trim() || title || "Lizart Dijital Rehber";
      const autoExcerpt = rawText.slice(0, 160).replace(/\s+/g, " ");
      excerptInput.value = autoExcerpt;
      setExcerpt(autoExcerpt);
    }

    // 3. Slug boşsa başlıktan otomatik slugify yap
    const slugInput = e.currentTarget.elements.namedItem("slug") as HTMLInputElement;
    if (slugInput && !slugInput.value.trim()) {
      const autoSlug = slugify(title || "yeni-blog-yazisi");
      slugInput.value = autoSlug;
      setSlug(autoSlug);
    }

    // 4. Kapak görseli boşsa varsayılan logo yap
    const coverInput = e.currentTarget.elements.namedItem("coverImage") as HTMLInputElement;
    if (coverInput && !coverInput.value.trim()) {
      coverInput.value = "/logo.svg";
      setCoverImage("/logo.svg");
    }
  };

  return (
    <AdminForm
      action={isEditing ? (formData) => updateBlogPost(post!.id, formData) : createBlogPost}
      submitLabel={isEditing ? "Değişiklikleri Kaydet" : "Yazıyı Oluştur"}
      redirectTo={redirectTo}
      onSubmit={handleFormSubmit}
      className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-50px_rgb(15_23_42/.5)] lg:p-8"
    >
      {/* ─── 1. ÜST YAPIŞKAN VE FERAH YÖNETİM ÇUBUĞU (Sticky Action Bar) ─── */}
      <div className="sticky top-2 z-40 mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-3 shadow-[0_12px_30px_-15px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all sm:px-6">
        {/* Sol Taraf: Geri Dönüş & Makale Başlık Özeti */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-950 transition cursor-pointer shrink-0"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" />
            <span>Blog Listesine Dön</span>
          </Link>

          <div className="hidden h-5 w-px bg-slate-200 sm:block shrink-0" />

          {/* Makale Başlığı İpucu */}
          <span className="hidden sm:inline truncate max-w-[200px] lg:max-w-md text-xs font-bold text-slate-500">
            {title ? title : isEditing ? "Makale Düzenleniyor" : "Yeni Makale Yazılıyor"}
          </span>
        </div>

        {/* Sağ Taraf: İstatistikler, Canlı Durum Rozeti & Kaydet Butonları */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Kelime & Okuma Süresi */}
          <div className="hidden items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-1.5 text-xs font-bold text-slate-600 md:flex">
            <span className="flex items-center gap-1">
              <FileText size={13} className="text-slate-400" />
              {wordCount} kelime
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-slate-400" />
              ~{readingTime} dk okuma
            </span>
          </div>

          {/* Canlı Yayın Durumu Rozeti */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black transition ${
              isPublished
                ? "bg-emerald-50 text-[#1f7a68] border border-emerald-200/80"
                : "bg-amber-50 text-amber-700 border border-amber-200/80"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            {isPublished ? "Yayında" : "Taslak"}
          </span>

          {/* Makaleyi Sil Butonu (Düzenlemede) */}
          {isEditing && (
            <ActionButton
              action={async () => {
                const res = await deleteBlogPost(post!.id);
                if (res.ok) {
                  router.push("/admin/blog");
                }
                return res;
              }}
              label="Sil"
              pendingLabel="Siliniyor…"
              variant="danger"
              confirmText="Bu makaleyi kalıcı olarak silmek istediğinizden emin misiniz?"
            />
          )}

          {/* Sitedeki Blog Sayfasını Aç Butonu */}
          <Link
            href={isEditing && post?.slug ? `/blog/${post.slug}` : "/blog"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-2xs hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-emerald-50/40 transition cursor-pointer"
            title="Sitedeki blog sayfasını yeni sekmede önizle"
          >
            <ExternalLink size={13} className="text-slate-400" />
            <span className="hidden sm:inline">Blogda Gör</span>
          </Link>

          {/* Üst Hızlı Kaydet Butonu */}
          <button
            type="submit"
            title="Makaleyi Kaydet (Ctrl + S)"
            onClick={() => syncFromWordEditor()}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#1f7a68] px-4 text-xs font-black text-white shadow-sm shadow-[#1f7a68]/20 hover:bg-[#176956] transition cursor-pointer"
          >
            <Save size={14} />
            <span>{isEditing ? "Değişiklikleri Kaydet" : "Yazıyı Oluştur"}</span>
          </button>
        </div>
      </div>

      {/* ─── 2. ANA ÇALIŞMA ALANI (Tuval & Ayarlar) ─── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ─── SOL KOLON: Ferah & Büyük Makale Yazma Tuvali ─── */}
        <div className="w-full min-w-0 flex-1">
          <div className="rounded-[2.5rem] border border-slate-200/90 bg-white p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.06)] space-y-6">
            {/* Makale Üst Başlık & Kategori Şeridi */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-black text-[#1f7a68]">
                  <Tag size={13} />
                  {categoryList.find((c) => c.id === categoryId)?.name || "Kategori Seçilmedi"}
                </span>
                <span className="text-xs font-bold text-slate-400">·</span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Calendar size={13} className="text-slate-400" />
                  {publishedAt}
                </span>
              </div>

              <span className="text-xs font-bold text-slate-400">
                {title.length}/180 karakter
              </span>
            </div>

            {/* Büyük ve Ferah Belge Başlığı (Editorial Document Headline) */}
            <div>
              <textarea
                ref={titleTextareaRef}
                name="title"
                rows={1}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Başlığı Buraya Yazın..."
                required
                className="w-full text-2xl sm:text-3xl lg:text-4xl font-black text-black placeholder:text-slate-300 border-none outline-none focus:ring-0 bg-transparent resize-none leading-tight tracking-tight p-0"
              />

              {/* Kalıcı URL Bilgisi */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-slate-400 font-semibold">Bağlantı:</span>
                <span className="font-bold text-[#1f7a68] underline decoration-emerald-200 underline-offset-4">
                  /blog/{slug || "yazi-adresi"}
                </span>
                <button
                  type="button"
                  onClick={() => setSlug(slugify(title))}
                  className="font-sans text-[11px] font-black text-slate-500 hover:text-[#1f7a68] transition cursor-pointer"
                >
                  ↺ Başlıktan Üret
                </button>
              </div>
            </div>

            {/* ─── WORD DOKÜMAN ŞERİDİ & ARAÇ ÇUBUĞU (Word Ribbon Toolbar) ─── */}
            <div className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-slate-200/95 bg-white/95 p-2.5 shadow-md backdrop-blur-md">
              {/* Sol Taraf: Biçimlendirme Araçları */}
              <div className="flex flex-wrap items-center gap-1">
                {/* Başlık / Paragraf Seçici */}
                <div className="flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 border border-slate-200/80">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleParagraph();
                    }}
                    title="Normal Paragraf Metni"
                    className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-950 transition cursor-pointer"
                  >
                    <Type size={13} />
                    <span>Normal</span>
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleHeading(2);
                    }}
                    title="H2 Ana Başlık"
                    className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-black text-slate-800 hover:bg-white hover:text-[#1f7a68] transition cursor-pointer"
                  >
                    <Heading2 size={14} />
                    <span>H2</span>
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleHeading(3);
                    }}
                    title="H3 Alt Başlık"
                    className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-black text-slate-800 hover:bg-white hover:text-[#1f7a68] transition cursor-pointer"
                  >
                    <Heading3 size={14} />
                    <span>H3</span>
                  </button>
                </div>

                <div className="h-5 w-px bg-slate-200 mx-1" />

                {/* Kalın Yap */}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveWordSelection();
                  }}
                  onClick={handleBold}
                  title="Seçili Yazıyı Kalın Yap (Ctrl + B)"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-900 shadow-2xs hover:border-[#1f7a68] hover:text-[#1f7a68] transition cursor-pointer"
                >
                  <Bold size={15} className="stroke-[3]" />
                  <span>Kalın</span>
                </button>

                {/* İtalik Yap */}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveWordSelection();
                  }}
                  onClick={handleItalic}
                  title="Seçili Yazıyı İtalik Yap (Ctrl + I)"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-black text-slate-900 shadow-2xs hover:border-[#1f7a68] hover:text-[#1f7a68] transition cursor-pointer"
                >
                  <Italic size={15} className="stroke-[2.5]" />
                  <span>İtalik</span>
                </button>

                <div className="h-5 w-px bg-slate-200 mx-1" />

                {/* Link Ekle / Düzenle */}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveWordSelection();
                  }}
                  onClick={() => handleAddLink()}
                  title={
                    isEditingExistingLink
                      ? "Seçili Bağlantıyı Düzenle"
                      : "Seçili Metne Tıklanabilir Link Ver (Ctrl + K)"
                  }
                  className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-black shadow-2xs transition cursor-pointer ${
                    isEditingExistingLink
                      ? "border-blue-500 bg-blue-100 text-blue-900 ring-2 ring-blue-400/40"
                      : "border-blue-200 bg-blue-50/90 text-blue-900 hover:bg-blue-100"
                  }`}
                >
                  <LinkIcon size={14} className="stroke-[2.5]" />
                  <span>{isEditingExistingLink ? "Bağlantıyı Düzenle" : "Link Ekle"}</span>
                </button>

                {/* Bağlantıyı Kaldır (Sadece bir link seçiliyse aktifleşir) */}
                {isEditingExistingLink && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleUnlink();
                    }}
                    title="Bağlantıyı Kaldır (Yazı silinmez)"
                    className="inline-flex h-9 items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2.5 text-xs font-black text-red-700 shadow-2xs hover:bg-red-100 transition cursor-pointer"
                  >
                    <Unlink size={13} />
                    <span>Kaldır</span>
                  </button>
                )}

                {/* Görsel Ekle */}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveWordSelection();
                  }}
                  onClick={handleOpenImageModal}
                  title="İmlecin bulunduğu satıra fotoğraf yerleştirir (Doğrudan görsel sürükleyip bırakabilir veya panodan yapıştırabilirsiniz)"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 text-xs font-black text-emerald-900 shadow-2xs hover:bg-emerald-100 transition cursor-pointer"
                >
                  <UploadCloud size={15} className="text-emerald-700 stroke-[2.5]" />
                  <span>Görsel Ekle</span>
                </button>

                <div className="h-5 w-px bg-slate-200 mx-1" />

                {/* Listeler & Alıntı */}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleBulletList();
                  }}
                  title="Madde İmli Liste"
                  className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-black text-slate-800 hover:border-[#1f7a68] hover:text-[#1f7a68] transition cursor-pointer"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleNumberedList();
                  }}
                  title="Numaralı Liste"
                  className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-black text-slate-800 hover:border-[#1f7a68] hover:text-[#1f7a68] transition cursor-pointer"
                >
                  <ListOrdered size={16} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleQuote();
                  }}
                  title="Alıntı Kutusu"
                  className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-black text-slate-800 hover:border-[#1f7a68] hover:text-[#1f7a68] transition cursor-pointer"
                >
                  <Quote size={16} />
                </button>

                <div className="h-5 w-px bg-slate-200 mx-1" />

                {/* Geri Al / Yinele */}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleUndo();
                  }}
                  title="Geri Al (Ctrl + Z)"
                  className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-2 text-xs text-slate-600 hover:text-slate-950 transition cursor-pointer"
                >
                  <Undo2 size={15} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleRedo();
                  }}
                  title="Yinele (Ctrl + Y)"
                  className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-2 text-xs text-slate-600 hover:text-slate-950 transition cursor-pointer"
                >
                  <Redo2 size={15} />
                </button>
              </div>
            </div>

            {/* ─── WORD DOKÜMAN SAYFASI (A4 KAĞIT DÜZENLEYİCİ) ─── */}
            <div className="rounded-[2.25rem] border border-slate-200/90 bg-[#f1f3f6] p-4 sm:p-8 lg:p-10 shadow-inner flex justify-center">
              {/* Gerçekçi A4 Word Kağıt Sayfası */}
              <div className="relative w-full max-w-[840px] bg-white min-h-[960px] rounded-xs shadow-[0_10px_35px_-8px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.05)] border border-slate-200/80 p-8 sm:p-14 lg:p-16 transition-all">
                {/* Sürükle-Bırak Görsel Göstergesi */}
                {isDraggingOver && (
                  <div className="absolute inset-4 z-30 flex flex-col items-center justify-center rounded-2xl border-3 border-dashed border-[#1f7a68] bg-[#1f7a68]/10 backdrop-blur-xs pointer-events-none animate-in fade-in">
                    <UploadCloud size={48} className="text-[#1f7a68] animate-bounce" />
                    <p className="mt-2 text-base font-black text-[#1f7a68]">
                      Görseli Buraya Bırakın
                    </p>
                    <p className="text-xs font-bold text-slate-600">
                      Fotoğraf doğrudan imlecin olduğu satıra eklenecektir
                    </p>
                  </div>
                )}

                {/* Yüzen Link Mini Araç Çubuğu (Pop-up Bubble) */}
                {floatingLinkBubble.visible && floatingLinkBubble.element && (
                  <div
                    style={{
                      left: `${floatingLinkBubble.x}px`,
                      top: `${floatingLinkBubble.y}px`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full mb-2 z-40 flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/95 text-white px-3 py-1.5 text-xs shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                  >
                    <LinkIcon size={12} className="text-emerald-400 stroke-[2.5]" />
                    <span className="font-mono text-[11px] text-slate-200 truncate max-w-[170px]">
                      {floatingLinkBubble.url}
                    </span>

                    <div className="h-3 w-px bg-slate-700 mx-1" />

                    <a
                      href={floatingLinkBubble.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Yeni Sekmede Aç"
                      className="p-1 hover:text-emerald-400 text-slate-300 transition"
                    >
                      <ExternalLink size={13} />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleAddLink(floatingLinkBubble.element)}
                      title="Bağlantıyı Düzenle"
                      className="p-1 hover:text-emerald-400 text-slate-300 transition cursor-pointer"
                    >
                      <Edit3 size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUnlink(floatingLinkBubble.element)}
                      title="Bağlantıyı Kaldır (Metin kalsın)"
                      className="p-1 hover:text-red-400 text-slate-300 transition cursor-pointer"
                    >
                      <Unlink size={13} />
                    </button>
                  </div>
                )}

                {/* WYSIWYG ContentEditable Word Tuvali */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck
                  onInput={syncFromWordEditor}
                  onBlur={syncFromWordEditor}
                  onKeyUp={() => {
                    saveWordSelection();
                    syncFromWordEditor();
                  }}
                  onMouseUp={saveWordSelection}
                  onTouchEnd={saveWordSelection}
                  onClick={handleEditorClick}
                  onPointerUp={saveWordSelection}
                  onFocus={saveWordSelection}
                  onKeyDown={handleWordKeyDown}
                  onDrop={handleEditorDrop}
                  onDragOver={handleEditorDragOver}
                  onDragLeave={handleEditorDragLeave}
                  onPaste={handleEditorPaste}
                  className="word-document-canvas min-h-[860px] outline-none focus:outline-none text-black font-sans text-base sm:text-[17px] leading-[1.85]"
                />
              </div>
            </div>

            {/* Sunucuya Gönderilen Gizli Form Alanı */}
            <input type="hidden" name="body" value={body} />
            <input type="hidden" name="slug" value={slug || slugify(title)} />
          </div>
        </div>

        {/* ─── SAĞ KOLON: Düzenli & Modern Makale Ayarları Çekmecesi (Inspector) ─── */}
        <aside className="w-full space-y-5 lg:w-[380px] xl:w-[410px] shrink-0">
          {/* 1. KUTU: Yayın & Durum Ayarları */}
          <div className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-black text-slate-950 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#1f7a68]" />
                Yayın & Durum
              </span>
              <span className="text-[11px] font-bold text-slate-400">Yönetim</span>
            </div>

            {/* Yayın Durumu Switch (Özel Tasarım) */}
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 transition hover:border-[#1f7a68] hover:bg-white">
              <div className="space-y-0.5">
                <span className="block text-xs font-black text-slate-950">
                  {isPublished ? "Sitede Yayında (Canlı)" : "Taslak Olarak Sakla (Gizli)"}
                </span>
                <span className="block text-[11px] font-medium text-slate-500">
                  {isPublished ? "Ziyaretçiler makaleyi okuyabilir." : "Sadece yöneticiler görebilir."}
                </span>
              </div>
              <input
                type="hidden"
                name="isPublished"
                value={isPublished ? "true" : "false"}
              />
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="size-5 accent-[#1f7a68] cursor-pointer"
              />
            </label>

            {/* Blog Kategorisi Seçimi */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Blog Kategorisi <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNewCategoryName("");
                    setCategoryError("");
                    setNewCategoryModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-black text-[#1f7a68] hover:underline cursor-pointer"
                >
                  <Plus size={12} className="stroke-[3]" />
                  <span>Yeni Kategori Ekle</span>
                </button>
              </div>
              <select
                name="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-950 focus:border-[#1f7a68] focus:outline-none"
                required
              >
                {categoryList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input type="hidden" name="authorName" value={post?.authorName ?? "Lizart Dijital"} />
            </div>

            {/* Yayınlanma Tarihi */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Yayınlanma Tarihi
                </label>
                <button
                  type="button"
                  onClick={() => setPublishedAt(new Date().toISOString().split("T")[0])}
                  className="text-[11px] font-black text-[#1f7a68] hover:underline"
                >
                  Bugün Yap ↺
                </button>
              </div>
              <div className="relative mt-1.5">
                <input
                  type="date"
                  name="publishedAt"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-950 focus:border-[#1f7a68] focus:outline-none"
                />
              </div>
            </div>

            {/* Anahtar Kelimeler (Keywords / Etiketler) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Anahtar Kelimeler (Keywords)
              </label>
              <input
                name="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Örn: E-Ticaret, Dönüşüm, Satış (virgülle ayırın)"
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-950 placeholder:text-slate-400 focus:border-[#1f7a68] focus:outline-none"
              />
              {keywordList.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {keywordList.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-black text-[#1f7a68] border border-emerald-100"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. KUTU: Kapak Görseli Ayarları */}
          <div className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-black text-slate-950 flex items-center gap-2">
                <ImageIcon size={16} className="text-[#1f7a68]" />
                Kapak Görseli
              </span>

              {/* Cihazdan Yükleme Butonu */}
              <input
                ref={coverImageFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploadingCoverImage}
                onClick={() => coverImageFileInputRef.current?.click()}
                title="Cihazınızdan kapak görseli yükleyin"
                className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-800 hover:bg-emerald-100 transition cursor-pointer disabled:opacity-60"
              >
                <UploadCloud size={13} className="text-emerald-700" />
                {isUploadingCoverImage ? "Yükleniyor…" : "Cihazdan Seç"}
              </button>
            </div>

            {/* Görsel URL Girişi */}
            <input
              name="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="/logo.svg veya görsel internet linki"
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-mono font-bold text-slate-950 placeholder:text-slate-400 focus:border-[#1f7a68] focus:outline-none"
            />

            {/* Hızlı Seçim */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">Hızlı Seç:</span>
              {[
                { label: "Logo", path: "/logo.svg" },
                { label: "Orijinal Logo", path: "/lizart-logo-original.png" },
                { label: "Favicon", path: "/icon.svg" },
              ].map((img) => (
                <button
                  key={img.path}
                  type="button"
                  onClick={() => setCoverImage(img.path)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-black text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition cursor-pointer"
                >
                  {img.label}
                </button>
              ))}
            </div>

            {/* Canlı Kapak Görseli Önizleme */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-2">
              <div className="flex h-36 items-center justify-center rounded-xl bg-white p-2 border border-slate-100">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImage}
                    alt="Kapak önizleme"
                    className="max-h-full max-w-full rounded-lg object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <p className="text-xs font-bold text-slate-400">Görsel URL girilmedi</p>
                )}
              </div>
            </div>
          </div>

          {/* 3. KUTU: Özet & Arama Motoru (SEO) — BAŞTAN AÇIK VE FERAH TASARIM */}
          <div className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-sm space-y-5">
            {/* Başlık */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-sm font-black text-slate-950 flex items-center gap-2">
                  <Globe size={16} className="text-[#1f7a68]" />
                  Özet & Arama Motoru (SEO)
                </span>
                <p className="text-[11px] font-medium text-slate-500">
                  Google araması ve sosyal medya paylaşımları
                </p>
              </div>
              <span className="rounded-lg bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-black text-[#1f7a68]">
                Google SERP
              </span>
            </div>

            {/* Kısa Açıklama (Özet / Excerpt) — Geniş ve Ferah */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                  Kısa Açıklama (Makale Özeti) <span className="text-red-500">*</span>
                </label>
                <span className={`text-[11px] font-bold ${excerpt.length > 280 ? "text-amber-600" : "text-slate-400"}`}>
                  {excerpt.length} / 300 karakter
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Makale listesinde, anasayfada ve sosyal medya paylaşımlarında gösterilecek vurucu özet.
              </p>
              <textarea
                name="excerpt"
                rows={4}
                value={excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                placeholder="Örnek: E-ticaret sitenizde dönüşüm oranlarını artırmanın en etkili yollarını ve hemen uygulayabileceğiniz 7 pratik ipucunu bu rehberde derledik... (boş bırakılırsa içerikten otomatik üretilir)"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs font-bold leading-relaxed text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] focus:ring-2 focus:ring-[#1f7a68]/10 focus:outline-none transition-all resize-none min-h-[110px]"
              />
            </div>

            {/* Gelişmiş SEO Ayarları Aç/Kapa Butonu */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedSeo(!showAdvancedSeo)}
                className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-[#1f7a68] transition cursor-pointer"
              >
                <span>{showAdvancedSeo ? "▲ Özel SEO Başlığı & Açıklamasını Gizle" : "▼ Özel SEO Başlığı & Açıklamasını Düzenle"}</span>
              </button>

              {/* Özel SEO Alanları */}
              {showAdvancedSeo && (
                <div className="mt-3 space-y-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 animate-in fade-in duration-150">
                  {/* Meta Başlık */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                        Özel Google Başlığı (Meta Title)
                      </label>
                      <span className="text-[10px] font-bold text-slate-400">
                        {metaTitle.length} / 70
                      </span>
                    </div>
                    <input
                      name="metaTitle"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Boş bırakırsanız makale başlığı kullanılır"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-950 placeholder:text-slate-400 focus:border-[#1f7a68] focus:outline-none"
                    />
                  </div>

                  {/* Meta Açıklama */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                        Özel Google Açıklaması (Meta Description)
                      </label>
                      <span className="text-[10px] font-bold text-slate-400">
                        {metaDescription.length} / 160
                      </span>
                    </div>
                    <textarea
                      name="metaDescription"
                      rows={2}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Boş bırakırsanız yukarıdaki kısa açıklama (özet) kullanılır"
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-950 placeholder:text-slate-400 focus:border-[#1f7a68] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Hidden inputs to guarantee data submission if custom inputs aren't open */}
              {!showAdvancedSeo && (
                <>
                  <input type="hidden" name="metaTitle" value={metaTitle || title} />
                  <input type="hidden" name="metaDescription" value={metaDescription || excerpt} />
                </>
              )}
            </div>

            {/* Gerçekçi & Ferah Google SERP Canlı Önizleme Kartı */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Google Arama Sonucu Önizlemesi
                </span>
                <span className="text-[10px] font-bold text-slate-400">Canlı Simülasyon</span>
              </div>

              {/* Google Kartı */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-1.5">
                {/* Site URL yolu */}
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <img
                    src="/logo-kare.svg"
                    alt="Lizart Dijital"
                    className="size-5 rounded-full border border-slate-200/80 object-cover shadow-2xs shrink-0"
                  />
                  <div className="truncate">
                    <span className="font-semibold text-slate-900">Lizart Dijital</span>
                    <span className="text-slate-400 mx-1">›</span>
                    <span className="text-[#1f7a68] font-mono text-[11px] font-bold">https://lizartdijital.com/blog/{slug || "yazi-adresi"}</span>
                  </div>
                </div>

                {/* Google Tıklanabilir Başlık */}
                <p className="text-[15px] font-semibold text-[#1a0dab] hover:underline leading-snug cursor-pointer line-clamp-2">
                  {metaTitle || title || "Blog Başlığı Buraya Gelecek"} | Lizart Dijital
                </p>

                {/* Google Açıklama Metni */}
                <p className="text-xs leading-relaxed text-[#4d5156] line-clamp-3">
                  {metaDescription ||
                    excerpt ||
                    "Sayfanızın meta açıklaması Google arama sonuçlarında tam olarak burada listelenecek."}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Yazıya Link / Bağlantı Ekleme ve Düzenleme Modalı ─── */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            {/* Modal Başlık */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <LinkIcon size={20} className="stroke-[2.5]" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {isEditingExistingLink ? "Bağlantıyı Düzenle" : "Yazıya Link (Bağlantı) Ekle"}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    {isEditingExistingLink
                      ? "Mevcut bağlantının metnini veya internet adresini güncelleyin"
                      : "Yazı içindeki kelimeye tıklandığında başka sayfaya yönlendirir"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Alanları */}
            <div className="space-y-4">
              {/* 1. Tıklanacak Yazı Metni */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Tıklanacak Yazı (Kullanıcının Göreceği Metin) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveLink();
                    }
                  }}
                  placeholder="Örn: Hizmetlerimizi inceleyin, Projelerimiz..."
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] focus:outline-none"
                />
                <p className="mt-1 text-[11px] font-semibold text-slate-500">
                  Makalede bu yazı tıklanabilir bağlantı olarak görünecektir.
                </p>
              </div>

              {/* 2. Gidilecek İnternet Adresi (URL) */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Gidilecek Sayfa Linki (URL) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">Site İçi veya Harici</span>
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveLink();
                    }
                  }}
                  placeholder="https://... veya /hizmetler"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 font-mono text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] focus:outline-none"
                />

                {/* Hızlı Sayfa Seçenekleri */}
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">⚡ Hızlı Sayfa Seç:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_LINKS.map((ql) => (
                      <button
                        key={ql.url}
                        type="button"
                        onClick={() => setLinkUrl(ql.url)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-emerald-50/50 transition cursor-pointer"
                      >
                        {ql.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Yeni Sekmede Açma Seçeneği */}
              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3 cursor-pointer hover:bg-slate-100/80 transition">
                <input
                  type="checkbox"
                  checked={linkOpenInNewTab}
                  onChange={(e) => setLinkOpenInNewTab(e.target.checked)}
                  className="size-4 accent-[#1f7a68] cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900">Otomatik Yeni Sekmede Aç</span>
                  <span className="text-slate-500 ml-1">
                    (Ziyaretçi bağlantıya tıkladığında blog yazınız kapanmaz)
                  </span>
                </div>
              </label>

              {/* Butonlar */}
              <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                {isEditingExistingLink ? (
                  <button
                    type="button"
                    onClick={() => handleUnlink()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
                  >
                    <Unlink size={14} />
                    <span>Bağlantıyı Kaldır</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setLinkModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveLink()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f7a68] px-5 py-2.5 text-xs font-black text-white shadow-sm hover:bg-[#176956] transition cursor-pointer"
                  >
                    <LinkIcon size={14} />
                    <span>{isEditingExistingLink ? "Bağlantıyı Güncelle" : "Yazıya Linki Ekle"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Yazı İçine / Seçili Metin Yerine Görsel Ekleme Modalı ─── */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            {/* Modal Başlık */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ImageIcon size={20} className="stroke-[2.5]" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    Yazı İçine Görsel Ekle
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    {imageSelectionText
                      ? "Seçtiğiniz metnin yerine görsel yerleştirilir"
                      : "İmlecin bulunduğu konuma görsel yerleştirilir"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Seçili Metin veya İmleç Konumu Açıklama Kutusu */}
            {imageSelectionText ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-black text-emerald-900">
                  <span>🎯 Seçtiğiniz Metnin Yerine Eklenecek:</span>
                </div>
                <p className="font-mono text-xs font-bold text-emerald-900 bg-white/95 p-2 rounded-xl border border-emerald-200/90 truncate">
                  &quot;{imageSelectionText}&quot;
                </p>
                <p className="text-[11px] font-semibold text-emerald-700">
                  Görsel eklendiğinde bu metin kaldırılacak ve tam bulunduğu konuma seçtiğiniz fotoğraf yerleştirilecektir.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-800 flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-xl bg-white border border-slate-200 text-slate-700 font-bold shrink-0">
                  📍
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-900">
                    İmlecin Bırakıldığı Konum
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    Görsel, yazı içerisinde tıkladığınız satır arasına eklenecektir.
                  </p>
                </div>
              </div>
            )}

            {/* İçerik Alanı */}
            <div className="space-y-4">
              {/* Sekmeler: Cihazdan Yükle / URL */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setImageSourceTab("upload")}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-black transition cursor-pointer ${
                    imageSourceTab === "upload"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ☁️ Cihazdan Seç (Telefon/PC)
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceTab("url")}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-black transition cursor-pointer ${
                    imageSourceTab === "url"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🔗 İnternet Adresi (URL)
                </button>
              </div>

              {/* Cihazdan Yükleme Alanı */}
              {imageSourceTab === "upload" ? (
                <div>
                  <input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    onChange={handleModalFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => modalFileInputRef.current?.click()}
                    className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center transition hover:border-[#1f7a68] hover:bg-emerald-50/30 cursor-pointer"
                  >
                    <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition">
                      {isUploadingModalImage ? (
                        <span className="size-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <UploadCloud size={24} />
                      )}
                    </div>
                    <p className="mt-2.5 text-xs font-black text-slate-900">
                      {isUploadingModalImage
                        ? "Görsel yükleniyor…"
                        : "Fotoğraf Seçmek İçin Tıklayın"}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                      Bilgisayarınızdan veya telefon galerinizden fotoğraf seçin
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Görsel Web Adresi (URL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={imageSourceTab === "url"}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveImage();
                      }
                    }}
                    placeholder="https://... veya /logo.svg"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 font-mono text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] focus:outline-none"
                  />
                  {/* Hızlı Görsel Seçenekleri */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400">Hızlı Seç:</span>
                    {[
                      { label: "Logo", path: "/logo.svg" },
                      { label: "Orijinal Logo", path: "/lizart-logo-original.png" },
                      { label: "Favicon", path: "/icon.svg" },
                    ].map((img) => (
                      <button
                        key={img.path}
                        type="button"
                        onClick={() => setImageUrl(img.path)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-black text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition cursor-pointer"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Canlı Görsel Önizleme */}
              {imageUrl && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-center justify-between px-1 pb-1.5 text-[11px] font-black text-slate-600">
                    <span>Seçilen Görsel Önizleme</span>
                    <span className="text-[#1f7a68] font-bold truncate max-w-[220px]">{imageUrl}</span>
                  </div>
                  <div className="flex h-32 items-center justify-center rounded-lg bg-white p-2 border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Önizleme"
                      className="max-h-full max-w-full rounded object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Görsel Açıklaması (Alt Metni) */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Görsel Açıklaması (Alt Metni / SEO)
                </label>
                <input
                  type="text"
                  value={imageAltText}
                  onChange={(e) => setImageAltText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveImage();
                    }
                  }}
                  placeholder="Görsel açıklaması..."
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] focus:outline-none"
                />
                <p className="mt-1 text-[11px] font-semibold text-slate-500">
                  {imageSelectionText
                    ? "Seçtiğiniz metin otomatik olarak görsel açıklaması yapıldı."
                    : "Google aramalarında ve ekran okuyucularda görünecek görsel açıklaması."}
                </p>
              </div>

              {/* Butonlar */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveImage()}
                  disabled={!imageUrl.trim() || isUploadingModalImage}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f7a68] px-5 py-2.5 text-xs font-black text-white shadow-sm hover:bg-[#176956] transition cursor-pointer disabled:opacity-50"
                >
                  <ImageIcon size={14} />
                  <span>{imageSelectionText ? "Metnin Yerine Görseli Ekle" : "Yazıya Görseli Ekle"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Hızlı Yeni Kategori Ekleme Modalı ─── */}
      {newCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-[#1f7a68]">
                  <Tag size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-950">Yeni Blog Kategorisi Ekle</h3>
                  <p className="text-[11px] font-bold text-slate-500">
                    Sitede ve editörde anında listelenir
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewCategoryModalOpen(false);
                  setCategoryError("");
                }}
                className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Kategori Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    setCategoryError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateQuickCategory();
                    }
                  }}
                  placeholder="Örn: E-İhracat, Sosyal Medya, Yazılım"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] focus:outline-none"
                />
                {newCategoryName.trim() && (
                  <p className="mt-1.5 text-[11px] font-mono text-slate-400">
                    Kalıcı bağlantı: <span className="text-[#1f7a68] font-bold">/blog?kategori={slugify(newCategoryName)}</span>
                  </p>
                )}
              </div>

              {categoryError && (
                <p className="text-xs font-bold text-red-600 animate-in fade-in duration-150">
                  {categoryError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setNewCategoryModalOpen(false);
                    setCategoryError("");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  disabled={isCreatingCategory || !newCategoryName.trim()}
                  onClick={() => handleCreateQuickCategory()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f7a68] px-5 py-2 text-xs font-black text-white shadow-sm hover:bg-[#176956] transition cursor-pointer disabled:opacity-50"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>{isCreatingCategory ? "Oluşturuluyor…" : "Kategoriyi Oluştur & Seç"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminForm>
  );
}

export function BlogRowActions({
  postId,
  isPublished,
}: {
  postId: string;
  isPublished: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
      <Link
        href={`/admin/blog/${postId}`}
        className="inline-flex h-8.5 items-center gap-1.5 rounded-xl bg-[#1f7a68] px-3 text-xs font-black text-white shadow-2xs hover:bg-[#176956] transition"
      >
        <Edit3 size={13} className="stroke-[2.5]" />
        <span>Düzenle</span>
      </Link>
      <ActionButton
        action={() => toggleBlogPublished(postId)}
        label={isPublished ? "Taslak" : "Yayınla"}
        size="sm"
        variant={isPublished ? "outline" : "primary"}
        icon={
          isPublished ? (
            <Archive size={12} className="text-slate-500 stroke-[2.5]" />
          ) : (
            <CheckCircle2 size={12} className="stroke-[2.5]" />
          )
        }
      />
      <ActionButton
        action={() => deleteBlogPost(postId)}
        label="Sil"
        size="sm"
        variant="danger"
        icon={<Trash2 size={12} className="stroke-[2.5]" />}
        confirmText="Bu blog yazısını kalıcı olarak silmek istediğinizden emin misiniz?"
      />
    </div>
  );
}
