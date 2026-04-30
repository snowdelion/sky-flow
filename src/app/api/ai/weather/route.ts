import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { city, country, region, lat, lon, temperature, condition } =
      await req.json();

    const location = `${city}${country ? `, ${country}` : ""}${region ? `, ${region}` : ""}`;
    const coords = `${lat} latitude and ${lon} longitude`;

    const prompt = `
      You are a friendly meteorologist.
      Write a short (1-2 sentences), warm, and lively
      description of the weather in ${location} (${coords}) in English.
      It's ${temperature}°C now, it's ${condition} outside.
      Give some advice on the current weather.
      Use friendly emoji at the end`;

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: "You are a professional and friendly meteorologist.",
      prompt,
      temperature: 0.7,
      maxOutputTokens: 150,
    });

    return result.toTextStreamResponse();
  } catch {
    return NextResponse.json(
      { error: "Failed to generate weather description" },
      { status: 500 },
    );
  }
}
