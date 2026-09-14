import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/ui";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "İşlem kayıtları", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  "order.created": "Sipariş oluşturuldu",
  "order.paid": "Ödeme alındı",
  "order.status_changed": "Sipariş durumu değişti",
  "order.bank_transfer_confirmed": "Havale onaylandı",
  "product.updated": "Ürün güncellendi",
  "product.publish_toggled": "Ürün yayın durumu değişti",
  "product.version_published": "Yeni sürüm yayınlandı",
  "review.approval_changed": "Yorum onayı değişti",
  "coupon.created": "Kupon oluşturuldu",
  "setting.updated": "Ayar güncellendi",
  "user.role_changed": "Kullanıcı rolü değişti",
  "user.active_toggled": "Hesap durumu değişti",
  "project.stage_changed": "Proje aşaması değişti",
  "ticket.closed": "Destek talebi kapatıldı",
  "license.domain_added": "Lisansa domain eklendi",
  "download.link_created": "İndirme bağlantısı üretildi",
  "offer.status_changed": "Teklif durumu değişti",
};

export default async function AdminAuditLogPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { fullName: true, email: true } } },
  });

  if (logs.length === 0) {
    return (
      <EmptyState
        title="İşlem kaydı yok"
        description="Sistemde yapılan değişiklikler burada kaydedilir."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Hero ─── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#1f7a68]">Sistem kayıtları</p>
        <h1 className="mt-2 text-2xl font-bold text-[#111]">İşlem kayıtları</h1>
        <p className="mt-2 max-w-2xl text-[0.9375rem] font-medium leading-7 text-[#555]">
          Son 200 kayıt. Hassas veriler (şifre, kart bilgisi, tam IP adresi) kaydedilmez.
        </p>
      </section>

      <AdminTable headers={["Zaman", "Kullanıcı", "İşlem", "Kayıt", "Ayrıntı"]}>
        {logs.map((log) => (
          <tr key={log.id}>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-[#555]">
              {new Intl.DateTimeFormat("tr-TR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(log.createdAt)}
            </td>
            <td className="px-4 py-3 font-semibold text-[#333]">
              {log.user ? log.user.fullName : <span className="text-[#999]">sistem</span>}
            </td>
            <td className="px-4 py-3 font-semibold text-[#111]">{ACTION_LABELS[log.action] ?? log.action}</td>
            <td className="px-4 py-3 text-sm text-[#555]">
              {log.entity}
              {log.entityId && <span className="block font-mono text-sm">{log.entityId.slice(0, 12)}…</span>}
            </td>
            <td className="max-w-64 px-4 py-3 font-mono text-sm text-[#555]">{log.meta}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
