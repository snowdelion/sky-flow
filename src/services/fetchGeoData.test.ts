import { http, HttpResponse } from "msw";

import { server } from "@/testing/msw/server";
import { AppError } from "@/types/errors";

import { fetchGeoData } from "./fetchGeoData";

describe("fetchGeoData", () => {
  it("should fetch 8 cities with minsk query", async () => {
    const result = await fetchGeoData("Minsk");

    expect(result?.results).toHaveLength(8);
    expect(result?.results[0].name).toBe("Minsk");
    expect(result?.results[0].country).toBe("Belarus");
  });

  it("should handle 404 error", async () => {
    await expect(fetchGeoData("notExist123")).resolves.toEqual({ results: [] });
  });

  it("should throw network error", async () => {
    server.use(
      http.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    await expect(fetchGeoData("Minsk")).rejects.toThrow(AppError);
  });

  it("should handle and format AppError when API returns invalid data", async () => {
    server.use(
      http.get("https://geocoding-api.open-meteo.com/v1/search", () =>
        HttpResponse.json({
          results: [
            {
              name: 1,
            },
          ],
        }),
      ),
    );

    await expect(fetchGeoData("Warsaw")).rejects.toThrowError(
      "Data validation failed:",
    );
    await expect(fetchGeoData("Warsaw")).rejects.toThrowError(
      "results.0.name: expected string, received number",
    );
  });
});
