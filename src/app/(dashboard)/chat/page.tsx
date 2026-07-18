"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Bot, User, Trash2, Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: string;
  content: string;
}

const SUGGESTIONS = [
  "What should I learn next?",
  "Am I ready for React interviews?",
  "How can I improve my resume?",
  "Which project should I build?",
  "Should I learn Docker or AWS first?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  function nextMessageId(role: Message["role"]) {
    messageIdRef.current += 1;
    return `${role}-${messageIdRef.current}`;
  }

  useEffect(() => {
    fetch("/api/chat").then((r) => r.json()).then(setMessages);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    setInput("");
    setLoading(true);

    const userMsg: Message = { id: nextMessageId("user"), role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { id: nextMessageId("assistant"), role: "assistant", content: data.response },
    ]);
    setLoading(false);
  }

  async function clearChat() {
    await fetch("/api/chat", { method: "DELETE" });
    setMessages([]);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <DashboardHeader
          title="AI Career Assistant"
          description="Your 24/7 career mentor powered by AI"
        />
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat}>
            <Trash2 size={14} /> Clear
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Ask me anything about your career!</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 rounded-full bg-slate-800 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-200"
                )}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-400">
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-slate-800">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your career path..."
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send size={16} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
