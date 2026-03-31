import { http, HttpResponse } from "msw";

import { createResultsMocks } from "@/shared/lib/testing";
import { server } from "@/shared/lib/testing";

import { fetchSearchResults } from "./weather.api";

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
              temperature_2m: "NaN",
            },
          },
        ]),
      ),
    );

    const result = fetchSearchResults("Berlin");

    await expect(result).rejects.toThrowError("Data validation failed:");
    await expect(result).rejects.toThrowError(
      "0.current.temperature_2m: expected number, received string",
    );
  });
});
