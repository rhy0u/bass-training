import { getInvitationInfo } from "@/app/actions/groups";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { JoinPageClient } from "./join-client";

export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = await getInvitationInfo(token);

  if (!invitation) notFound();

  const user = await getCurrentUser();

  return <JoinPageClient invitation={invitation} isLoggedIn={!!user} />;
}
