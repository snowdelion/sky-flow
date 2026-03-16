import type { CityData } from "@/types/location";

export const DEFAULT_CITY_DATA: Extract<CityData, { status: "found" }> = {
  status: "found",
  city: "Minsk",
  country: "Belarus",
  lat: 53.9,
  lon: 27.56667,
};
