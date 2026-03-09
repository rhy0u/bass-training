import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetSession = vi.fn();
vi.mock("@/lib/session", () => ({
  getSession: mockGetSession,
}));

const mockDb = {
  notification: {
    findMany: vi.fn(),
    count: vi.fn(),
    updateMany: vi.fn(),
  },
};

vi.mock("@friends/database", () => ({
  db: mockDb,
}));

class RedirectError extends Error {
  constructor(public url: string) {
    super(`NEXT_REDIRECT: ${url}`);
  }
}
const mockRedirect = vi.fn((url: string) => {
  throw new RedirectError(url);
});
vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("notifications actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getNotifications", () => {
    it("returns empty array when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { getNotifications } = await import("@/app/actions/notifications");
      const result = await getNotifications();
      expect(result).toEqual([]);
    });

    it("returns notifications for authenticated user", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const notifications = [{ id: "n1", title: "test" }];
      mockDb.notification.findMany.mockResolvedValue(notifications);

      const { getNotifications } = await import("@/app/actions/notifications");
      const result = await getNotifications();
      expect(result).toEqual(notifications);
    });
  });

  describe("getUnreadNotificationCount", () => {
    it("returns 0 when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { getUnreadNotificationCount } = await import("@/app/actions/notifications");
      const result = await getUnreadNotificationCount();
      expect(result).toBe(0);
    });

    it("returns count for authenticated user", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.notification.count.mockResolvedValue(5);

      const { getUnreadNotificationCount } = await import("@/app/actions/notifications");
      const result = await getUnreadNotificationCount();
      expect(result).toBe(5);
    });
  });

  describe("markNotificationAsRead", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { markNotificationAsRead } = await import("@/app/actions/notifications");
      await expect(markNotificationAsRead("n1")).rejects.toThrow("NEXT_REDIRECT");
    });

    it("marks notification as read", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { markNotificationAsRead } = await import("@/app/actions/notifications");
      await markNotificationAsRead("n1");
      expect(mockDb.notification.updateMany).toHaveBeenCalledWith({
        where: { id: "n1", userId: "user-1" },
        data: { read: true },
      });
    });
  });

  describe("markAllNotificationsAsRead", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { markAllNotificationsAsRead } = await import("@/app/actions/notifications");
      await expect(markAllNotificationsAsRead()).rejects.toThrow("NEXT_REDIRECT");
    });

    it("marks all notifications as read", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { markAllNotificationsAsRead } = await import("@/app/actions/notifications");
      await markAllNotificationsAsRead();
      expect(mockDb.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: "user-1", read: false },
        data: { read: true },
      });
    });
  });
});
