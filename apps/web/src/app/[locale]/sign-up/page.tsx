"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@boilerplate/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/card";
import { Input } from "@boilerplate/ui/input";
import { toast } from "@boilerplate/ui/toaster";
import { Typography } from "@boilerplate/ui/typography";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { FieldError, type FieldRule } from "../../../components/field-error";
import { signUp, type AuthResult } from "../../actions/auth";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function SignUpPage() {
  const t = useTranslations("signUp");
  const [state, formAction, isPending] = useActionState<AuthResult | null, FormData>(signUp, null);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (state?.error) {
      toast(t("error"), { description: state.error, type: "error" });
    }
  }, [state, t]);

  function nameRules(): FieldRule[] {
    if (!submitted && !name) return [];
    return [{ label: t("nameRequired"), valid: name.trim().length > 0 }];
  }

  function emailRules(): FieldRule[] {
    if (!submitted && !email) return [];
    const rules: FieldRule[] = [{ label: t("emailRequired"), valid: email.trim().length > 0 }];
    if (email.trim().length > 0) {
      rules.push({ label: t("emailInvalid"), valid: EMAIL_REGEX.test(email.trim()) });
    }
    return rules;
  }

  function passwordRules(): FieldRule[] {
    if (!submitted && !password) return [];
    return [
      { label: t("hintMinLength"), valid: password.length >= 8 },
      { label: t("hintUppercase"), valid: /[A-Z]/.test(password) },
      { label: t("hintLowercase"), valid: /[a-z]/.test(password) },
      { label: t("hintNumber"), valid: /\d/.test(password) },
      { label: t("hintSpecial"), valid: /[^a-zA-Z0-9]/.test(password) },
    ];
  }

  function confirmPasswordRules(): FieldRule[] {
    if (!submitted && !confirmPassword) return [];
    const rules: FieldRule[] = [
      { label: t("confirmPasswordRequired"), valid: confirmPassword.length > 0 },
    ];
    if (confirmPassword.length > 0) {
      rules.push({ label: t("passwordsMismatch"), valid: password === confirmPassword });
    }
    return rules;
  }

  function handleSubmit(formData: FormData) {
    setSubmitted(true);
    const allRules = [
      ...nameRules(),
      ...emailRules(),
      ...passwordRules(),
      ...confirmPasswordRules(),
    ];
    if (allRules.some((r) => !r.valid)) return;
    formAction(formData);
  }

  const hasError = (rules: FieldRule[]) => rules.some((r) => !r.valid);
  const inputClass = (rules: FieldRule[]) =>
    hasError(rules) ? "border-red-500 focus:border-red-500" : "";

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
                className={inputClass(nameRules())}
                onChange={(e) => setName(e.target.value)}
              />
              <FieldError rules={nameRules()} />
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
                className={inputClass(emailRules())}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldError rules={emailRules()} />
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
                className={inputClass(passwordRules())}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FieldError rules={passwordRules()} />
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
                className={inputClass(confirmPasswordRules())}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FieldError rules={confirmPasswordRules()} />
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
