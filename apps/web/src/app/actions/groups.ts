"use server";

import { getSession } from "@/lib/session";
import { db, GroupRole } from "@friends/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type GroupResult = {
  error?: string;
  success?: boolean;
};

export async function createGroup(
  _prev: GroupResult | null,
  formData: FormData,
): Promise<GroupResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    return { error: "Group name is required" };
  }
  if (name.length > 100) {
    return { error: "Group name must be 100 characters or fewer" };
  }

  await db.group.create({
    data: {
      name,
      ownerId: session.userId,
      members: {
        create: { userId: session.userId, role: GroupRole.ADMIN },
      },
    },
  });

  revalidatePath("/groups");
  return { success: true };
}

export async function deleteGroup(groupId: string): Promise<GroupResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { ownerId: true },
  });

  if (!group) {
    return { error: "Group not found" };
  }
  if (group.ownerId !== session.userId) {
    return { error: "Only the group owner can delete it" };
  }

  await db.group.delete({ where: { id: groupId } });

  revalidatePath("/groups");
  redirect("/groups");
}

export async function updateGroup(
  _prev: GroupResult | null,
  formData: FormData,
): Promise<GroupResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const groupId = formData.get("groupId") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!name) {
    return { error: "Group name is required" };
  }
  if (name.length > 100) {
    return { error: "Group name must be 100 characters or fewer" };
  }

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.userId } },
    include: { group: { select: { ownerId: true } } },
  });

  if (!membership) {
    return { error: "Group not found" };
  }
  const isOwner = membership.group.ownerId === session.userId;
  if (!isOwner && membership.role !== GroupRole.ADMIN) {
    return { error: "Only the group owner or admins can edit it" };
  }

  await db.group.update({
    where: { id: groupId },
    data: { name },
  });

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/groups");
  return { success: true };
}

export async function addMember(groupId: string, userId: string): Promise<GroupResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.userId } },
    include: { group: { select: { ownerId: true } } },
  });

  if (!membership) {
    return { error: "Group not found" };
  }
  const isOwner = membership.group.ownerId === session.userId;
  if (!isOwner && membership.role !== GroupRole.ADMIN) {
    return { error: "Only the group owner or admins can add members" };
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: "User not found" };
  }

  const existing = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (existing) {
    return { error: "User is already a member" };
  }

  await db.groupMember.create({
    data: { groupId, userId },
  });

  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}

export async function removeMember(groupId: string, userId: string): Promise<GroupResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.userId } },
    include: { group: { select: { ownerId: true } } },
  });

  if (!membership) {
    return { error: "Group not found" };
  }

  const isOwner = membership.group.ownerId === session.userId;
  const isAdmin = membership.role === GroupRole.ADMIN;
  const isSelf = userId === session.userId;

  if (!isOwner && !isAdmin && !isSelf) {
    return { error: "Only the group owner or admins can remove other members" };
  }

  // Owner cannot leave their own group
  if (isSelf && isOwner) {
    return { error: "The group owner cannot leave. Delete the group instead." };
  }

  // Admins cannot remove other admins (only owner can)
  if (!isOwner && !isSelf) {
    const targetMember = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (targetMember?.role === GroupRole.ADMIN) {
      return { error: "Only the group owner can remove admins" };
    }
  }

  await db.groupMember.delete({
    where: { groupId_userId: { groupId, userId } },
  });

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/groups");
  return { success: true };
}

export async function searchUsers(query: string, excludeGroupId?: string) {
  const session = await getSession();
  if (!session) return [];

  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const where: Parameters<typeof db.user.findMany>[0] = {
    where: {
      OR: [
        { name: { contains: trimmed, mode: "insensitive" as const } },
        { email: { contains: trimmed, mode: "insensitive" as const } },
      ],
      ...(excludeGroupId
        ? {
            NOT: {
              memberships: {
                some: { groupId: excludeGroupId },
              },
            },
          }
        : {}),
    },
    select: { id: true, name: true, email: true, avatar: true },
    take: 10,
  };

  return db.user.findMany(where);
}

export async function updateGroupAvatar(
  _prev: GroupResult | null,
  formData: FormData,
): Promise<GroupResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const groupId = formData.get("groupId") as string;
  if (!groupId) return { error: "Group ID is required" };

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.userId } },
    include: { group: { select: { ownerId: true } } },
  });

  if (!membership) return { error: "Group not found" };
  const isOwner = membership.group.ownerId === session.userId;
  if (!isOwner && membership.role !== GroupRole.ADMIN) {
    return { error: "Only the group owner or admins can change the avatar" };
  }

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return { error: "No file provided" };

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Only JPEG, PNG, and WebP images are allowed" };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { error: "File must be smaller than 2MB" };
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  await db.group.update({
    where: { id: groupId },
    data: { avatar: dataUri },
  });

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/groups");
  return { success: true };
}

export async function updateMemberRole(
  groupId: string,
  userId: string,
  role: GroupRole,
): Promise<GroupResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { ownerId: true },
  });

  if (!group) return { error: "Group not found" };
  if (group.ownerId !== session.userId) {
    return { error: "Only the group owner can change member roles" };
  }

  // Cannot change the owners own role
  if (userId === session.userId) {
    return { error: "Cannot change the owner's role" };
  }

  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!member) return { error: "Member not found" };

  await db.groupMember.update({
    where: { id: member.id },
    data: { role },
  });

  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}

export async function createInvitation(
  groupId: string,
): Promise<{ error?: string; token?: string }> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.userId } },
    include: { group: { select: { ownerId: true } } },
  });

  if (!membership) return { error: "Group not found" };
  const isOwner = membership.group.ownerId === session.userId;
  if (!isOwner && membership.role !== GroupRole.ADMIN) {
    return { error: "Only the group owner or admins can create invitations" };
  }

  const invitation = await db.invitation.create({
    data: {
      groupId,
      inviterId: session.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { token: invitation.token };
}

export async function getInvitationInfo(token: string) {
  const invitation = await db.invitation.findUnique({
    where: { token },
    include: {
      group: {
        select: { id: true, name: true, avatar: true, _count: { select: { members: true } } },
      },
      inviter: { select: { name: true } },
    },
  });

  if (!invitation) return null;
  if (invitation.expiresAt < new Date()) return null;

  return {
    groupId: invitation.group.id,
    groupName: invitation.group.name,
    groupAvatar: invitation.group.avatar,
    memberCount: invitation.group._count.members,
    inviterName: invitation.inviter.name,
    token: invitation.token,
  };
}

export async function acceptInvitation(token: string): Promise<GroupResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const invitation = await db.invitation.findUnique({
    where: { token },
    include: {
      group: { select: { id: true, name: true, ownerId: true } },
      inviter: { select: { name: true } },
    },
  });

  if (!invitation) return { error: "Invitation not found" };
  if (invitation.expiresAt < new Date()) return { error: "Invitation has expired" };

  const existing = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId: invitation.groupId, userId: session.userId } },
  });
  if (existing) return { error: "You are already a member of this group" };

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { name: true },
  });

  await db.$transaction([
    db.groupMember.create({
      data: { groupId: invitation.groupId, userId: session.userId },
    }),
    db.notification.create({
      data: {
        userId: invitation.group.ownerId,
        type: "member_joined",
        title: "New member joined",
        message: `${user?.name ?? "Someone"} joined ${invitation.group.name} via invitation`,
        link: `/groups/${invitation.groupId}`,
      },
    }),
  ]);

  revalidatePath(`/groups/${invitation.groupId}`);
  revalidatePath("/groups");
  return { success: true };
}
