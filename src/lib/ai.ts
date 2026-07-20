import { GoogleGenAI } from "@google/genai";
import { CareerRole, ROLE_SKILLS } from "./career-data";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export interface ParsedResume {
  skills: string[];
  education: Array<{ degree: string; institution: string; year?: string }>;
  experience: Array<{ title: string; company: string; duration?: string; description?: string }>;
  certifications: string[];
  projects: Array<{ name: string; description?: string; technologies?: string[] }>;
  keywords: string[];
}

export interface SkillAnalysis {
  currentSkills: Array<{ name: string; proficiency: string }>;
  missingSkills: string[];
  matchPercentage: number;
}

export interface InterviewQuestion {
  question: string;
  type: string;
  difficulty: string;
  suggestedAnswer?: string;
}

async function callAI(prompt: string, systemPrompt: string): Promise<string> {
  if (!ai) {
    throw new Error("NO_AI_KEY");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  return response.text || "{}";
}

export async function parseResumeWithAI(text: string): Promise<ParsedResume> {
  const systemPrompt = `You are a resume parser. Extract structured data from resumes. Return JSON with keys: skills (string[]), education ({degree, institution, year}[]), experience ({title, company, duration, description}[]), certifications (string[]), projects ({name, description, technologies}[]), keywords (string[]).`;

  try {
    const result = await callAI(text.slice(0, 8000), systemPrompt);
    return JSON.parse(result);
  } catch {
    return parseResumeLocally(text);
  }
}

export function parseResumeLocally(text: string): ParsedResume {
  const lowerText = text.toLowerCase();
  const allSkills = Object.values(ROLE_SKILLS).flat();
  const uniqueSkills = [...new Set(allSkills)];

  const foundSkills = uniqueSkills.filter((skill) =>
    lowerText.includes(skill.toLowerCase())
  );

  const techKeywords = [
    "javascript", "python", "react", "node", "docker", "aws", "sql",
    "mongodb", "typescript", "git", "html", "css", "java", "kubernetes",
    "graphql", "redis", "postgresql", "express", "next.js", "vue", "angular",
  ].filter((kw) => lowerText.includes(kw));

  return {
    skills: foundSkills.length > 0 ? foundSkills : ["JavaScript", "HTML", "CSS"],
    education: [{ degree: "Detected from resume", institution: "See resume", year: "" }],
    experience: [{ title: "See resume for details", company: "Parsed from upload", duration: "" }],
    certifications: [],
    projects: [{ name: "Projects listed in resume", description: "Review uploaded resume" }],
    keywords: techKeywords,
  };
}

export function analyzeSkills(
  userSkills: string[],
  careerGoal: CareerRole
): SkillAnalysis {
  const requiredSkills = ROLE_SKILLS[careerGoal] || ROLE_SKILLS["Full-Stack Developer"];
  const normalizedUser = userSkills.map((s) => s.toLowerCase());

  const currentSkills = userSkills.map((name) => ({
    name,
    proficiency: normalizedUser.includes(name.toLowerCase()) ? "Intermediate" : "Beginner",
  }));

  const missingSkills = requiredSkills.filter(
    (skill) => !normalizedUser.some((us) => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))
  );

  const matched = requiredSkills.length - missingSkills.length;
  const matchPercentage = Math.round((matched / requiredSkills.length) * 100);

  return { currentSkills, missingSkills, matchPercentage };
}

export async function generateInterviewQuestions(
  role: string,
  type: string,
  count: number = 5
): Promise<InterviewQuestion[]> {
  const systemPrompt = `Generate ${count} ${type} interview questions for a ${role} position. Return JSON with key "questions" containing array of {question, type, difficulty, suggestedAnswer}.`;

  try {
    const result = await callAI(`Generate ${count} questions`, systemPrompt);
    const parsed = JSON.parse(result);
    return parsed.questions || parsed;
  } catch {
    return getDefaultInterviewQuestions(role, type, count);
  }
}

