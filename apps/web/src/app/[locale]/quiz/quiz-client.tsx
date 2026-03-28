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

const NOTE_MAP: Record<string, string> = {
  C: "do",
  D: "ré",
  E: "mi",
  F: "fa",
  G: "sol",
  A: "la",
  B: "si",
};

const ENGLISH_NOTES = Object.keys(NOTE_MAP);
const LATIN_NOTES = Object.values(NOTE_MAP);
const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 10;

type QuizPhase = "intro" | "playing" | "results";

interface QuestionResult {
  note: string;
  correct: string;
  answer: string | null;
  isCorrect: boolean;
  responseTimeMs: number | null;
}

function generateQuestions(): string[] {
  const questions: string[] = [];
  const pool = [...ENGLISH_NOTES];

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  questions.push(...pool);

  for (let i = 0; i < TOTAL_QUESTIONS - ENGLISH_NOTES.length; i++) {
    questions.push(
      ENGLISH_NOTES[Math.floor(Math.random() * ENGLISH_NOTES.length)]!,
    );
  }

  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j]!, questions[i]!];
  }

  return questions;
}

// ─── Reducer ──────────────────────────────────────────

interface QuizState {
  phase: QuizPhase;
  questions: string[];
  currentIndex: number;
  timeLeft: number;
  results: QuestionResult[];
  selectedAnswer: string | null;
  questionStartedAt: number;
}

const initialState: QuizState = {
  phase: "intro",
  questions: [],
  currentIndex: 0,
  timeLeft: TIME_PER_QUESTION,
  results: [],
  selectedAnswer: null,
  questionStartedAt: 0,
};

type QuizAction =
  | { type: "start"; questions: string[] }
  | { type: "tick" }
  | { type: "answer"; answer: string }
  | { type: "advance" };

function recordAndAdvance(state: QuizState, answer: string | null): QuizState {
  const note = state.questions[state.currentIndex];
  if (!note) return state;

  const correct = NOTE_MAP[note]!;
  const responseTimeMs = answer !== null ? Date.now() - state.questionStartedAt : null;
  const result: QuestionResult = {
    note,
    correct,
    answer,
    isCorrect: answer === correct,
    responseTimeMs,
  };

  const newResults = [...state.results, result];
  const now = Date.now();

  if (newResults.length >= TOTAL_QUESTIONS) {
    return {
      ...state,
      results: newResults,
      selectedAnswer: answer,
      phase: "results",
    };
  }

  return {
    ...state,
    results: newResults,
    currentIndex: state.currentIndex + 1,
    timeLeft: TIME_PER_QUESTION,
    selectedAnswer: null,
    questionStartedAt: now,
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
      if (state.phase !== "playing" || state.selectedAnswer !== null)
        return state;
      const newTime = state.timeLeft - 1;
      if (newTime > 0) return { ...state, timeLeft: newTime };
      // Time's up — record as unanswered and advance
      return recordAndAdvance(state, null);
    }

    case "answer": {
      if (state.phase !== "playing" || state.selectedAnswer !== null)
        return state;
      return { ...state, selectedAnswer: action.answer };
    }

    case "advance": {
      if (state.phase !== "playing" || state.selectedAnswer === null)
        return state;
      return recordAndAdvance(state, state.selectedAnswer);
    }

    default:
      return state;
  }
}

// ─── Component ────────────────────────────────────────

