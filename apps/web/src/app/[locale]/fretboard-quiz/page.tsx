import { getSession } from "@/lib/session";
import { getTranslations } from "next-intl/server";
import { FretboardQuizClient } from "./fretboard-quiz-client";

export async function generateMetadata() {
    const t = await getTranslations("fretboardQuiz");
    return { title: t("title") };
}

export default async function FretboardQuizPage() {
    const session = await getSession();
    return <FretboardQuizClient isLoggedIn={session !== null} />;
}
