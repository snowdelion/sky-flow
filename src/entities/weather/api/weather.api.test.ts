import { http, HttpResponse } from "msw";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import { createGeoData, createResultsMocks } from "@/shared/lib/testing";
import { server } from "@/shared/lib/testing";
import { fetchSearchResults } from "./weather.api";

describe("fetchSearchResults", () => {
  const geoData = createGeoData();
  const [searchData] = createResultsMocks();

  it("should fetch city with search result", async () => {
    const result = await fetchSearchResults(geoData, DEFAULT_UNITS);

    expect(result[0]).toEqual(searchData[0]);

    expect(result.at(-1)).toEqual(searchData.at(-1));
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
});
