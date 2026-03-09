import { getCurrentUser } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { Navbar } from "./navbar";

export async function NavbarServer() {
  const t = await getTranslations("navbar");
  const user = await getCurrentUser();

  return (
    <Navbar
      user={user}
      translations={{
        brand: t("brand"),
        signIn: t("signIn"),
        signUp: t("signUp"),
        profile: t("profile"),
        logout: t("logout"),
        lightMode: t("lightMode"),
        darkMode: t("darkMode"),
      }}
    />
  );
}
