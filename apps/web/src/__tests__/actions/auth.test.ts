import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCreateSession = vi.fn();
const mockDestroySession = vi.fn();

vi.mock("@/lib/session", () => ({
  createSession: mockCreateSession,
  destroySession: mockDestroySession,
}));

const mockDb = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock("@boilerplate/database", () => ({
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

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signIn", () => {
    it("returns error when email or password missing", async () => {
      const { signIn } = await import("@/app/actions/auth");
      const formData = new FormData();
      const result = await signIn(null, formData);
      expect(result).toEqual({ error: "Email and password are required" });
    });

    it("returns error when user not found", async () => {
      mockDb.user.findUnique.mockResolvedValue(null);
      const { signIn } = await import("@/app/actions/auth");
      const formData = new FormData();
      formData.set("email", "test@test.com");
      formData.set("password", "password");
      const result = await signIn(null, formData);
      expect(result).toEqual({ error: "Invalid email or password" });
    });

    it("returns error when password invalid", async () => {
      mockDb.user.findUnique.mockResolvedValue({ id: "1", passwordHash: "hash" });
      const bcrypt = (await import("bcryptjs")).default;
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      const { signIn } = await import("@/app/actions/auth");
      const formData = new FormData();
      formData.set("email", "test@test.com");
      formData.set("password", "wrong");
      const result = await signIn(null, formData);
      expect(result).toEqual({ error: "Invalid email or password" });
    });

    it("creates session and redirects on success", async () => {
      mockDb.user.findUnique.mockResolvedValue({ id: "user-1", passwordHash: "hash" });
      const bcrypt = (await import("bcryptjs")).default;
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);

      const { signIn } = await import("@/app/actions/auth");
      const formData = new FormData();
      formData.set("email", "test@test.com");
      formData.set("password", "correct");
      await expect(signIn(null, formData)).rejects.toThrow("NEXT_REDIRECT");

      expect(mockCreateSession).toHaveBeenCalledWith("user-1");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });
  });

  describe("signUp", () => {
    it("returns error when fields missing", async () => {
      const { signUp } = await import("@/app/actions/auth");
      const formData = new FormData();
      const result = await signUp(null, formData);
      expect(result).toEqual({ error: "All fields are required" });
    });

    it("returns error when passwords don't match", async () => {
      const { signUp } = await import("@/app/actions/auth");
      const formData = new FormData();
      formData.set("name", "Test");
      formData.set("email", "test@test.com");
      formData.set("password", "Pass1234!");
      formData.set("confirmPassword", "Different1!");
      const result = await signUp(null, formData);
      expect(result).toEqual({ error: "Passwords do not match" });
    });

    it("returns error for invalid email", async () => {
      const { signUp } = await import("@/app/actions/auth");
      const formData = new FormData();
      formData.set("name", "Test");
      formData.set("email", "not-an-email");
      formData.set("password", "Pass1234!");
      formData.set("confirmPassword", "Pass1234!");
      const result = await signUp(null, formData);
      expect(result).toEqual({ error: "Invalid email address" });
    });

    it("returns error for weak password", async () => {
      const { signUp } = await import("@/app/actions/auth");
      const formData = new FormData();
      formData.set("name", "Test");
      formData.set("email", "test@test.com");
      formData.set("password", "weak");
      formData.set("confirmPassword", "weak");
      const result = await signUp(null, formData);
      expect(result.error).toContain("Password must be at least 8 characters");
    });

    it("returns error when email already exists", async () => {
      mockDb.user.findUnique.mockResolvedValue({ id: "existing" });
      const { signUp } = await import("@/app/actions/auth");
      const formData = new FormData();
      formData.set("name", "Test");
      formData.set("email", "test@test.com");
      formData.set("password", "Pass1234!");
      formData.set("confirmPassword", "Pass1234!");
      const result = await signUp(null, formData);
      expect(result).toEqual({ error: "An account with this email already exists" });
    });

    it("creates user, session and redirects on success", async () => {
      mockDb.user.findUnique.mockResolvedValue(null);
      mockDb.user.create.mockResolvedValue({ id: "new-user" });
      const bcrypt = (await import("bcryptjs")).default;
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue("hashed");

      const { signUp } = await import("@/app/actions/auth");
      const formData = new FormData();
      formData.set("name", "Test User");
      formData.set("email", "new@test.com");
      formData.set("password", "Pass1234!");
      formData.set("confirmPassword", "Pass1234!");
      await expect(signUp(null, formData)).rejects.toThrow("NEXT_REDIRECT");

      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: { name: "Test User", email: "new@test.com", passwordHash: "hashed" },
      });
      expect(mockCreateSession).toHaveBeenCalledWith("new-user");
    });
  });

  describe("signOut", () => {
    it("destroys session and redirects", async () => {
      const { signOut } = await import("@/app/actions/auth");
      await expect(signOut()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockDestroySession).toHaveBeenCalled();
    });
  });
});
