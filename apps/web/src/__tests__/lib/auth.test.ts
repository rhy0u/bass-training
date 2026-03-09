import { describe, expect, it, vi } from "vitest";

const mockDb = {
  user: {
    findUnique: vi.fn(),
  },
};

vi.mock("@friends/database", () => ({
  db: mockDb,
}));

const mockGetSession = vi.fn();
vi.mock("@/lib/session", () => ({
  getSession: mockGetSession,
}));

describe("auth", () => {
  describe("getCurrentUser", () => {
    it("returns null when no session exists", async () => {
      mockGetSession.mockResolvedValue(null);
      const { getCurrentUser } = await import("@/lib/auth");
      const result = await getCurrentUser();
      expect(result).toBeNull();
    });

    it("returns user when session exists", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@test.com",
        name: "Test",
        avatar: null,
        createdAt: new Date(),
      };
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.user.findUnique.mockResolvedValue(mockUser);

      const { getCurrentUser } = await import("@/lib/auth");
      const result = await getCurrentUser();
      expect(result).toEqual(mockUser);
    });
  });
});
