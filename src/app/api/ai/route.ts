import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getAiConfig } from "@/features/ai-description/server";
import { createRateLimitResponse } from "@/shared/api/rate-limit";
import { checkRatelimit } from "@/shared/lib/ratelimit";

const schema = z.object({
  option: z.enum(["location", "weather"]),
  city: z.string(),
  country: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  temperature: z.number().optional(),
  condition: z.string().optional(),
});

export const maxDuration = 30;
export async function POST(req: NextRequest) {
  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  const limitResult = await checkRatelimit(ip);

  if (!limitResult.success) return createRateLimitResponse(limitResult);

  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success)
      return NextResponse.json(
        { error: "Invalid data", code: "INVALID_REQUEST_DATA" },
        { status: 400 },
      );

    const config = getAiConfig(result.data);

    const streamResult = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: config.system,
      prompt: config.prompt,
      temperature: config.temperature,
      maxOutputTokens: 150,
    });

    return streamResult.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate description",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
