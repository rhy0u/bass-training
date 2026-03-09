"use client";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@friends/ui/button";
import { Card, CardContent } from "@friends/ui/card";
import { Typography } from "@friends/ui/typography";
import { useTranslations } from "next-intl";
import { markAllNotificationsAsRead, markNotificationAsRead } from "../actions/notifications";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export function NotificationsPageClient({ notifications }: { notifications: NotificationItem[] }) {
  const t = useTranslations("notifications");
  const router = useRouter();
  const hasUnread = notifications.some((n) => !n.read);

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    router.refresh();
  };

  const handleClick = async (notification: NotificationItem) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    } else {
      router.refresh();
    }
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return t("justNow");
    if (diffMin < 60) return t("minutesAgo", { count: diffMin });
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return t("hoursAgo", { count: diffHours });
    const diffDays = Math.floor(diffHours / 24);
    return t("daysAgo", { count: diffDays });
  };

  return (
    <main className="mx-auto max-w-3xl px-3 py-6 xs:px-4 md:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Typography variant="h1">{t("title")}</Typography>
          <Typography variant="body-sm" className="text-foreground-secondary">
            {t("description")}
          </Typography>
        </div>
        {hasUnread && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            {t("markAllRead")}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-foreground-secondary">
            {t("empty")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              className={`w-full rounded-lg border text-left transition-colors ${
                notification.read
                  ? "border-border bg-surface"
                  : "border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950"
              } p-3 hover:bg-surface-secondary xs:p-4`}
              onClick={() => handleClick(notification)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                    )}
                    <Typography variant="body-sm" className="font-medium text-foreground">
                      {notification.title}
                    </Typography>
                  </div>
                  <Typography variant="caption" className="mt-0.5 text-foreground-secondary">
                    {notification.message}
                  </Typography>
                </div>
                <Typography variant="caption" className="shrink-0 text-foreground-secondary">
                  {formatTime(notification.createdAt)}
                </Typography>
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
