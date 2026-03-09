import { ReactNode } from "react";
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "../dialog";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onConfirm,
  variant = "default",
}: ConfirmDialogProps) {
  const confirmClass =
    variant === "danger"
      ? "bg-red-500 text-white hover:opacity-90"
      : "bg-foreground text-surface hover:opacity-90";

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose>{cancelLabel}</DialogClose>
            <button
              type="button"
              className={`inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${confirmClass}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}
