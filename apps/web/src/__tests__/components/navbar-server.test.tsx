import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("NavbarServer", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("fetches user, locale, translations and passes to Navbar", async () => {
    vi.doMock("@/app/actions/notifications", () => ({
      getUnreadNotificationCount: vi.fn().mockResolvedValue(3),
    }));

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
        unreadNotificationCount: 3,
        user: { name: "Test User", avatar: null },
      }),
      undefined,
    );
  });

  it("passes 0 unread count when no user", async () => {
    vi.doMock("@/lib/auth", () => ({
      getCurrentUser: vi.fn().mockResolvedValue(null),
    }));

    vi.doMock("@/app/actions/notifications", () => ({
      getUnreadNotificationCount: vi.fn().mockResolvedValue(0),
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
        unreadNotificationCount: 0,
      }),
      undefined,
    );
  });
});
