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
import { FieldError, type FieldRule } from "../../../components/field-error";
import {
  deleteAccount,
  updateAvatar,
  updatePassword,
  updateProfile,
  type ProfileResult,
} from "../../actions/profile";

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

  // Password change state
  const [passwordState, passwordAction, passwordPending] = useActionState<
    ProfileResult | null,
    FormData
  >(updatePassword, null);
  const [pwSubmitted, setPwSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  function newPasswordRules(): FieldRule[] {
    if (!pwSubmitted && !newPassword) return [];
    return [
      { label: t("hintMinLength"), valid: newPassword.length >= 8 },
      { label: t("hintUppercase"), valid: /[A-Z]/.test(newPassword) },
      { label: t("hintLowercase"), valid: /[a-z]/.test(newPassword) },
      { label: t("hintNumber"), valid: /\d/.test(newPassword) },
      { label: t("hintSpecial"), valid: /[^a-zA-Z0-9]/.test(newPassword) },
    ];
  }

  function confirmNewPasswordRules(): FieldRule[] {
    if (!pwSubmitted && !confirmNewPassword) return [];
    const rules: FieldRule[] = [
      { label: t("confirmNewPasswordRequired"), valid: confirmNewPassword.length > 0 },
    ];
    if (confirmNewPassword.length > 0) {
      rules.push({ label: t("passwordsMismatch"), valid: newPassword === confirmNewPassword });
    }
    return rules;
  }

  const hasError = (rules: FieldRule[]) => rules.some((r) => !r.valid);
  const inputClass = (rules: FieldRule[]) =>
    hasError(rules) ? "border-red-500 focus:border-red-500" : "";

  function handlePasswordSubmit(formData: FormData) {
    setPwSubmitted(true);
    const allRules = [...newPasswordRules(), ...confirmNewPasswordRules()];
    if (allRules.some((r) => !r.valid)) return;
    passwordAction(formData);
  }

  useEffect(() => {
    if (profileState?.success) {
      toast(t("saved"), { type: "success" });
    } else if (profileState?.error) {
      toast(t("error"), { description: profileState.error, type: "error" });
    }
  }, [profileState, t]);

  useEffect(() => {
    if (passwordState?.success) {
      toast(t("passwordChanged"), { type: "success" });
      queueMicrotask(() => {
        setNewPassword("");
        setConfirmNewPassword("");
        setPwSubmitted(false);
      });
    } else if (passwordState?.error) {
      toast(t("error"), { description: passwordState.error, type: "error" });
    }
  }, [passwordState, t]);

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

      {/* Password change card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("changePassword")}</CardTitle>
          <CardDescription>{t("changePasswordDescription")}</CardDescription>
        </CardHeader>
        <form id="password-form" action={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            {passwordState?.error && (
              <Typography variant="body-sm" className="text-red-500">
                {passwordState.error}
              </Typography>
            )}
            {passwordState?.success && (
              <Typography variant="body-sm" className="text-green-600">
                {t("passwordChanged")}
              </Typography>
            )}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                {t("currentPassword")}
              </label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                {t("newPassword")}
              </label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                className={inputClass(newPasswordRules())}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <FieldError rules={newPasswordRules()} />
            </div>
            <div>
              <label
                htmlFor="confirmNewPassword"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                {t("confirmNewPassword")}
              </label>
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                placeholder="••••••••"
                className={inputClass(confirmNewPasswordRules())}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <FieldError rules={confirmNewPasswordRules()} />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={passwordPending}>
              {passwordPending ? t("saving") : t("changePasswordSubmit")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
