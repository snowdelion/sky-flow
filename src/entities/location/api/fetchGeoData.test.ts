import { http, HttpResponse } from "msw";
import { ERROR_CODES } from "@/shared/api";
import { server } from "@/shared/lib/testing";
import { fetchGeoData } from "./fetchGeoData";

describe("fetchGeoData", () => {
  it("should fetch 8 cities with minsk query", async () => {
    const result = await fetchGeoData({ city: "Minsk" });

    expect(result?.results).toHaveLength(8);
    expect(result?.results[0].city).toBe("Minsk");
    expect(result?.results[0].country).toBe("Belarus");
  });

  it("should handle 404 error", async () => {
    await expect(fetchGeoData({ city: "notExist123" })).resolves.toEqual({
      results: [],
    });
  });

  it("should throw network error", async () => {
    server.use(
      http.get("/api/geocoding", () => new HttpResponse(null, { status: 500 })),
    );

    await expect(fetchGeoData({ city: "Minsk" })).rejects.toMatchObject({
      name: "AppError",
      code: ERROR_CODES.GEOCODING,
    });
  });

  it("should handle and format AppError when API returns invalid data", async () => {
    server.use(
      http.get("/api/geocoding", () =>
        HttpResponse.json({
          results: [
            {
              name: 1,
            },
          ],
        }),
      ),
    );

    await expect(fetchGeoData({ city: "Warsaw" })).rejects.toThrow(
      "Data validation failed:",
    );
    await expect(fetchGeoData({ city: "Warsaw" })).rejects.toThrow(
      "results.0.name: expected string, received number",
    );
  });
});
