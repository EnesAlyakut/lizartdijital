import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/ui";
import {
  DeleteMessageButton,
  MarkAllReadButton,
  MarkReadButton,
  MessagesListWithDetail,
} from "@/components/admin/FormMessageControls";
import { EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { Mail, MessageCircle, Phone, Inbox, MailWarning, Users, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Form Mesajları | Lizart Yönetim",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const DEPARTMENT_LABELS: Record<string, string> = {
  satis: "Satış & Fiyatlandırma",
  destek: "Teknik Destek",
  proje: "Özel Proje",
  kurumsal: "Kurumsal & İştirak",
  genel: "Genel İletişim",
};

export default async function AdminFormsPage() {
  const [rawMessages, unreadCount, subscribers] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  const senderEmails = Array.from(new Set(rawMessages.map((m) => m.email.toLowerCase())));

  const [orders, offers] = await Promise.all([
    prisma.order.findMany({
      where: {
        email: { in: senderEmails },
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.offer.findMany({
      where: {
        email: { in: senderEmails },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const messages = rawMessages.map((m) => {
    const userOrders = orders.filter(
      (o) => o.email.toLowerCase() === m.email.toLowerCase()
    );
    const userOffers = offers.filter(
      (off) => off.email.toLowerCase() === m.email.toLowerCase()
    );
    return {
      ...m,
      orders: userOrders,
      offers: userOffers,
    };
  });

  return (
    <div className="space-y-8">
      {/* ─── Hero & Metrics ─── */}
      <section className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-[0_20px_60px_-45px_rgb(15_23_42/.35)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223d26]/15 bg-[#223d26]/[0.06] px-3.5 py-1 text-xs font-semibold text-[#223d26]">
              <Inbox className="h-3.5 w-3.5 text-[#223d26]" />
              <span>Gelen Mesajlar & İletişim</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem] leading-tight">
              İletişim Formu Mesajları
            </h1>
            <p className="mt-2.5 text-sm sm:text-base font-normal leading-relaxed text-slate-600">
              Web sitenizdeki iletişim formlarından gelen müşteri mesajlarını anında görün, WhatsApp veya e-posta ile hemen yanıtlayın ve bülten abonelerini takip edin.
            </p>
          </div>

          {/* Uygun Renkli İstatistik Kartları */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 lg:w-[28rem]">
            {/* Toplam Mesaj - Mavi */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">Toplam</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xs">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{messages.length}</div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">Gelen Mesaj</p>
              </div>
            </div>

            {/* Okunmamış - Kırmızı/Rose (Dikkat) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-200/90 bg-gradient-to-b from-rose-50/60 to-white p-4 shadow-xs transition-all hover:border-rose-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-700">Okunmamış</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-xs">
                  <MailWarning className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-rose-600">{unreadCount}</div>
                <p className="mt-0.5 text-[11px] font-bold text-rose-500">Yanıt Bekliyor</p>
              </div>
            </div>

            {/* Aboneler - Zümrüt Yeşil */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Aboneler</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{subscribers.length}</div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">E-Bülten</p>
              </div>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-end">
            <MarkAllReadButton />
          </div>
        )}
      </section>

      {/* ─── Mesajlar Listesi ─── */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Gelen Mesajlar</h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Müşteri detayları, ne sorunu olduğu ve satın aldığı paketlerle birlikte inceleyin
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700">
            {messages.length} Kayıt
          </span>
        </div>

        <MessagesListWithDetail messages={messages} />
      </section>

      {/* ─── Bülten Aboneleri ─── */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Bülten Aboneleri</h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            E-bültene kayıt olan e-posta adresleri
          </p>
        </div>

        {subscribers.length === 0 ? (
          <p className="text-sm font-medium text-slate-400 italic py-4">Henüz bülten abonesi yok.</p>
        ) : (
          <AdminTable headers={["E-posta", "Kayıt Kaynağı", "Durum", "Kayıt Tarihi"]}>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3.5 font-semibold text-slate-900">{s.email}</td>
                <td className="px-5 py-3.5 text-xs font-medium text-slate-600">{s.source ?? "Ana Sayfa"}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      s.isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {s.isActive ? "Aktif" : "Abonelikten Çıktı"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs font-medium text-slate-500">
                  {formatDate(s.createdAt)}
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </section>
    </div>
  );
}
