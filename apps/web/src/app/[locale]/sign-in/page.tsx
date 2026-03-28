"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@bass-training/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bass-training/ui/card";
import { Input } from "@bass-training/ui/input";
import { toast } from "@bass-training/ui/toaster";
import { Typography } from "@bass-training/ui/typography";
import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { signIn, type AuthResult } from "../../actions/auth";

export default function SignInPage() {
  const t = useTranslations("signIn");
  const [state, formAction, isPending] = useActionState<AuthResult | null, FormData>(signIn, null);

  useEffect(() => {
    if (state?.error) {
      toast(t("error"), { description: state.error, type: "error" });
    }
  }, [state, t]);

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-3 xs:px-4 md:min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state?.error && (
              <Typography variant="body-sm" className="text-red-500">
                {state.error}
              </Typography>
            )}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                {t("email")}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                required
              />
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
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("submitting") : t("submit")}
            </Button>
            <Typography variant="body-sm">
              {t("noAccount")}{" "}
              <Link href="/sign-up" className="text-brand-600 hover:underline">
                {t("signUpLink")}
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
