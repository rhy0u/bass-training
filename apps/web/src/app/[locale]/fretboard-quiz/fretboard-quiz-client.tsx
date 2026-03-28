"use client";

import { Button } from "@bass-training/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@bass-training/ui/card";
import { Typography } from "@bass-training/ui/typography";
import { useTranslations } from "next-intl";
import { useEffect, useReducer, useRef } from "react";
import { saveQuizResult } from "../../actions/quiz";
import {
    BassFretboard,
    type FretboardFeedback,
    type StringName,
    STRINGS,
    getNoteAtFret,
} from "@/components/bass-fretboard";

const CHROMATIC = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];
const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 15;
const FRET_COUNT = 12;

type QuizPhase = "intro" | "playing" | "results";

interface Question {
    note: string;
    stringName: StringName;
    correctFrets: number[];
}

interface QuestionResult {
    question: Question;
    answeredFret: number | null;
    isCorrect: boolean;
    responseTimeMs: number | null;
}

function generateQuestions(): Question[] {
    const questions: Question[] = [];
    const seen = new Set<string>();

    while (questions.length < TOTAL_QUESTIONS) {
        const stringName = STRINGS[Math.floor(Math.random() * STRINGS.length)]!;
        const note = CHROMATIC[Math.floor(Math.random() * CHROMATIC.length)]!;
        const key = `${note}-${stringName}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const correctFrets: number[] = [];
        for (let f = 1; f <= FRET_COUNT; f++) {
            if (getNoteAtFret(stringName, f) === note) correctFrets.push(f);
        }
        if (correctFrets.length === 0) continue;

        questions.push({ note, stringName, correctFrets });
    }

    return questions;
}

// ─── Reducer ──────────────────────────────────────────

interface QuizState {
    phase: QuizPhase;
    questions: Question[];
    currentIndex: number;
    timeLeft: number;
    results: QuestionResult[];
    feedback: FretboardFeedback | null;
    questionStartedAt: number;
}

const initialState: QuizState = {
    phase: "intro",
    questions: [],
    currentIndex: 0,
    timeLeft: TIME_PER_QUESTION,
    results: [],
    feedback: null,
    questionStartedAt: 0,
};

type QuizAction =
    | { type: "start"; questions: Question[] }
    | { type: "tick" }
    | { type: "answer"; fret: number }
    | { type: "advance" };

function recordAndAdvance(
    state: QuizState,
    answeredFret: number | null,
): QuizState {
    const question = state.questions[state.currentIndex];
    if (!question) return state;

    const isCorrect =
        answeredFret !== null && question.correctFrets.includes(answeredFret);
    const responseTimeMs =
        answeredFret !== null ? Date.now() - state.questionStartedAt : null;

    const result: QuestionResult = {
        question,
        answeredFret,
        isCorrect,
        responseTimeMs,
    };

    const newResults = [...state.results, result];

    if (newResults.length >= TOTAL_QUESTIONS) {
        return {
            ...state,
            results: newResults,
            feedback: answeredFret
                ? {
                    stringName: question.stringName,
                    fret: answeredFret,
                    correct: isCorrect,
                }
                : null,
            phase: "results",
        };
    }

    return {
        ...state,
        results: newResults,
        currentIndex: state.currentIndex + 1,
        timeLeft: TIME_PER_QUESTION,
        feedback: null,
        questionStartedAt: Date.now(),
    };
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
        case "start":
            return {
                ...initialState,
                phase: "playing",
                questions: action.questions,
                questionStartedAt: Date.now(),
            };

        case "tick": {
            if (state.phase !== "playing" || state.feedback !== null) return state;
            const newTime = state.timeLeft - 1;
            if (newTime > 0) return { ...state, timeLeft: newTime };
            return recordAndAdvance(state, null);
        }

        case "answer": {
            if (state.phase !== "playing" || state.feedback !== null) return state;
            const question = state.questions[state.currentIndex];
            if (!question) return state;
            const isCorrect = question.correctFrets.includes(action.fret);
            return {
                ...state,
                feedback: {
                    stringName: question.stringName,
                    fret: action.fret,
                    correct: isCorrect,
                },
            };
        }

        case "advance": {
            if (state.phase !== "playing" || state.feedback === null) return state;
            const answeredFret = state.feedback.fret;
            return recordAndAdvance(state, answeredFret);
        }

        default:
            return state;
    }
}

// ─── Component ────────────────────────────────────────

export function FretboardQuizClient({
    isLoggedIn,
}: Readonly<{ isLoggedIn: boolean }>) {
    const t = useTranslations("fretboardQuiz");
    const [state, dispatch] = useReducer(quizReducer, initialState);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const savedRef = useRef(false);

    const { phase, currentIndex, timeLeft, results, feedback, questions } = state;
    const currentQuestion = questions[currentIndex];
    const score = results.filter((r) => r.isCorrect).length;
    const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;

    const answeredResults = results.filter((r) => r.responseTimeMs !== null);
    const averageTimeMs =
        answeredResults.length > 0
            ? answeredResults.reduce((sum, r) => sum + r.responseTimeMs!, 0) /
            answeredResults.length
            : 0;

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (phase !== "playing" || feedback !== null) return;

        timerRef.current = setInterval(() => dispatch({ type: "tick" }), 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [phase, currentIndex, feedback]);

    useEffect(() => {
        if (phase !== "results" || !isLoggedIn || savedRef.current) return;
        savedRef.current = true;
        saveQuizResult({
            quizType: "fretboard",
            score,
            totalQuestions: TOTAL_QUESTIONS,
            averageTimeMs,
        });
    }, [phase, isLoggedIn, score, averageTimeMs]);

    useEffect(() => {
        if (phase !== "playing" || feedback === null) return;
        const id = setTimeout(() => dispatch({ type: "advance" }), 800);
        return () => clearTimeout(id);
    }, [phase, feedback, currentIndex]);

    function startQuiz() {
        savedRef.current = false;
        dispatch({ type: "start", questions: generateQuestions() });
    }

    function handleFretClick(_stringName: StringName, fret: number) {
        dispatch({ type: "answer", fret });
    }

    // ─── Intro ────────────────────────────────────────────
    if (phase === "intro") {
        return (
            <main className="px-4 py-6 mx-auto max-w-3xl md:py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Typography variant="body-sm">{t("rules")}</Typography>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>
                                        <Typography variant="body-sm">
                                            {t("ruleQuestions", { count: TOTAL_QUESTIONS })}
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography variant="body-sm">
                                            {t("ruleTime", { seconds: TIME_PER_QUESTION })}
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography variant="body-sm">
                                            {t("ruleFind")}
                                        </Typography>
                                    </li>
                                </ul>
                            </div>
                            <BassFretboard />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={startQuiz}>{t("start")}</Button>
                    </CardFooter>
                </Card>
            </main>
        );
    }

    // ─── Results ──────────────────────────────────────────
    if (phase === "results") {
        return (
            <main className="px-4 py-6 mx-auto max-w-3xl md:py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("resultsTitle")}</CardTitle>
                        <CardDescription>
                            {t("score", { score, total: TOTAL_QUESTIONS })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {answeredResults.length > 0 && (
                                <div className="flex justify-center mb-3">
                                    <Typography
                                        variant="body-sm"
                                        className="text-foreground-muted"
                                    >
                                        {t("averageTime", {
                                            time: (averageTimeMs / 1000).toFixed(1),
                                        })}
                                    </Typography>
                                </div>
                            )}
                            {results.map((r, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between rounded-lg px-4 py-2 ${r.isCorrect
                                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                            : "bg-red-500/10 text-red-700 dark:text-red-400"
                                        }`}
                                >
                                    <span className="font-mono font-semibold w-24">
                                        {r.question.note} / {r.question.stringName}
                                    </span>
                                    <span className="flex-1 text-center">
                                        {r.answeredFret !== null ? (
                                            <>
                                                Fret {r.answeredFret}
                                                {!r.isCorrect && (
                                                    <span className="ml-2 text-foreground-muted">
                                                        → Fret {r.question.correctFrets[0]}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="italic text-foreground-muted">
                                                {t("timeout")}
                                            </span>
                                        )}
                                    </span>
                                    <span className="w-16 text-right text-sm text-foreground-muted">
                                        {r.responseTimeMs !== null
                                            ? `${(r.responseTimeMs / 1000).toFixed(1)}s`
                                            : "—"}
                                    </span>
                                    <span className="w-6 text-right">
                                        {r.isCorrect ? "✓" : "✗"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={startQuiz}>{t("retry")}</Button>
                    </CardFooter>
                </Card>
            </main>
        );
    }

    // ─── Playing ──────────────────────────────────────────
    return (
        <main className="px-4 py-6 mx-auto max-w-3xl md:py-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Typography variant="caption">
                            {t("questionProgress", {
                                current: currentIndex + 1,
                                total: TOTAL_QUESTIONS,
                            })}
                        </Typography>
                        <Typography
                            variant="caption"
                            className={timeLeft <= 3 ? "text-red-500 font-semibold" : ""}
                        >
                            {timeLeft}s
                        </Typography>
                    </div>

                    {/* Timer bar */}
                    <div className="mt-2 h-1.5 w-full rounded-full bg-surface-tertiary overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 linear ${timeLeft <= 3 ? "bg-red-500" : "bg-foreground"
                                }`}
                            style={{ width: `${timerPercent}%` }}
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col items-center gap-6 py-4">
                        {/* Question prompt */}
                        <div className="text-center">
                            <Typography variant="h3">
                                {currentQuestion &&
                                    t("findNote", {
                                        note: currentQuestion.note,
                                        string: currentQuestion.stringName,
                                    })}
                            </Typography>
                            {feedback && (
                                <Typography
                                    variant="body-sm"
                                    className={`mt-2 font-semibold ${feedback.correct
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    {feedback.correct
                                        ? t("correct")
                                        : t("wrong", {
                                            fret: currentQuestion?.correctFrets[0] ?? 0,
                                        })}
                                </Typography>
                            )}
                        </div>

                        {/* Fretboard */}
                        <BassFretboard
                            highlightString={currentQuestion?.stringName}
                            feedback={feedback}
                            correctFrets={currentQuestion?.correctFrets}
                            onFretClick={handleFretClick}
                            disabled={feedback !== null}
                        />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
