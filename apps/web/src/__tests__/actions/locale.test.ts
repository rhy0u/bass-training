import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCookieStore = {
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

describe("locale action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets cookie for valid locale", async () => {
    const { setLocale } = await import("@/app/actions/locale");
    await setLocale("fr");
    expect(mockCookieStore.set).toHaveBeenCalledWith("NEXT_LOCALE", "fr", {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  });

  it("does nothing for invalid locale", async () => {
    const { setLocale } = await import("@/app/actions/locale");
    await setLocale("invalid");
    expect(mockCookieStore.set).not.toHaveBeenCalled();
  });
});
