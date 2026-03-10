import { AppError } from "@/types/errors";

import { throwResponseErrors } from "./throwResponseErrors";

describe("throwResponseErrors", () => {
  const cases: TestCase[] = [
    {
      status: 400,
      apiType: "geocoding",
      code: "GEOCODING_FAILED",
      message: "Invalid search query...",
    },
    {
      status: 403,
      apiType: "geocoding",
      code: "GEOCODING_FAILED",
      message: "API authentication failed. Try again later...",
    },
    {
      status: 429,
      apiType: "geocoding",
      code: "GEOCODING_FAILED",
      message: "Too many requests. Wait a moment and try again...",
    },
    {
      status: 500,
      apiType: "geocoding",
      code: "GEOCODING_FAILED",
      message:
        "Geocoding service is temporarily unavailable. Try again later...",
    },
    {
      status: 1000,
      apiType: "geocoding",
      code: "GEOCODING_FAILED",
      message: "Failed to fetch city data (status: 1000). Try again later...",
    },

    {
      status: 400,
      apiType: "forecast",
      code: "FORECAST_FAILED",
      message: "Invalid search query...",
    },
    {
      status: 403,
      apiType: "forecast",
      code: "FORECAST_FAILED",
      message: "API authentication failed. Try again later...",
    },
    {
      status: 429,
      apiType: "forecast",
      code: "FORECAST_FAILED",
      message: "Too many requests. Wait a moment and try again...",
    },
    {
      status: 500,
      apiType: "forecast",
      code: "FORECAST_FAILED",
      message:
        "Forecast service is temporarily unavailable. Try again later...",
    },
    {
      status: 1000,
      apiType: "forecast",
      code: "FORECAST_FAILED",
      message:
        "Failed to fetch weather data (status: 1000). Try again later...",
    },
  ];

  test.each(cases)(
    "should throw correct errors",
    ({ status, apiType, code, message }) => {
      expect.assertions(3);

      try {
        throwResponseErrors(status, apiType);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe(message);
        expect((error as AppError).code).toBe(code);
      }
    },
  );
});

interface TestCase {
  status: number;
  apiType: "geocoding" | "forecast";
  code: "GEOCODING_FAILED" | "FORECAST_FAILED";
  message: string;
}
