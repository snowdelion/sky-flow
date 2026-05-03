import "server-only";
import { getAiPrompt } from "./getAiPrompt";
import type { ServerRequestData } from "./types";

export function getAiConfig(data: ServerRequestData) {
  const optionConfig: OptionConfig = {
    location: {
      system: "You are a professional and friendly local guide and historian",
      prompt: getAiPrompt(data),
      temperature: 0.9,
    },
    weather: {
      system: "You are a professional and friendly meteorologist",
      prompt: getAiPrompt(data),
      temperature: 0.7,
    },
  };

  return optionConfig[data.option];
}

type OptionConfig = {
  location: {
    system: string;
    prompt: string;
    temperature: number;
  };
  weather: {
    system: string;
    prompt: string;
    temperature: number;
  };
};
