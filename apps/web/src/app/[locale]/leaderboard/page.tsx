import { db } from "@bass-training/database";
import { getTranslations } from "next-intl/server";
import { LeaderboardTabs } from "./leaderboard-tabs";

export async function generateMetadata() {
    const t = await getTranslations("leaderboard");
    return { title: t("title") };
}

export default async function LeaderboardPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const t = await getTranslations("leaderboard");
    const { tab } = await searchParams;
    const defaultTab = tab === "fretboard" ? "fretboard" : "notation";

    const [notationScores, fretboardScores] = await Promise.all([
        db.quizResult.findMany({
            where: { quizType: "notation" },
            orderBy: [{ score: "desc" }, { averageTimeMs: "asc" }],
            take: 20,
            include: { user: { select: { name: true } } },
        }),
        db.quizResult.findMany({
            where: { quizType: "fretboard" },
            orderBy: [{ score: "desc" }, { averageTimeMs: "asc" }],
            take: 20,
            include: { user: { select: { name: true } } },
        }),
    ]);

    const serialize = (scores: typeof notationScores) =>
        scores.map((s) => ({
            id: s.id,
            userName: s.user.name,
            score: s.score,
            totalQuestions: s.totalQuestions,
            averageTimeMs: s.averageTimeMs,
        }));

    return (
        <main className="px-4 py-6 mx-auto max-w-xl md:py-8">
            <LeaderboardTabs
                defaultTab={defaultTab}
                notationScores={serialize(notationScores)}
                fretboardScores={serialize(fretboardScores)}
                translations={{
                    title: t("title"),
                    description: t("description"),
                    tabNotation: t("tabNotation"),
                    tabFretboard: t("tabFretboard"),
                    empty: t("empty"),
                    player: t("player"),
                    scoreLabel: t("scoreLabel"),
                    time: t("time"),
                    anonymous: t("anonymous"),
                }}
            />
        </main>
    );
}
