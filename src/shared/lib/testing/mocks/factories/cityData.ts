import type { CityData } from "@/entities/location";

export const createCityData = (
  overrides: CityDataOverrides = {},
): CityDataMocks => {
  const getCity = (
    data: CityData,
    override: Partial<CityData> = {},
  ): CityData => {
    if (override?.status === "not-found" || data.status === "not-found")
      return { status: "not-found", city: data.city };
    return { ...data, ...override };
  };

  return {
    minskCityData: getCity(getMinskData(), overrides.minsk),
    berlinCityData: getCity(getBerlinData(), overrides.berlin),
    warsawCityData: getCity(getWarsawData(), overrides.warsaw),
  };
};

const getMinskData = (): CityData => ({
  status: "found",
  city: "Minsk",
  country: "Belarus",
  region: "Minsk City",
  code: "PPLC",
  lat: 53.9,
  lon: 27.56667,
});

const getBerlinData = (): CityData => ({
  status: "found",
  city: "Berlin",
  country: "Germany",
  region: "State of Berlin",
  code: "PPLC",
  lat: 52.52437,
  lon: 13.41053,
});

const getWarsawData = (): CityData => ({
  status: "found",
  city: "Warsaw",
  country: "Poland",
  region: "Masovian",
  code: "PPLC",
  lat: 52.22977,
  lon: 21.01178,
});

interface CityDataOverrides {
  minsk?: Partial<CityData>;
  berlin?: Partial<CityData>;
  warsaw?: Partial<CityData>;
}

interface CityDataMocks {
  minskCityData: CityData;
  berlinCityData: CityData;
  warsawCityData: CityData;
}
