"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, Brain, Map, BookOpen, MessageSquare,
  TrendingUp, Globe, Code2, Bot, Shield, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "Skill Analysis", desc: "AI identifies your strengths and skill gaps for your target role" },
  { icon: Map, title: "Career Roadmap", desc: "Personalized step-by-step learning path with projects and resources" },
  { icon: BookOpen, title: "Course Recommendations", desc: "Curated courses from Coursera, Udemy, freeCodeCamp, and more" },
  { icon: MessageSquare, title: "Interview Prep", desc: "AI-generated questions with mock interviews and feedback" },
  { icon: TrendingUp, title: "Progress Tracker", desc: "Visual dashboards, streaks, and milestone achievements" },
  { icon: Globe, title: "Portfolio Generator", desc: "AI-built portfolio websites with multiple themes" },
  { icon: Code2, title: "GitHub Analysis", desc: "Analyze repos, detect languages, and get improvement tips" },
  { icon: Bot, title: "AI Career Assistant", desc: "24/7 chatbot mentor for career guidance and advice" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">PathForge AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 hero-glow">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
              <Zap size={14} />
              AI-Powered Career Mentorship
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Forge Your Path to a{" "}
              <span className="gradient-text">Dream Career</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              PathForge AI analyzes your skills, resume, and GitHub profile to generate
              a personalized roadmap that guides you to your target role.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Journey <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From skill analysis to interview prep — PathForge AI is your complete career development platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-indigo-500/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 w-fit mb-4">
                  <feature.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
          <p className="text-slate-400 mb-8">
            Join PathForge AI and get a personalized roadmap to your dream job.
          </p>
          <Link href="/register">
            <Button size="lg">
              Create Free Account <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-slate-400">PathForge AI — Your AI-powered career mentor</span>
          </div>
          <p className="text-sm text-slate-500">&copy; 2026 PathForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
