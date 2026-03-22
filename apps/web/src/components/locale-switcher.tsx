"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import {
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@boilerplate/ui/menu";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useTransition } from "react";

const flags: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  pt: "Português",
  es: "Español",
  de: "Deutsch",
};

function Flag({ locale, size = 20 }: { locale: Locale; size?: number }) {
  return (
    <Image
      src={`/flags/${locale}.svg`}
      alt={flags[locale]}
      width={size}
      height={size}
      aria-hidden="true"
    />
  );
}

export function LocaleSwitcher({ label }: { label: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: Locale) {
    startTransition(() => {
      router.replace({ pathname }, { locale: next });
    });
  }

  return (
    <MenuRoot>
      <MenuTrigger
        aria-label={label}
        className={`flex cursor-pointer items-center gap-1 rounded-md p-2 text-foreground-secondary outline-none hover:bg-surface-secondary hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary ${isPending ? "opacity-50" : ""}`}
      >
        <Flag locale={locale} />
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner align="end" sideOffset={8}>
          <MenuPopup>
            {locales.map((l) => (
              <MenuItem
                key={l}
                onClick={() => switchLocale(l)}
                className={l === locale ? "bg-surface-secondary font-medium" : ""}
              >
                <span className="flex items-center gap-2">
                  <Flag locale={l} />
                  {flags[l]}
                </span>
              </MenuItem>
            ))}
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  );
}
