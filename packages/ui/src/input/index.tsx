"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export type InputProps = ComponentPropsWithoutRef<typeof BaseInput>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <BaseInput
        ref={ref}
        className={`h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-foreground-muted focus:border-brand-600 focus:outline-2 focus:outline-offset-2 focus:outline-brand-600 disabled:pointer-events-none disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