export function getDefaultInterviewQuestions(
  role: string,
  type: string,
  count: number
): InterviewQuestion[] {
  const technical: InterviewQuestion[] = [
    { question: "Explain the difference between let, const, and var in JavaScript.", type: "technical", difficulty: "Beginner", suggestedAnswer: "let and const are block-scoped (ES6), var is function-scoped. const cannot be reassigned." },
    { question: "What is the virtual DOM in React and why is it useful?", type: "technical", difficulty: "Intermediate", suggestedAnswer: "The virtual DOM is a lightweight copy of the actual DOM. React compares virtual DOM snapshots to minimize expensive DOM updates." },
    { question: "Explain RESTful API design principles.", type: "technical", difficulty: "Intermediate", suggestedAnswer: "Use HTTP methods correctly, resource-based URLs, stateless communication, and proper status codes." },
    { question: "How would you optimize a slow database query?", type: "technical", difficulty: "Advanced", suggestedAnswer: "Add indexes, analyze query plans, normalize/denormalize appropriately, use caching, and optimize JOIN operations." },
    { question: "Describe how authentication works with JWT tokens.", type: "technical", difficulty: "Intermediate", suggestedAnswer: "JWT contains encoded user claims signed with a secret. Server verifies signature on each request without session storage." },
  ];

  const hr: InterviewQuestion[] = [
    { question: "Tell me about yourself and your career journey.", type: "hr", difficulty: "Beginner", suggestedAnswer: "Focus on relevant experience, key achievements, and why you're interested in this role." },
    { question: "Describe a challenging project and how you handled it.", type: "hr", difficulty: "Intermediate", suggestedAnswer: "Use STAR method: Situation, Task, Action, Result." },
    { question: "Where do you see yourself in 5 years?", type: "hr", difficulty: "Beginner", suggestedAnswer: "Align your goals with the company's growth and show commitment to continuous learning." },
    { question: "How do you handle disagreements with team members?", type: "hr", difficulty: "Intermediate", suggestedAnswer: "Emphasize communication, empathy, data-driven decisions, and finding common ground." },
    { question: "Why do you want to work as a " + role + "?", type: "hr", difficulty: "Beginner", suggestedAnswer: "Connect your passion, skills, and the company's mission." },
  ];

  const coding: InterviewQuestion[] = [
    { question: "Write a function to reverse a string without using built-in reverse methods.", type: "coding", difficulty: "Beginner", suggestedAnswer: "Use a loop or two-pointer approach to swap characters." },
    { question: "Implement a function to check if a string is a palindrome.", type: "coding", difficulty: "Beginner", suggestedAnswer: "Compare characters from both ends moving inward." },
    { question: "Find the two numbers in an array that add up to a target sum.", type: "coding", difficulty: "Intermediate", suggestedAnswer: "Use a hash map to store complements for O(n) time complexity." },
    { question: "Implement a debounce function.", type: "coding", difficulty: "Intermediate", suggestedAnswer: "Use setTimeout/clearTimeout to delay function execution until after wait period." },
    { question: "Design a rate limiter for an API.", type: "coding", difficulty: "Advanced", suggestedAnswer: "Use token bucket or sliding window algorithm with Redis for distributed rate limiting." },
  ];

  const systemDesign: InterviewQuestion[] = [
    { question: "Design a URL shortening service like bit.ly.", type: "system-design", difficulty: "Advanced", suggestedAnswer: "Discuss hash generation, database schema, caching, and redirect flow." },
    { question: "How would you design a real-time chat application?", type: "system-design", difficulty: "Advanced", suggestedAnswer: "WebSockets, message queues, database for persistence, and presence detection." },
    { question: "Design a notification system for a social media app.", type: "system-design", difficulty: "Advanced", suggestedAnswer: "Event-driven architecture, push notification services, and user preference management." },
  ];

  const pools: Record<string, InterviewQuestion[]> = {
    technical,
    hr,
    coding,
    "system-design": systemDesign,
  };

  const pool = pools[type] || technical;
  return pool.slice(0, count);
}

