"use client";

import { useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge, ProgressBar } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea, Select } from "@/components/ui/input";

interface Question {
  question: string;
  type: string;
  difficulty: string;
  suggestedAnswer?: string;
}

export default function InterviewPage() {
  const [type, setType] = useState("technical");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [sessionId, setSessionId] = useState("");

  async function generateQuestions() {
    setLoading(true);
    setFeedback(null);
    setCurrentQ(0);
    setAnswer("");

    const res = await fetch("/api/interview/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, count: 5 }),
    });
    const data = await res.json();
    setQuestions(data.questions);
    setSessionId(data.sessionId);
    setLoading(false);
  }

  async function submitAnswer() {
    if (!answer.trim() || !questions[currentQ]) return;
    setEvaluating(true);

    const res = await fetch("/api/interview/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "evaluate",
        question: questions[currentQ].question,
        answer,
        sessionId,
      }),
    });
    const data = await res.json();
    setFeedback(data);
    setEvaluating(false);
  }

  function nextQuestion() {
    setCurrentQ((q) => q + 1);
    setAnswer("");
    setFeedback(null);
  }

  return (
    <div>
      <DashboardHeader
        title="Interview Preparation"
        description="AI-generated questions with feedback on your answers"
      />

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Question Type</label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="technical">Technical</option>
              <option value="hr">HR / Behavioral</option>
              <option value="coding">Coding Challenges</option>
              <option value="system-design">System Design</option>
            </Select>
          </div>
          <Button onClick={generateQuestions} disabled={loading}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : "Start Mock Interview"}
          </Button>
        </div>
      </Card>

      {questions.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <Badge>Question {currentQ + 1} of {questions.length}</Badge>
            <Badge variant="proficiency" proficiency={questions[currentQ]?.difficulty}>
              {questions[currentQ]?.difficulty}
            </Badge>
          </div>

          {currentQ < questions.length ? (
            <>
              <CardTitle className="mb-4 flex items-start gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                {questions[currentQ].question}
              </CardTitle>

              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={5}
                className="mb-4"
              />

              {!feedback ? (
                <Button onClick={submitAnswer} disabled={evaluating || !answer.trim()}>
                  {evaluating ? "Evaluating..." : "Submit Answer"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Score</span>
                      <span className="text-white font-bold">{feedback.score}/100</span>
                    </div>
                    <ProgressBar value={feedback.score} />
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-sm text-slate-300">{feedback.feedback}</p>
                  </div>
                  {questions[currentQ].suggestedAnswer && (
                    <details className="text-sm">
                      <summary className="text-indigo-400 cursor-pointer">View suggested answer</summary>
                      <p className="text-slate-400 mt-2">{questions[currentQ].suggestedAnswer}</p>
                    </details>
                  )}
                  <Button onClick={nextQuestion}>
                    {currentQ + 1 < questions.length ? "Next Question" : "Finish"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl font-bold text-white mb-2">Interview Complete!</p>
              <p className="text-slate-400 mb-4">Great practice session. Keep going!</p>
              <Button onClick={generateQuestions}>Start New Session</Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
