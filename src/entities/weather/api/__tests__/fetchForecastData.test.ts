import { http, HttpResponse } from "msw";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import { server } from "@/shared/lib/testing";
import type { CityData } from "@/shared/types";
import { fetchForecastData } from "../fetchForecastData";

describe("fetchForecastData", () => {
  const cityData: CityData = {
    status: "found",
    city: "Warsaw",
    lat: 10,
    lon: 20,
  };

  it("should throw AppError when cityData is 'not-found'", async () => {
    const city: CityData = { status: "not-found", city: "Unknown" };

    await expect(
      fetchForecastData({ cityData: city, units: DEFAULT_UNITS }),
    ).rejects.toThrow(/coords not found/i);
  });

  it("should throw AppError when cityData is invalid", async () => {
    const invalidCityData = {
      status: "found",
      city: undefined,
      lat: undefined,
      lon: undefined,
    } as unknown as CityData;

    await expect(
      fetchForecastData({ cityData: invalidCityData, units: DEFAULT_UNITS }),
    ).rejects.toThrow(/coords not found/i);
  });

  it("should throw AppError if API returns null", async () => {
    server.use(http.get("/api/forecast", () => HttpResponse.json(null)));

    await expect(
      fetchForecastData({ cityData, units: DEFAULT_UNITS }),
    ).rejects.toThrow(/validation failed/i);
    await expect(
      fetchForecastData({ cityData, units: DEFAULT_UNITS }),
    ).rejects.toThrow(/expected/i);
    await expect(
      fetchForecastData({ cityData, units: DEFAULT_UNITS }),
    ).rejects.toThrow(/received/i);
  });

  it("should catch and handle unexpected errors", async () => {
    server.use(
      http.get("/api/forecast", () => new HttpResponse(null, { status: 500 })),
    );

    await expect(
      fetchForecastData({ cityData, units: DEFAULT_UNITS }),
    ).rejects.toThrow();
  });
});
