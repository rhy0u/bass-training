"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@bass-training/ui/card";
import { TabsList, TabsPanel, TabsRoot, TabsTab } from "@bass-training/ui/tabs";
import { Typography } from "@bass-training/ui/typography";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface ScoreEntry {
    id: string;
    score: number;
    totalQuestions: number;
    averageTimeMs: number;
    createdAt: string;
}

interface MyScoresTabsProps {
    defaultTab: string;
    notationScores: ScoreEntry[];
    fretboardScores: ScoreEntry[];
    translations: {
        title: string;
        description: string;
        tabNotation: string;
        tabFretboard: string;
        empty: string;
        totalGames: string;
        bestScore: string;
        bestTime: string;
        date: string;
        scoreLabel: string;
        time: string;
    };
}

function ScorePanel({
    scores,
    translations,
}: {
    scores: ScoreEntry[];
    translations: MyScoresTabsProps["translations"];
}) {
    if (scores.length === 0) {
        return (
            <Typography variant="body-sm" className="text-center text-foreground-muted py-4">
                {translations.empty}
            </Typography>
        );
    }

    const bestScore = Math.max(...scores.map((s) => s.score));
    const bestTime = Math.min(...scores.map((s) => s.averageTimeMs));

    return (
        <>
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-lg border border-border bg-surface-secondary/50 p-3.5 text-center">
                    <Typography variant="caption" className="text-foreground-muted">{translations.totalGames}</Typography>
                    <Typography variant="h3" className="mt-1">{scores.length}</Typography>
                </div>
                <div className="rounded-lg border border-border bg-surface-secondary/50 p-3.5 text-center">
                    <Typography variant="caption" className="text-foreground-muted">{translations.bestScore}</Typography>
                    <Typography variant="h3" className="mt-1">{bestScore}/{scores[0]!.totalQuestions}</Typography>
                </div>
                <div className="rounded-lg border border-border bg-surface-secondary/50 p-3.5 text-center">
                    <Typography variant="caption" className="text-foreground-muted">{translations.bestTime}</Typography>
                    <Typography variant="h3" className="mt-1">{(bestTime / 1000).toFixed(1)}s</Typography>
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center px-4 py-2 text-foreground-muted">
                    <Typography variant="caption" className="flex-1">{translations.date}</Typography>
                    <Typography variant="caption" className="w-16 text-right">{translations.scoreLabel}</Typography>
                    <Typography variant="caption" className="w-20 text-right">{translations.time}</Typography>
                </div>
                {scores.map((entry) => (
                    <div
                        key={entry.id}
                        className={`flex items-center rounded-lg border px-4 py-2.5 transition-colors ${entry.score === bestScore
                            ? "border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400"
                            : "border-border bg-surface-secondary/50 hover:bg-surface-secondary"
                            }`}
                    >
                        <span className="flex-1 text-sm">
                            {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                        <span className="w-16 text-right font-mono text-sm">
                            {entry.score}/{entry.totalQuestions}
                        </span>
                        <span className="w-20 text-right text-sm text-foreground-muted tabular-nums">
                            {(entry.averageTimeMs / 1000).toFixed(1)}s
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}

export function MyScoresTabs({ defaultTab, notationScores, fretboardScores, translations }: Readonly<MyScoresTabsProps>) {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(defaultTab);

    const onTabChange = useCallback(
        (value: string | number | null) => {
            const tab = String(value);
            setActiveTab(tab);
            router.replace(`${pathname}?tab=${tab}`, { scroll: false });
        },
        [router, pathname],
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{translations.title}</CardTitle>
                <CardDescription>{translations.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <TabsRoot value={activeTab} onValueChange={onTabChange}>
                    <TabsList>
                        <TabsTab value="notation">{translations.tabNotation}</TabsTab>
                        <TabsTab value="fretboard">{translations.tabFretboard}</TabsTab>
                    </TabsList>
                    <TabsPanel value="notation">
                        <ScorePanel scores={notationScores} translations={translations} />
                    </TabsPanel>
                    <TabsPanel value="fretboard">
                        <ScorePanel scores={fretboardScores} translations={translations} />
                    </TabsPanel>
                </TabsRoot>
            </CardContent>
        </Card>
    );
}
