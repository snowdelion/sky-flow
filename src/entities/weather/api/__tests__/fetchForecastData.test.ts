import { http, HttpResponse } from "msw";
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

    await expect(fetchForecastData(city)).rejects.toThrow(/coords not found/i);
  });

  it("should throw AppError when cityData is invalid", async () => {
    const invalidCityData = {
      status: "found",
      city: undefined,
      lat: undefined,
      lon: undefined,
    } as unknown as CityData;

    await expect(fetchForecastData(invalidCityData)).rejects.toThrow(
      /coords not found/i,
    );
  });

  it("should throw AppError if API returns null", async () => {
    server.use(http.get("/api/forecast", () => HttpResponse.json(null)));

    await expect(fetchForecastData(cityData)).rejects.toThrow(/no data/i);
  });

  it("should catch and handle unexpected errors", async () => {
    server.use(
      http.get("/api/forecast", () => new HttpResponse(null, { status: 500 })),
    );

    await expect(fetchForecastData(cityData)).rejects.toThrow();
  });
});
