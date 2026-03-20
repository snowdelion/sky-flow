import { http, HttpResponse } from "msw";

import { createCityData } from "@/testing/mocks/factories/cityData";
import { server } from "@/testing/msw/server";

import { fetchForecastData } from "./fetchForecastData";

describe("fetchForecastData", () => {
  const { minskCityData } = createCityData();

  it("should fetch city with cityData", async () => {
    const result = await fetchForecastData(minskCityData);

    expect(result.current.city).toBe("Minsk");
    expect(result.current.latitude).toBe(53.9);
    expect(result.current.longitude).toBe(27.56667);
  });

  it("should throw and format AppError when API returns invalid data", async () => {
    server.use(
      http.get("https://api.open-meteo.com/v1/forecast", () =>
        HttpResponse.json({
          current: { apparent_temperature: "NaN" },
          current_units: {
            temperature_2m: 1,
          },
        }),
      ),
    );

    const result = fetchForecastData(minskCityData);

    await expect(result).rejects.toThrowError("Data validation failed:");
    await expect(result).rejects.toThrowError(
      "current.apparent_temperature: expected number, received string",
    );
  });
});
