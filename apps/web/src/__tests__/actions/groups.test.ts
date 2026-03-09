import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetSession = vi.fn();
vi.mock("@/lib/session", () => ({
  getSession: mockGetSession,
}));

const mockDb = {
  group: {
    create: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
  groupMember: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  invitation: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
  notification: {
    create: vi.fn(),
  },
  $transaction: vi.fn(),
};

const MockGroupRole = { ADMIN: "ADMIN", MEMBER: "MEMBER" } as const;

vi.mock("@friends/database", () => ({
  db: mockDb,
  GroupRole: MockGroupRole,
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

describe("groups actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createGroup", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { createGroup } = await import("@/app/actions/groups");
      await expect(createGroup(null, new FormData())).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when name empty", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { createGroup } = await import("@/app/actions/groups");
      const result = await createGroup(null, new FormData());
      expect(result).toEqual({ error: "Group name is required" });
    });

    it("returns error when name too long", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { createGroup } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("name", "x".repeat(101));
      const result = await createGroup(null, formData);
      expect(result).toEqual({ error: "Group name must be 100 characters or fewer" });
    });

    it("creates group on success", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { createGroup } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("name", "Test Group");
      const result = await createGroup(null, formData);
      expect(result).toEqual({ success: true });
      expect(mockDb.group.create).toHaveBeenCalled();
    });
  });

  describe("deleteGroup", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { deleteGroup } = await import("@/app/actions/groups");
      await expect(deleteGroup("g1")).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when group not found", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.group.findUnique.mockResolvedValue(null);
      const { deleteGroup } = await import("@/app/actions/groups");
      const result = await deleteGroup("g1");
      expect(result).toEqual({ error: "Group not found" });
    });

    it("returns error when not owner", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.group.findUnique.mockResolvedValue({ ownerId: "user-2" });
      const { deleteGroup } = await import("@/app/actions/groups");
      const result = await deleteGroup("g1");
      expect(result).toEqual({ error: "Only the group owner can delete it" });
    });

    it("deletes group and redirects", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.group.findUnique.mockResolvedValue({ ownerId: "user-1" });
      const { deleteGroup } = await import("@/app/actions/groups");
      await expect(deleteGroup("g1")).rejects.toThrow("NEXT_REDIRECT");
      expect(mockDb.group.delete).toHaveBeenCalledWith({ where: { id: "g1" } });
    });
  });

  describe("updateGroup", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { updateGroup } = await import("@/app/actions/groups");
      await expect(updateGroup(null, new FormData())).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when name empty", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updateGroup } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      const result = await updateGroup(null, formData);
      expect(result).toEqual({ error: "Group name is required" });
    });

    it("returns error when name too long", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updateGroup } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      formData.set("name", "x".repeat(101));
      const result = await updateGroup(null, formData);
      expect(result).toEqual({ error: "Group name must be 100 characters or fewer" });
    });

    it("returns error when not a member", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue(null);
      const { updateGroup } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      formData.set("name", "New Name");
      const result = await updateGroup(null, formData);
      expect(result).toEqual({ error: "Group not found" });
    });

    it("returns error when not owner or admin", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "MEMBER",
        group: { ownerId: "user-2" },
      });
      const { updateGroup } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      formData.set("name", "New Name");
      const result = await updateGroup(null, formData);
      expect(result).toEqual({ error: "Only the group owner or admins can edit it" });
    });

    it("updates group when owner", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "MEMBER",
        group: { ownerId: "user-1" },
      });
      const { updateGroup } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      formData.set("name", "Updated Name");
      const result = await updateGroup(null, formData);
      expect(result).toEqual({ success: true });
    });

    it("updates group when admin", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "ADMIN",
        group: { ownerId: "user-2" },
      });
      const { updateGroup } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      formData.set("name", "Updated Name");
      const result = await updateGroup(null, formData);
      expect(result).toEqual({ success: true });
    });
  });

  describe("addMember", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { addMember } = await import("@/app/actions/groups");
      await expect(addMember("g1", "u1")).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when not a member", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue(null);
      const { addMember } = await import("@/app/actions/groups");
      const result = await addMember("g1", "u2");
      expect(result).toEqual({ error: "Group not found" });
    });

    it("returns error when not owner or admin", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValueOnce({
        role: "MEMBER",
        group: { ownerId: "user-2" },
      });
      const { addMember } = await import("@/app/actions/groups");
      const result = await addMember("g1", "u2");
      expect(result).toEqual({ error: "Only the group owner or admins can add members" });
    });

    it("returns error when user not found", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValueOnce({
        role: "ADMIN",
        group: { ownerId: "user-1" },
      });
      mockDb.user.findUnique.mockResolvedValue(null);
      const { addMember } = await import("@/app/actions/groups");
      const result = await addMember("g1", "u2");
      expect(result).toEqual({ error: "User not found" });
    });

    it("returns error when user already a member", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN", group: { ownerId: "user-1" } })
        .mockResolvedValueOnce({ id: "existing" });
      mockDb.user.findUnique.mockResolvedValue({ id: "u2" });
      const { addMember } = await import("@/app/actions/groups");
      const result = await addMember("g1", "u2");
      expect(result).toEqual({ error: "User is already a member" });
    });

    it("adds member on success", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN", group: { ownerId: "user-1" } })
        .mockResolvedValueOnce(null);
      mockDb.user.findUnique.mockResolvedValue({ id: "u2" });
      const { addMember } = await import("@/app/actions/groups");
      const result = await addMember("g1", "u2");
      expect(result).toEqual({ success: true });
      expect(mockDb.groupMember.create).toHaveBeenCalled();
    });
  });

  describe("removeMember", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { removeMember } = await import("@/app/actions/groups");
      await expect(removeMember("g1", "u1")).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when not a member", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue(null);
      const { removeMember } = await import("@/app/actions/groups");
      const result = await removeMember("g1", "u2");
      expect(result).toEqual({ error: "Group not found" });
    });

    it("returns error when not owner/admin and not self", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValueOnce({
        role: "MEMBER",
        group: { ownerId: "user-2" },
      });
      const { removeMember } = await import("@/app/actions/groups");
      const result = await removeMember("g1", "user-3");
      expect(result).toEqual({ error: "Only the group owner or admins can remove other members" });
    });

    it("returns error when owner tries to leave", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValueOnce({
        role: "ADMIN",
        group: { ownerId: "user-1" },
      });
      const { removeMember } = await import("@/app/actions/groups");
      const result = await removeMember("g1", "user-1");
      expect(result).toEqual({ error: "The group owner cannot leave. Delete the group instead." });
    });

    it("returns error when admin tries to remove another admin (not owner)", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN", group: { ownerId: "user-3" } })
        .mockResolvedValueOnce({ role: "ADMIN" });
      const { removeMember } = await import("@/app/actions/groups");
      const result = await removeMember("g1", "user-2");
      expect(result).toEqual({ error: "Only the group owner can remove admins" });
    });

    it("allows member to leave (self removal)", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValueOnce({
        role: "MEMBER",
        group: { ownerId: "user-2" },
      });
      const { removeMember } = await import("@/app/actions/groups");
      const result = await removeMember("g1", "user-1");
      expect(result).toEqual({ success: true });
      expect(mockDb.groupMember.delete).toHaveBeenCalled();
    });

    it("allows owner to remove a member", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValueOnce({
        role: "ADMIN",
        group: { ownerId: "user-1" },
      });
      const { removeMember } = await import("@/app/actions/groups");
      const result = await removeMember("g1", "user-2");
      expect(result).toEqual({ success: true });
    });

    it("allows admin to remove a non-admin member", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique
        .mockResolvedValueOnce({ role: "ADMIN", group: { ownerId: "user-3" } })
        .mockResolvedValueOnce({ role: "MEMBER" });
      const { removeMember } = await import("@/app/actions/groups");
      const result = await removeMember("g1", "user-2");
      expect(result).toEqual({ success: true });
    });
  });

  describe("searchUsers", () => {
    it("returns empty array when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { searchUsers } = await import("@/app/actions/groups");
      const result = await searchUsers("alice");
      expect(result).toEqual([]);
    });

    it("returns empty array when query too short", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { searchUsers } = await import("@/app/actions/groups");
      const result = await searchUsers("a");
      expect(result).toEqual([]);
    });

    it("searches users without excludeGroupId", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.user.findMany.mockResolvedValue([{ id: "u1", name: "Alice" }]);
      const { searchUsers } = await import("@/app/actions/groups");
      const result = await searchUsers("alice");
      expect(result).toEqual([{ id: "u1", name: "Alice" }]);
    });

    it("searches users with excludeGroupId", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.user.findMany.mockResolvedValue([]);
      const { searchUsers } = await import("@/app/actions/groups");
      const result = await searchUsers("alice", "g1");
      expect(result).toEqual([]);
      expect(mockDb.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            NOT: expect.anything(),
          }),
        }),
      );
    });
  });

  describe("updateGroupAvatar", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { updateGroupAvatar } = await import("@/app/actions/groups");
      await expect(updateGroupAvatar(null, new FormData())).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/sign-in");
    });

    it("returns error when no groupId", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      const { updateGroupAvatar } = await import("@/app/actions/groups");
      const result = await updateGroupAvatar(null, new FormData());
      expect(result).toEqual({ error: "Group ID is required" });
    });

    it("returns error when not a member", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue(null);
      const { updateGroupAvatar } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      const result = await updateGroupAvatar(null, formData);
      expect(result).toEqual({ error: "Group not found" });
    });

    it("returns error when not owner or admin", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "MEMBER",
        group: { ownerId: "user-2" },
      });
      const { updateGroupAvatar } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      const result = await updateGroupAvatar(null, formData);
      expect(result).toEqual({
        error: "Only the group owner or admins can change the avatar",
      });
    });

    it("returns error when no file", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "ADMIN",
        group: { ownerId: "user-1" },
      });
      const { updateGroupAvatar } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      const result = await updateGroupAvatar(null, formData);
      expect(result).toEqual({ error: "No file provided" });
    });

    it("returns error for invalid file type", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "ADMIN",
        group: { ownerId: "user-1" },
      });
      const { updateGroupAvatar } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      formData.set("avatar", new File(["data"], "test.gif", { type: "image/gif" }));
      const result = await updateGroupAvatar(null, formData);
      expect(result).toEqual({ error: "Only JPEG, PNG, and WebP images are allowed" });
    });

    it("returns error for file too large", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "ADMIN",
        group: { ownerId: "user-1" },
      });
      const { updateGroupAvatar } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      formData.set(
        "avatar",
        new File([new ArrayBuffer(3 * 1024 * 1024)], "big.png", { type: "image/png" }),
      );
      const result = await updateGroupAvatar(null, formData);
      expect(result).toEqual({ error: "File must be smaller than 2MB" });
    });

    it("uploads avatar on success", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "ADMIN",
        group: { ownerId: "user-1" },
      });
      const { updateGroupAvatar } = await import("@/app/actions/groups");
      const formData = new FormData();
      formData.set("groupId", "g1");
      formData.set("avatar", new File(["pixel"], "avatar.png", { type: "image/png" }));
      const result = await updateGroupAvatar(null, formData);
      expect(result).toEqual({ success: true });
      expect(mockDb.group.update).toHaveBeenCalled();
    });
  });

  describe("updateMemberRole", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { updateMemberRole } = await import("@/app/actions/groups");
      await expect(
        updateMemberRole(
          "g1",
          "u2",
          MockGroupRole.ADMIN as unknown as import("@friends/database").GroupRole,
        ),
      ).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when group not found", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.group.findUnique.mockResolvedValue(null);
      const { updateMemberRole } = await import("@/app/actions/groups");
      const result = await updateMemberRole(
        "g1",
        "u2",
        MockGroupRole.ADMIN as unknown as import("@friends/database").GroupRole,
      );
      expect(result).toEqual({ error: "Group not found" });
    });

    it("returns error when not owner", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.group.findUnique.mockResolvedValue({ ownerId: "user-2" });
      const { updateMemberRole } = await import("@/app/actions/groups");
      const result = await updateMemberRole(
        "g1",
        "u2",
        MockGroupRole.ADMIN as unknown as import("@friends/database").GroupRole,
      );
      expect(result).toEqual({ error: "Only the group owner can change member roles" });
    });

    it("returns error when trying to change own role", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.group.findUnique.mockResolvedValue({ ownerId: "user-1" });
      const { updateMemberRole } = await import("@/app/actions/groups");
      const result = await updateMemberRole(
        "g1",
        "user-1",
        MockGroupRole.MEMBER as unknown as import("@friends/database").GroupRole,
      );
      expect(result).toEqual({ error: "Cannot change the owner's role" });
    });

    it("returns error when member not found", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.group.findUnique.mockResolvedValue({ ownerId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue(null);
      const { updateMemberRole } = await import("@/app/actions/groups");
      const result = await updateMemberRole(
        "g1",
        "u2",
        MockGroupRole.ADMIN as unknown as import("@friends/database").GroupRole,
      );
      expect(result).toEqual({ error: "Member not found" });
    });

    it("updates role on success", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.group.findUnique.mockResolvedValue({ ownerId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({ id: "m1" });
      const { updateMemberRole } = await import("@/app/actions/groups");
      const result = await updateMemberRole(
        "g1",
        "u2",
        MockGroupRole.ADMIN as unknown as import("@friends/database").GroupRole,
      );
      expect(result).toEqual({ success: true });
      expect(mockDb.groupMember.update).toHaveBeenCalled();
    });
  });

  describe("createInvitation", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { createInvitation } = await import("@/app/actions/groups");
      await expect(createInvitation("g1")).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when not a member", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue(null);
      const { createInvitation } = await import("@/app/actions/groups");
      const result = await createInvitation("g1");
      expect(result).toEqual({ error: "Group not found" });
    });

    it("returns error when not owner or admin", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "MEMBER",
        group: { ownerId: "user-2" },
      });
      const { createInvitation } = await import("@/app/actions/groups");
      const result = await createInvitation("g1");
      expect(result).toEqual({ error: "Only the group owner or admins can create invitations" });
    });

    it("creates invitation on success", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.groupMember.findUnique.mockResolvedValue({
        role: "ADMIN",
        group: { ownerId: "user-1" },
      });
      mockDb.invitation.create.mockResolvedValue({ token: "invite-token" });
      const { createInvitation } = await import("@/app/actions/groups");
      const result = await createInvitation("g1");
      expect(result).toEqual({ token: "invite-token" });
    });
  });

  describe("getInvitationInfo", () => {
    it("returns null when invitation not found", async () => {
      mockDb.invitation.findUnique.mockResolvedValue(null);
      const { getInvitationInfo } = await import("@/app/actions/groups");
      const result = await getInvitationInfo("bad-token");
      expect(result).toBeNull();
    });

    it("returns null when invitation expired", async () => {
      mockDb.invitation.findUnique.mockResolvedValue({
        expiresAt: new Date(Date.now() - 1000),
        group: { id: "g1", name: "G", avatar: null, _count: { members: 1 } },
        inviter: { name: "Bob" },
        token: "t",
      });
      const { getInvitationInfo } = await import("@/app/actions/groups");
      const result = await getInvitationInfo("expired-token");
      expect(result).toBeNull();
    });

    it("returns invitation info when valid", async () => {
      mockDb.invitation.findUnique.mockResolvedValue({
        expiresAt: new Date(Date.now() + 100000),
        group: { id: "g1", name: "Group", avatar: null, _count: { members: 3 } },
        inviter: { name: "Alice" },
        token: "valid-token",
      });
      const { getInvitationInfo } = await import("@/app/actions/groups");
      const result = await getInvitationInfo("valid-token");
      expect(result).toEqual({
        groupId: "g1",
        groupName: "Group",
        groupAvatar: null,
        memberCount: 3,
        inviterName: "Alice",
        token: "valid-token",
      });
    });
  });

  describe("acceptInvitation", () => {
    it("redirects when no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const { acceptInvitation } = await import("@/app/actions/groups");
      await expect(acceptInvitation("token")).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns error when invitation not found", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.invitation.findUnique.mockResolvedValue(null);
      const { acceptInvitation } = await import("@/app/actions/groups");
      const result = await acceptInvitation("bad-token");
      expect(result).toEqual({ error: "Invitation not found" });
    });

    it("returns error when invitation expired", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.invitation.findUnique.mockResolvedValue({
        expiresAt: new Date(Date.now() - 1000),
        group: { id: "g1", name: "G", ownerId: "o1" },
        inviter: { name: "Bob" },
        groupId: "g1",
      });
      const { acceptInvitation } = await import("@/app/actions/groups");
      const result = await acceptInvitation("expired-token");
      expect(result).toEqual({ error: "Invitation has expired" });
    });

    it("returns error when already a member", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.invitation.findUnique.mockResolvedValue({
        expiresAt: new Date(Date.now() + 100000),
        group: { id: "g1", name: "G", ownerId: "o1" },
        inviter: { name: "Bob" },
        groupId: "g1",
      });
      mockDb.groupMember.findUnique.mockResolvedValue({ id: "existing" });
      const { acceptInvitation } = await import("@/app/actions/groups");
      const result = await acceptInvitation("token");
      expect(result).toEqual({ error: "You are already a member of this group" });
    });

    it("accepts invitation on success", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.invitation.findUnique.mockResolvedValue({
        expiresAt: new Date(Date.now() + 100000),
        group: { id: "g1", name: "Group", ownerId: "owner-1" },
        inviter: { name: "Bob" },
        groupId: "g1",
      });
      mockDb.groupMember.findUnique.mockResolvedValue(null);
      mockDb.user.findUnique.mockResolvedValue({ name: "Alice" });
      const { acceptInvitation } = await import("@/app/actions/groups");
      const result = await acceptInvitation("valid-token");
      expect(result).toEqual({ success: true });
      expect(mockDb.$transaction).toHaveBeenCalled();
    });

    it("handles user without name", async () => {
      mockGetSession.mockResolvedValue({ userId: "user-1" });
      mockDb.invitation.findUnique.mockResolvedValue({
        expiresAt: new Date(Date.now() + 100000),
        group: { id: "g1", name: "Group", ownerId: "owner-1" },
        inviter: { name: "Bob" },
        groupId: "g1",
      });
      mockDb.groupMember.findUnique.mockResolvedValue(null);
      mockDb.user.findUnique.mockResolvedValue(null);
      const { acceptInvitation } = await import("@/app/actions/groups");
      const result = await acceptInvitation("valid-token");
      expect(result).toEqual({ success: true });
    });
  });
});
