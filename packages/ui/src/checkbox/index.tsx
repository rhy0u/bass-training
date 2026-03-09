"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof BaseCheckbox.Root> {
  label?: ReactNode;
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <BaseCheckbox.Root
          ref={ref}
          className={`flex h-5 w-5 items-center justify-center rounded border border-border bg-surface transition-colors data-checked:border-brand-600 data-checked:bg-brand-600 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${className}`}
          {...props}
        >
          <BaseCheckbox.Indicator className="flex items-center justify-center">
            <CheckIcon />
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
        {label && <span className="text-sm text-foreground select-none">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
