"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteOffer, updateOfferAmount, updateOfferStatus } from "@/lib/actions/admin";
import { ActionButton, StatusSelect } from "@/components/admin/ui";
import { Check, Trash2 } from "lucide-react";

export const OFFER_STATUSES = [
  { value: "yeni", label: "Yeni" },
  { value: "incelemede", label: "İnceleniyor" },
  { value: "teklif-gonderildi", label: "Teklif gönderildi" },
  { value: "kazanildi", label: "Kazanıldı" },
  { value: "kaybedildi", label: "Kaybedildi" },
];

/** Teklif talebinin durumunu değiştirir. */
export function OfferStatusControl({ offerId, status }: { offerId: string; status: string }) {
  const dotColor =
    status === "yeni"
      ? "bg-amber-500"
      : status === "incelemede"
        ? "bg-sky-500"
        : status === "teklif-gonderildi"
          ? "bg-indigo-500"
          : status === "kazanildi"
            ? "bg-emerald-600"
            : "bg-rose-500";

  return (
    <div className="relative inline-flex items-center">
      <span className={`absolute left-2.5 size-2 rounded-full ${dotColor} pointer-events-none z-10`} />
      <StatusSelect
        label="Teklif durumu"
        value={status}
        options={OFFER_STATUSES}
        action={(next) => updateOfferStatus(offerId, next)}
        selectClassName="pl-6 font-semibold"
      />
    </div>
  );
}

/** Adminin teklife belirlenen tutarı girmesi için form. */
export function OfferAmountForm({
  offerId,
  currentAmount,
}: {
  offerId: string;
  currentAmount: number | null;
}) {
  const [amount, setAmount] = useState<string>(currentAmount ? String(currentAmount) : "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const num = amount.trim() ? parseInt(amount.replace(/[^0-9]/g, ""), 10) : null;
      const res = await updateOfferAmount(offerId, num);
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
          ₺
        </span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Örn: 45000"
          className="h-11 w-44 rounded-xl border border-slate-200 bg-white pl-8 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-[#1f7a68] transition"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-xl bg-[#1f7a68] px-4 text-xs font-black text-white hover:bg-[#176956] transition disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
      >
        {saved ? (
          <>
            <Check size={14} />
            Kaydedildi
          </>
        ) : pending ? (
          "Kaydediliyor…"
        ) : (
          "Tutarı Kaydet"
        )}
      </button>
    </form>
  );
}

/** Teklif silme butonu. */
export function DeleteOfferButton({ offerId }: { offerId: string }) {
  const router = useRouter();

  return (
    <ActionButton
      action={async () => {
        const res = await deleteOffer(offerId);
        if (res.ok) {
          router.push("/admin/teklifler");
        }
        return res;
      }}
      label="Teklifi Sil"
      pendingLabel="Siliniyor…"
      variant="danger"
      confirmText="Bu teklif talebi kalıcı olarak silinecek. Emin misiniz?"
    />
  );
}
