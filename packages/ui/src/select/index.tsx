"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const SelectRoot = BaseSelect.Root;
export const SelectPortal = BaseSelect.Portal;
export const SelectValue = BaseSelect.Value;
export const SelectGroup = BaseSelect.Group;
export const SelectPositioner = BaseSelect.Positioner;

export const SelectTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof BaseSelect.Trigger>
>(({ className = "", ...props }, ref) => (
  <BaseSelect.Trigger
    ref={ref}
    className={`inline-flex h-10 items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${className}`}
    {...props}
  />
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectPopup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseSelect.Popup>
>(({ className = "", ...props }, ref) => (
  <BaseSelect.Popup
    ref={ref}
    className={`rounded-md border border-border bg-surface p-1 shadow-card ${className}`}
    {...props}
  />
));
SelectPopup.displayName = "SelectPopup";

export const SelectItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseSelect.Item>
>(({ className = "", ...props }, ref) => (
  <BaseSelect.Item
    ref={ref}
    className={`flex cursor-pointer items-center rounded px-2 py-1.5 text-sm text-foreground outline-none data-highlighted:bg-surface-secondary ${className}`}
    {...props}
  />
));
SelectItem.displayName = "SelectItem";

export const SelectGroupLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>(({ className = "", ...props }, ref) => (
  <BaseSelect.GroupLabel
    ref={ref}
    className={`px-2 py-1.5 text-xs font-medium text-foreground-muted ${className}`}
    {...props}
  />
));
SelectGroupLabel.displayName = "SelectGroupLabel";
