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
    userName: string | null;
    score: number;
    totalQuestions: number;
    averageTimeMs: number;
}

interface LeaderboardTabsProps {
    defaultTab: string;
    notationScores: ScoreEntry[];
    fretboardScores: ScoreEntry[];
    translations: {
        title: string;
        description: string;
        tabNotation: string;
        tabFretboard: string;
        empty: string;
        player: string;
        scoreLabel: string;
        time: string;
        anonymous: string;
    };
}

function ScoreList({
    scores,
    translations,
}: {
    scores: ScoreEntry[];
    translations: LeaderboardTabsProps["translations"];
}) {
    if (scores.length === 0) {
        return (
            <Typography variant="body-sm" className="text-center text-foreground-muted py-4">
                {translations.empty}
            </Typography>
        );
    }

    return (
        <div className="space-y-1.5">
            <div className="flex items-center px-4 py-2 text-foreground-muted">
                <Typography variant="caption" className="w-8">#</Typography>
                <Typography variant="caption" className="flex-1">{translations.player}</Typography>
                <Typography variant="caption" className="w-16 text-right">{translations.scoreLabel}</Typography>
                <Typography variant="caption" className="w-20 text-right">{translations.time}</Typography>
            </div>
            {scores.map((entry, i) => (
                <div
                    key={entry.id}
                    className={`flex items-center rounded-lg border px-4 py-2.5 transition-colors ${i < 3
                            ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400"
                            : "border-border bg-surface-secondary/50 hover:bg-surface-secondary"
                        }`}
                >
                    <span className={`w-8 font-semibold tabular-nums ${i < 3 ? "text-yellow-600 dark:text-yellow-400" : "text-foreground-muted"}`}>{i + 1}</span>
                    <span className="flex-1 truncate font-medium">{entry.userName ?? translations.anonymous}</span>
                    <span className="w-16 text-right font-mono text-sm">{entry.score}/{entry.totalQuestions}</span>
                    <span className="w-20 text-right text-sm text-foreground-muted tabular-nums">
                        {(entry.averageTimeMs / 1000).toFixed(1)}s
                    </span>
                </div>
            ))}
        </div>
    );
}

export function LeaderboardTabs({ defaultTab, notationScores, fretboardScores, translations }: Readonly<LeaderboardTabsProps>) {
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
                        <ScoreList scores={notationScores} translations={translations} />
                    </TabsPanel>
                    <TabsPanel value="fretboard">
                        <ScoreList scores={fretboardScores} translations={translations} />
                    </TabsPanel>
                </TabsRoot>
            </CardContent>
        </Card>
    );
}
