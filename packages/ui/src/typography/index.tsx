import { type ComponentPropsWithoutRef, type ElementType, forwardRef } from "react";

type TypographyVariant = "h1" | "h2" | "h3" | "body" | "body-sm" | "caption";

const defaultElementMap: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  "body-sm": "p",
  caption: "span",
};

const variantStyles: Record<TypographyVariant, string> = {
  h1: "text-h1 text-foreground",
  h2: "text-h2 text-foreground",
  h3: "text-h3 text-foreground",
  body: "text-body text-foreground-secondary",
  "body-sm": "text-body-sm text-foreground-secondary",
  caption: "text-caption text-foreground-muted",
};

type TypographyProps<T extends ElementType = "p"> = {
  as?: T;
  variant?: TypographyVariant;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ as, variant = "body", className = "", ...props }, ref) => {
    const Component = as ?? defaultElementMap[variant];

    return <Component ref={ref} className={`${variantStyles[variant]} ${className}`} {...props} />;
  },
) as <T extends ElementType = "p">(
  props: TypographyProps<T> & { ref?: React.Ref<HTMLElement> },
) => React.ReactElement | null;
