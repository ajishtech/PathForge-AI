import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatWithAI } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { skills: true, chatMessages: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.chatMessage.create({
    data: { userId: session.user.id, role: "user", content: message },
  });

  const history = user.chatMessages.reverse().map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const response = await chatWithAI(message, {
    careerGoal: user.careerGoal,
    skills: user.skills.map((s) => s.name),
    history,
  });

  await prisma.chatMessage.create({
    data: { userId: session.user.id, role: "assistant", content: response },
  });

  return NextResponse.json({ response });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.chatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return NextResponse.json(messages);
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.chatMessage.deleteMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
