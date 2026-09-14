"use client";

import { changeUserRole, toggleUserActive } from "@/lib/actions/admin";
import { ActionButton, StatusSelect } from "@/components/admin/ui";

/** Kullanıcının rolünü değiştirir. */
export function RoleControl({
  userId,
  roleKey,
  roles,
}: {
  userId: string;
  roleKey: string;
  roles: { value: string; label: string }[];
}) {
  return (
    <StatusSelect
      label="Kullanıcı rolü"
      value={roleKey}
      options={roles}
      action={(next) => changeUserRole(userId, next)}
    />
  );
}

/** Hesabı aktif/pasif yapar. */
export function UserActiveToggle({ userId, isActive }: { userId: string; isActive: boolean }) {
  return (
    <ActionButton
      action={() => toggleUserActive(userId)}
      label={isActive ? "Pasifleştir" : "Etkinleştir"}
      variant={isActive ? "danger" : "primary"}
      confirmText={
        isActive
          ? "Hesap pasifleştirilecek ve açık oturumlar kapatılacak. Devam edilsin mi?"
          : undefined
      }
    />
  );
}
