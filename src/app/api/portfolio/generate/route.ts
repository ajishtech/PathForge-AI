import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePortfolioContent } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { theme } = await req.json();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { skills: true, resumes: { orderBy: { parsedAt: "desc" }, take: 1 } },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const skills = user.skills.map((s) => s.name);
  let projects: string[] = [];

  if (user.resumes[0]?.projects) {
    try {
      const parsed = JSON.parse(user.resumes[0].projects);
      projects = parsed.map((p: { name: string }) => p.name);
    } catch {
      projects = ["Personal Project"];
    }
  }

  const content = await generatePortfolioContent(
    user.name || "Developer",
    skills,
    projects.length > 0 ? projects : ["Portfolio Project"],
    user.bio || undefined
  );

  const existing = await prisma.achievement.findFirst({
    where: { userId: session.user.id, title: "Portfolio Pro" },
  });

  if (!existing) {
    await prisma.achievement.create({
      data: {
        userId: session.user.id,
        title: "Portfolio Pro",
        description: "Generated your portfolio website",
        badge: "🚀",
      },
    });
  }

  return NextResponse.json({ content, theme: theme || "modern", user: { name: user.name, email: user.email, skills } });
}
