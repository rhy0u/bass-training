import { getSession } from "@/lib/session";
import { getTranslations } from "next-intl/server";
import { QuizClient } from "./quiz-client";

export async function generateMetadata() {
  const t = await getTranslations("quiz");
  return { title: t("title") };
}

export default async function QuizPage() {
  const session = await getSession();
  return <QuizClient isLoggedIn={session !== null} />;
}
