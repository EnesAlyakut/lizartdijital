"use client";

import { useTransition } from "react";
import { deleteReview, setReviewApproval } from "@/lib/actions/admin";
import { ActionButton } from "@/components/admin/ui";
import { Check, Eye, EyeOff, Trash2 } from "lucide-react";

/** Yorumu yayına alır / yayından kaldırır. */
export function ReviewApprovalButton({
  reviewId,
  isApproved,
}: {
  reviewId: string;
  isApproved: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await setReviewApproval(reviewId, !isApproved);
        })
      }
      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black shadow-xs transition disabled:opacity-60 ${
        isApproved
          ? "border border-slate-200 bg-white text-slate-700 hover:border-amber-500 hover:text-amber-700"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
    >
      {isApproved ? (
        <>
          <EyeOff size={14} />
          {pending ? "Kaldırılıyor…" : "Yayından Kaldır"}
        </>
      ) : (
        <>
          <Check size={14} />
          {pending ? "Onaylanıyor…" : "Yayına İzin Ver (Onayla)"}
        </>
      )}
    </button>
  );
}

/** Yorumu kalıcı olarak siler. */
export function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  return (
    <ActionButton
      action={() => deleteReview(reviewId)}
      label="Sil"
      pendingLabel="Siliniyor…"
      variant="danger"
      confirmText="Bu müşteri yorumu kalıcı olarak silinecek. Emin misiniz?"
    />
  );
}
