"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentPropsWithoutRef<typeof BaseButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  solid: "bg-foreground text-surface hover:opacity-90 active:opacity-80",
  outline:
    "border border-border text-foreground hover:bg-surface-secondary active:bg-surface-tertiary",
  ghost: "text-foreground hover:bg-surface-secondary active:bg-surface-tertiary",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "solid", size = "md", className = "", ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
