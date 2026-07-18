import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  careerGoal: z.string().optional(),
  githubUsername: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      careerGoal: true,
      bio: true,
      githubUsername: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const data = updateSchema.parse(body);

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  if (data.careerGoal) {
    await prisma.roadmapStep.deleteMany({
      where: { userId: session.user.id },
    });
  }

  return NextResponse.json(user);
}
