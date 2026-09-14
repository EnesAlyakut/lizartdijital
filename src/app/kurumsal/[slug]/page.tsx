import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";
import { Breadcrumb } from "@/components/ui";
import { FOOTER_LEGAL, SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await prisma.page.findMany({ select: { slug: true } });
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? `${page.title} — ${SITE.name}`,
    alternates: { canonical: `${SITE.url}/kurumsal/${slug}` },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) notFound();

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb
        items={[{ label: "Ana Sayfa", href: "/" }, { label: "Kurumsal" }, { label: page.title }]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        <nav aria-label="Yasal sayfalar" className="lg:sticky lg:top-24 lg:h-fit">
          <p className="text-sm font-semibold text-ink-900">Yasal metinler</p>
          <ul className="mt-3 space-y-1">
            {FOOTER_LEGAL.map((l) => {
              const active = l.href === `/kurumsal/${slug}`;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      active ? "bg-ink-900 text-canvas" : "text-ink-600 hover:bg-ink-100"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <article className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">{page.title}</h1>
          <p className="mt-2 text-sm text-ink-400">Son güncelleme: {formatDate(page.updatedAt)}</p>
          <div className="mt-6">{renderMarkdown(page.body)}</div>
        </article>
      </div>
    </div>
  );
}
