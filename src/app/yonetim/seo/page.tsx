import type { Metadata } from "next";
import Link from "next/link";
import { Activity, AlertTriangle, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/ui";

export const metadata: Metadata = { title: "SEO Yönetimi | Lizart Yönetim", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const [blogs, products, portfolio] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, include: { category: true } }),
    prisma.product.findMany({ orderBy: { updatedAt: "desc" }, include: { category: true } }),
    prisma.portfolioProject.findMany({ orderBy: { completedAt: "desc" } }),
  ]);

  const rows = [
    ...blogs.map((item) => ({
      id: item.id,
      type: "Blog Yazısı",
      title: item.title,
      href: `/blog/${item.slug}`,
      editHref: "/yonetim/blog",
      slug: item.slug,
      metaTitle: item.metaTitle ?? item.title,
      metaDescription: item.metaDescription ?? item.excerpt,
      body: item.body,
      status: item.isPublished ? "Yayında" : "Taslak",
    })),
    ...products.map((item) => ({
      id: item.id,
      type: "Ürün / Paket",
      title: item.name,
      href: `/urun/${item.slug}`,
      editHref: `/yonetim/urunler/${item.id}`,
      slug: item.slug,
      metaTitle: item.metaTitle ?? item.name,
      metaDescription: item.metaDescription ?? item.shortDesc,
      body: item.description,
      status: item.isPublished ? "Yayında" : "Taslak",
    })),
    ...portfolio.map((item) => ({
      id: item.id,
      type: "Referans Proje",
      title: item.title,
      href: `/projeler/${item.slug}`,
      editHref: "/yonetim/portfoy",
      slug: item.slug,
      metaTitle: item.title,
      metaDescription: item.summary,
      body: `${item.problem} ${item.solution}`,
      status: item.isFeatured ? "Öne Çıkan" : "Standart",
    })),
  ].map((row) => ({ ...row, score: scoreSeo(row), issues: seoIssues(row) }));

  const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length) : 0;
  const weak = rows.filter((row) => row.score < 60).length;
  const good = rows.filter((row) => row.score >= 80).length;

  return (
    <div className="space-y-8">
      {/* ─── Hero ─── */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)] lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
          <div>
            <span className="inline-block rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
              Arama Motoru Optimizasyonu
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              SEO Sağlık ve Görünürlük Paneli
            </h1>
            <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-slate-700">
              Blog makaleleri, web paketi ürünleri ve referans sayfaları otomatik SEO analizinden geçer. Title uzunluğu, meta açıklama doluluğu ve URL optimizasyon skorları anlık olarak hesaplanır.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            <Metric icon={Activity} label="Ortalama Skor" value={`${average}/100`} tone="blue" />
            <Metric icon={CheckCircle2} label="Güçlü Sayfalar" value={String(good)} tone="emerald" />
            <Metric icon={AlertTriangle} label="Geliştirilmeli" value={String(weak)} tone="amber" />
          </div>
        </div>
      </section>

      {/* ─── Ana İçerik Tablosu ve Yan Kılavuz ─── */}
      <section className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">İçerik SEO Skor Tablosu</h2>
              <p className="mt-0.5 text-sm font-semibold text-slate-600">Öncelik sıralı indeksleme ve içerik kalitesi denetimi</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-800">
              {rows.length} Sayfa Taranıyor
            </span>
          </div>

          <AdminTable headers={["İçerik Başlığı", "Tür", "Google SERP Önizleme", "SEO Skoru", "Tespit Edilen İyileştirmeler", "Aksiyon"]}>
            {rows
              .sort((a, b) => a.score - b.score)
              .map((row) => (
                <tr key={`${row.type}-${row.id}`} className="align-top border-b border-slate-100 last:border-0 hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <p className="text-base font-black text-slate-950">{row.title}</p>
                    <p className="mt-0.5 font-mono text-xs font-bold text-slate-500">/{row.slug}</p>
                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-700">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-800">{row.type}</td>
                  <td className="px-5 py-4">
                    <div className="max-w-sm rounded-2xl border border-slate-200 bg-slate-50/90 p-3.5">
                      <p className="truncate text-sm font-black text-blue-700 hover:underline">{row.metaTitle}</p>
                      <p className="mt-1 truncate text-xs font-black text-[#1f7a68]">lizartdijital.com/{row.slug}</p>
                      <p className="mt-1 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-600">
                        {row.metaDescription}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Score value={row.score} />
                  </td>
                  <td className="px-5 py-4">
                    <ul className="space-y-1.5">
                      {row.issues.slice(0, 3).map((issue) => (
                        <li key={issue} className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={row.editHref}
                        className="rounded-xl bg-[#1f7a68] px-3 py-1.5 text-xs font-black text-white shadow-sm hover:bg-[#176956]"
                      >
                        Düzenle
                      </Link>
                      <Link
                        href={row.href}
                        target="_blank"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-800 hover:bg-slate-50"
                      >
                        Gör ↗
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </AdminTable>
        </div>

        {/* Yan Kılavuz */}
        <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)] h-fit">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#1f7a68]/10 text-[#1f7a68]">
            <Search size={24} className="stroke-[2.5]" />
          </div>
          <h2 className="mt-4 text-xl font-black text-slate-950">SEO Standartları Rehberi</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">Maksimum arama performansı için kontrol noktaları</p>
          <div className="mt-5 space-y-3.5 border-t border-slate-100 pt-5">
            {[
              "SEO başlığı (title) 30-70 karakter aralığında olmalı.",
              "Meta açıklama 90-165 karakter arasında net değer teklifi sunmalı.",
              "URL slug kısa, sade ve anahtar kelime içermeli.",
              "İçerik gövdesi en az 500 kelimeden oluşmalı.",
              "Görsellerde alt etiketi ve WebP formatı tercih edilmeli.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-xs font-bold leading-5 text-slate-800">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#1f7a68]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone = "blue",
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  tone?: "blue" | "emerald" | "amber";
}) {
  const styles = {
    blue: {
      border: "border-blue-200/90",
      bg: "bg-gradient-to-b from-blue-50/60 to-white",
      badge: "bg-gradient-to-tr from-blue-600 to-sky-500 text-white",
      label: "text-blue-700",
    },
    emerald: {
      border: "border-emerald-200/90",
      bg: "bg-gradient-to-b from-emerald-50/60 to-white",
      badge: "bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white",
      label: "text-emerald-700",
    },
    amber: {
      border: "border-amber-200/90",
      bg: "bg-gradient-to-b from-amber-50/60 to-white",
      badge: "bg-gradient-to-tr from-amber-500 to-orange-400 text-white",
      label: "text-amber-700",
    },
  };
  const current = styles[tone];
  return (
    <div className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border ${current.border} ${current.bg} p-4 shadow-xs transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-black uppercase tracking-wider ${current.label}`}>{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${current.badge} shadow-xs`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2.5">
        <div className="text-2xl font-black tracking-tight text-slate-950">{value}</div>
      </div>
    </div>
  );
}

function Score({ value }: { value: number }) {
  return (
    <div className="w-28">
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-black ${
            value >= 80 ? "text-[#1f7a68]" : value >= 55 ? "text-amber-600" : "text-red-600"
          }`}
        >
          {value}/100
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            value >= 80 ? "bg-[#1f7a68]" : value >= 55 ? "bg-amber-500" : "bg-red-500"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function scoreSeo(row: { metaTitle: string; metaDescription: string; slug: string; body: string }) {
  let score = 15;
  if (row.metaTitle.length >= 30 && row.metaTitle.length <= 70) score += 25;
  if (row.metaDescription.length >= 90 && row.metaDescription.length <= 165) score += 30;
  if (row.slug.length >= 5 && row.slug.length <= 80) score += 15;
  if (row.body.length >= 500) score += 15;
  return Math.min(score, 100);
}

function seoIssues(row: { metaTitle: string; metaDescription: string; slug: string; body: string }) {
  const issues = [];
  if (row.metaTitle.length < 30) issues.push("Başlık kısa; daha açıklayıcı yazılmalı.");
  if (row.metaTitle.length > 70) issues.push("Başlık uzun; SERP'te kesilebilir.");
  if (row.metaDescription.length < 90) issues.push("Meta açıklama kısa kalıyor.");
  if (row.metaDescription.length > 165) issues.push("Meta açıklama 165 karakteri aşıyor.");
  if (row.body.length < 500) issues.push("İçerik gövdesi zayıf.");
  if (issues.length === 0) issues.push("Tüm temel SEO kriterleri karşılanıyor.");
  return issues;
}
