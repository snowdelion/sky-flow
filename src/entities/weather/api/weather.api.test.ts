import { http, HttpResponse } from "msw";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import { createGeoData, createResultsMocks } from "@/shared/lib/testing";
import { server } from "@/shared/lib/testing";
import type { CityData, Geo } from "@/shared/types";
import { fetchForecastData, fetchSearchResults } from "./weather.api";

describe("fetchSearchResults", () => {
  const geoData = createGeoData();
  const [searchData] = createResultsMocks();

  it("should fetch city with search result", async () => {
    const result = await fetchSearchResults(geoData, DEFAULT_UNITS);

    expect(result?.[0]).toEqual(searchData[0]);

    expect(result?.at(-1)).toEqual(searchData.at(-1));
  });

  it("should return empty array if no results", async () => {
    const results = await fetchSearchResults({ results: [] }, DEFAULT_UNITS);

    expect(results).toEqual([]);
  });

  it("should handle and format AppError when API returns invalid data", async () => {
    server.use(
      http.get("https://api.open-meteo.com/v1/forecast", () =>
        HttpResponse.json([
          {
            current: {
              temperature_2m: "NaN",
            },
          },
        ]),
      ),
    );

    const result = fetchSearchResults(geoData);

    await expect(result).rejects.toThrowError("Data validation failed:");
    await expect(result).rejects.toThrowError(
      "0.current.temperature_2m: expected number, received string",
    );
  });

  it("should throw AppError if API returns null", async () => {
    server.use(
      http.get("https://api.open-meteo.com/v1/forecast", () =>
        HttpResponse.json(null),
      ),
    );

    const geoData = { results: [{ city: "Warsaw", lat: 10, lon: 20 }] } as Geo;

    await expect(fetchSearchResults(geoData)).rejects.toThrow(/no data/i);
  });
});

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
    server.use(
      http.get("https://api.open-meteo.com/v1/forecast", () =>
        HttpResponse.json(null),
      ),
    );

    await expect(fetchForecastData(cityData)).rejects.toThrow(/no data/i);
  });

  it("should catch and handle unexpected errors", async () => {
    server.use(
      http.get(
        "https://api.open-meteo.com/v1/forecast",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    await expect(fetchForecastData(cityData)).rejects.toThrow();
  });
});
