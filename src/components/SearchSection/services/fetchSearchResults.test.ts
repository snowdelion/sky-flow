import { http, HttpResponse } from "msw";

import { createResultsMocks } from "@/testing/mocks/factories/search";
import { server } from "@/testing/msw/server";

import { fetchSearchResults } from "./fetchSearchResults";

describe("fetchSearchResults", () => {
  it("should fetch city with search result", async () => {
    const [searchResults] = createResultsMocks();
    const result = await fetchSearchResults("Berlin");

    expect(result[0]).toEqual(searchResults[0]);

    expect(result.at(-1)).toEqual(searchResults.at(-1));
  });

  it("should return empty array if no results", async () => {
    const results = await fetchSearchResults("notFound123");

    expect(results).toEqual([]);
  });

  it("should handle and format AppError when API returns invalid data", async () => {
    server.use(
      http.get("https://api.open-meteo.com/v1/forecast", () =>
        HttpResponse.json([
          {
            current: {
              weather_code: "NaN",
            },
          },
        ]),
      ),
    );

    const result = fetchSearchResults("Berlin");

    await expect(result).rejects.toThrowError("Data validation failed:");
    await expect(result).rejects.toThrowError(
      "0.weatherCode: expected number, received string",
    );
  });
});
