import { describe, expect, it } from "vitest";
import { defaultLocale, locales } from "@/i18n/config";

describe("i18n config", () => {
  it("re-exports locales from routing", () => {
    expect(locales).toEqual(["en", "fr", "pt", "es", "de"]);
  });

  it("re-exports defaultLocale from routing", () => {
    expect(defaultLocale).toBe("en");
  });
});
