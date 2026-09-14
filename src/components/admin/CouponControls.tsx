"use client";

import { createCoupon, toggleCoupon } from "@/lib/actions/admin";
import { ActionButton, AdminForm } from "@/components/admin/ui";

/** Yeni kupon oluşturma formu. */
export function CouponForm({
  redirectTo = "/admin/kuponlar",
}: {
  redirectTo?: string;
} = {}) {
  return (
    <AdminForm
      action={createCoupon}
      submitLabel="Kuponu oluştur"
      redirectTo={redirectTo}
      className="mt-4 rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="code" className="block text-sm text-ink-700">
            Kupon kodu
          </label>
          <input
            id="code"
            name="code"
            required
            placeholder="YAZKAMPANYA"
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm uppercase focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm text-ink-700">
            İndirim türü
          </label>
          <select
            id="type"
            name="type"
            defaultValue="yuzde"
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none"
          >
            <option value="yuzde">Yüzde (%)</option>
            <option value="tutar">Sabit tutar (₺)</option>
          </select>
        </div>
        <div>
          <label htmlFor="value" className="block text-sm text-ink-700">
            Değer
          </label>
          <input
            id="value"
            name="value"
            type="number"
            min={1}
            required
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink-400">Yüzde için 10, tutar için ₺ değeri girin.</p>
        </div>
        <div>
          <label htmlFor="minSubtotal" className="block text-sm text-ink-700">
            Min. sepet tutarı (₺)
          </label>
          <input
            id="minSubtotal"
            name="minSubtotal"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="maxUses" className="block text-sm text-ink-700">
            Kullanım limiti (boş = sınırsız)
          </label>
          <input
            id="maxUses"
            name="maxUses"
            type="number"
            min={0}
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>
    </AdminForm>
  );
}

/** Kuponu aktif/pasif yapar. */
export function CouponToggle({ couponId, isActive }: { couponId: string; isActive: boolean }) {
  return (
    <ActionButton
      action={() => toggleCoupon(couponId)}
      label={isActive ? "Pasifleştir" : "Etkinleştir"}
      variant={isActive ? "outline" : "primary"}
    />
  );
}
