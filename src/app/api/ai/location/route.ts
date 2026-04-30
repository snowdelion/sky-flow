import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { city, country, region, lat, lon } = await req.json();

    const location = `${city}${country ? `, ${country}` : ""}${region ? `, ${region}` : ""}`;
    const coords = `${lat} latitude and ${lon} longitude`;

    const prompt = `
      You are an friendly expert local guide and urban historian. 
      Tell one surprising, little-known, or unique fact about ${location} (${coords}). 
      Focus on quirky history, hidden architecture, or unusual local traditions. 
      Keep it to 2-3 engaging sentences in English. 
      Use a friendly emoji at the end.`;

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: "You are a professional local guide and historian.",
      prompt,
      temperature: 0.9,
      maxOutputTokens: 150,
    });

    return result.toTextStreamResponse();
  } catch {
    return NextResponse.json(
      { error: "Failed to generate location description" },
      { status: 500 },
    );
  }
}
