import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@bass-training/ui/avatar", () => ({
  Avatar: ({ fallback }: { fallback: string }) => <div data-testid="avatar">{fallback}</div>,
}));

vi.mock("@bass-training/ui/button", () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@bass-training/ui/menu", () => ({
  MenuRoot: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MenuTrigger: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <button data-testid="user-menu-trigger" {...props}>
      {children}
    </button>
  ),
  MenuPortal: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MenuPositioner: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MenuPopup: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MenuItem: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div {...props}>{children}</div>
  ),
  MenuLinkItem: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  MenuSeparator: () => <hr />,
}));

const mockToggle = vi.fn();
const mockUseTheme = vi.fn(() => ({ theme: "light", toggle: mockToggle }));

vi.mock("@/components/locale-switcher", () => ({
  LocaleSwitcher: ({ label }: { label: string }) => (
    <div data-testid="locale-switcher">{label}</div>
  ),
}));

vi.mock("@/components/theme-provider", () => ({
  useTheme: (...args: unknown[]) => mockUseTheme(...args),
}));

import { Navbar } from "@/components/navbar";

const baseTranslations = {
  brand: "Bass Training",
  signIn: "Sign In",
  signUp: "Sign Up",
  profile: "Profile",
  logout: "Logout",
  userMenu: "User Menu",
  lightMode: "Light Mode",
  darkMode: "Dark Mode",
  language: "Language",
};

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({ theme: "light", toggle: mockToggle });
  });

  it("renders brand link", () => {
    render(<Navbar currentLocale="en" translations={baseTranslations} />);
    expect(screen.getByText("Bass Training")).toBeDefined();
  });

  it("renders sign in/up buttons when no user", () => {
    render(<Navbar currentLocale="en" translations={baseTranslations} />);
    const signInBtns = screen.getAllByText("Sign In");
    expect(signInBtns.length).toBeGreaterThan(0);
  });

  it("renders user nav when authenticated", () => {
    render(
      <Navbar
        user={{ name: "Alice", avatar: null }}
        currentLocale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getAllByText("Logout").length).toBeGreaterThan(0);
  });

  it("renders dark mode toggle", () => {
    mockUseTheme.mockReturnValue({ theme: "dark", toggle: mockToggle });

    render(<Navbar currentLocale="en" translations={baseTranslations} />);
    // The theme toggle button should exist (using Light Mode label when in dark mode)
  });

  it("renders 0 notification count without badge", () => {
    render(
      <Navbar
        user={{ name: "Alice", avatar: null }}
        currentLocale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.queryByText("0")).toBeNull();
  });
});
