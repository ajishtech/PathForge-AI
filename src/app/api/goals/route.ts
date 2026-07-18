import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DAILY_GOAL_TEMPLATES } from "@/lib/career-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goals = await prisma.dailyGoal.findMany({
    where: {
      userId: session.user.id,
      date: { gte: today },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(goals);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.action === "generate") {
    const shuffled = [...DAILY_GOAL_TEMPLATES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    const goals = await Promise.all(
      selected.map((title) =>
        prisma.dailyGoal.create({
          data: { userId: session.user.id, title },
        })
      )
    );

    return NextResponse.json(goals);
  }

  if (body.action === "toggle") {
    const goal = await prisma.dailyGoal.update({
      where: { id: body.id },
      data: { completed: body.completed },
    });
    return NextResponse.json(goal);
  }

  const goal = await prisma.dailyGoal.create({
    data: {
      userId: session.user.id,
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(goal);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  await prisma.dailyGoal.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
