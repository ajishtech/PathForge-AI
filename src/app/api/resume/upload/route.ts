import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromFile } from "@/lib/resume-parser";
import { parseResumeWithAI } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawText = await extractTextFromFile(buffer, file.name);
    const parsed = await parseResumeWithAI(rawText);

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        rawText,
        skills: JSON.stringify(parsed.skills),
        education: JSON.stringify(parsed.education),
        experience: JSON.stringify(parsed.experience),
        projects: JSON.stringify(parsed.projects),
      },
    });

    for (const skill of parsed.skills) {
      await prisma.userSkill.upsert({
        where: { userId_name: { userId: session.user.id, name: skill } },
        update: { isCurrent: true },
        create: { userId: session.user.id, name: skill, proficiency: "Intermediate", isCurrent: true },
      });
    }

    return NextResponse.json({ resume, parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { parsedAt: "desc" },
  });

  return NextResponse.json(resumes);
}
