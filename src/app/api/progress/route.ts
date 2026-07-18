import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [
    user,
    skills,
    roadmapSteps,
    courses,
    goals,
    achievements,
    studyLogs,
    interviewSessions,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userSkill.findMany({ where: { userId, isCurrent: true } }),
    prisma.roadmapStep.findMany({ where: { userId } }),
    prisma.userCourse.findMany({ where: { userId } }),
    prisma.dailyGoal.findMany({ where: { userId, completed: true } }),
    prisma.achievement.findMany({ where: { userId } }),
    prisma.studyLog.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 30 }),
    prisma.interviewSession.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const completedSteps = roadmapSteps.filter((s) => s.completed).length;
  const totalSteps = roadmapSteps.length;
  const roadmapProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const completedCourses = courses.filter((c) => c.completed).length;
  const avgInterviewScore = interviewSessions.length > 0
    ? Math.round(interviewSessions.reduce((a, s) => a + (s.score || 0), 0) / interviewSessions.length)
    : 0;

  const weeklyHours = studyLogs
    .filter((log) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(log.date) >= weekAgo;
    })
    .reduce((a, log) => a + log.hours, 0);

  const studyByDay = studyLogs.reduce<Record<string, number>>((acc, log) => {
    const day = new Date(log.date).toLocaleDateString("en-US", { weekday: "short" });
    acc[day] = (acc[day] || 0) + log.hours;
    return acc;
  }, {});

  return NextResponse.json({
    careerGoal: user?.careerGoal,
    skillCount: skills.length,
    roadmapProgress,
    completedSteps,
    totalSteps,
    completedCourses,
    totalCourses: courses.length,
    completedGoals: goals.length,
    achievements,
    weeklyHours,
    studyByDay,
    interviewReadiness: avgInterviewScore,
    streak: Math.min(goals.length, 7),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { hours, notes } = await req.json();

  const log = await prisma.studyLog.create({
    data: {
      userId: session.user.id,
      hours: hours || 1,
      notes,
    },
  });

  return NextResponse.json(log);
}
