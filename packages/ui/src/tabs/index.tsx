"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const TabsRoot = BaseTabs.Root;

export const TabsList = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseTabs.List>>(
  ({ className = "", ...props }, ref) => (
    <BaseTabs.List ref={ref} className={`inline-flex items-center gap-1 rounded-lg bg-surface-secondary p-1 ${className}`} {...props} />
  ),
);
TabsList.displayName = "TabsList";

export const TabsTab = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseTabs.Tab>>(
  ({ className = "", ...props }, ref) => (
    <BaseTabs.Tab
      ref={ref}
      className={`rounded-md px-3 py-1.5 text-sm font-medium text-foreground-muted transition-all hover:text-foreground data-selected:bg-surface data-selected:text-foreground data-selected:shadow-soft ${className}`}
      {...props}
    />
  ),
);
TabsTab.displayName = "TabsTab";

export const TabsPanel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseTabs.Panel>
>(({ className = "", ...props }, ref) => (
  <BaseTabs.Panel ref={ref} className={`py-4 ${className}`} {...props} />
));
TabsPanel.displayName = "TabsPanel";

export const TabsIndicator = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<typeof BaseTabs.Indicator>
>(({ className = "", ...props }, ref) => (
  <BaseTabs.Indicator
    ref={ref}
    className={`absolute bottom-0 h-0.5 bg-brand-600 transition-all ${className}`}
    {...props}
  />
));
TabsIndicator.displayName = "TabsIndicator";
