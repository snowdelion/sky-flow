import { AppError } from "@/types/errors";

export function throwResponseErrors(
  status: number,
  apiType: "geocoding" | "forecast",
): never {
  const codeData = API_NAMES[apiType];
  const { code, name, dataName } = codeData;

  switch (status) {
    case 400:
      throw new AppError(code, "Invalid search query...");
    case 401:
    case 403:
      throw new AppError(code, "API authentication failed. Try again later...");
    case 429:
      throw new AppError(
        code,
        "Too many requests. Wait a moment and try again...",
      );
    case 500:
    case 502:
    case 503:
    case 504:
      throw new AppError(
        code,
        `${name} service is temporarily unavailable. Try again later...`,
      );
    default:
      throw new AppError(
        code,
        `Failed to fetch ${dataName} data (status: ${status}). Try again later...`,
      );
  }
}

type ApiType = "geocoding" | "forecast";

const API_NAMES: Record<
  ApiType,
  {
    code: "GEOCODING_FAILED" | "FORECAST_FAILED";
    name: string;
    dataName: string;
  }
> = {
  geocoding: {
    code: "GEOCODING_FAILED",
    name: "Geocoding",
    dataName: "city",
  },
  forecast: { code: "FORECAST_FAILED", name: "Forecast", dataName: "weather" },
};
