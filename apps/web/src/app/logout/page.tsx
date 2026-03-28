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
import { useTranslations } from "next-intl";
import { signOut } from "../actions/auth";

export default function LogoutPage() {
  const t = useTranslations("logout");

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-3 xs:px-4 md:min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent />
        <CardFooter className="flex-col gap-3">
          <form action={signOut} className="w-full">
            <Button type="submit" className="w-full">
              {t("confirm")}
            </Button>
          </form>
          <Link href="/" className="text-sm text-foreground-secondary hover:text-foreground">
            {t("cancel")}
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
