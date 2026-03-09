"use client";

import { UserAutocomplete } from "@/components/user-autocomplete";
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
import { Input } from "@friends/ui/input";
import { Separator } from "@friends/ui/separator";
import { toast } from "@friends/ui/toaster";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import {
  addMember,
  deleteGroup,
  removeMember,
  updateGroup,
  type GroupResult,
} from "../../actions/groups";

interface Member {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  isOwner: boolean;
}

interface GroupDetail {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  isOwner: boolean;
  members: Member[];
  currentUserId: string;
}

export function GroupDetailClient({ group }: { group: GroupDetail }) {
  const t = useTranslations("groupDetail");

  const [updateState, updateAction, updatePending] = useActionState<GroupResult | null, FormData>(
    updateGroup,
    null,
  );

  useEffect(() => {
    if (updateState?.success) {
      toast(t("saved"), { type: "success" });
    } else if (updateState?.error) {
      toast(t("error"), { description: updateState.error, type: "error" });
    }
  }, [updateState, t]);

  const handleAddMember = async (userId: string) => {
    const result = await addMember(group.id, userId);
    if (result.error) {
      toast(t("error"), { description: result.error, type: "error" });
    } else {
      toast(t("memberAdded"), { type: "success" });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    const isSelf = userId === group.currentUserId;
    const message = isSelf ? t("leaveConfirm") : t("removeMemberConfirm");
    if (!window.confirm(message)) return;

    const result = await removeMember(group.id, userId);
    if (result.error) {
      toast(t("error"), { description: result.error, type: "error" });
    } else {
      toast(isSelf ? t("left") : t("memberRemoved"), { type: "success" });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t("deleteConfirm"))) return;
    const result = await deleteGroup(group.id);
    if (result?.error) {
      toast(t("error"), { description: result.error, type: "error" });
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4">
        <Link href="/groups" className="text-sm text-foreground-secondary hover:text-foreground">
          ← {t("backToGroups")}
        </Link>
      </div>

      {/* Group info card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          <CardDescription>
            {t("owner")}: {group.ownerName} · {t("members", { count: group.members.length })}
          </CardDescription>
        </CardHeader>

        {group.isOwner && (
          <>
            <CardContent>
              <form id="update-group-form" action={updateAction} className="space-y-4">
                <input type="hidden" name="groupId" value={group.id} />
                <div>
                  <label
                    htmlFor="group-name"
                    className="mb-1 block text-sm font-medium text-foreground"
                  >
                    {t("groupName")}
                  </label>
                  <Input
                    id="group-name"
                    name="name"
                    defaultValue={group.name}
                    placeholder={t("groupNamePlaceholder")}
                    required
                    maxLength={100}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                variant="ghost"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleDelete}
              >
                {t("deleteGroup")}
              </Button>
              <Button type="submit" form="update-group-form" disabled={updatePending}>
                {updatePending ? t("saving") : t("save")}
              </Button>
            </CardFooter>
          </>
        )}

        {!group.isOwner && (
          <CardFooter>
            <Button
              variant="ghost"
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => handleRemoveMember(group.currentUserId)}
            >
              {t("leaveGroup")}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Members card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("membersTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {group.isOwner && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("addMember")}
                </label>
                <UserAutocomplete
                  excludeGroupId={group.id}
                  onSelect={handleAddMember}
                  placeholder={t("searchUsers")}
                />
              </div>
              <Separator />
            </>
          )}

          <div className="space-y-2">
            {group.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={member.avatar} fallback={member.name ?? member.email} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {member.name ?? member.email}
                      {member.isOwner && (
                        <span className="ml-2 text-xs text-foreground-secondary">
                          ({t("ownerBadge")})
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-foreground-secondary">{member.email}</p>
                  </div>
                </div>
                {group.isOwner && !member.isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    {t("remove")}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
