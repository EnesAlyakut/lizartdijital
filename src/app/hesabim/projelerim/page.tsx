import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ProjectBriefForm } from "@/components/account/ProjectBriefForm";
import { Badge, ButtonLink, EmptyState } from "@/components/ui";
import { PROJECT_STAGES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Projelerim", robots: { index: false, follow: false } };

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      stages: { orderBy: { sortOrder: "asc" } },
      order: { select: { orderNumber: true, estimatedDays: true } },
    },
  });

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Aktif projeniz yok"
        description="Kurulum veya hizmet içeren bir sipariş verdiğinizde proje süreciniz burada aşama aşama izlenir."
        action={<ButtonLink href="/magaza/hizmet-paketleri">Hizmet paketlerine bak</ButtonLink>}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">Projelerim</h2>
        <p className="mt-2 text-sm text-ink-500">
          Süreç boyunca hangi aşamada olduğunuzu buradan izleyebilir, gerekli bilgileri iletebilirsiniz.
        </p>
      </div>

      {projects.map((project) => {
        const currentIndex = PROJECT_STAGES.findIndex((s) => s.key === project.currentStage);
        const brief = safeBrief(project.briefData);
        const needsBrief = Object.keys(brief).length === 0;

        return (
          <section key={project.id} className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-ink-900">{project.title}</h3>
                <p className="mt-0.5 text-sm text-ink-500">
                  {project.code}
                  {project.order && ` · Sipariş ${project.order.orderNumber}`}
                </p>
              </div>
              <Badge tone="brand">{PROJECT_STAGES[currentIndex]?.name ?? "Başlatıldı"}</Badge>
            </div>

            {/* Zaman çizelgesi */}
            <ol className="mt-6">
              {project.stages.map((stage, i) => {
                const done = Boolean(stage.completedAt);
                const current = stage.key === project.currentStage;
                return (
                  <li key={stage.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                          done
                            ? "bg-brand-500 text-canvas"
                            : current
                              ? "border-2 border-brand-600 bg-surface text-brand-700"
                              : "border border-ink-200 bg-surface text-ink-400"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      {i < project.stages.length - 1 && <span className="my-1 w-px flex-1 bg-ink-200" />}
                    </div>
                    <div className="pb-5">
                      <p className={`text-sm font-medium ${done || current ? "text-ink-900" : "text-ink-400"}`}>
                        {stage.name}
                      </p>
                      {stage.completedAt && (
                        <p className="mt-0.5 text-xs text-ink-500">{formatDate(stage.completedAt)}</p>
                      )}
                      {stage.note && <p className="mt-1 text-xs text-ink-600">{stage.note}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="border-t border-ink-100 pt-5">
              <h4 className="font-medium text-ink-900">Proje bilgi formu</h4>
              <p className="mt-1 text-sm text-ink-500">
                {needsBrief
                  ? "Kuruluma başlayabilmemiz için aşağıdaki bilgileri iletin."
                  : "Bilgilerinizi güncelleyebilirsiniz."}
              </p>
              <ProjectBriefForm projectId={project.id} initial={brief} />
            </div>
          </section>
        );
      })}
    </div>
  );
}

function safeBrief(value: string): Record<string, string> {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
