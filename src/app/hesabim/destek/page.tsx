import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { TicketForm, TicketReply } from "@/components/account/TicketForms";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Destek taleplerim", robots: { index: false, follow: false } };

const TOPIC_LABELS: Record<string, string> = {
  kurulum: "Kurulum",
  lisans: "Lisans",
  odeme: "Ödeme",
  teknik: "Teknik",
  diger: "Diğer",
};

const STATUS_LABELS: Record<string, string> = {
  acik: "Açık",
  yanitlandi: "Yanıtlandı",
  kapali: "Kapalı",
};

export default async function SupportPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const tickets = await prisma.supportTicket.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">Yeni destek talebi</h2>
        <p className="mt-2 text-sm text-ink-500">
          Hafta içi 09:00–18:30 arasında yanıt veriyoruz. Acil konularda WhatsApp&apos;tan da yazabilirsiniz.
        </p>
        <TicketForm />
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">Taleplerim</h2>
        {tickets.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">Henüz destek talebiniz bulunmuyor.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink-900">{ticket.subject}</p>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {ticket.code} · {TOPIC_LABELS[ticket.topic] ?? ticket.topic} ·{" "}
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                  <Badge tone={ticket.status === "kapali" ? "neutral" : "brand"}>
                    {STATUS_LABELS[ticket.status] ?? ticket.status}
                  </Badge>
                </div>

                <ul className="mt-4 space-y-3 border-t border-ink-100 pt-4">
                  {ticket.messages.map((m) => (
                    <li
                      key={m.id}
                      className={`rounded-2xl p-4 text-sm ${
                        m.authorRole === "musteri" ? "bg-ink-50" : "bg-brand-50"
                      }`}
                    >
                      <p className="text-xs font-medium text-ink-500">
                        {m.authorRole === "musteri" ? "Siz" : "Lizart Dijital ekibi"} ·{" "}
                        {formatDate(m.createdAt)}
                      </p>
                      <p className="mt-1.5 leading-relaxed text-ink-700">{m.body}</p>
                    </li>
                  ))}
                </ul>

                {ticket.status !== "kapali" && <TicketReply ticketId={ticket.id} />}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
