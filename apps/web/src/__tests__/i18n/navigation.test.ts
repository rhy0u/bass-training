import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl/navigation", () => ({
  createNavigation: vi.fn(() => ({
    Link: "MockLink",
    redirect: "mockRedirect",
    usePathname: "mockUsePathname",
    useRouter: "mockUseRouter",
    getPathname: "mockGetPathname",
  })),
}));

describe("i18n navigation", () => {
  it("exports navigation utilities", async () => {
    const mod = await import("@/i18n/navigation");
    expect(mod.Link).toBeDefined();
    expect(mod.redirect).toBeDefined();
    expect(mod.usePathname).toBeDefined();
    expect(mod.useRouter).toBeDefined();
    expect(mod.getPathname).toBeDefined();
  });
});
