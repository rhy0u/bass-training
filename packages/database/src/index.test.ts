import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// We need to test the singleton behavior of the Prisma client

describe("database index", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    // Clean up global prisma
    const g = globalThis as unknown as { prisma?: unknown };
    delete g.prisma;
  });

  it("exports a PrismaClient instance as db", async () => {
    const mod = await import("./index");
    expect(mod.db).toBeDefined();
    expect(typeof mod.db).toBe("object");
  });

  it("caches the client on globalThis in non-production", async () => {
    process.env.NODE_ENV = "development";
    const mod = await import("./index");
    const g = globalThis as unknown as { prisma?: unknown };
    expect(g.prisma).toBe(mod.db);
  });

  it("does not cache on globalThis in production", async () => {
    process.env.NODE_ENV = "production";
    const g = globalThis as unknown as { prisma?: unknown };
    delete g.prisma;
    const mod = await import("./index");
    expect(mod.db).toBeDefined();
    // In production, globalThis.prisma is not set by the module
    // (it only sets when NODE_ENV !== "production")
    expect(g.prisma).toBeUndefined();
  });

  it("reuses existing globalThis.prisma if present", async () => {
    const fakePrisma = { fake: true };
    const g = globalThis as unknown as { prisma?: unknown };
    g.prisma = fakePrisma;
    const mod = await import("./index");
    expect(mod.db).toBe(fakePrisma);
  });

  it("re-exports from @prisma/client", async () => {
    const mod = await import("./index");
    expect(mod.Prisma).toBeDefined();
  });
});
