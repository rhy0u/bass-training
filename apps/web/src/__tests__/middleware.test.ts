import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl/middleware", () => ({
  default: vi.fn(() => "middleware-handler"),
}));

describe("middleware", () => {
  it("exports a default middleware", async () => {
    const mod = await import("@/middleware");
    expect(mod.default).toBe("middleware-handler");
  });

  it("exports a config with matcher", async () => {
    const mod = await import("@/middleware");
    expect(mod.config).toEqual({
      matcher: ["/((?!api|_next|_vercel|icons|.*\\..*).*)"],
    });
  });
});
