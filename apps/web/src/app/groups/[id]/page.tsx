import { getCurrentUser } from "@/lib/auth";
import { db } from "@friends/database";
import { notFound, redirect } from "next/navigation";
import { GroupDetailClient } from "./group-detail-client";

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;

  const group = await db.group.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!group) notFound();

  // Check user is a member
  const isMember = group.members.some((m) => m.user.id === user.id);
  if (!isMember) notFound();

  const serialized = {
    id: group.id,
    name: group.name,
    ownerId: group.ownerId,
    ownerName: group.owner.name ?? group.owner.email,
    isOwner: group.ownerId === user.id,
    members: group.members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      avatar: m.user.avatar,
      isOwner: m.user.id === group.ownerId,
    })),
    currentUserId: user.id,
  };

  return <GroupDetailClient group={serialized} />;
}
