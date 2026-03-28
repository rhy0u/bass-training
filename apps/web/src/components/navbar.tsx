"use client";

import { Link } from "@/i18n/navigation";
import { Avatar } from "@bass-training/ui/avatar";
import { Button } from "@bass-training/ui/button";
import {
  MenuLinkItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@bass-training/ui/menu";
import { LocaleSwitcher } from "./locale-switcher";
import { useTheme } from "./theme-provider";

interface NavbarProps {
  user?: {
    name?: string | null;
    avatar?: string | null;
  } | null;
  currentLocale: string;
  translations: {
    brand: string;
    signIn: string;
    signUp: string;
    profile: string;
    logout: string;
    userMenu: string;
    lightMode: string;
    darkMode: string;
    language: string;
    notationQuiz: string;
    fretboardQuiz: string;
    leaderboard: string;
    myScores: string;
  };
}

function ThemeToggle({
  theme,
  toggle,
  label,
}: Readonly<{
  theme: string;
  toggle: () => void;
  label: string;
}>) {
  return (
    <button
      onClick={toggle}
      className="rounded-md p-2 text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
      aria-label={label}
      title={label}
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
  );
}

export function Navbar({
  user,
  currentLocale,
  translations,
}: Readonly<NavbarProps>) {
  const { theme, toggle } = useTheme();
  const themeLabel = theme === "dark" ? translations.lightMode : translations.darkMode;

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 xs:px-4 md:h-16">
        <Link href="/" className="text-lg font-semibold text-foreground">
          {translations.brand}
        </Link>

        {/* Page links */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/notation-quiz"
            className="rounded-md px-3 py-1.5 text-sm text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
          >
            {translations.notationQuiz}
          </Link>
          <Link
            href="/fretboard-quiz"
            className="rounded-md px-3 py-1.5 text-sm text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
          >
            {translations.fretboardQuiz}
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-md px-3 py-1.5 text-sm text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
          >
            {translations.leaderboard}
          </Link>
          {user && (
            <Link
              href="/my-scores"
              className="rounded-md px-3 py-1.5 text-sm text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
            >
              {translations.myScores}
            </Link>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher label={translations.language} />
          <ThemeToggle theme={theme} toggle={toggle} label={themeLabel} />
          {user ? (
            <>
              <Link href="/profile" aria-label={translations.profile}>
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

        {/* Mobile nav */}
        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher label={translations.language} />
          <ThemeToggle theme={theme} toggle={toggle} label={themeLabel} />
          {user ? (
            <>
              <MenuRoot>
                <MenuTrigger
                  aria-label={translations.userMenu}
                  className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Avatar src={user.avatar} fallback={user.name ?? "?"} size="sm" />
                </MenuTrigger>
                <MenuPortal>
                  <MenuPositioner align="end" sideOffset={8}>
                    <MenuPopup>
                      <MenuLinkItem href={`/${currentLocale}/notation-quiz`}>
                        {translations.notationQuiz}
                      </MenuLinkItem>
                      <MenuLinkItem href={`/${currentLocale}/fretboard-quiz`}>
                        {translations.fretboardQuiz}
                      </MenuLinkItem>
                      <MenuLinkItem href={`/${currentLocale}/leaderboard`}>
                        {translations.leaderboard}
                      </MenuLinkItem>
                      <MenuLinkItem href={`/${currentLocale}/my-scores`}>
                        {translations.myScores}
                      </MenuLinkItem>
                      <MenuSeparator />
                      <MenuLinkItem href={`/${currentLocale}/profile`}>
                        {translations.profile}
                      </MenuLinkItem>
                      <MenuSeparator />
                      <MenuLinkItem href={`/${currentLocale}/logout`} className="text-red-500">
                        {translations.logout}
                      </MenuLinkItem>
                    </MenuPopup>
                  </MenuPositioner>
                </MenuPortal>
              </MenuRoot>
            </>
          ) : (
            <>
              <Link href="/notation-quiz">
                <Button variant="ghost" size="sm">
                  {translations.notationQuiz}
                </Button>
              </Link>
              <Link href="/fretboard-quiz">
                <Button variant="ghost" size="sm">
                  {translations.fretboardQuiz}
                </Button>
              </Link>
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
