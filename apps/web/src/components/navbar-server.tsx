import { getCurrentUser } from "@/lib/auth";
import { getLocale, getTranslations } from "next-intl/server";
import { Navbar } from "./navbar";

export async function NavbarServer() {
  const t = await getTranslations("navbar");
  const locale = await getLocale();
  const user = await getCurrentUser();

  return (
    <Navbar
      user={user}
      currentLocale={locale}
      translations={{
        brand: t("brand"),
        signIn: t("signIn"),
        signUp: t("signUp"),
        profile: t("profile"),
        logout: t("logout"),
        userMenu: t("userMenu"),
        lightMode: t("lightMode"),
        darkMode: t("darkMode"),
        language: t("language"),
        notationQuiz: t("notationQuiz"),
        fretboardQuiz: t("fretboardQuiz"),
        leaderboard: t("leaderboard"),
        myScores: t("myScores"),
      }}
    />
  );
}
