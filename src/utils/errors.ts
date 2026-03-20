import type { ZodError } from "zod";

import { AppError } from "@/types/errors";

type ApiType = "geocoding" | "forecast";
type CodeData = {
  code: "GEOCODING_FAILED" | "FORECAST_FAILED";
  name: string;
  dataName: string;
};

const API_CONFIG: Record<ApiType, CodeData> = {
  geocoding: {
    code: "GEOCODING_FAILED",
    name: "Geocoding",
    dataName: "city",
  },
  forecast: { code: "FORECAST_FAILED", name: "Forecast", dataName: "weather" },
};

const ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid search query...",
  401: "API authentication failed. Try again later...",
  403: "API authentication failed. Try again later...",
  429: "Too many requests. Wait a moment and try again...",
};

export function throwResponseErrors(status: number, apiType: ApiType): never {
  const { code, name, dataName } = API_CONFIG[apiType];

  if (status >= 500 && status <= 504)
    throw new AppError(
      code,
      `${name} service is temporarily unavailable. Try again later...`,
    );

  const message =
    ERROR_MESSAGES[status] ??
    `Failed to fetch ${dataName} data (status: ${status}). Try again later...`;
  throw new AppError(code, message);
}

export function throwZodErrors(error: ZodError): never {
  const issue = error.issues[0];
  const message = `${issue.path.join(".")}: ${issue.message}`.replace(
    /invalid input: /i,
    "",
  );
  throw new AppError("VALIDATION_ERROR", `Data validation failed: ${message}`);
}
