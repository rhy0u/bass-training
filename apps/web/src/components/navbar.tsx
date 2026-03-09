"use client";

import { Avatar } from "@friends/ui/avatar";
import { Button } from "@friends/ui/button";
import Link from "next/link";
import { useTheme } from "./theme-provider";

interface NavbarProps {
  user?: {
    name?: string | null;
    avatar?: string | null;
  } | null;
  translations: {
    brand: string;
    signIn: string;
    signUp: string;
    profile: string;
    logout: string;
    lightMode: string;
    darkMode: string;
  };
}

export function Navbar({ user, translations }: NavbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-foreground">
          {translations.brand}
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="rounded-md p-2 text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
            aria-label={theme === "dark" ? translations.lightMode : translations.darkMode}
            title={theme === "dark" ? translations.lightMode : translations.darkMode}
          >
            {theme === "dark" ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          {user ? (
            <>
              <Link href="/profile">
                <Avatar
                  src={user.avatar}
                  fallback={user.name ?? "?"}
                  size="sm"
                  className="cursor-pointer"
                />
              </Link>
              <Link
                href="/profile"
                className="text-sm text-foreground-secondary hover:text-foreground"
              >
                {translations.profile}
              </Link>
              <Link href="/logout">
                <Button variant="ghost" size="sm">
                  {translations.logout}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  {translations.signIn}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">{translations.signUp}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
