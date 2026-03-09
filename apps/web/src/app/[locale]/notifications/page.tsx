import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getNotifications } from "../../actions/notifications";
import { NotificationsPageClient } from "./notifications-client";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const notifications = await getNotifications();

  const serialized = notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  }));

  return <NotificationsPageClient notifications={serialized} />;
}
