"use client";

import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export interface SeparatorProps extends ComponentPropsWithoutRef<typeof BaseSeparator> {
  orientation?: "horizontal" | "vertical";
}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  ({ orientation = "horizontal", className = "", ...props }, ref) => {
    return (
      <BaseSeparator
        ref={ref}
        className={`shrink-0 bg-border ${
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px"
        } ${className}`}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";
