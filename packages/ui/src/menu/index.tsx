import { Menu as BaseMenu } from "@base-ui/react";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const MenuRoot = BaseMenu.Root;

export const MenuTrigger = BaseMenu.Trigger;

export const MenuPortal = BaseMenu.Portal;

export const MenuPositioner = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseMenu.Positioner>
>(({ className = "", ...props }, ref) => (
  <BaseMenu.Positioner ref={ref} className={`z-50 ${className}`} {...props} />
));
MenuPositioner.displayName = "MenuPositioner";

export const MenuPopup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseMenu.Popup>
>(({ className = "", ...props }, ref) => (
  <BaseMenu.Popup
    ref={ref}
    className={`min-w-40 rounded-lg border border-border bg-surface p-1 shadow-lg outline-none ${className}`}
    {...props}
  />
));
MenuPopup.displayName = "MenuPopup";

export const MenuItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseMenu.Item>>(
  ({ className = "", ...props }, ref) => (
    <BaseMenu.Item
      ref={ref}
      className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground outline-none select-none hover:bg-surface-secondary data-highlighted:bg-surface-secondary ${className}`}
      {...props}
    />
  ),
);
MenuItem.displayName = "MenuItem";

export const MenuLinkItem = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof BaseMenu.LinkItem>
>(({ className = "", ...props }, ref) => (
  <BaseMenu.LinkItem
    ref={ref}
    className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground no-underline outline-none select-none hover:bg-surface-secondary data-highlighted:bg-surface-secondary ${className}`}
    {...props}
  />
));
MenuLinkItem.displayName = "MenuLinkItem";

export const MenuSeparator = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} role="separator" className={`my-1 h-px bg-border ${className}`} {...props} />
  ),
);
MenuSeparator.displayName = "MenuSeparator";
