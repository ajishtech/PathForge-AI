"use client";

import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const THEMES = [
  { id: "modern", name: "Modern", bg: "from-indigo-600 to-purple-600" },
  { id: "minimal", name: "Minimal", bg: "from-slate-700 to-slate-900" },
  { id: "creative", name: "Creative", bg: "from-pink-500 to-orange-500" },
];

interface PortfolioContent {
  headline: string;
  about: string;
  projectDescriptions: Array<{ title: string; description: string }>;
}

export default function PortfolioPage() {
  const [theme, setTheme] = useState("modern");
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [userData, setUserData] = useState<{ name: string; email: string; skills: string[] } | null>(null);
  const [generating, setGenerating] = useState(false);

  async function generate() {
    setGenerating(true);
    const res = await fetch("/api/portfolio/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });
    const data = await res.json();
    setContent(data.content);
    setUserData(data.user);
    setGenerating(false);
  }

  const selectedTheme = THEMES.find((t) => t.id === theme)!;

  return (
    <div>
      <DashboardHeader
        title="Portfolio Generator"
        description="AI-generated portfolio website with multiple themes"
      />

      <Card className="mb-6">
        <CardTitle className="mb-4">Choose Theme</CardTitle>
        <div className="flex gap-3 mb-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                theme === t.id
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                  : "border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <Button onClick={generate} disabled={generating}>
          {generating ? (
            <><Loader2 size={16} className="animate-spin" /> Generating...</>
          ) : (
            <><Globe size={16} /> Generate Portfolio</>
          )}
        </Button>
      </Card>

      {content && userData && (
        <div className="rounded-xl overflow-hidden border border-slate-800">
          <div className={`bg-gradient-to-r ${selectedTheme.bg} p-12 text-center`}>
            <h2 className="text-3xl font-bold text-white mb-2">{content.headline}</h2>
            <p className="text-white/80">{userData.email}</p>
          </div>

          <div className="bg-slate-900 p-8">
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">About</h3>
              <p className="text-slate-400">{content.about}</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill) => (
                  <Badge key={skill} variant="success">{skill}</Badge>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">Projects</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {content.projectDescriptions.map((proj) => (
                  <Card key={proj.title}>
                    <CardTitle className="text-base">{proj.title}</CardTitle>
                    <p className="text-sm text-slate-400 mt-2">{proj.description}</p>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
              <p className="text-slate-400">{userData.email}</p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
