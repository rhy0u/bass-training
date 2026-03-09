"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const DialogRoot = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;
export const DialogPortal = BaseDialog.Portal;

export const DialogBackdrop = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className = "", ...props }, ref) => (
  <BaseDialog.Backdrop
    ref={ref}
    className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-all data-ending-style:opacity-0 data-starting-style:opacity-0 ${className}`}
    {...props}
  />
));
DialogBackdrop.displayName = "DialogBackdrop";

export const DialogPopup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseDialog.Popup>
>(({ className = "", ...props }, ref) => (
  <BaseDialog.Popup
    ref={ref}
    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl bg-surface p-6 shadow-modal transition-all data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 ${className}`}
    {...props}
  />
));
DialogPopup.displayName = "DialogPopup";

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(({ className = "", ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={`text-lg font-semibold text-foreground ${className}`}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(({ className = "", ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    className={`mt-2 text-sm text-foreground-secondary ${className}`}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
