import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROADMAP_TEMPLATES, CareerRole } from "@/lib/career-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const steps = await prisma.roadmapStep.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(steps);
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.roadmapStep.deleteMany({
    where: { userId: session.user.id },
  });

  const template = ROADMAP_TEMPLATES[user.careerGoal as CareerRole] || ROADMAP_TEMPLATES["Full-Stack Developer"];

  const steps = await Promise.all(
    template.map((step, index) =>
      prisma.roadmapStep.create({
        data: {
          userId: session.user.id,
          title: step.title,
          description: step.description,
          order: index + 1,
          difficulty: step.difficulty,
          estimatedHours: step.estimatedHours,
          resources: JSON.stringify(step.resources),
          projects: JSON.stringify(step.projects),
        },
      })
    )
  );

  return NextResponse.json(steps);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, completed } = await req.json();

  const step = await prisma.roadmapStep.update({
    where: { id, userId: session.user.id },
    data: { completed },
  });

  if (completed) {
    const completedCount = await prisma.roadmapStep.count({
      where: { userId: session.user.id, completed: true },
    });

    if (completedCount === 1) {
      await prisma.achievement.create({
        data: {
          userId: session.user.id,
          title: "First Step",
          description: "Completed your first roadmap step",
          badge: "🎯",
        },
      });
    }
  }

  return NextResponse.json(step);
}
