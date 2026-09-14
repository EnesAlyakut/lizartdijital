import type { Metadata } from "next";
import Link from "next/link";
import { getAllServices } from "@/lib/data/services";
import { AdminTable } from "@/components/admin/ui";
import { ServiceRowActions } from "@/components/admin/ServiceControls";
import {
  BriefcaseBusiness,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  Image as ImageIcon,
  Edit3,
  X,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hizmet Yönetimi | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const allServices = getAllServices();

  const filteredServices = q
    ? allServices.filter(
        (s) =>
          s.title.toLowerCase().includes(q.toLowerCase()) ||
          s.slug.toLowerCase().includes(q.toLowerCase()) ||
          s.summary.toLowerCase().includes(q.toLowerCase()) ||
          (s.category && s.category.toLowerCase().includes(q.toLowerCase()))
      )
    : allServices;

  const categoryLabels: Record<string, string> = {
    web: "Web & E-Ticaret",
    yazilim: "Mobil & Özel Yazılım",
    buyume: "SEO & Büyüme",
    pazarlama: "Dijital Reklam",
    tasarim: "Tasarım & Prodüksiyon",
  };

  return (
    <div className="space-y-8">
      {/* ─── Hero ─── */}
      <section className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-[0_20px_60px_-45px_rgb(15_23_42/.35)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223d26]/15 bg-[#223d26]/[0.06] px-3.5 py-1 text-xs font-semibold text-[#223d26]">
              <BriefcaseBusiness className="h-3.5 w-3.5 text-[#223d26]" />
              <span>Hizmet Kataloğu & CMS</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem] leading-tight">
              Hizmet Yönetim Merkezi
            </h1>
            <p className="mt-2.5 text-sm sm:text-base font-normal leading-relaxed text-slate-600">
              Web sitenizdeki tüm hizmetleri görüntüleyin, güncelleyin, yeni hizmet ekleyin ve çoklu görsellerini yönetin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/yonetim/hizmetler/yeni"
              className="inline-flex items-center gap-2 rounded-xl bg-[#223d26] px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#2b4c30] active:scale-[0.99]"
            >
              <Plus size={16} className="stroke-[2.5]" />
              Yeni Hizmet Oluştur
            </Link>
            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white px-4 py-2.5 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Yayındaki Hizmetler</p>
                <p className="text-lg font-black text-slate-950">{allServices.length} Hizmet</p>
              </div>
            </div>
            <Link
              href="/hizmetler"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-[#223d26] hover:text-[#223d26]"
            >
              <span>Sitede Gör</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HİZMETLERİ ARAMA ─── */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Hizmetlerde Ara</h2>
            <p className="text-xs font-medium text-slate-500">
              Hizmet adına, kategorisine veya URL slug&apos;ına göre anında bulun
            </p>
          </div>

          <form className="flex flex-wrap items-center gap-2.5" role="search">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Örn: E-Ticaret, SEO, Mobil..."
                aria-label="Hizmet ara"
                className="h-11 w-full sm:w-72 rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#223d26] focus:bg-white focus:ring-2 focus:ring-[#223d26]/10"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#223d26] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#2b4c30] active:scale-[0.99] transition cursor-pointer"
            >
              Ara
            </button>
            {q && (
              <Link
                href="/yonetim/hizmetler"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                <X className="h-4 w-4" />
                Temizle
              </Link>
            )}
          </form>
        </div>
      </section>

      {/* ─── HİZMETLERİN LİSTESİ ─── */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)] lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#223d26]">
              <Layers size={13} />
              Aktif Hizmetler
            </span>
            <h3 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
              Tüm Hizmet Sayfaları ({filteredServices.length})
            </h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Aşağıdaki her hizmetin yanındaki &quot;Düzenle&quot; butonuyla görsel ve metinlerini güncelleyebilirsiniz.
            </p>
          </div>
          <Link
            href="/yonetim/hizmetler/yeni"
            className="rounded-xl bg-[#223d26] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2b4c30] shadow-xs transition"
          >
            + Yeni Hizmet Ekle
          </Link>
        </div>

        {filteredServices.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-base font-semibold text-slate-900">
              Arama kriterinize uygun hizmet bulunamadı.
            </p>
            <Link
              href="/yonetim/hizmetler"
              className="mt-3 inline-block rounded-xl bg-[#223d26] px-4 py-2 text-xs font-semibold text-white"
            >
              Tüm Hizmetleri Göster
            </Link>
          </div>
        ) : (
          <AdminTable
            headers={[
              "Hizmet & Görsel",
              "Kategori / Rozet",
              "Başlangıç Fiyatı",
              "Kapsam & Galeri",
              "İşlemler",
            ]}
          >
            {filteredServices.map((srv) => {
              const categoryName = srv.category
                ? categoryLabels[srv.category] || srv.category
                : "Web";
              const coverImg = srv.image || "/gorseller/ajans/hizmet-web.svg";
              const galleryCount = srv.gallery?.length || 0;

              return (
                <tr
                  key={srv.slug}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition"
                >
                  {/* 1. Görsel & Başlık */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverImg}
                          alt={srv.title}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/yonetim/hizmetler/${srv.slug}`}
                          className="text-sm font-bold text-slate-900 hover:text-[#223d26] transition line-clamp-1"
                        >
                          {srv.title}
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-500">
                          {srv.summary}
                        </p>
                        <span className="font-mono text-[11px] font-medium text-slate-400">
                          /hizmetler/{srv.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Kategori & Rozet */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        {categoryName}
                      </span>
                      {srv.badge && (
                        <p className="text-[11px] font-medium text-emerald-700">
                          ★ {srv.badge}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* 3. Fiyat */}
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#223d26]">
                      {srv.packages?.[0]?.price || "Teklif Alın"}
                    </span>
                  </td>

                  {/* 4. Süreç & Galeri */}
                  <td className="px-5 py-4">
                    <div className="space-y-1 text-xs font-medium text-slate-700">
                      <p className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-[#223d26]" />
                        {srv.benefits?.length || 0} Fayda
                      </p>
                      <p className="flex items-center gap-1 text-slate-500">
                        <Clock size={12} />
                        {srv.process?.length || 0} Süreç Adımı
                      </p>
                      {galleryCount > 0 && (
                        <p className="flex items-center gap-1 text-indigo-600 font-semibold text-[11px]">
                          <ImageIcon size={11} />
                          {galleryCount} Galeri Görseli
                        </p>
                      )}
                    </div>
                  </td>

                  {/* 5. İşlemler */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <ServiceRowActions slug={srv.slug} />
                  </td>
                </tr>
              );
            })}
          </AdminTable>
        )}
      </section>
    </div>
  );
}
