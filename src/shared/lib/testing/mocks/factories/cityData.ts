import type { CityData } from "../../../../types/city-data.types";

export const createCityData = (overrides: CityDataOverrides = {}) => {
  const getCity = (data: CityData, override: Partial<CityData> = {}) => {
    if (override?.status === "not-found" || data.status === "not-found")
      return { status: "not-found" as const, city: data.city };
    return { ...data, ...override };
  };

  return {
    minskCityData: getCity(getMinskData(), overrides.minsk),
    berlinCityData: getCity(getBerlinData(), overrides.berlin),
    warsawCityData: getCity(getWarsawData(), overrides.warsaw),
  };
};

const getMinskData = () => ({
  status: "found" as const,
  city: "Minsk",
  country: "Belarus",
  region: "Minsk City",
  code: "PPLC",
  lat: 53.9,
  lon: 27.56667,
});

const getBerlinData = () => ({
  status: "found" as const,
  city: "Berlin",
  country: "Germany",
  region: "State of Berlin",
  code: "PPLC",
  lat: 52.52437,
  lon: 13.41053,
});

const getWarsawData = () => ({
  status: "found" as const,
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
