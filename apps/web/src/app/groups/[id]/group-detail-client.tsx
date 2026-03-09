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
import { ConfirmDialog } from "@friends/ui/confirm-dialog";
import { Input } from "@friends/ui/input";
import { Separator } from "@friends/ui/separator";
import { toast } from "@friends/ui/toaster";
import { Typography } from "@friends/ui/typography";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import {
  addMember,
  deleteGroup,
  removeMember,
  updateGroup,
  updateGroupAvatar,
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
  avatar: string | null;
  ownerId: string;
  ownerName: string;
  isOwner: boolean;
  members: Member[];
  currentUserId: string;
}

export function GroupDetailClient({ group }: { group: GroupDetail }) {
  const t = useTranslations("groupDetail");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [removeMemberTarget, setRemoveMemberTarget] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(group.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const confirmRemoveMember = useCallback(async () => {
    if (!removeMemberTarget) return;
    const isSelf = removeMemberTarget === group.currentUserId;
    const result = await removeMember(group.id, removeMemberTarget);
    setRemoveMemberTarget(null);
    if (result.error) {
      toast(t("error"), { description: result.error, type: "error" });
    } else {
      toast(isSelf ? t("left") : t("memberRemoved"), { type: "success" });
    }
  }, [removeMemberTarget, group.id, group.currentUserId, t]);

  const confirmDelete = useCallback(async () => {
    setDeleteDialogOpen(false);
    const result = await deleteGroup(group.id);
    if (result?.error) {
      toast(t("error"), { description: result.error, type: "error" });
    }
  }, [group.id, t]);

  return (
    <main className="mx-auto max-w-3xl px-3 py-6 xs:px-4 md:py-8">
      <div className="mb-4">
        <Link href="/groups" className="text-sm text-foreground-secondary hover:text-foreground">
          ← {t("backToGroups")}
        </Link>
      </div>

      {/* Group info card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3 md:gap-4">
            <Avatar src={avatarPreview} fallback={group.name} size="xl" />
            <div className="flex-1">
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>
                {t("owner")}: {group.ownerName} · {t("members", { count: group.members.length })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {group.isOwner && (
          <>
            <CardContent>
              <form id="update-group-form" action={updateAction} className="space-y-4">
                <input type="hidden" name="groupId" value={group.id} />
                <div>
                  <label
                    htmlFor="group-avatar"
                    className="mb-1 block text-sm font-medium text-foreground"
                  >
                    {t("changeAvatar")}
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {t("changeAvatar")}
                    </Button>
                    <input
                      ref={fileInputRef}
                      id="group-avatar"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setAvatarPreview(URL.createObjectURL(file));
                        const fd = new FormData();
                        fd.append("groupId", group.id);
                        fd.append("avatar", file);
                        await updateGroupAvatar(null, fd);
                      }}
                    />
                  </div>
                </div>
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
            <CardFooter className="flex-wrap justify-between gap-2">
              <Button
                variant="ghost"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => setDeleteDialogOpen(true)}
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
              onClick={() => setRemoveMemberTarget(group.currentUserId)}
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
                className="flex items-center justify-between gap-2 rounded-lg border border-border p-2 xs:p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={member.avatar} fallback={member.name ?? member.email} size="sm" />
                  <div>
                    <Typography variant="body-sm" className="font-medium text-foreground">
                      {member.name ?? member.email}
                      {member.isOwner && (
                        <Typography
                          as="span"
                          variant="caption"
                          className="ml-2 text-foreground-secondary"
                        >
                          ({t("ownerBadge")})
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="caption" className="text-foreground-secondary">
                      {member.email}
                    </Typography>
                  </div>
                </div>
                {group.isOwner && !member.isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setRemoveMemberTarget(member.id)}
                  >
                    {t("remove")}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete group confirmation dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t("deleteGroup")}
        description={t("deleteConfirm")}
        cancelLabel={t("cancel")}
        confirmLabel={t("confirm")}
        onConfirm={confirmDelete}
        variant="danger"
      />

      {/* Remove member / leave group confirmation dialog */}
      <ConfirmDialog
        open={removeMemberTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveMemberTarget(null);
        }}
        title={removeMemberTarget === group.currentUserId ? t("leaveGroup") : t("remove")}
        description={
          removeMemberTarget === group.currentUserId ? t("leaveConfirm") : t("removeMemberConfirm")
        }
        cancelLabel={t("cancel")}
        confirmLabel={t("confirm")}
        onConfirm={confirmRemoveMember}
        variant="danger"
      />
    </main>
  );
}
