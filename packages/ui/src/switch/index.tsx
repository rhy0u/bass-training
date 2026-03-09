"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";

export interface SwitchProps extends ComponentPropsWithoutRef<typeof BaseSwitch.Root> {
  label?: ReactNode;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <BaseSwitch.Root
          ref={ref}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-surface-tertiary transition-colors data-checked:border-brand-600 data-checked:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${className}`}
          {...props}
        >
          <BaseSwitch.Thumb className="block h-5 w-5 rounded-full bg-surface shadow-soft transition-transform data-checked:translate-x-5 translate-x-0 data-checked:bg-white" />
        </BaseSwitch.Root>
        {label && <span className="text-sm text-foreground select-none">{label}</span>}
      </label>
    );
  },
);

Switch.displayName = "Switch";
