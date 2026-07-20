import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not defined in environment variables" }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Test direct content generation
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hello! This is a connection test. Please reply with 'OK'.",
      config: {
        maxOutputTokens: 10,
      }
    });

    return NextResponse.json({
      status: "success",
      modelUsed: "gemini-1.5-flash",
      response: response.text,
    });
  } catch (error: any) {
    console.error("Gemini diagnostics failed:", error);
    return NextResponse.json({
      status: "error",
      message: error?.message || String(error),
      name: error?.name,
      apiStatus: error?.status,
      stack: error?.stack,
    }, { status: 500 });
  }
}
