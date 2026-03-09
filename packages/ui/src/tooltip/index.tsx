"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const TooltipRoot = BaseTooltip.Root;
export const TooltipProvider = BaseTooltip.Provider;
export const TooltipTrigger = BaseTooltip.Trigger;
export const TooltipPortal = BaseTooltip.Portal;
export const TooltipPositioner = BaseTooltip.Positioner;

export const TooltipPopup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseTooltip.Popup>
>(({ className = "", ...props }, ref) => (
  <BaseTooltip.Popup
    ref={ref}
    className={`rounded-md bg-foreground px-2 py-1 text-xs text-surface shadow-md ${className}`}
    {...props}
  />
));
TooltipPopup.displayName = "TooltipPopup";

export const TooltipArrow = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseTooltip.Arrow>
>(({ className = "", ...props }, ref) => (
  <BaseTooltip.Arrow ref={ref} className={`fill-foreground ${className}`} {...props} />
));
TooltipArrow.displayName = "TooltipArrow";
