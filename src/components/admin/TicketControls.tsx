"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { closeTicket, staffReplyToTicket } from "@/lib/actions/admin";
import { ActionButton } from "@/components/admin/ui";

/** Ekip yanıtı yazma alanı. */
export function StaffTicketReply({ ticketId }: { ticketId: string }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await staffReplyToTicket(ticketId, value);
          if (result.ok) {
            setValue("");
            setError(null);
            router.refresh();
          } else {
            setError(result.error);
          }
        });
      }}
    >
      <label htmlFor={`staff-reply-${ticketId}`} className="sr-only">
        Destek Yanıtınız
      </label>
      <input
        id={`staff-reply-${ticketId}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Müşteriye yanıt yazın..."
        className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:border-[#1f7a68] focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending || !value.trim()}
        className="h-11 shrink-0 rounded-xl bg-[#1f7a68] px-6 text-sm font-black text-white shadow-sm hover:bg-[#176956] disabled:opacity-40 transition"
      >
        {pending ? "Gönderiliyor…" : "Yanıtla"}
      </button>
      {error && (
        <p role="alert" className="text-xs font-bold text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}

/** Talebi kapatır. */
export function CloseTicketButton({ ticketId }: { ticketId: string }) {
  return (
    <ActionButton
      action={() => closeTicket(ticketId)}
      label="Talebi Kapat"
      confirmText="Bu destek talebini kapatmak istediğinize emin misiniz?"
    />
  );
}
