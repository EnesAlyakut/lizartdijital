import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers3,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/ui";
import { AddOnRowActions } from "@/components/admin/AddOnControls";
import { ADDON_GROUPS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { getAllAddOnMedia } from "@/lib/data/addon-media";

export const metadata: Metadata = {
  title: "Ek Hizmetler | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const GROUP_MAP: Record<string, string> = Object.fromEntries(
  ADDON_GROUPS.map((g) => [g.key, g.label])
);

export default async function AdminAddOnsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; grup?: string; durum?: string }>;
}) {
  const { q, grup, durum } = await searchParams;
  const mediaMap = getAllAddOnMedia();

  const [addOns, totalCount, activeCount, inactiveCount] = await Promise.all([
    prisma.addOnService.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { slug: { contains: q } },
                { description: { contains: q } },
              ],
            }
          : {}),
        ...(grup ? { group: grup } : {}),
        ...(durum === "aktif"
          ? { isActive: true }
          : durum === "pasif"
          ? { isActive: false }
          : {}),
      },
      orderBy: [{ group: "asc" }, { price: "asc" }],
      include: {
        _count: { select: { products: true, orderItemAddOns: true } },
      },
    }),
    prisma.addOnService.count(),
    prisma.addOnService.count({ where: { isActive: true } }),
    prisma.addOnService.count({ where: { isActive: false } }),
  ]);

  return (
    <div className="space-y-8">
      {/* ─── 1. HERO ALANI & YENİ OLUŞTUR BUTONU ─── */}
      <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
              <Layers3 size={14} className="stroke-[2.5]" />
              Ek Hizmet & Sepet Eklentileri
            </span>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Ek Hizmet Yönetimi
            </h1>
            <p className="mt-2 max-w-2xl text-base font-bold leading-7 text-slate-700">
              Müşterilerin ürün sayfalarında veya sipariş esnasında satın alabileceği kurulum, entegrasyon, içerik ve teknik destek paketlerini yönetin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/ek-hizmetler/yeni"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1f7a68] px-6 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-[#176956] hover:shadow-md"
            >
              <Plus size={18} className="stroke-[3]" />
              Yeni Ek Hizmet Oluştur
            </Link>
          </div>
        </div>

        {/* Uygun Renkli İstatistik Kartları */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4">
          {/* Toplam Hizmet - Mavi */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">Toplam</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xs">
                <Layers3 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black tracking-tight text-slate-950">{totalCount}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Tanımlı Hizmet</p>
            </div>
          </div>

          {/* Yayında (Aktif) - Zümrüt Yeşil */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Aktif</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black tracking-tight text-slate-950">{activeCount}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Satışa Açık</p>
            </div>
          </div>

          {/* Pasif - Amber / Turuncu */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-xs transition-all hover:border-amber-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Pasif</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-xs">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black tracking-tight text-amber-600">{inactiveCount}</div>
              <p className="mt-0.5 text-[11px] font-bold text-amber-500">Gizlenmiş</p>
            </div>
          </div>

          {/* Kategori Grubu - Mor / İndigo */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-indigo-200/90 bg-gradient-to-b from-indigo-50/60 to-white p-4 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">Kategori</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black tracking-tight text-slate-950">{ADDON_GROUPS.length} Grup</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Hizmet Grubu</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. ARAMA VE FİLTRELEME ─── */}
      <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
        <form className="grid gap-3 lg:grid-cols-[1.5fr_13rem_12rem_auto_auto]" role="search">
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-[#1f7a68] focus-within:bg-white transition">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Ek hizmet adı, slug veya açıklamasında ara..."
              aria-label="Ek hizmet ara"
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>

          <select
            name="grup"
            defaultValue={grup ?? ""}
            aria-label="Gruba göre filtrele"
            className="h-12 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-black text-slate-900 focus:border-[#1f7a68] outline-none"
          >
            <option value="">Tüm Gruplar</option>
            {ADDON_GROUPS.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label}
              </option>
            ))}
          </select>

          <select
            name="durum"
            defaultValue={durum ?? ""}
            aria-label="Duruma göre filtrele"
            className="h-12 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-black text-slate-900 focus:border-[#1f7a68] outline-none"
          >
            <option value="">Tüm Durumlar</option>
            <option value="aktif">Yalnızca Aktif Olanlar</option>
            <option value="pasif">Yalnızca Pasifler</option>
          </select>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1f7a68] px-6 text-sm font-black text-white shadow-sm hover:bg-[#176956] transition"
          >
            <Filter size={16} />
            Filtrele
          </button>

          {(q || grup || durum) && (
            <Link
              href="/admin/ek-hizmetler"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
            >
              Temizle
            </Link>
          )}
        </form>
      </section>

      {/* ─── 3. TABLO LİSTESİ ─── */}
      <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Tanımlı Ek Hizmetler
            </h2>
            <p className="text-xs font-bold text-slate-500">
              {addOns.length} ek hizmet listeleniyor
            </p>
          </div>

          <Link
            href="/admin/ek-hizmetler/yeni"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f7a68] px-4 py-2 text-xs font-black text-white hover:bg-[#176956] transition"
          >
            <Plus size={14} className="stroke-[3]" />
            Yeni Ek Hizmet Ekle
          </Link>
        </div>

        {addOns.length === 0 ? (
          <div className="p-12 text-center">
            <Layers3 size={32} className="mx-auto text-slate-300" />
            <p className="mt-3 text-base font-black text-slate-900">
              Kriterlere uygun ek hizmet bulunamadı.
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              Farklı bir arama terimi deneyebilir veya yeni bir ek hizmet oluşturabilirsiniz.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Link
                href="/admin/ek-hizmetler"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-800 hover:bg-slate-50"
              >
                Filtreleri Temizle
              </Link>
              <Link
                href="/admin/ek-hizmetler/yeni"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f7a68] px-4 py-2 text-xs font-black text-white hover:bg-[#176956]"
              >
                <Plus size={14} className="stroke-[3]" />
                Yeni Ek Hizmet Oluştur
              </Link>
            </div>
          </div>
        ) : (
          <AdminTable
            headers={[
              "Hizmet Bilgisi",
              "Grup",
              "Fiyat (KDV Hariç)",
              "Ek Teslimat Süresi",
              "Sunulan Ürün / Sipariş",
              "Durum",
              "İşlemler",
            ]}
          >
            {addOns.map((a) => {
              const groupLabel = GROUP_MAP[a.group] || a.group;
              const groupColors: Record<string, string> = {
                kurulum: "bg-emerald-100 text-emerald-950 border-emerald-200",
                icerik: "bg-blue-100 text-blue-950 border-blue-200",
                entegrasyon: "bg-amber-100 text-amber-950 border-amber-200",
                yayin: "bg-purple-100 text-purple-950 border-purple-200",
                destek: "bg-rose-100 text-rose-950 border-rose-200",
              };

              const media = mediaMap[a.id] || mediaMap[a.slug] || {
                image: "/gorseller/ajans/hizmet-web.svg",
                gallery: [],
              };
              const galleryCount = media.gallery?.length || 0;

              return (
                <tr
                  key={a.id}
                  className="align-top border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition"
                >
                  {/* Hizmet Görseli, Adı, Açıklama, Slug */}
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3.5">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={media.image}
                          alt={a.name}
                          className="size-full object-cover"
                        />
                        {galleryCount > 0 && (
                          <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 py-0.2 text-[9px] font-mono font-black text-white">
                            +{galleryCount}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/ek-hizmetler/${a.id}`}
                          className="text-base font-black text-slate-950 hover:text-[#1f7a68] transition"
                        >
                          {a.name}
                        </Link>
                        <p className="mt-1 line-clamp-2 text-xs font-bold leading-relaxed text-slate-600">
                          {a.description}
                        </p>
                        <span className="mt-1.5 inline-block font-mono text-[11px] font-semibold text-slate-400">
                          /{a.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Grup */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${
                        groupColors[a.group] ||
                        "bg-slate-100 text-slate-800 border-slate-200"
                      }`}
                    >
                      {groupLabel}
                    </span>
                  </td>

                  {/* Fiyat */}
                  <td className="px-5 py-4">
                    <span className="text-base font-black text-slate-950">
                      {formatPrice(a.price)}
                    </span>
                  </td>

                  {/* Ek Gün */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                      <Clock size={14} className="text-[#1f7a68]" />
                      <span>
                        {a.extraDays > 0 ? `+${a.extraDays} İş Günü` : "Anında / Aynı Gün"}
                      </span>
                    </div>
                  </td>

                  {/* Sunulan Ürün & Sipariş */}
                  <td className="px-5 py-4 text-xs font-bold text-slate-600">
                    <span className="text-slate-950 font-black">
                      {a._count.products}
                    </span>{" "}
                    üründe aktif
                    <p className="mt-0.5 text-slate-400">
                      {a._count.orderItemAddOns} kez satın alındı
                    </p>
                  </td>

                  {/* Durum */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                        a.isActive
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          a.isActive ? "bg-emerald-600" : "bg-slate-400"
                        }`}
                      />
                      {a.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>

                  {/* İşlemler */}
                  <td className="px-5 py-4 text-right">
                    <AddOnRowActions addOnId={a.id} isActive={a.isActive} />
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
