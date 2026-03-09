"use server";

import { getSession } from "@/lib/session";
import { db } from "@friends/database";
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
        create: { userId: session.userId },
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

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { ownerId: true },
  });

  if (!group) {
    return { error: "Group not found" };
  }
  if (group.ownerId !== session.userId) {
    return { error: "Only the group owner can edit it" };
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

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { ownerId: true },
  });

  if (!group) {
    return { error: "Group not found" };
  }
  if (group.ownerId !== session.userId) {
    return { error: "Only the group owner can add members" };
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

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { ownerId: true },
  });

  if (!group) {
    return { error: "Group not found" };
  }

  // Owner can remove anyone; members can only remove themselves
  const isSelf = userId === session.userId;
  const isOwner = group.ownerId === session.userId;

  if (!isOwner && !isSelf) {
    return { error: "Only the group owner can remove other members" };
  }

  // Owner cannot leave their own group
  if (isSelf && isOwner) {
    return { error: "The group owner cannot leave. Delete the group instead." };
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

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { ownerId: true },
  });

  if (!group) return { error: "Group not found" };
  if (group.ownerId !== session.userId) {
    return { error: "Only the group owner can change the avatar" };
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
