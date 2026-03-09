import { ComponentPropsWithoutRef, forwardRef } from "react";

export type CardProps = ComponentPropsWithoutRef<"div">;

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border border-border bg-surface p-6 shadow-card ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`mb-4 ${className}`} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h3">>(
  ({ className = "", ...props }, ref) => (
    <h3 ref={ref} className={`text-lg font-semibold text-foreground ${className}`} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<"p">>(
  ({ className = "", ...props }, ref) => (
    <p ref={ref} className={`mt-1 text-sm text-foreground-secondary ${className}`} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className = "", ...props }, ref) => <div ref={ref} className={`${className}`} {...props} />,
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`mt-4 flex items-center gap-2 ${className}`} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";
