import type { CityData } from "@/types/api/CityData";
import { fetchForecastData } from "./fetchForecastData";

describe("fetchForecastData", () => {
  let cityData: CityData;

  beforeEach(() => {
    cityData = {
      city: "Minsk",
      country: "Belarus",
      lat: 53.9,
      lon: 27.56667,
    };
  });

  it("should fetch city with cityData", async () => {
    const result = await fetchForecastData(cityData);

    expect(result.current.city).toBe("Minsk");
    expect(result.current.latitude).toBe(53.9);
    expect(result.current.longitude).toBe(27.56667);
  });
});
