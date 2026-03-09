import { NavbarServer } from "@/components/navbar-server";
import { Toaster } from "@friends/ui/toaster";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Friends",
  description: "Friends project",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <NavbarServer />
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
