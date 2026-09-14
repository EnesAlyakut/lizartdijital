"use client";

import { confirmBankTransfer, updateOrderStatus } from "@/lib/actions/admin";
import { ActionButton, StatusSelect } from "@/components/admin/ui";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }));

/** Sipariş durumunu değiştirir. */
export function OrderStatusControl({ orderId, status }: { orderId: string; status: string }) {
  const dotColor =
    status === "bekliyor"
      ? "bg-amber-500"
      : status === "odendi" || status === "hazirlaniyor"
        ? "bg-sky-500"
        : status === "teslim"
          ? "bg-emerald-600"
          : "bg-rose-500";

  return (
    <div className="relative inline-flex items-center">
      <span className={`absolute left-2.5 size-2 rounded-full ${dotColor} pointer-events-none z-10`} />
      <StatusSelect
        label="Sipariş durumu"
        value={status}
        options={STATUS_OPTIONS}
        action={(next) => updateOrderStatus(orderId, next)}
        selectClassName="pl-6 font-semibold"
      />
    </div>
  );
}

/** Havale ödemesini onaylayıp teslimatı başlatır. */
export function ConfirmTransferButton({ orderId }: { orderId: string }) {
  return (
    <ActionButton
      action={() => confirmBankTransfer(orderId)}
      label="Ödemeyi Onayla"
      pendingLabel="Onaylanıyor…"
      variant="primary"
      size="sm"
      icon={<CheckCircle2 size={13} />}
      confirmText="Havale ödemesi hesabınıza geçtiyse onaylayın. Bu işlem lisans anahtarı üretir ve teslimatı başlatır. Devam edilsin mi?"
    />
  );
}
