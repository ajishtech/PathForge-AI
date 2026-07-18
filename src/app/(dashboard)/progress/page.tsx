"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProgressData {
  careerGoal: string;
  skillCount: number;
  roadmapProgress: number;
  completedSteps: number;
  totalSteps: number;
  completedCourses: number;
  totalCourses: number;
  completedGoals: number;
  weeklyHours: number;
  studyByDay: Record<string, number>;
  interviewReadiness: number;
  streak: number;
  achievements: Array<{ title: string; badge: string }>;
}

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c084fc"];

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [hours, setHours] = useState("1");

  function loadProgress() {
    fetch("/api/progress").then((r) => r.json()).then(setData);
  }

  useEffect(() => { loadProgress(); }, []);

  async function logStudy() {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours: parseFloat(hours) }),
    });
    loadProgress();
  }

  const studyData = data?.studyByDay
    ? Object.entries(data.studyByDay).map(([day, hours]) => ({ day, hours }))
    : [];

  const pieData = [
    { name: "Roadmap", value: data?.roadmapProgress || 0 },
    { name: "Courses", value: data?.totalCourses ? Math.round((data.completedCourses / data.totalCourses) * 100) : 0 },
    { name: "Interview", value: data?.interviewReadiness || 0 },
    { name: "Goals", value: Math.min(100, (data?.completedGoals || 0) * 10) },
  ];

  return (
    <div>
      <DashboardHeader
        title="Progress Tracker"
        description="Monitor your learning journey and achievements"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Skills Learned", value: data?.skillCount || 0 },
          { label: "Roadmap Steps", value: `${data?.completedSteps || 0}/${data?.totalSteps || 0}` },
          { label: "Courses Done", value: data?.completedCourses || 0 },
          { label: "Day Streak", value: data?.streak || 0 },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardTitle>Weekly Study Hours</CardTitle>
          <div className="h-64 mt-4">
            {studyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                Log study hours to see your chart
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Overall Progress</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <CardTitle>Log Study Session</CardTitle>
        <div className="flex gap-3 mt-4">
          <Input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            min="0.5"
            step="0.5"
            className="w-32"
          />
          <Button onClick={logStudy}>Log Hours</Button>
        </div>
      </Card>

      <Card>
        <CardTitle>Milestones</CardTitle>
        <div className="space-y-4 mt-4">
          {[
            { label: "Roadmap Completion", value: data?.roadmapProgress || 0 },
            { label: "Interview Readiness", value: data?.interviewReadiness || 0 },
            { label: "Weekly Goal (10h)", value: Math.min(100, ((data?.weeklyHours || 0) / 10) * 100) },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">{m.label}</span>
                <span className="text-white">{Math.round(m.value)}%</span>
              </div>
              <ProgressBar value={m.value} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
