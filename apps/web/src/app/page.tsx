import { db } from "@friends/database";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");
  const userCount = await db.user.count();

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{t("title")}</h1>
      <p>{t("welcome")}</p>
      <p>{t("usersCount", { count: userCount })}</p>
    </main>
  );
}
