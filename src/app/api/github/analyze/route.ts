import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface GitHubRepo {
  name: string;
  language: string | null;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await req.json();

  if (!username) {
    return NextResponse.json({ error: "GitHub username required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
    }

    const repos: GitHubRepo[] = await res.json();

    const languages: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .map(([lang]) => lang);

    const suggestions = [];
    const noReadme = repos.filter((r) => !r.description);
    if (noReadme.length > 0) {
      suggestions.push(`Add README files to ${noReadme.length} repositories missing descriptions`);
    }
    if (repos.length < 3) {
      suggestions.push("Create more public repositories to showcase your skills");
    }
    suggestions.push("Increase test coverage on your top projects");
    suggestions.push("Pin your best repositories on your GitHub profile");

    const strongest = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
      .map((r) => ({ name: r.name, stars: r.stargazers_count, language: r.language, url: r.html_url }));

    await prisma.user.update({
      where: { id: session.user.id },
      data: { githubUsername: username },
    });

    for (const lang of topLanguages) {
      await prisma.userSkill.upsert({
        where: { userId_name: { userId: session.user.id, name: lang } },
        update: { isCurrent: true },
        create: { userId: session.user.id, name: lang, proficiency: "Intermediate", isCurrent: true },
      });
    }

    return NextResponse.json({
      username,
      totalRepos: repos.length,
      languages: topLanguages,
      strongestProjects: strongest,
      suggestions,
      activityScore: Math.min(100, repos.length * 10 + strongest.reduce((a, r) => a + r.stars * 2, 0)),
    });
  } catch {
    return NextResponse.json({ error: "Failed to analyze GitHub profile" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { githubUsername: true },
  });

  return NextResponse.json({ githubUsername: user?.githubUsername });
}
