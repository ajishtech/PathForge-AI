import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not defined in environment variables" }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // List available models to check what the API supports
    const listResponse = await ai.models.list();
    const models = listResponse.page?.map((m) => ({
      name: m.name,
      displayName: m.displayName,
      supportedActions: m.supportedActions,
    })) || [];

    return NextResponse.json({
      status: "success",
      modelsAvailable: models,
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
