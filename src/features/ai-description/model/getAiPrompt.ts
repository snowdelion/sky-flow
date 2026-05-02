import "server-only";
import type { ServerRequestData } from "./types";

export function getAiPrompt(data: ServerRequestData) {
  const { city, country, region, lat, lon, option, temperature, condition } =
    data;

  const parts = [city, region !== city && region, country !== city && country];
  const location = parts.filter(Boolean).join(", ");
  const coords = `${lat} latitude and ${lon} longitude`;

  const locationPrompt = `
     You are an friendly expert local guide and urban historian. 
     Tell one surprising, little-known, or unique fact about ${location} (${coords} but don't mention coords in your answer).
     Focus on quirky history, hidden architecture, or unusual local traditions.
     Type in lively and conversational style (as if talking to a friend).
     Keep it to 2-3 engaging sentences in English. 
     Use a friendly emoji at the end.`.trim();

  const weatherPrompt = `
     You are a friendly meteorologist.
     Write a short (1-2 sentences), warm, and lively
     description of the weather in ${location} (${coords} but don't mention coords in your answer) in English.
     It's ${temperature}°C now, it's ${condition} outside.
     Type in lively and conversational style (as if talking to a friend).
     Give some advice on the current weather.
     Use friendly emoji at the end.`.trim();

  const prompts = {
    location: locationPrompt,
    weather: weatherPrompt,
  };

  return prompts[option];
}
