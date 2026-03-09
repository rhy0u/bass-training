"use client";

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
import { Typography } from "@friends/ui/typography";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { deleteAccount, updateAvatar, updateProfile, type ProfileResult } from "../actions/profile";

interface ProfilePageClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
}

export function ProfilePageClient({ user }: ProfilePageClientProps) {
  const t = useTranslations("profile");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Key to reset form inputs when server data changes after a successful update
  const formKey = `${user.name}-${user.email}`;

  const [profileState, profileAction, profilePending] = useActionState<
    ProfileResult | null,
    FormData
  >(updateProfile, null);

  useEffect(() => {
    if (profileState?.success) {
      toast(t("saved"), { type: "success" });
    } else if (profileState?.error) {
      toast(t("error"), { description: profileState.error, type: "error" });
    }
  }, [profileState, t]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);

    const formData = new FormData();
    formData.append("avatar", file);
    await updateAvatar(null, formData);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t("deleteConfirm"))) {
      await deleteAccount();
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-3 py-6 xs:px-4 md:py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar section */}
          <div className="flex items-center gap-3 md:gap-4">
            <Avatar src={avatarPreview} fallback={user.name ?? user.email} size="xl" />
            <div>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                {t("changeAvatar")}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Typography variant="caption" className="mt-1">
                {t("avatarHint")}
              </Typography>
            </div>
          </div>

          <Separator />

          {/* Profile form */}
          <form id="profile-form" action={profileAction} key={formKey} className="space-y-4">
            {profileState?.error && (
              <Typography variant="body-sm" className="text-red-500">
                {profileState.error}
              </Typography>
            )}
            {profileState?.success && (
              <Typography variant="body-sm" className="text-green-600">
                {t("saved")}
              </Typography>
            )}
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                {t("name")}
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name ?? ""}
                placeholder={t("namePlaceholder")}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                {t("email")}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                placeholder={t("emailPlaceholder")}
                required
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-wrap justify-between gap-2">
          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleDeleteAccount}
          >
            {t("deleteAccount")}
          </Button>
          <Button type="submit" form="profile-form" disabled={profilePending}>
            {profilePending ? t("saving") : t("save")}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
