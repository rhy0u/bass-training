import { db } from "@friends/database";
import { Typography } from "@friends/ui/typography";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");
  const userCount = await db.user.count();

  return (
    <main className="px-4 py-6 mx-auto max-w-3xl md:py-8">
      <Typography variant="h1">{t("title")}</Typography>
      <Typography>{t("welcome")}</Typography>
      <Typography>{t("usersCount", { count: userCount })}</Typography>
    </main>
  );
}
