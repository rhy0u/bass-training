import { getUnreadNotificationCount } from "@/app/actions/notifications";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, getTranslations } from "next-intl/server";
import { Navbar } from "./navbar";

export async function NavbarServer() {
  const t = await getTranslations("navbar");
  const locale = await getLocale();
  const user = await getCurrentUser();
  const unreadCount = user ? await getUnreadNotificationCount() : 0;

  return (
    <Navbar
      user={user}
      unreadNotificationCount={unreadCount}
      currentLocale={locale}
      translations={{
        brand: t("brand"),
        signIn: t("signIn"),
        signUp: t("signUp"),
        profile: t("profile"),
        groups: t("groups"),
        notifications: t("notifications"),
        logout: t("logout"),
        userMenu: t("userMenu"),
        lightMode: t("lightMode"),
        darkMode: t("darkMode"),
        language: t("language"),
      }}
    />
  );
}
