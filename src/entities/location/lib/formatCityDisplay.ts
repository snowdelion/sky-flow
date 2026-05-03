import { type CityData, isNotFoundCity } from "@shared/types";

export function formatCityDisplay(cityData: CityData) {
  if (isNotFoundCity(cityData)) return cityData.city;
  const { city, country, region, code } = cityData;
  const parts = [];

  if (code === "PCLI") return city;
  if (!country && region) return `${city}, ${region}`;
  if (!country && !region) return city;

  if (region && region !== city && code !== "PPLC" && code !== "PPLA") {
    parts.push(`${city}, ${region}`);
  } else {
    parts.push(city);
  }

  parts.push(country);
  return parts.join(", ");
}
