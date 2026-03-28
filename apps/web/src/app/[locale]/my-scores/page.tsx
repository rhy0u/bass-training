import { getCurrentUser } from "@/lib/auth";
import { db } from "@bass-training/database";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { MyScoresTabs } from "./my-scores-tabs";

export async function generateMetadata() {
    const t = await getTranslations("myScores");
    return { title: t("title") };
}

export default async function MyScoresPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const t = await getTranslations("myScores");
    const user = await getCurrentUser();

    if (!user) redirect("/sign-in");

    const { tab } = await searchParams;
    const defaultTab = tab === "fretboard" ? "fretboard" : "notation";

    const [notationScores, fretboardScores] = await Promise.all([
        db.quizResult.findMany({
            where: { userId: user.id, quizType: "notation" },
            orderBy: { createdAt: "desc" },
            take: 50,
        }),
        db.quizResult.findMany({
            where: { userId: user.id, quizType: "fretboard" },
            orderBy: { createdAt: "desc" },
            take: 50,
        }),
    ]);

    const serialize = (scores: typeof notationScores) =>
        scores.map((s) => ({
            id: s.id,
            score: s.score,
            totalQuestions: s.totalQuestions,
            averageTimeMs: s.averageTimeMs,
            createdAt: s.createdAt.toISOString(),
        }));

    return (
        <main className="px-4 py-6 mx-auto max-w-xl md:py-8">
            <MyScoresTabs
                defaultTab={defaultTab}
                notationScores={serialize(notationScores)}
                fretboardScores={serialize(fretboardScores)}
                translations={{
                    title: t("title"),
                    description: t("description"),
                    tabNotation: t("tabNotation"),
                    tabFretboard: t("tabFretboard"),
                    empty: t("empty"),
                    totalGames: t("totalGames"),
                    bestScore: t("bestScore"),
                    bestTime: t("bestTime"),
                    date: t("date"),
                    scoreLabel: t("scoreLabel"),
                    time: t("time"),
                }}
            />
        </main>
    );
}
