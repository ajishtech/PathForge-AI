"use client";

import { useState } from "react";
import { Code2, Loader2, Star, ExternalLink } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge, ProgressBar } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

interface GitHubAnalysis {
  username: string;
  totalRepos: number;
  languages: string[];
  strongestProjects: Array<{ name: string; stars: number; language: string; url: string }>;
  suggestions: string[];
  activityScore: number;
}

export default function GitHubPage() {
  const [username, setUsername] = useState("");
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!username.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/github/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim() }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setAnalysis(data);
    }
    setLoading(false);
  }

  return (
    <div>
      <DashboardHeader
        title="GitHub Analysis"
        description="Analyze repositories, detect languages, and get improvement suggestions"
      />

      <Card className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="username">GitHub Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="octocat"
              onKeyDown={(e) => e.key === "Enter" && analyze()}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={analyze} disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Code2 size={16} />}
              Analyze
            </Button>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </Card>

      {analysis && (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <p className="text-2xl font-bold text-white">{analysis.totalRepos}</p>
              <p className="text-sm text-slate-400">Repositories</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-white">{analysis.languages.length}</p>
              <p className="text-sm text-slate-400">Languages</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-white">{analysis.activityScore}</p>
              <p className="text-sm text-slate-400">Activity Score</p>
              <ProgressBar value={analysis.activityScore} className="mt-2" />
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardTitle>Languages Detected</CardTitle>
              <div className="flex flex-wrap gap-2 mt-4">
                {analysis.languages.map((lang) => (
                  <Badge key={lang} variant="success">{lang}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle>Suggestions</CardTitle>
              <ul className="space-y-2 mt-4">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                    <span className="text-indigo-400">→</span> {s}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="mt-6">
            <CardTitle>Top Projects</CardTitle>
            <div className="space-y-3 mt-4">
              {analysis.strongestProjects.map((proj) => (
                <div key={proj.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium text-white">{proj.name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      {proj.language && <Badge>{proj.language}</Badge>}
                      <span className="flex items-center gap-1"><Star size={12} /> {proj.stars}</span>
                    </div>
                  </div>
                  <a href={proj.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} className="text-slate-400 hover:text-white" />
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
