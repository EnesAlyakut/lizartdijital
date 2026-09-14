"use client";

import { updateProjectStage } from "@/lib/actions/admin";
import { StatusSelect } from "@/components/admin/ui";
import { PROJECT_STAGES } from "@/lib/constants";

/** Projenin bulunduğu aşamayı değiştirir. */
export function ProjectStageControl({
  projectId,
  currentStage,
}: {
  projectId: string;
  currentStage: string;
}) {
  return (
    <StatusSelect
      label="Proje aşaması"
      value={currentStage}
      options={PROJECT_STAGES.map((s) => ({ value: s.key, label: s.name }))}
      action={(next) => updateProjectStage(projectId, next)}
    />
  );
}
