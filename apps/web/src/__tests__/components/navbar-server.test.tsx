import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("NavbarServer", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("fetches user, locale, translations and passes to Navbar", async () => {
    vi.doMock("@/lib/auth", () => ({
      getCurrentUser: vi.fn().mockResolvedValue({
        name: "Test User",
        avatar: null,
      }),
    }));

    vi.doMock("next-intl/server", () => ({
      getTranslations: vi.fn().mockResolvedValue((key: string) => `t.${key}`),
      getLocale: vi.fn().mockResolvedValue("en"),
    }));

    const mockNavbar = vi.fn(() => null);
    vi.doMock("@/components/navbar", () => ({
      Navbar: mockNavbar,
    }));

    const { NavbarServer } = await import("@/components/navbar-server");
    const jsx = await NavbarServer();
    render(jsx);

    expect(mockNavbar).toHaveBeenCalledWith(
      expect.objectContaining({
        currentLocale: "en",
        user: { name: "Test User", avatar: null },
      }),
      undefined,
    );
  });

  it("passes null user when not authenticated", async () => {
    vi.doMock("@/lib/auth", () => ({
      getCurrentUser: vi.fn().mockResolvedValue(null),
    }));

    vi.doMock("next-intl/server", () => ({
      getTranslations: vi.fn().mockResolvedValue((key: string) => `t.${key}`),
      getLocale: vi.fn().mockResolvedValue("en"),
    }));

    const mockNavbar = vi.fn(() => null);
    vi.doMock("@/components/navbar", () => ({
      Navbar: mockNavbar,
    }));

    const { NavbarServer } = await import("@/components/navbar-server");
    const jsx = await NavbarServer();
    render(jsx);

    expect(mockNavbar).toHaveBeenCalledWith(
      expect.objectContaining({
        user: null,
      }),
      undefined,
    );
  });
});
