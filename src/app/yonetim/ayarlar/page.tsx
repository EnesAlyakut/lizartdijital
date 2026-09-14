import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SettingRow } from "@/components/admin/SettingControls";

export const metadata: Metadata = { title: "Ayarlar", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Panelden yönetilebilen ayarlar ve açıklamaları. */
const SETTING_DEFS = [
  {
    group: "Duyuru bandı",
    items: [
      { key: "announcement.active", label: "Duyuru bandı açık", hint: "true veya false yazın." },
      { key: "announcement.text", label: "Duyuru metni", hint: "Sayfanın en üstünde görünür." },
      { key: "announcement.href", label: "Duyuru bağlantısı", hint: "Örn. /magaza?siralama=indirimli" },
    ],
  },
  {
    group: "Ana sayfa göstergeleri",
    items: [
      { key: "stats.projects", label: "Tamamlanan proje sayısı", hint: "" },
      { key: "stats.customers", label: "Müşteri sayısı", hint: "" },
      { key: "stats.years", label: "Yıllık deneyim", hint: "" },
      { key: "stats.satisfaction", label: "Ortalama müşteri puanı", hint: "Örn. 4.8" },
    ],
  },
];

export default async function AdminSettingsPage() {
  const rows = await prisma.setting.findMany();
  const values = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div className="space-y-6">
      {/* ─── Hero ─── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#1f7a68]">Sistem ayarları</p>
        <h1 className="mt-2 text-2xl font-bold text-[#111]">Ayarlar</h1>
        <p className="mt-2 max-w-2xl text-[0.9375rem] font-medium leading-7 text-[#555]">
          Bu alandaki değerler siteyi anında etkiler. Ödeme, e-posta ve depolama gibi teknik ayarlar
          güvenlik nedeniyle panelden değil, sunucudaki ortam değişkenlerinden yönetilir.
        </p>
      </section>

      {SETTING_DEFS.map((group) => (
        <section key={group.group} className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-[#111]">{group.group}</h3>
          <div className="mt-4 space-y-3">
            {group.items.map((item) => (
              <SettingRow
                key={item.key}
                settingKey={item.key}
                label={item.label}
                hint={item.hint}
                value={values[item.key] ?? ""}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-xl border border-gray-200 bg-[#f8f9fc] p-6">
        <h3 className="text-lg font-bold text-[#111]">Ortam değişkenleriyle yönetilen ayarlar</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#555]">
          Aşağıdaki değerler sunucudaki <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[#333]">.env</code>{" "}
          dosyasında tutulur; gizli bilgiler asla veritabanına veya bu panele yazılmaz.
        </p>
        <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
          <li className="font-mono text-sm text-[#555]">PAYMENT_PROVIDER</li>
          <li className="font-mono text-sm text-[#555]">PAYMENT_WEBHOOK_SECRET</li>
          <li className="font-mono text-sm text-[#555]">MAIL_PROVIDER</li>
          <li className="font-mono text-sm text-[#555]">DOWNLOAD_SIGNING_SECRET</li>
          <li className="font-mono text-sm text-[#555]">DOWNLOAD_LINK_DAYS / DOWNLOAD_MAX_COUNT</li>
          <li className="font-mono text-sm text-[#555]">BANK_NAME / BANK_IBAN</li>
        </ul>
      </section>
    </div>
  );
}
