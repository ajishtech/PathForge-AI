"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge, ProgressBar } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SkillData {
  careerGoal: string;
  currentSkills: Array<{ id: string; name: string; proficiency: string }>;
  missingSkills: string[];
  matchPercentage: number;
}

export default function SkillsPage() {
  const [data, setData] = useState<SkillData | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  function loadSkills() {
    fetch("/api/skills/analyze").then((r) => r.json()).then(setData);
  }

  useEffect(() => { loadSkills(); }, []);

  async function addSkill() {
    if (!newSkill.trim()) return;
    await fetch("/api/skills/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSkill, proficiency: "Beginner" }),
    });
    setNewSkill("");
    setShowAdd(false);
    loadSkills();
  }

  async function removeSkill(name: string) {
    await fetch("/api/skills/analyze", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    loadSkills();
  }

  return (
    <div>
      <DashboardHeader
        title="Skill Analysis"
        description={`Skill match for ${data?.careerGoal || "your career goal"}`}
      />

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle>Match Score</CardTitle>
            <p className="text-4xl font-bold text-white mt-2">{data?.matchPercentage || 0}%</p>
          </div>
          <div className="w-48">
            <ProgressBar value={data?.matchPercentage || 0} className="h-3" />
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Current Skills</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(!showAdd)}>
              <Plus size={16} /> Add
            </Button>
          </div>

          {showAdd && (
            <div className="flex gap-2 mb-4">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Skill name"
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <Button size="sm" onClick={addSkill}>Add</Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {data?.currentSkills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-1">
                <Badge variant="proficiency" proficiency={skill.proficiency}>
                  {skill.name}
                </Badge>
                <button
                  onClick={() => removeSkill(skill.name)}
                  className="text-slate-600 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {(!data?.currentSkills || data.currentSkills.length === 0) && (
              <p className="text-sm text-slate-500">Upload a resume or add skills manually</p>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Missing Skills</CardTitle>
          <p className="text-sm text-slate-400 mb-4">Skills to learn for your target role</p>
          <div className="flex flex-wrap gap-2">
            {data?.missingSkills.map((skill) => (
              <Badge key={skill} variant="warning">{skill}</Badge>
            ))}
            {(!data?.missingSkills || data.missingSkills.length === 0) && (
              <p className="text-sm text-emerald-400">Great job! You have all required skills.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
