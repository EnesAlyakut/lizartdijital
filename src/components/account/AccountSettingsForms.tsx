"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changePassword, updateProfile } from "@/lib/actions/account";

type Feedback = { type: "ok" | "error"; text: string } | null;

/** Profil bilgileri ve şifre değiştirme formları. */
export function AccountSettingsForms({
  user,
}: {
  user: {
    email: string;
    fullName: string;
    phone: string | null;
    customerType: string;
    companyName: string | null;
  };
}) {
  const [customerType, setCustomerType] = useState(user.customerType);
  const [profileMsg, setProfileMsg] = useState<Feedback>(null);
  const [passwordMsg, setPasswordMsg] = useState<Feedback>(null);
  const [pendingProfile, startProfile] = useTransition();
  const [pendingPassword, startPassword] = useTransition();
  const router = useRouter();

  return (
    <div className="mt-5 space-y-6">
      {/* Profil */}
      <form
        className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6"
        action={(formData) =>
          startProfile(async () => {
            const result = await updateProfile(formData);
            setProfileMsg(
              result.ok
                ? { type: "ok", text: result.message ?? "Güncellendi." }
                : { type: "error", text: result.error },
            );
            if (result.ok) router.refresh();
          })
        }
      >
        <p className="font-medium text-ink-900">Kişisel ve fatura bilgileri</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="block text-sm text-ink-700">
              Ad soyad
            </label>
            <input
              id="fullName"
              name="fullName"
              defaultValue={user.fullName}
              required
              className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="account-email" className="block text-sm text-ink-700">
              E-posta
            </label>
            <input
              id="account-email"
              value={user.email}
              readOnly
              aria-describedby="email-hint"
              className="mt-1.5 h-11 w-full cursor-not-allowed rounded-xl border border-ink-200 bg-ink-50 px-3 text-sm text-ink-500"
            />
            <p id="email-hint" className="mt-1 text-xs text-ink-400">
              E-posta değişikliği için destek talebi oluşturun.
            </p>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-ink-700">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone ?? ""}
              className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="customerType" className="block text-sm text-ink-700">
              Müşteri tipi
            </label>
            <select
              id="customerType"
              name="customerType"
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none"
            >
              <option value="bireysel">Bireysel</option>
              <option value="kurumsal">Kurumsal</option>
            </select>
          </div>

          {customerType === "kurumsal" && (
            <>
              <div>
                <label htmlFor="companyName" className="block text-sm text-ink-700">
                  Firma adı
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  defaultValue={user.companyName ?? ""}
                  className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="taxOffice" className="block text-sm text-ink-700">
                  Vergi dairesi
                </label>
                <input
                  id="taxOffice"
                  name="taxOffice"
                  className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="taxNumber" className="block text-sm text-ink-700">
                  Vergi numarası
                </label>
                <input
                  id="taxNumber"
                  name="taxNumber"
                  className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-5 flex items-center gap-4">
          <button
            type="submit"
            disabled={pendingProfile}
            className="h-11 rounded-full bg-brand-500 px-6 text-sm font-semibold text-canvas hover:bg-brand-400 disabled:opacity-60"
          >
            {pendingProfile ? "Kaydediliyor…" : "Bilgileri kaydet"}
          </button>
          {profileMsg && (
            <p
              aria-live="polite"
              className={`text-sm ${profileMsg.type === "error" ? "text-[color:var(--color-accent-sale)]" : "text-brand-700"}`}
            >
              {profileMsg.text}
            </p>
          )}
        </div>
      </form>

      {/* Şifre */}
      <form
        className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6"
        action={(formData) =>
          startPassword(async () => {
            const result = await changePassword(formData);
            setPasswordMsg(
              result.ok
                ? { type: "ok", text: result.message ?? "Güncellendi." }
                : { type: "error", text: result.error },
            );
          })
        }
      >
        <p className="font-medium text-ink-900">Şifre değiştir</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <PasswordField id="currentPassword" label="Mevcut şifre" autoComplete="current-password" />
          <PasswordField id="newPassword" label="Yeni şifre" autoComplete="new-password" />
          <PasswordField id="newPasswordConfirm" label="Yeni şifre tekrar" autoComplete="new-password" />
        </div>
        <p className="mt-2 text-xs text-ink-400">
          Şifre değiştirildiğinde diğer cihazlardaki oturumlarınız güvenlik amacıyla kapatılır.
        </p>
        <div className="mt-5 flex items-center gap-4">
          <button
            type="submit"
            disabled={pendingPassword}
            className="h-11 rounded-full border border-ink-900 px-6 text-sm font-medium text-ink-900 hover:bg-ink-900 hover:text-canvas disabled:opacity-60"
          >
            {pendingPassword ? "Güncelleniyor…" : "Şifreyi güncelle"}
          </button>
          {passwordMsg && (
            <p
              aria-live="polite"
              className={`text-sm ${passwordMsg.type === "error" ? "text-[color:var(--color-accent-sale)]" : "text-brand-700"}`}
            >
              {passwordMsg.text}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

function PasswordField({ id, label, autoComplete }: { id: string; label: string; autoComplete: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-ink-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="password"
        required
        autoComplete={autoComplete}
        className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
      />
    </div>
  );
}
