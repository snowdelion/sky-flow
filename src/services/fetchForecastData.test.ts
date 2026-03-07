import { createCityDataMocks } from "@/testing/mocks/factories/cityData";

import { fetchForecastData } from "./fetchForecastData";

describe("fetchForecastData", () => {
  const { minskCityData } = createCityDataMocks();

  it("should fetch city with cityData", async () => {
    const result = await fetchForecastData(minskCityData);

    expect(result.current.city).toBe("Minsk");
    expect(result.current.latitude).toBe(53.9);
    expect(result.current.longitude).toBe(27.56667);
  });
});
