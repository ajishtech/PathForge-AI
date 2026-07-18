import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInterviewQuestions, evaluateInterviewAnswer } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, type, count, question, answer, sessionId } = body;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (action === "evaluate" && question && answer) {
    const evaluation = await evaluateInterviewAnswer(question, answer);

    if (sessionId) {
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          answers: JSON.stringify([{ question, answer }]),
          feedback: evaluation.feedback,
          score: evaluation.score,
        },
      });
    }

    return NextResponse.json(evaluation);
  }

  const questions = await generateInterviewQuestions(
    user?.careerGoal || "Full-Stack Developer",
    type || "technical",
    count || 5
  );

  const interviewSession = await prisma.interviewSession.create({
    data: {
      userId: session.user.id,
      type: type || "technical",
      questions: JSON.stringify(questions),
    },
  });

  return NextResponse.json({ questions, sessionId: interviewSession.id });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json(sessions);
}
