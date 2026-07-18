"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Circle, Clock, Sparkles, Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, ProgressBar } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  order: number;
  difficulty: string;
  estimatedHours: number;
  resources: string;
  projects: string;
  completed: boolean;
}

export default function RoadmapPage() {
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function loadRoadmap() {
    fetch("/api/roadmap/generate").then((r) => r.json()).then(setSteps);
  }

  useEffect(() => { loadRoadmap(); }, []);

  async function generateRoadmap() {
    setGenerating(true);
    await fetch("/api/roadmap/generate", { method: "POST" });
    loadRoadmap();
    setGenerating(false);
  }

  async function toggleStep(id: string, completed: boolean) {
    await fetch("/api/roadmap/generate", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    loadRoadmap();
  }

  const completed = steps.filter((s) => s.completed).length;
  const progress = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <div>
      <DashboardHeader
        title="Career Roadmap"
        description="Your personalized step-by-step learning path"
      />

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Progress: {completed}/{steps.length} steps</CardTitle>
            <ProgressBar value={progress} className="mt-3 w-64" />
          </div>
          <Button onClick={generateRoadmap} disabled={generating}>
            {generating ? (
              <><Loader2 size={16} className="animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={16} /> {steps.length > 0 ? "Regenerate" : "Generate"} Roadmap</>
            )}
          </Button>
        </div>
      </Card>

      {steps.length === 0 ? (
        <Card className="text-center py-12">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <CardTitle>No roadmap yet</CardTitle>
          <CardDescription className="mb-4">Generate a personalized roadmap based on your career goal</CardDescription>
          <Button onClick={generateRoadmap} disabled={generating}>Generate Roadmap</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {steps.map((step) => {
            const resources = JSON.parse(step.resources || "[]");
            const projects = JSON.parse(step.projects || "[]");
            const isExpanded = expanded === step.id;

            return (
              <Card
                key={step.id}
                className={cn(
                  "cursor-pointer transition-colors",
                  step.completed && "border-emerald-500/30 bg-emerald-500/5"
                )}
                onClick={() => setExpanded(isExpanded ? null : step.id)}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleStep(step.id, step.completed); }}
                    className="mt-1 shrink-0"
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs text-slate-500">Step {step.order}</span>
                      <Badge variant="proficiency" proficiency={step.difficulty}>{step.difficulty}</Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> {step.estimatedHours}h
                      </span>
                    </div>
                    <h3 className={cn("font-semibold", step.completed ? "text-slate-400 line-through" : "text-white")}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{step.description}</p>

                    {isExpanded && (
                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-slate-300 mb-2">Resources</p>
                          <ul className="space-y-1">
                            {resources.map((r: string) => (
                              <li key={r} className="text-sm text-slate-400">• {r}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-300 mb-2">Practice Projects</p>
                          <ul className="space-y-1">
                            {projects.map((p: string) => (
                              <li key={p} className="text-sm text-slate-400">• {p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
