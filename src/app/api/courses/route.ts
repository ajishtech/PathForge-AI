import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { COURSE_CATALOG } from "@/lib/career-data";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const level = searchParams.get("level");
  const isFree = searchParams.get("free");
  const platform = searchParams.get("platform");

  let courses = [...COURSE_CATALOG];

  if (level) {
    courses = courses.filter((c) => c.level.toLowerCase() === level.toLowerCase());
  }
  if (isFree === "true") {
    courses = courses.filter((c) => c.isFree);
  }
  if (platform) {
    courses = courses.filter((c) => c.platform.toLowerCase() === platform.toLowerCase());
  }

  const userCourses = await prisma.userCourse.findMany({
    where: { userId: session.user.id },
  });

  const enriched = courses.map((course) => ({
    ...course,
    enrolled: userCourses.some((uc) => uc.title === course.title),
    completed: userCourses.find((uc) => uc.title === course.title)?.completed || false,
  }));

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, platform, url, level, duration, isFree, action } = await req.json();

  if (action === "complete") {
    const course = await prisma.userCourse.updateMany({
      where: { userId: session.user.id, title },
      data: { completed: true },
    });
    return NextResponse.json(course);
  }

  const course = await prisma.userCourse.create({
    data: {
      userId: session.user.id,
      title,
      platform,
      url,
      level: level || "Beginner",
      duration,
      isFree: isFree ?? true,
    },
  });

  return NextResponse.json(course);
}
