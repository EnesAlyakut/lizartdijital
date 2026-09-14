import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProjectStageControl } from "@/components/admin/ProjectControls";
import { EmptyState } from "@/components/ui";
import { PROJECT_STAGES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Projeler", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      user: { select: { fullName: true, email: true } },
      order: { select: { orderNumber: true } },
      stages: { orderBy: { sortOrder: "asc" }, select: { key: true, completedAt: true } },
    },
  });

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Aktif proje yok"
        description="Kurulum veya hizmet içeren siparişler verildiğinde projeler burada listelenir."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Hero ─── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#1f7a68]">Proje yönetimi</p>
        <h1 className="mt-2 text-2xl font-bold text-[#111]">Projeler</h1>
        <p className="mt-2 max-w-2xl text-[0.9375rem] font-medium leading-7 text-[#555]">
          Aktif projelerin aşamalarını takip edin ve müşteri bilgi formlarını inceleyin.
        </p>
      </section>

      <ul className="space-y-4">
        {projects.map((project) => {
          const brief = safeBrief(project.briefData);
          const briefEntries = Object.entries(brief).filter(([, v]) => v);
          const stageIndex = PROJECT_STAGES.findIndex((s) => s.key === project.currentStage);
          const percent = Math.round(((stageIndex + 1) / PROJECT_STAGES.length) * 100);

          return (
            <li key={project.id} className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-[#111]">{project.title}</p>
                  <p className="mt-0.5 text-sm font-medium text-[#555]">
                    {project.code} · {project.user.fullName} ({project.user.email})
                    {project.order && ` · Sipariş ${project.order.orderNumber}`}
                  </p>
                  <p className="mt-0.5 text-sm text-[#999]">
                    Güncelleme: {formatDate(project.updatedAt)}
                  </p>
                </div>
                <ProjectStageControl projectId={project.id} currentStage={project.currentStage} />
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-[#1f7a68]" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-1.5 text-sm font-medium text-[#555]">%{percent} tamamlandı</p>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-sm font-bold text-[#111]">Müşteri bilgi formu</p>
                {briefEntries.length === 0 ? (
                  <p className="mt-1 text-sm font-medium text-[#777]">
                    Müşteri henüz bilgi formunu doldurmadı.
                  </p>
                ) : (
                  <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                    {briefEntries.map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm text-[#999]">{BRIEF_LABELS[key] ?? key}</dt>
                        <dd className="font-medium text-[#333]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const BRIEF_LABELS: Record<string, string> = {
  domain: "Alan adı",
  hosting: "Hosting",
  brandName: "Marka adı",
  brandColors: "Kurumsal renkler",
  contactInfo: "İletişim bilgileri",
  socialLinks: "Sosyal medya",
  contentNotes: "İçerikler",
  specialRequests: "Özel talepler",
};

function safeBrief(value: string): Record<string, string> {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
