import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetSession = vi.fn();
const mockDestroySession = vi.fn();

vi.mock("@/lib/session", () => ({
  getSession: mockGetSession,
  destroySession: mockDestroySession,
}));

const mockDb = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

describe("profile actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateProfile", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { updateProfile } = await import("@/app/actions/profile");
      await expect(updateProfile(null, new FormData())).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when fields missing", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updateProfile } = await import("@/app/actions/profile");
      const result = await updateProfile(null, new FormData());
      expect(result).toEqual({ error: "Name and email are required" });
    });

    it("returns error when email taken by another user", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.user.findUnique.mockResolvedValue({ id: "user-2" });

      const { updateProfile } = await import("@/app/actions/profile");
      const formData = new FormData();
      formData.set("name", "Test");
      formData.set("email", "taken@test.com");
      const result = await updateProfile(null, formData);
      expect(result).toEqual({ error: "This email is already in use" });
    });

    it("updates profile and returns success", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.user.findUnique.mockResolvedValue({ id: "user-1" });

      const { updateProfile } = await import("@/app/actions/profile");
      const formData = new FormData();
      formData.set("name", "New Name");
      formData.set("email", "same@test.com");
      const result = await updateProfile(null, formData);
      expect(result).toEqual({ success: true });
      expect(mockDb.user.update).toHaveBeenCalled();
    });

    it("updates profile when email not taken (findUnique returns null)", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.user.findUnique.mockResolvedValue(null);

      const { updateProfile } = await import("@/app/actions/profile");
      const formData = new FormData();
      formData.set("name", "Name");
      formData.set("email", "new@test.com");
      const result = await updateProfile(null, formData);
      expect(result).toEqual({ success: true });
    });
  });

  describe("updatePassword", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { updatePassword } = await import("@/app/actions/profile");
      await expect(updatePassword(null, new FormData())).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when fields missing", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updatePassword } = await import("@/app/actions/profile");
      const result = await updatePassword(null, new FormData());
      expect(result).toEqual({ error: "Both fields are required" });
    });

    it("returns error for weak password", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updatePassword } = await import("@/app/actions/profile");
      const formData = new FormData();
      formData.set("currentPassword", "old");
      formData.set("newPassword", "weak");
      const result = await updatePassword(null, formData);
      expect(result.error).toContain("Password must be at least 8 characters");
    });

    it("redirects when user not found", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.user.findUnique.mockResolvedValue(null);

      const { updatePassword } = await import("@/app/actions/profile");
      const formData = new FormData();
      formData.set("currentPassword", "Old1234!");
      formData.set("newPassword", "New1234!");
      await expect(updatePassword(null, formData)).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when current password wrong", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.user.findUnique.mockResolvedValue({ id: "user-1", passwordHash: "hash" });
      const bcrypt = (await import("bcryptjs")).default;
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      const { updatePassword } = await import("@/app/actions/profile");
      const formData = new FormData();
      formData.set("currentPassword", "Wrong1234!");
      formData.set("newPassword", "New1234!");
      const result = await updatePassword(null, formData);
      expect(result).toEqual({ error: "Current password is incorrect" });
    });

    it("updates password on success", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.user.findUnique.mockResolvedValue({ id: "user-1", passwordHash: "hash" });
      const bcrypt = (await import("bcryptjs")).default;
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue("new-hash");

      const { updatePassword } = await import("@/app/actions/profile");
      const formData = new FormData();
      formData.set("currentPassword", "Old1234!");
      formData.set("newPassword", "New1234!");
      const result = await updatePassword(null, formData);
      expect(result).toEqual({ success: true });
      expect(mockDb.user.update).toHaveBeenCalled();
    });
  });

  describe("updateAvatar", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { updateAvatar } = await import("@/app/actions/profile");
      await expect(updateAvatar(null, new FormData())).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when no file", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updateAvatar } = await import("@/app/actions/profile");
      const result = await updateAvatar(null, new FormData());
      expect(result).toEqual({ error: "No file provided" });
    });

    it("returns error for invalid file type", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updateAvatar } = await import("@/app/actions/profile");
      const formData = new FormData();
      formData.set("avatar", new File(["data"], "test.gif", { type: "image/gif" }));
      const result = await updateAvatar(null, formData);
      expect(result).toEqual({ error: "Only JPEG, PNG, and WebP images are allowed" });
    });

    it("returns error for file too large", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updateAvatar } = await import("@/app/actions/profile");
      const formData = new FormData();
      const bigFile = new File([new ArrayBuffer(3 * 1024 * 1024)], "big.png", {
        type: "image/png",
      });
      formData.set("avatar", bigFile);
      const result = await updateAvatar(null, formData);
      expect(result).toEqual({ error: "File must be smaller than 2MB" });
    });

    it("uploads avatar on success", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updateAvatar } = await import("@/app/actions/profile");
      const formData = new FormData();
      const file = new File(["pixel"], "avatar.png", { type: "image/png" });
      formData.set("avatar", file);
      const result = await updateAvatar(null, formData);
      expect(result).toEqual({ success: true });
      expect(mockDb.user.update).toHaveBeenCalled();
    });
  });

  describe("deleteAccount", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { deleteAccount } = await import("@/app/actions/profile");
      await expect(deleteAccount()).rejects.toThrow("NEXT_REDIRECT");
    });

    it("deletes user, destroys session, and redirects", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { deleteAccount } = await import("@/app/actions/profile");
      await expect(deleteAccount()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockDb.user.delete).toHaveBeenCalledWith({ where: { id: "user-1" } });
      expect(mockDestroySession).toHaveBeenCalled();
    });
  });
});
