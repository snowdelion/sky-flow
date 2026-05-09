import { http, HttpResponse } from "msw";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import {
  createGeoData,
  createResultsMocks,
  server,
} from "@/shared/lib/testing";
import type { Geo } from "@/shared/types";
import { fetchSearchResults } from "../fetchSearchResults";

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
      http.get("/api/search", () =>
        HttpResponse.json([
          {
            current: {
              temperature_2m: "NaN",
            },
          },
        ]),
      ),
    );

    const result = fetchSearchResults(geoData, DEFAULT_UNITS);

    await expect(result).rejects.toThrow("Data validation failed:");
    await expect(result).rejects.toThrow(
      "0.current.temperature_2m: expected number, received string",
    );
  });

  it("should throw AppError if API returns null", async () => {
    server.use(http.get("/api/search", () => HttpResponse.json(null)));

    const geoData = { results: [{ city: "Warsaw", lat: 10, lon: 20 }] } as Geo;

    await expect(fetchSearchResults(geoData, DEFAULT_UNITS)).rejects.toThrow(
      /no data/i,
    );
  });
});
