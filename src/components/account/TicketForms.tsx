"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTicket, replyToTicket } from "@/lib/actions/account";

const TOPICS = [
  { value: "kurulum", label: "Kurulum" },
  { value: "lisans", label: "Lisans" },
  { value: "odeme", label: "Ödeme ve fatura" },
  { value: "teknik", label: "Teknik sorun" },
  { value: "diger", label: "Diğer" },
];

/** Yeni destek talebi formu. */
export function TicketForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const router = useRouter();

  return (
    <form
      className="mt-4 rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6"
      action={(formData) =>
        startTransition(async () => {
          const result = await createTicket(formData);
          setMessage(
            result.ok
              ? { type: "ok", text: result.message ?? "Talebiniz oluşturuldu." }
              : { type: "error", text: result.error },
          );
          if (result.ok) router.refresh();
        })
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ticket-subject" className="block text-sm text-ink-700">
            Konu
          </label>
          <input
            id="ticket-subject"
            name="subject"
            required
            maxLength={160}
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ticket-topic" className="block text-sm text-ink-700">
            Kategori
          </label>
          <select
            id="ticket-topic"
            name="topic"
            defaultValue="kurulum"
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none"
          >
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="ticket-body" className="block text-sm text-ink-700">
          Talebiniz
        </label>
        <textarea
          id="ticket-body"
          name="body"
          rows={4}
          required
          maxLength={4000}
          placeholder="Yaşadığınız durumu, hangi üründe olduğunu ve varsa hata mesajını yazın."
          className="mt-1.5 w-full rounded-xl border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-full bg-brand-500 px-6 text-sm font-semibold text-canvas hover:bg-brand-400 disabled:opacity-60"
        >
          {pending ? "Gönderiliyor…" : "Talebi gönder"}
        </button>
        {message && (
          <p
            aria-live="polite"
            className={`text-sm ${message.type === "error" ? "text-[color:var(--color-accent-sale)]" : "text-brand-700"}`}
          >
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}

/** Mevcut bir talebe yanıt yazma alanı. */
export function TicketReply({ ticketId }: { ticketId: string }) {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <form
      className="mt-4 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await replyToTicket(ticketId, value);
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
      <label htmlFor={`reply-${ticketId}`} className="sr-only">
        Yanıtınız
      </label>
      <input
        id={`reply-${ticketId}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Yanıtınızı yazın…"
        className="h-11 w-full min-w-0 rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending || !value.trim()}
        className="h-11 shrink-0 rounded-xl border border-ink-900 px-5 text-sm font-medium text-ink-900 hover:bg-ink-900 hover:text-canvas disabled:opacity-50"
      >
        Gönder
      </button>
      {error && (
        <p role="alert" className="text-xs text-[color:var(--color-accent-sale)]">
          {error}
        </p>
      )}
    </form>
  );
}
