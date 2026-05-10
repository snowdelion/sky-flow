import { verifyAndGetCityData, type WeatherParams } from "./utils";

// --- 1. mocks ---
const mockRedirect = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));

// --- 2. tests ---
describe("WeatherPage utils", () => {
  const params = {
    region: "State of Berlin",
    city: "Berlin",
    country: "Germany",
    code: "PPLC",
    lat: "52.52437",
    lon: "13.41053",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const cases = [
    {
      name: "no coords",
      params: {
        status: "found",
        city: "Berlin",
        region: "State of Berlin",
        code: "PPLC",
        country: "Germany",
      },
      expected: {
        status: "found",
        region: "State of Berlin",
        city: "Berlin",
        country: "Germany",
        code: "PPLC",
        lat: 52.52437,
        lon: 13.41053,
      },
    },
    {
      name: "no country",
      params: {
        status: "found",
        region: "State of Berlin",
        city: "Berlin",
        code: "PPLC",
        lat: "52.52437",
        lon: "13.41053",
      },
      expected: {
        status: "found",
        region: "State of Berlin",
        country: "Germany",
        city: "Berlin",
        code: "PPLC",
        lat: 52.52437,
        lon: 13.41053,
      },
    },
    {
      name: "no code",
      params: {
        status: "found",
        country: "Germany",
        region: "State of Berlin",
        city: "Berlin",
        lat: "52.52437",
        lon: "13.41053",
      },
      expected: {
        status: "found",
        region: "State of Berlin",
        city: "Berlin",
        country: "Germany",
        code: "PPLC",
        lat: 52.52437,
        lon: 13.41053,
      },
    },
    {
      name: "only city",
      params: {
        status: "found",
        city: "Berlin",
      },
      expected: {
        status: "found",
        region: "State of Berlin",
        city: "Berlin",
        country: "Germany",
        code: "PPLC",
        lat: 52.52437,
        lon: 13.41053,
      },
    },
  ];

  test.each(cases)(
    "should redirect when $name",
    async ({ params, expected }) => {
      const result = await verifyAndGetCityData(params);
      expect(result).toEqual(expected);
    },
  );

  it("should redirect to default city when no params", async () => {
    await verifyAndGetCityData({ city: "" });
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("/weather/?city=Minsk"),
    );
  });

  it("should return city data when params valid", async () => {
    const result = await verifyAndGetCityData(params);

    expect(result).toEqual({
      ...params,
      status: "found",
      lat: 52.52437,
      lon: 13.41053,
    });
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should return not found when city doesn't exist", async () => {
    const params = { city: "nonExist12313" };
    const result = await verifyAndGetCityData(params);

    expect(result).toEqual({ status: "not-found", city: "nonExist12313" });
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should redirect when extra params", async () => {
    await verifyAndGetCityData({
      ...params,
      extra: "123",
    } as WeatherParams);

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("/weather/?city=Berlin"),
    );
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.not.stringContaining("extra"),
    );
  });

  it("should redirect when params incorrect", async () => {
    await verifyAndGetCityData({
      ...params,
      region: "123",
      lat: "0",
      lon: "0",
    });

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("/weather/?city=Berlin"),
    );
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("region=State+of+Berlin"),
    );
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("lat=52.52437"),
    );
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("lon=13.41053"),
    );
  });
});
