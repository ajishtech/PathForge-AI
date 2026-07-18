import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeSkills } from "@/lib/ai";
import { CareerRole } from "@/lib/career-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { skills: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const skillNames = user.skills.filter((s) => s.isCurrent).map((s) => s.name);
  const analysis = analyzeSkills(skillNames, user.careerGoal as CareerRole);

  return NextResponse.json({
    careerGoal: user.careerGoal,
    currentSkills: user.skills.filter((s) => s.isCurrent),
    missingSkills: analysis.missingSkills,
    matchPercentage: analysis.matchPercentage,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, proficiency } = await req.json();

  const skill = await prisma.userSkill.upsert({
    where: { userId_name: { userId: session.user.id, name } },
    update: { proficiency, isCurrent: true },
    create: { userId: session.user.id, name, proficiency, isCurrent: true },
  });

  return NextResponse.json(skill);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  await prisma.userSkill.delete({
    where: { userId_name: { userId: session.user.id, name } },
  });

  return NextResponse.json({ success: true });
}