export function QuizClient({ isLoggedIn }: Readonly<{ isLoggedIn: boolean }>) {
  const t = useTranslations("quiz");
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedRef = useRef(false);

  const {
    phase,
    currentIndex,
    timeLeft,
    results,
    selectedAnswer,
    questions,
  } = state;
  const currentNote = questions[currentIndex];
  const score = results.filter((r) => r.isCorrect).length;
  const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;

  const answeredResults = results.filter((r) => r.responseTimeMs !== null);
  const averageTimeMs =
    answeredResults.length > 0
      ? answeredResults.reduce((sum, r) => sum + r.responseTimeMs!, 0) / answeredResults.length
      : 0;

  // Timer: run while playing and no answer selected
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phase !== "playing" || selectedAnswer !== null) return;

    timerRef.current = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentIndex, selectedAnswer]);

  // Save score when quiz ends (logged-in users only)
  useEffect(() => {
    if (phase !== "results" || !isLoggedIn || savedRef.current) return;
    savedRef.current = true;
    saveQuizResult({
      score,
      totalQuestions: TOTAL_QUESTIONS,
      averageTimeMs: averageTimeMs,
    });
  }, [phase, isLoggedIn, score, averageTimeMs]);

  // Auto-advance after answer feedback
  useEffect(() => {
    if (phase !== "playing" || selectedAnswer === null) return;
    const id = setTimeout(() => dispatch({ type: "advance" }), 400);
    return () => clearTimeout(id);
  }, [phase, selectedAnswer, currentIndex]);

  function startQuiz() {
    savedRef.current = false;
    dispatch({ type: "start", questions: generateQuestions() });
  }

  function handleAnswer(latin: string) {
    dispatch({ type: "answer", answer: latin });
  }

  // ─── Intro ────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <main className="px-4 py-6 mx-auto max-w-xl md:py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Typography variant="body-sm">
                {t("rules")}
              </Typography>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <Typography variant="body-sm">
                    {t("ruleQuestions", {
                      count: TOTAL_QUESTIONS,
                    })}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body-sm">
                    {t("ruleTime", {
                      seconds: TIME_PER_QUESTION,
                    })}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body-sm">
                    {t("ruleTranslate")}
                  </Typography>
                </li>
              </ul>
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
      <main className="px-4 py-6 mx-auto max-w-xl md:py-8">
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
                  <Typography variant="body-sm" className="text-foreground-muted">
                    {t("averageTime", { time: (averageTimeMs / 1000).toFixed(1) })}
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
                  <span className="font-mono font-semibold w-8">{r.note}</span>
                  <span className="flex-1 text-center">
                    {r.answer ? (
                      <>
                        {r.answer}
                        {!r.isCorrect && (
                          <span className="ml-2 text-foreground-muted">→ {r.correct}</span>
                        )}
                      </>
                    ) : (
                      <span className="italic text-foreground-muted">{t("timeout")}</span>
                    )}
                  </span>
                  <span className="w-16 text-right text-sm text-foreground-muted">
                    {r.responseTimeMs !== null ? `${(r.responseTimeMs / 1000).toFixed(1)}s` : "—"}
                  </span>
                  <span className="w-6 text-right">{r.isCorrect ? "✓" : "✗"}</span>
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
    <main className="px-4 py-6 mx-auto max-w-xl md:py-8">
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
              className={
                timeLeft <= 3
                  ? "text-red-500 font-semibold"
                  : ""
              }
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
          <div className="flex flex-col items-center gap-8 py-4">
            {/* Note display */}
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-border bg-surface-secondary">
              <span className="text-5xl font-bold text-foreground">
                {currentNote}
              </span>
            </div>

            {/* Answer grid */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
              {LATIN_NOTES.map((latin) => {
                const isSelected = selectedAnswer === latin;
                const isCorrectAnswer =
                  latin === NOTE_MAP[currentNote!];

                let extraClass = "";
                if (isSelected && isCorrectAnswer) {
                  extraClass =
                    "!bg-green-600 !text-white border-green-600";
                } else if (isSelected && !isCorrectAnswer) {
                  extraClass =
                    "!bg-red-600 !text-white border-red-600";
                }

                return (
                  <Button
                    key={latin}
                    variant={
                      isSelected ? "solid" : "outline"
                    }
                    size="lg"
                    className={`text-base font-semibold ${extraClass}`}
                    onClick={() => handleAnswer(latin)}
                    disabled={selectedAnswer !== null}
                  >
                    {latin}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
