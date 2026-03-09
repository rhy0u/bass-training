"use client";

import { Avatar } from "@friends/ui/avatar";
import { Button } from "@friends/ui/button";
import Link from "next/link";

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
  };
}

export function Navbar({ user, translations }: NavbarProps) {
  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-foreground">
          {translations.brand}
        </Link>

        <div className="flex items-center gap-3">
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
