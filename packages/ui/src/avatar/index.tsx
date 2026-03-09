import { ComponentPropsWithoutRef, forwardRef } from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends ComponentPropsWithoutRef<"div"> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "", fallback, size = "md", className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-tertiary ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span className="font-medium text-foreground-secondary">
            {fallback ? getInitials(fallback) : "?"}
          </span>
        )}
      </div>
    );
  },
);
Avatar.displayName = "Avatar";
