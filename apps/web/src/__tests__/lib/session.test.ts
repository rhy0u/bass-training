import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
};

const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

vi.mock("@/lib/redis", () => ({
  redis: mockRedis,
}));

vi.mock("jose", () => {
  const signMock = vi.fn().mockResolvedValue("mock-jwt-token");
  class MockSignJWT {
    setProtectedHeader() {
      return this;
    }
    setExpirationTime() {
      return this;
    }
    setIssuedAt() {
      return this;
    }
    sign = signMock;
  }
  return {
    SignJWT: MockSignJWT,
    jwtVerify: vi.fn(),
  };
});

describe("session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createSession", () => {
    it("creates a JWT, stores in Redis, and sets a cookie", async () => {
      const { createSession } = await import("@/lib/session");
      const token = await createSession("user-123");

      expect(token).toBe("mock-jwt-token");
      expect(mockRedis.set).toHaveBeenCalledWith("session:mock-jwt-token", "user-123", {
        ex: 604800,
      });
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "session",
        "mock-jwt-token",
        expect.objectContaining({
          httpOnly: true,
          sameSite: "lax",
          maxAge: 604800,
          path: "/",
        }),
      );
    });
  });

  describe("getSession", () => {
    it("returns null when no cookie exists", async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      const { getSession } = await import("@/lib/session");
      const result = await getSession();
      expect(result).toBeNull();
    });

    it("returns null when Redis has no session", async () => {
      mockCookieStore.get.mockReturnValue({ value: "some-token" });
      mockRedis.get.mockResolvedValue(null);
      const { getSession } = await import("@/lib/session");
      const result = await getSession();
      expect(result).toBeNull();
    });

    it("returns session payload on valid token", async () => {
      mockCookieStore.get.mockReturnValue({ value: "valid-token" });
      mockRedis.get.mockResolvedValue("user-123");

      const { jwtVerify } = await import("jose");
      (jwtVerify as ReturnType<typeof vi.fn>).mockResolvedValue({
        payload: { userId: "user-123" },
      });

      const { getSession } = await import("@/lib/session");
      const result = await getSession();
      expect(result).toEqual({ userId: "user-123" });
    });

    it("returns null when JWT verification fails", async () => {
      mockCookieStore.get.mockReturnValue({ value: "bad-token" });
      mockRedis.get.mockResolvedValue("user-123");

      const { jwtVerify } = await import("jose");
      (jwtVerify as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("invalid"));

      const { getSession } = await import("@/lib/session");
      const result = await getSession();
      expect(result).toBeNull();
    });
  });

  describe("destroySession", () => {
    it("deletes from Redis and clears cookie when token exists", async () => {
      mockCookieStore.get.mockReturnValue({ value: "to-delete" });
      const { destroySession } = await import("@/lib/session");
      await destroySession();

      expect(mockRedis.del).toHaveBeenCalledWith("session:to-delete");
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "session",
        "",
        expect.objectContaining({ maxAge: 0 }),
      );
    });

    it("clears cookie even when no token exists", async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      const { destroySession } = await import("@/lib/session");
      await destroySession();

      expect(mockRedis.del).not.toHaveBeenCalled();
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "session",
        "",
        expect.objectContaining({ maxAge: 0 }),
      );
    });
  });
});
