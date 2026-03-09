import { beforeEach, describe, expect, it, vi } from "vitest";

type ConfigFn = (opts: { requestLocale: Promise<string> }) => Promise<{
  locale: string;
  messages: Record<string, unknown>;
}>;

let configCallback: ConfigFn;
let hasLocaleMock: (locales: string[], locale: string) => boolean;

vi.mock("next-intl", () => ({
  hasLocale: (locales: string[], locale: string) => hasLocaleMock(locales, locale),
}));

vi.mock("next-intl/server", () => ({
  getRequestConfig: vi.fn((fn: ConfigFn) => {
    configCallback = fn;
    return fn;
  }),
}));

describe("i18n request", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns the requested locale when valid", async () => {
    hasLocaleMock = (locales: string[], locale: string) => locales.includes(locale);

    await import("@/i18n/request");
    const result = await configCallback({ requestLocale: Promise.resolve("fr") });
    expect(result.locale).toBe("fr");
    expect(result.messages).toBeDefined();
  });

  it("falls back to defaultLocale when requested locale is invalid", async () => {
    hasLocaleMock = () => false;

    await import("@/i18n/request");
    const result = await configCallback({ requestLocale: Promise.resolve("invalid") });
    expect(result.locale).toBe("en");
  });
});
