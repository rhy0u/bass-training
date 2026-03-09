import { describe, expect, it } from "vitest";
import { defaultLocale, locales, routing } from "@/i18n/routing";

describe("routing", () => {
  it("exports locales", () => {
    expect(locales).toEqual(["en", "fr", "pt", "es", "de"]);
  });

  it("exports defaultLocale as en", () => {
    expect(defaultLocale).toBe("en");
  });

  it("exports a routing object with locales and defaultLocale", () => {
    expect(routing).toBeDefined();
  });
});
