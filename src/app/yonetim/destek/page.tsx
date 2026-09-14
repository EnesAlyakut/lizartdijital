import type { Metadata } from "next";
import { Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { StaffTicketReply, CloseTicketButton } from "@/components/admin/TicketControls";
import { Badge, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Destek Talepleri | Lizart Yönetim", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  acik: "Açık",
  yanitlandi: "Yanıtlandı",
  kapali: "Kapalı",
};

export default async function AdminSupportPage() {
  const [tickets, openCount, answeredCount, closedCount] = await Promise.all([
    prisma.supportTicket.findMany({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      take: 50,
      include: {
        user: { select: { fullName: true, email: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.supportTicket.count({ where: { status: "acik" } }),
    prisma.supportTicket.count({ where: { status: "yanitlandi" } }),
    prisma.supportTicket.count({ where: { status: "kapali" } }),
  ]);

  return (
    <div className="space-y-6">
      {/* ─── Hero & KPI Kartları ─── */}
      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="max-w-xl">
          <span className="inline-block rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
            Müşteri Destek Merkezi
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            Destek Talepleri & İletişim
          </h1>
          <p className="mt-2.5 max-w-xl text-sm font-medium leading-relaxed text-slate-600">
            Müşteri taleplerini anlık olarak yanıtlayın, çözüm geçmişini izleyin ve tamamlanan talepleri arşivleyin.
          </p>
        </div>

        {/* Uygun Renkli İstatistik Kartları */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 lg:w-[28rem]">
          {/* Açık Talepler - Amber / Turuncu (İşlem gerektirir) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-xs transition-all hover:border-amber-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Açık</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-xs">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600">{openCount}</div>
              <p className="mt-0.5 text-[11px] font-bold text-amber-500">Bekleyen Çağrı</p>
            </div>
          </div>

          {/* Yanıtlananlar - Mavi / Gökyüzü */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">Yanıtlanan</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xs">
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{answeredCount}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Dönüş Bekliyor</p>
            </div>
          </div>

          {/* Çözümlenenler - Zümrüt Yeşil */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Çözümlenen</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{closedCount}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Kapatılan</p>
            </div>
          </div>
        </div>
      </section>

      {tickets.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <EmptyState title="Destek talebi yok" description="Müşterilerden gelen yeni destek talepleri burada görüntülenecek." />
        </div>
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-black text-slate-700">
                      #{ticket.code}
                    </span>
                    <h2 className="text-lg font-black text-slate-950">{ticket.subject}</h2>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-slate-600">
                    <span className="text-slate-900">{ticket.user.fullName}</span> ({ticket.user.email}) · {formatDate(ticket.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Badge tone={ticket.status === "kapali" ? "neutral" : ticket.status === "acik" ? "sale" : "brand"}>
                    {STATUS_LABELS[ticket.status] ?? ticket.status}
                  </Badge>
                  {ticket.status !== "kapali" && <CloseTicketButton ticketId={ticket.id} />}
                </div>
              </div>

              {ticket.messages.length > 0 && (
                <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  {ticket.messages.map((m) => (
                    <li
                      key={m.id}
                      className={`rounded-2xl p-4.5 ${
                        m.authorRole === "musteri"
                          ? "border border-slate-200 bg-slate-50"
                          : "border border-emerald-100 bg-emerald-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className={m.authorRole === "musteri" ? "text-slate-700" : "text-[#1f7a68]"}>
                          {m.authorRole === "musteri" ? "Müşteri Mesajı" : "Destek Ekibi"}
                        </span>
                        <span className="text-slate-400">{formatDate(m.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-sm font-bold leading-relaxed text-slate-900 whitespace-pre-line">
                        {m.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {ticket.status !== "kapali" && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <StaffTicketReply ticketId={ticket.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
