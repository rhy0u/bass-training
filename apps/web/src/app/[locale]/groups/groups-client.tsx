"use client";

import { Link } from "@/i18n/navigation";
import { Avatar } from "@friends/ui/avatar";
import { Button } from "@friends/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@friends/ui/card";
import { ConfirmDialog } from "@friends/ui/confirm-dialog";
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@friends/ui/dialog";
import { Input } from "@friends/ui/input";
import { toast } from "@friends/ui/toaster";
import { Typography } from "@friends/ui/typography";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { createGroup, deleteGroup, type GroupResult } from "../../actions/groups";

interface GroupSummary {
  id: string;
  name: string;
  avatar: string | null;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  isOwner: boolean;
}

export function GroupsPageClient({ groups }: Readonly<{ groups: GroupSummary[] }>) {
  const t = useTranslations("groups");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [createState, createAction, createPending] = useActionState<GroupResult | null, FormData>(
    createGroup,
    null,
  );

  useEffect(() => {
    if (createState?.success) {
      toast(t("created"), { type: "success" });
      queueMicrotask(() => setDialogOpen(false));
    } else if (createState?.error) {
      toast(t("error"), { description: createState.error, type: "error" });
    }
  }, [createState, t]);

  const handleDelete = async (groupId: string) => {
    setDeleteTarget(groupId);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteTarget(null);
    const result = await deleteGroup(deleteTarget);
    if (result?.error) {
      toast(t("error"), { description: result.error, type: "error" });
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-3 py-6 xs:px-4 md:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Typography variant="h1">{t("title")}</Typography>
          <Typography variant="body-sm">{t("description")}</Typography>
        </div>

        <DialogRoot open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>{t("create")}</DialogTrigger>
          <DialogPortal>
            <DialogBackdrop />
            <DialogPopup>
              <DialogTitle>{t("createTitle")}</DialogTitle>
              <DialogDescription>{t("createDescription")}</DialogDescription>
              <form action={createAction} className="mt-4 space-y-4">
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
                    placeholder={t("groupNamePlaceholder")}
                    required
                    maxLength={100}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose type="button">{t("cancel")}</DialogClose>
                  <Button type="submit" disabled={createPending}>
                    {createPending ? t("creating") : t("create")}
                  </Button>
                </div>
              </form>
            </DialogPopup>
          </DialogPortal>
        </DialogRoot>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-foreground-secondary">
            {t("empty")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
                <div className="flex min-w-0 items-center gap-2 xs:gap-3">
                  <Link href={`/groups/${group.id}`}>
                    <Avatar
                      src={group.avatar}
                      fallback={group.name}
                      size="sm"
                      className="md:h-12 md:w-12 md:text-base"
                    />
                  </Link>
                  <div>
                    <CardTitle className="text-lg">
                      <Link href={`/groups/${group.id}`} className="hover:underline">
                        {group.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {t("owner")}: {group.ownerName} · {t("members", { count: group.memberCount })}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1 xs:gap-2">
                  <Link
                    href={`/groups/${group.id}`}
                    className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary"
                  >
                    {t("view")}
                  </Link>
                  {group.isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(group.id)}
                    >
                      {t("delete")}
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Delete group confirmation dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={t("delete")}
        description={t("deleteConfirm")}
        cancelLabel={t("cancel")}
        confirmLabel={t("confirm")}
        onConfirm={confirmDelete}
        variant="danger"
      />
    </main>
  );
}
