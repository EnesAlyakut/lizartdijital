import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { extractHeadings, renderMarkdown, slugifyHeading } from "@/lib/markdown";
import { ProductCard } from "@/components/product/ProductCard";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Badge, Breadcrumb, ButtonLink, Card } from "@/components/ui";
import { productCardSelect } from "@/lib/data/products";
import { SITE, whatsappLink } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  PhoneCall,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    alternates: { canonical: `${SITE.url}/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
    include: { category: true },
  });
  if (!post) notFound();

  const [related, products] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true, categoryId: post.categoryId, id: { not: post.id } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, slug: true, title: true, excerpt: true, readMinutes: true },
    }),
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      select: productCardSelect,
      take: 2,
    }),
  ]);

  const headings = extractHeadings(post.body);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE.url}${post.coverImage}`,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE.url}/blog/${post.slug}` },
    ],
  };

  const shareUrl = `${SITE.url}/blog/${post.slug}`;

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.category.name, href: `/blog?kategori=${post.category.slug}` },
          { label: post.title },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_21.5rem] xl:grid-cols-[1fr_23rem] lg:gap-12 xl:gap-16">
        <article className="max-w-3xl">
          <Badge tone="brand">{post.category.name}</Badge>
          <h1 className="mt-4 text-balance-title text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">{post.excerpt}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
            <span className="font-medium text-ink-800">{post.authorName}</span>
            {post.authorTitle && <span>{post.authorTitle}</span>}
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{post.readMinutes} dk okuma</span>
          </div>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-ink-50">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 720px"
              className="object-cover"
            />
          </div>

          {headings.length > 1 && (
            <nav aria-label="İçindekiler" className="mt-8 rounded-2xl border border-ink-100 bg-surface-2 p-5">
              <p className="text-sm font-semibold text-ink-900">İçindekiler</p>
              <ol className="mt-3 space-y-1.5 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-ink-600 hover:text-brand-700">
                      {h.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="mt-6">{renderBodyWithAnchors(post.body)}</div>

          {/* Paylaşım */}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6">
            <span className="text-sm text-ink-500">Paylaş:</span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink-200 px-4 py-2 text-sm hover:bg-ink-50"
            >
              LinkedIn
            </a>
            <a
              href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink-200 px-4 py-2 text-sm hover:bg-ink-50"
            >
              X
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink-200 px-4 py-2 text-sm hover:bg-ink-50"
            >
              WhatsApp
            </a>
          </div>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">Benzer yazılar</h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/blog/${r.slug}`}
                      className="block rounded-2xl border border-ink-100 bg-surface p-5 transition-soft hover:border-brand-300 hover:shadow-[var(--shadow-card)]"
                    >
                      <p className="font-medium text-ink-900">{r.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-500">{r.excerpt}</p>
                      <p className="mt-2 text-xs text-ink-400">{r.readMinutes} dk okuma</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {/* ─── YENİ & PROFESYONEL EDİTORYAL YAN PANEL (Sidebar) ─── */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          {/* 1. ÖNE ÇIKAN DİJİTAL ÇÖZÜM & MAĞAZA KARTI (Mat, Asil ve Yüksek Okunabilirlikli Tasarım) */}
          <div className="relative overflow-hidden rounded-[2rem] border border-[#2a3c32] bg-[#16231c] p-6 sm:p-7 text-white shadow-[0_20px_45px_-18px_rgba(0,0,0,0.45)]">
            <div className="relative z-10">
              {/* Üst Rozet */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#344d40] bg-[#1f3027] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#7ee3b0]">
                <Sparkles size={13} className="text-[#7ee3b0]" />
                <span>Hazır &amp; Özel Çözümler</span>
              </div>

              {/* Başlık & Açıklama */}
              <h3 className="mt-4 text-xl font-bold tracking-tight text-white leading-snug">
                Hazır bir çözüm mü arıyorsunuz?
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#d6dfd9] font-normal">
                Yazıda anlatılan tüm hız, SEO ve dönüşüm standartlarına sahip hazır web sitelerimizi keşfedin, canlı demoları test edin.
              </p>

              {/* Avantaj Maddeleri */}
              <ul className="mt-5 space-y-3 border-y border-[#2a3c32] py-4 text-sm font-medium text-white">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span className="text-[#f1f5f3]">Google PageSpeed 95+ &amp; SEO Mimarisi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span className="text-[#f1f5f3]">%100 Mobil ve Dönüşüm Odaklı Tasarım</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span className="text-[#f1f5f3]">24 Saatte Canlıya Alma &amp; Teknik Destek</span>
                </li>
              </ul>

              {/* Aksiyon Butonları */}
              <div className="mt-5 space-y-2.5">
                <Link
                  href="/magaza"
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22774a] hover:bg-[#1c643e] px-4 text-sm font-bold text-white shadow-sm transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>Mağazayı ve Demoları İncele</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>

                <a
                  href={whatsappLink(
                    `Merhaba, "${post.title}" blog yazınızı okudum. İşletmem için hazır web sitesi çözümleri ve özel teklif hakkında bilgi almak istiyorum.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#344d40] bg-[#1a2a22] hover:bg-[#23382e] px-4 text-sm font-semibold text-[#eef4f0] transition hover:border-[#415e4f] cursor-pointer"
                >
                  <MessageSquare size={15} className="text-[#4ade80]" />
                  <span>WhatsApp ile Hızlı Bilgi Al</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. İLGİLİ ÜRÜNLER / ÖNERİLEN WEB PAKETLERİ */}
          {products.length > 0 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#1f7a68]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-ink-900">
                    Önerilen Web Çözümleri
                  </h4>
                </div>
                <Link
                  href="/magaza"
                  className="text-[11px] font-bold text-[#1f7a68] hover:underline"
                >
                  Tümünü Gör ↗
                </Link>
              </div>

              <div className="space-y-3">
                {products.map((p) => {
                  return (
                    <div
                      key={p.id}
                      className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-3.5 shadow-xs transition hover:border-[#1f7a68]/40 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Ürün Görseli / Mockup */}
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          <Image
                            src={p.coverImage}
                            alt={p.name}
                            fill
                            sizes="80px"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>

                        {/* Ürün Bilgileri */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#1f7a68]">
                            {p.category.name}
                          </span>
                          <h5 className="line-clamp-1 text-sm font-black text-ink-950 group-hover:text-[#1f7a68] transition">
                            <Link href={`/urun/${p.slug}`}>
                              {p.name}
                            </Link>
                          </h5>
                          <p className="text-xs font-black text-ink-900">
                            {formatPrice(p.basePrice)}
                          </p>
                        </div>
                      </div>

                      {/* Alt Butonlar: Canlı Demo & İncele */}
                      <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-slate-100">
                        {p.demoUrl && (
                          <a
                            href={p.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 text-[11px] font-black text-slate-700 hover:bg-white hover:text-slate-950 transition"
                          >
                            <ExternalLink size={12} />
                            <span>Canlı Demo</span>
                          </a>
                        )}
                        <Link
                          href={`/urun/${p.slug}`}
                          className="flex-1 inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-[#1f7a68] px-2 text-[11px] font-black text-white hover:bg-[#176956] transition"
                        >
                          <span>İncele</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. CANLI DESTEK & UZMAN DANIŞMANLIĞI KARTI */}
          <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="grid size-10 place-items-center rounded-xl bg-[#1f7a68] text-xs font-black text-white shadow-sm">
                  LZ
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-ink-950">Lizart Proje Danışmanı</p>
                <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  ● Çevrimiçi · Ortalama 5 dk yanıt
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-600">
              Projeniz veya hazır şablon seçimi için kararsız mısınız? Uzman ekibimizle WhatsApp üzerinden ücretsiz görüşün.
            </p>

            <a
              href={whatsappLink(
                `Merhaba, ${SITE.url}/blog/${post.slug} yazınızı okudum. Web sitem için danışmanlık almak istiyorum.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-black text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <PhoneCall size={14} />
              <span>Hemen Danışmana Bağlan</span>
            </a>
          </div>

          {/* 4. HAFTALIK BÜLTEN & DİJİTAL NOTLAR KARTI */}
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-brand-50 text-[#1f7a68]">
                <Sparkles size={14} />
              </span>
              <p className="text-xs font-black uppercase tracking-wider text-ink-900">
                Dijital Bültene Katılın
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-500">
              Ayda 2 kez, doğrudan işinize yarayacak teknik ve pazarlama taktiklerini e-postanıza gönderiyoruz.
            </p>
            <NewsletterForm tone="light" className="mt-3.5" />
          </div>
        </aside>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </div>
  );
}

/** Blog gövdesini başlıklara çapa ekleyerek işler (içindekiler bağlantıları için). */
function renderBodyWithAnchors(body: string) {
  const sections = body.split(/\n(?=## )/);
  return sections.map((section, i) => {
    const match = section.match(/^## (.+)/);
    if (!match) return <div key={i}>{renderMarkdown(section)}</div>;
    return (
      <div key={i} id={slugifyHeading(match[1])} className="scroll-mt-28">
        {renderMarkdown(section)}
      </div>
    );
  });
}
