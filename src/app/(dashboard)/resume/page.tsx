"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ParsedData {
  skills: string[];
  education: Array<{ degree: string; institution: string }>;
  experience: Array<{ title: string; company: string }>;
  projects: Array<{ name: string; description?: string }>;
}

export default function ResumePage() {
  const [uploading, setUploading] = useState(false);
  const [parsed, setParsed] = useState<ParsedData | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setParsed(data.parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <DashboardHeader
        title="Resume Upload"
        description="Upload your resume (PDF or DOCX) for AI-powered skill extraction"
      />

      <Card className="mb-6">
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-500/50 transition-colors"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleUpload}
            className="hidden"
          />
          {uploading ? (
            <Loader2 className="w-10 h-10 text-indigo-400 mx-auto mb-4 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-slate-500 mx-auto mb-4" />
          )}
          <p className="text-white font-medium">
            {uploading ? "Analyzing your resume..." : "Click to upload resume"}
          </p>
          <p className="text-sm text-slate-500 mt-1">PDF or DOCX, max 10MB</p>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </Card>

      {parsed && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Extracted Skills
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-4">
              {parsed.skills.map((skill) => (
                <Badge key={skill} variant="success">{skill}</Badge>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Education</CardTitle>
            <div className="space-y-3 mt-4">
              {parsed.education.map((edu, i) => (
                <div key={i} className="text-sm">
                  <p className="text-white font-medium">{edu.degree}</p>
                  <p className="text-slate-400">{edu.institution}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Experience</CardTitle>
            <div className="space-y-3 mt-4">
              {parsed.experience.map((exp, i) => (
                <div key={i} className="text-sm">
                  <p className="text-white font-medium">{exp.title}</p>
                  <p className="text-slate-400">{exp.company}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Projects</CardTitle>
            <div className="space-y-3 mt-4">
              {parsed.projects.map((proj, i) => (
                <div key={i} className="text-sm">
                  <p className="text-white font-medium">{proj.name}</p>
                  {proj.description && <p className="text-slate-400">{proj.description}</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
