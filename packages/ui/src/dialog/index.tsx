"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type DialogButtonVariant = "solid" | "ghost";
type DialogButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:pointer-events-none disabled:opacity-50";

const buttonVariantStyles: Record<DialogButtonVariant, string> = {
  solid: "bg-foreground text-surface hover:opacity-90 active:opacity-80",
  ghost: "text-foreground hover:bg-surface-secondary active:bg-surface-tertiary",
};

const buttonSizeStyles: Record<DialogButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const DialogRoot = BaseDialog.Root;
export const DialogPortal = BaseDialog.Portal;

interface DialogTriggerProps extends ComponentPropsWithoutRef<typeof BaseDialog.Trigger> {
  variant?: DialogButtonVariant;
  size?: DialogButtonSize;
}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ variant = "solid", size = "sm", className = "", ...props }, ref) => (
    <BaseDialog.Trigger
      ref={ref}
      className={`${buttonBase} ${buttonVariantStyles[variant]} ${buttonSizeStyles[size]} ${className}`}
      {...props}
    />
  ),
);
DialogTrigger.displayName = "DialogTrigger";

interface DialogCloseProps extends ComponentPropsWithoutRef<typeof BaseDialog.Close> {
  variant?: DialogButtonVariant;
  size?: DialogButtonSize;
}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ variant = "ghost", size = "sm", className = "", ...props }, ref) => (
    <BaseDialog.Close
      ref={ref}
      className={`${buttonBase} ${buttonVariantStyles[variant]} ${buttonSizeStyles[size]} ${className}`}
      {...props}
    />
  ),
);
DialogClose.displayName = "DialogClose";

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
