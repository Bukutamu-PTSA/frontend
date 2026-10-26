import { useSyncExternalStore } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Pengganti window.confirm: modal konfirmasi di tengah layar.
 *
 * Pemakaian:
 *   if (!(await confirmDialog(CONFIRM_MESSAGES.deleteFaq))) return;
 *
 * <ConfirmDialogHost /> cukup dipasang sekali di root (src/routes/__root.tsx).
 */
export type ConfirmOptions = {
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** true = tombol konfirmasi merah (aksi menghapus). */
  destructive?: boolean;
};

type PendingConfirm = Required<ConfirmOptions> & { resolve: (ok: boolean) => void };

let current: PendingConfirm | null = null;
const listeners = new Set<() => void>();

function setCurrent(next: PendingConfirm | null) {
  current = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Tampilkan modal konfirmasi; resolve true bila pengguna menekan tombol konfirmasi. */
export function confirmDialog(options: string | ConfirmOptions): Promise<boolean> {
  const opts = typeof options === "string" ? { message: options } : options;
  // Bila masih ada modal terbuka, anggap modal lama dibatalkan.
  current?.resolve(false);
  return new Promise<boolean>((resolve) => {
    setCurrent({
      title: "Konfirmasi Hapus",
      confirmLabel: "Hapus",
      cancelLabel: "Batal",
      destructive: true,
      ...opts,
      resolve,
    });
  });
}

function close(ok: boolean) {
  const pending = current;
  setCurrent(null);
  pending?.resolve(ok);
}

export function ConfirmDialogHost() {
  const pending = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );

  return (
    <AlertDialog
      open={pending !== null}
      onOpenChange={(open) => {
        if (!open) close(false);
      }}
    >
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
          <AlertDialogDescription>{pending?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => close(false)}>{pending?.cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={pending?.destructive ? "bg-red-500 text-white hover:bg-red-600" : ""}
            onClick={() => close(true)}
          >
            {pending?.confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
