"use client";

import { acceptInvitation } from "@/app/actions/groups";
import { Avatar } from "@friends/ui/avatar";
import { Button } from "@friends/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@friends/ui/card";
import { toast } from "@friends/ui/toaster";
import { Typography } from "@friends/ui/typography";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface InvitationInfo {
  groupId: string;
  groupName: string;
  groupAvatar: string | null;
  memberCount: number;
  inviterName: string | null;
  token: string;
}

export function JoinPageClient({
  invitation,
  isLoggedIn,
}: {
  invitation: InvitationInfo;
  isLoggedIn: boolean;
}) {
  const t = useTranslations("joinGroup");
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleJoin = async () => {
    setPending(true);
    const result = await acceptInvitation(invitation.token);
    setPending(false);
    if (result.error) {
      toast(t("error"), { description: result.error, type: "error" });
    } else {
      toast(t("joined"), { type: "success" });
      router.push(`/groups/${invitation.groupId}`);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-3 xs:px-4 md:min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-3">
            <Avatar src={invitation.groupAvatar} fallback={invitation.groupName} size="xl" />
          </div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            {t("description", {
              inviter: invitation.inviterName ?? t("someone"),
              group: invitation.groupName,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Typography variant="body-sm" className="text-foreground-secondary">
            {t("members", { count: invitation.memberCount })}
          </Typography>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          {isLoggedIn ? (
            <Button className="w-full" onClick={handleJoin} disabled={pending}>
              {pending ? t("joining") : t("join")}
            </Button>
          ) : (
            <>
              <Typography variant="body-sm" className="text-foreground-secondary">
                {t("signInRequired")}
              </Typography>
              <Link href="/sign-in" className="w-full">
                <Button className="w-full">{t("signIn")}</Button>
              </Link>
            </>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
