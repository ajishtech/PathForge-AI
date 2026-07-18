"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Circle, Plus, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  function loadGoals() {
    fetch("/api/goals").then((r) => r.json()).then(setGoals);
  }

  useEffect(() => { loadGoals(); }, []);

  async function generateGoals() {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate" }),
    });
    const data = await res.json();
    setGoals(data);
  }

  async function toggleGoal(id: string, completed: boolean) {
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id, completed: !completed }),
    });
    loadGoals();
  }

  async function addGoal() {
    if (!newGoal.trim()) return;
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newGoal }),
    });
    setNewGoal("");
    setShowAdd(false);
    loadGoals();
  }

  const completed = goals.filter((g) => g.completed).length;

  return (
    <div>
      <DashboardHeader
        title="Daily Goals"
        description={`${completed}/${goals.length} completed today`}
      />

      <div className="flex gap-3 mb-6">
        <Button onClick={generateGoals}>
          <Sparkles size={16} /> Generate Daily Goals
        </Button>
        <Button variant="secondary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} /> Add Custom Goal
        </Button>
      </div>

      {showAdd && (
        <Card className="mb-4">
          <div className="flex gap-2">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter your goal..."
              onKeyDown={(e) => e.key === "Enter" && addGoal()}
            />
            <Button onClick={addGoal}>Add</Button>
          </div>
        </Card>
      )}

      {goals.length === 0 ? (
        <Card className="text-center py-12">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <CardTitle>No goals for today</CardTitle>
          <p className="text-slate-400 mt-2 mb-4">Generate AI-powered daily goals or add your own</p>
          <Button onClick={generateGoals}>Generate Goals</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className={cn(
                "flex items-center gap-4 cursor-pointer transition-colors",
                goal.completed && "border-emerald-500/30 bg-emerald-500/5"
              )}
              onClick={() => toggleGoal(goal.id, goal.completed)}
            >
              {goal.completed ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 shrink-0" />
              )}
              <div>
                <p className={cn("font-medium", goal.completed ? "text-slate-400 line-through" : "text-white")}>
                  {goal.title}
                </p>
                {goal.description && (
                  <p className="text-sm text-slate-500">{goal.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
