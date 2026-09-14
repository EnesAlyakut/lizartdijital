import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, ExternalLink, FolderKanban, Layers3, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { PortfolioManager } from "@/components/admin/PortfolioControls";

export const metadata: Metadata = {
  title: "Portföy & Referans Yönetimi | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const [projects, totalProjects, featuredProjects] = await Promise.all([
    prisma.portfolioProject.findMany({
      orderBy: [{ isFeatured: "desc" }, { completedAt: "desc" }],
    }),
    prisma.portfolioProject.count(),
    prisma.portfolioProject.count({ where: { isFeatured: true } }),
  ]);

  const sectors = new Set(projects.map((project) => project.sector)).size;
  const categories = new Set(projects.map((project) => project.category)).size;

  return (
    <div className="space-y-8">
      {/* ─── Hero & İstatistik Kartları ─── */}
      <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)] lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
          <div>
            <span className="inline-block rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
              Referans & Proje Vitrini
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Portföy Yönetim Merkezi
            </h1>
            <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-slate-700">
              Müşterilerinize sunduğunuz tüm referans projelerini alt alta inceleyin, &quot;Düzenle&quot; butonuyla tüm detayları güncelleyin veya yeni masaüstü/mobil mockup görselleriyle yeni referanslar ekleyin.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <Metric icon={FolderKanban} label="Toplam Proje" value={String(totalProjects)} tone="blue" />
            <Metric icon={Sparkles} label="Öne Çıkan" value={String(featuredProjects)} tone="amber" />
            <Metric icon={BriefcaseBusiness} label="Farklı Sektör" value={String(sectors)} tone="teal" />
            <Metric icon={Layers3} label="Kategori" value={String(categories)} tone="indigo" />
          </div>
        </div>
      </section>

      {/* ─── YENİ EKLE BUTONU, ARAMA, DÜZENLEME VE ALT ALTA SIRALI LİSTE ─── */}
      <PortfolioManager projects={projects} />
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone = "blue",
}: {
  icon: typeof FolderKanban;
  label: string;
  value: string;
  tone?: "blue" | "amber" | "teal" | "indigo";
}) {
  const styles = {
    blue: {
      border: "border-blue-200/90",
      bg: "bg-gradient-to-b from-blue-50/60 to-white",
      badge: "bg-gradient-to-tr from-blue-600 to-sky-500 text-white",
      label: "text-blue-700",
    },
    amber: {
      border: "border-amber-200/90",
      bg: "bg-gradient-to-b from-amber-50/60 to-white",
      badge: "bg-gradient-to-tr from-amber-500 to-orange-400 text-white",
      label: "text-amber-700",
    },
    teal: {
      border: "border-emerald-200/90",
      bg: "bg-gradient-to-b from-emerald-50/60 to-white",
      badge: "bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white",
      label: "text-emerald-700",
    },
    indigo: {
      border: "border-indigo-200/90",
      bg: "bg-gradient-to-b from-indigo-50/60 to-white",
      badge: "bg-gradient-to-tr from-indigo-600 to-purple-500 text-white",
      label: "text-indigo-700",
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
