import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfilePageClient } from "./profile-client";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <ProfilePageClient user={user} />;
}
