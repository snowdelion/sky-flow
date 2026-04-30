import { streamText } from "ai";
import { NextRequest } from "next/server";
import { POST } from "./route";

// --- 1. mocks ---
vi.mock("ai", () => ({
  streamText: vi.fn().mockReturnValue({
    toTextStreamResponse: () => new Response("Mocked AI stream"),
  }),
}));

vi.mock("@ai-sdk/groq", () => ({
  groq: vi.fn(),
}));

// --- 2. tests ---
describe("POST /api/ai/location", () => {
  const ENDPOINT = "http://localhost/api/ai/weather";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call streamText with correct prompt", async () => {
    const data = {
      city: "Warsaw",
      country: "Poland",
      region: "Masovian",
      lat: 52,
      lon: 21,
      temperature: 10,
      condition: "sunny",
    };
    const req = new NextRequest(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        temperature: 0.7,
        maxOutputTokens: 150,
        prompt: expect.stringContaining("Warsaw, Poland, Masovian"),
      }),
    );
  });

  it("should return 500 when is a JSON parsing error", async () => {
    const req = new NextRequest(ENDPOINT, {
      method: "POST",
      body: "invalid json",
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to generate weather description");
  });

  it("should correct work without region/country", async () => {
    const data = {
      city: "Warsaw",
      lat: 52,
      lon: 21,
      temperature: 10,
      condition: "sunny",
    };
    const req = new NextRequest(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data),
    });
    await POST(req);

    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining(
          "Warsaw (52 latitude and 21 longitude)",
        ),
      }),
    );
  });
});
