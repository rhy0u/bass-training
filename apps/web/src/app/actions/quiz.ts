"use server";

import { getSession } from "@/lib/session";
import { db } from "@bass-training/database";

export async function saveQuizResult(data: {
    quizType?: string;
    score: number;
    totalQuestions: number;
    averageTimeMs: number;
}) {
    const session = await getSession();
    if (!session) return;

    await db.quizResult.create({
        data: {
            userId: session.userId,
            quizType: data.quizType ?? "notation",
            score: data.score,
            totalQuestions: data.totalQuestions,
            averageTimeMs: Math.round(data.averageTimeMs),
        },
    });
}
