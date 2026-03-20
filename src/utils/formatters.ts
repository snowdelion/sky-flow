import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { isNotFoundCity, type CityData } from "@/types/location";
dayjs.extend(utc);

export function formatDayOfWeek(date: Date, dayFormat: string): string {
  return dayjs(date).format(dayFormat || "dddd");
}

export function formatHourOfDay(date: Date, format: "12" | "24"): string {
  if (format === "12") {
    return dayjs(date).format("h A");
  } else {
    return dayjs(date).format("HH:mm");
  }
}

export function getHourNumber(hour: string): number | undefined {
  if (hour.includes("AM")) {
    if (parseInt(hour) === 12) return 0;
    return parseInt(hour);
  } else if (hour.includes("PM")) {
    if (parseInt(hour) === 12) return 12;
    return parseInt(hour) + 12;
  }
}

export function capitalizeString(value: string): string {
  return value[0].toUpperCase() + value.slice(1).toLowerCase();
}

export function formatCityDisplay(cityData: CityData): string {
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
