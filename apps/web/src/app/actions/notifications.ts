"use server";

import { getSession } from "@/lib/session";
import { db } from "@friends/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getNotifications() {
  const session = await getSession();
  if (!session) return [];

  return db.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getUnreadNotificationCount() {
  const session = await getSession();
  if (!session) return 0;

  return db.notification.count({
    where: { userId: session.userId, read: false },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  await db.notification.updateMany({
    where: { id: notificationId, userId: session.userId },
    data: { read: true },
  });

  revalidatePath("/notifications");
}

export async function markAllNotificationsAsRead() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  await db.notification.updateMany({
    where: { userId: session.userId, read: false },
    data: { read: true },
  });

  revalidatePath("/notifications");
}
