"use client";

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
import { toast } from "@friends/ui/toaster";
import { Typography } from "@friends/ui/typography";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signUp, type AuthResult } from "../actions/auth";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export default function SignUpPage() {
  const t = useTranslations("signUp");
  const [state, formAction, isPending] = useActionState<AuthResult | null, FormData>(signUp, null);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (state?.error) {
      toast(t("error"), { description: state.error, type: "error" });
    }
  }, [state, t]);

  function validate(formData: FormData): FieldErrors {
    const errs: FieldErrors = {};
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name) errs.name = t("nameRequired");
    if (!email) errs.email = t("emailRequired");
    else if (!EMAIL_REGEX.test(email)) errs.email = t("emailInvalid");
    if (!password) errs.password = t("passwordRequired");
    else if (!PASSWORD_REGEX.test(password)) errs.password = t("passwordHint");
    if (!confirmPassword) errs.confirmPassword = t("confirmPasswordRequired");
    else if (password !== confirmPassword) errs.confirmPassword = t("passwordsMismatch");

    return errs;
  }

  function handleSubmit(formData: FormData) {
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    formAction(formData);
  }

  const inputClass = (field: keyof FieldErrors) =>
    errors[field] ? "border-red-500 focus:border-red-500" : "";

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-3 xs:px-4 md:min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {state?.error && (
              <Typography variant="body-sm" className="text-red-500">
                {state.error}
              </Typography>
            )}
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                {t("name")}
              </label>
              <Input
                id="name"
                name="name"
                placeholder={t("namePlaceholder")}
                className={inputClass("name")}
              />
              <FieldError message={errors.name} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                {t("email")}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                className={inputClass("email")}
              />
              <FieldError message={errors.email} />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
                {t("password")}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                className={inputClass("password")}
              />
              <FieldError message={errors.password} />
              {!errors.password && (
                <p className="mt-1 text-xs text-foreground-secondary">{t("passwordHint")}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                {t("confirmPassword")}
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder={t("confirmPasswordPlaceholder")}
                className={inputClass("confirmPassword")}
              />
              <FieldError message={errors.confirmPassword} />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("submitting") : t("submit")}
            </Button>
            <Typography variant="body-sm">
              {t("hasAccount")}{" "}
              <Link href="/sign-in" className="text-brand-600 hover:underline">
                {t("signInLink")}
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
