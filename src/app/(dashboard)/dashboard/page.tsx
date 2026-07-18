"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, Map, Flame, Trophy, TrendingUp,
} from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/badge";

interface DashboardData {
  careerGoal: string;
  skillCount: number;
  roadmapProgress: number;
  completedSteps: number;
  totalSteps: number;
  completedCourses: number;
  weeklyHours: number;
  streak: number;
  interviewReadiness: number;
  achievements: Array<{ title: string; badge: string; description: string }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [skillMatch, setSkillMatch] = useState(0);

  useEffect(() => {
    fetch("/api/progress").then((r) => r.json()).then(setData);
    fetch("/api/skills/analyze").then((r) => r.json()).then((d) => setSkillMatch(d.matchPercentage || 0));
  }, []);

  const stats = [
    { label: "Skill Match", value: `${skillMatch}%`, icon: Brain, color: "text-indigo-400" },
    { label: "Roadmap Progress", value: `${data?.roadmapProgress || 0}%`, icon: Map, color: "text-purple-400" },
    { label: "Learning Streak", value: `${data?.streak || 0} days`, icon: Flame, color: "text-orange-400" },
    { label: "Weekly Hours", value: `${data?.weeklyHours || 0}h`, icon: TrendingUp, color: "text-emerald-400" },
  ];

  const quickActions = [
    { href: "/resume", label: "Upload Resume", desc: "Extract skills from your resume", icon: "📄" },
    { href: "/roadmap", label: "View Roadmap", desc: "Your personalized learning path", icon: "🗺️" },
    { href: "/interview", label: "Practice Interview", desc: "AI-generated mock questions", icon: "💼" },
    { href: "/chat", label: "Ask AI Mentor", desc: "Get career guidance instantly", icon: "🤖" },
  ];

  return (
    <div>
      <DashboardHeader
        title={`Welcome back${data?.careerGoal ? "" : "!"}`}
        description={data?.careerGoal ? `Your goal: ${data.careerGoal}` : "Let's build your career path"}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardTitle>Career Progress</CardTitle>
          <CardDescription className="mb-4">Track your journey to becoming a {data?.careerGoal || "developer"}</CardDescription>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Skill Match</span>
                <span className="text-white">{skillMatch}%</span>
              </div>
              <ProgressBar value={skillMatch} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Roadmap Completion</span>
                <span className="text-white">{data?.completedSteps || 0}/{data?.totalSteps || 0} steps</span>
              </div>
              <ProgressBar value={data?.roadmapProgress || 0} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Interview Readiness</span>
                <span className="text-white">{data?.interviewReadiness || 0}%</span>
              </div>
              <ProgressBar value={data?.interviewReadiness || 0} />
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Achievements
          </CardTitle>
          <div className="space-y-3 mt-4">
            {data?.achievements && data.achievements.length > 0 ? (
              data.achievements.slice(0, 4).map((a) => (
                <div key={a.title} className="flex items-center gap-3">
                  <span className="text-2xl">{a.badge}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Complete tasks to earn badges!</p>
            )}
          </div>
        </Card>
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:border-indigo-500/30 transition-colors cursor-pointer h-full">
              <span className="text-2xl mb-2 block">{action.icon}</span>
              <p className="font-medium text-white">{action.label}</p>
              <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
