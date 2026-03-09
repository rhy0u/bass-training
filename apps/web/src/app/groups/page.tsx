import { getCurrentUser } from "@/lib/auth";
import { db } from "@friends/database";
import { redirect } from "next/navigation";
import { GroupsPageClient } from "./groups-client";

export default async function GroupsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const groups = await db.group.findMany({
    where: {
      members: { some: { userId: user.id } },
    },
    include: {
      owner: { select: { id: true, name: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = groups.map((g) => ({
    id: g.id,
    name: g.name,
    ownerId: g.ownerId,
    ownerName: g.owner.name ?? g.owner.id,
    memberCount: g._count.members,
    isOwner: g.ownerId === user.id,
  }));

  return <GroupsPageClient groups={serialized} />;
}
