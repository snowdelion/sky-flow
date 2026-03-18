import { findCityDataFromParams, redirectToDefaultCity } from "./utils";

// --- 1. mocks ---
const mockRedirect = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));

// --- 2. tests ---
describe("WeatherPage utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to default city when no params", () => {
    const params = {};
    redirectToDefaultCity(params);

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(
      "/weather/?city=Minsk&country=Belarus&lat=53.9&lon=27.56667",
    );
  });

  it("should not redirect when params exist", () => {
    const params = {
      city: "London",
      country: "United Kingdom",
      lat: "51.50853",
      lon: "-0.12574",
    };
    redirectToDefaultCity(params);

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should return city data when params valid", () => {
    const params = {
      city: "London",
      country: "United Kingdom",
      lat: "51.50853",
      lon: "-0.12574",
    };
    const result = findCityDataFromParams(params);

    expect(result).toEqual({
      status: "found",
      city: "London",
      country: "United Kingdom",
      lat: 51.50853,
      lon: -0.12574,
    });
  });

  it("should return not found when city doesn't exist", () => {
    const params = { city: "nonExist12313" };
    const result = findCityDataFromParams(params);

    expect(result).toEqual({ status: "not-found", city: "nonExist12313" });
  });
});
