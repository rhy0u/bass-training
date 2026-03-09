"use server";

import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { cookies } from "next/headers";

export async function setLocale(locale: string) {
  if (!locales.includes(locale as Locale)) {
    return;
  }
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
