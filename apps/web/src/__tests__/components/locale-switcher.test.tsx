import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  usePathname: vi.fn(() => "/some-path"),
  useRouter: vi.fn(() => ({ replace: mockReplace })),
}));

vi.mock("@/i18n/routing", () => ({
  locales: ["en", "fr", "pt", "es", "de"] as const,
}));

vi.mock("next-intl", () => ({
  useLocale: vi.fn(() => "en"),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}));

vi.mock("@bass-training/ui/menu", () => ({
  MenuRoot: ({ children }: React.PropsWithChildren) => (
    <div data-testid="menu-root">{children}</div>
  ),
  MenuTrigger: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <button data-testid="menu-trigger" {...props}>
      {children}
    </button>
  ),
  MenuPortal: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MenuPositioner: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MenuPopup: ({ children }: React.PropsWithChildren) => (
    <div data-testid="menu-popup">{children}</div>
  ),
  MenuItem: ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

import { LocaleSwitcher } from "@/components/locale-switcher";

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the trigger with label", () => {
    render(<LocaleSwitcher label="Language" />);
    expect(screen.getByTestId("menu-trigger")).toBeDefined();
  });

  it("renders all locale options", () => {
    render(<LocaleSwitcher label="Language" />);
    expect(screen.getByText("English")).toBeDefined();
    expect(screen.getByText("Français")).toBeDefined();
    expect(screen.getByText("Português")).toBeDefined();
    expect(screen.getByText("Español")).toBeDefined();
    expect(screen.getByText("Deutsch")).toBeDefined();
  });

  it("calls router.replace when a locale is clicked", () => {
    render(<LocaleSwitcher label="Language" />);
    fireEvent.click(screen.getByText("Français"));
    expect(mockReplace).toHaveBeenCalledWith({ pathname: "/some-path" }, { locale: "fr" });
  });
});