export async function chatWithAI(
  message: string,
  context: { careerGoal: string; skills: string[]; history: Array<{ role: string; content: string }> }
): Promise<string> {
  const systemPrompt = `You are PathForge AI, a career mentor helping users become a ${context.careerGoal}. Their current skills: ${context.skills.join(", ")}. Be encouraging, specific, and actionable. Keep responses concise (2-3 paragraphs max).`;

  if (!ai) {
    return getLocalChatResponse(message, context);
  }

  try {
    const contents = [
      ...context.history.slice(-6).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return response.text || getLocalChatResponse(message, context);
  } catch (error) {
    console.error("Gemini Chat error:", error);
    return getLocalChatResponse(message, context);
  }
}

function getLocalChatResponse(
  message: string,
  context: { careerGoal: string; skills: string[] }
): string {
  const lower = message.toLowerCase();

  if (lower.includes("learn next") || lower.includes("what should")) {
    const missing = analyzeSkills(context.skills, context.careerGoal as CareerRole);
    const next = missing.missingSkills.slice(0, 3);
    return `Based on your goal to become a ${context.careerGoal}, I recommend focusing on these skills next: ${next.join(", ")}. Start with ${next[0]} — it's foundational for your career path. Check your roadmap for structured learning steps and recommended projects!`;
  }

  if (lower.includes("interview") || lower.includes("ready")) {
    const analysis = analyzeSkills(context.skills, context.careerGoal as CareerRole);
    return `Your current skill match for ${context.careerGoal} is ${analysis.matchPercentage}%. ${analysis.matchPercentage >= 70 ? "You're getting close to interview-ready! Focus on practicing mock interviews and building portfolio projects." : "Keep building your skills — aim for 70%+ match before intensive interview prep. Your missing skills: " + analysis.missingSkills.slice(0, 5).join(", ") + "."}`;
  }

  if (lower.includes("resume")) {
    return "To improve your resume: 1) Quantify achievements with metrics, 2) Tailor skills to match job descriptions, 3) Highlight relevant projects with tech stacks, 4) Keep it to 1-2 pages, 5) Use action verbs. Upload your resume in the Resume section for AI-powered analysis!";
  }

  if (lower.includes("project")) {
    return `For a ${context.careerGoal}, I recommend building: a full-stack web app with authentication, a REST API with documentation, and a project showcasing your strongest skill (${context.skills[0] || "JavaScript"}). These demonstrate practical ability to employers.`;
  }

  if (lower.includes("docker") || lower.includes("aws")) {
    return "Learn Docker first — it's easier to grasp and immediately useful for local development and deployment. Once you're comfortable containerizing apps, move to AWS. Docker knowledge makes cloud deployment much smoother!";
  }

  return `Great question! As your AI career mentor for becoming a ${context.careerGoal}, I suggest checking your personalized roadmap and skill analysis dashboard. Your current skills (${context.skills.slice(0, 5).join(", ")}) are a solid foundation. What specific area would you like to dive deeper into?`;
}

export async function generatePortfolioContent(
  name: string,
  skills: string[],
  projects: string[],
  bio?: string
): Promise<{ headline: string; about: string; projectDescriptions: Array<{ title: string; description: string }> }> {
  const systemPrompt = "Generate portfolio content. Return JSON with headline (string), about (string), projectDescriptions ({title, description}[]).";

  try {
    const result = await callAI(
      `Name: ${name}, Skills: ${skills.join(", ")}, Projects: ${projects.join(", ")}, Bio: ${bio || ""}`,
      systemPrompt
    );
    return JSON.parse(result);
  } catch {
    return {
      headline: `${name} — Aspiring ${skills[0] ? skills[0] + " Developer" : "Developer"}`,
      about: bio || `Passionate developer skilled in ${skills.slice(0, 5).join(", ")}. Always learning and building impactful projects.`,
      projectDescriptions: projects.map((p) => ({
        title: p,
        description: `A project showcasing skills in ${skills.slice(0, 3).join(", ")}.`,
      })),
    };
  }
}

export async function evaluateInterviewAnswer(
  question: string,
  answer: string
): Promise<{ score: number; feedback: string }> {
  const systemPrompt = "Evaluate the interview answer. Return JSON with score (0-100) and feedback (string with strengths and improvements).";

  try {
    const result = await callAI(`Question: ${question}\nAnswer: ${answer}`, systemPrompt);
    return JSON.parse(result);
  } catch {
    const wordCount = answer.split(/\s+/).length;
    const score = Math.min(100, Math.max(30, wordCount * 3));
    return {
      score,
      feedback: wordCount < 20
        ? "Your answer is too brief. Expand with specific examples and use the STAR method."
        : "Good effort! Add more specific metrics and concrete examples to strengthen your response.",
    };
  }
}
