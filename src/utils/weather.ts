import { StaticImageData } from "next/image";

import drizzleIcon from "@/../public/icons/icon-drizzle.webp";
import fogIcon from "@/../public/icons/icon-fog.webp";
import overcastIcon from "@/../public/icons/icon-overcast.webp";
import partlyCloudyIcon from "@/../public/icons/icon-partly-cloudy.webp";
import rainIcon from "@/../public/icons/icon-rain.webp";
import snowIcon from "@/../public/icons/icon-snow.webp";
import stormIcon from "@/../public/icons/icon-storm.webp";
import sunnyIcon from "@/../public/icons/icon-sunny.webp";
import { WeatherDataHourly } from "@/types/api/WeatherData";
import type { DailyForecast, HourlyItem } from "@/types/api/WeatherHourly";
import {
  formatDayOfWeek,
  formatHourOfDay,
  getHourNumber,
} from "@/utils/formatters";

const WEATHER_CODE_TO_ICON: Record<number, string> = {
  0: "sunny",
  1: "sunny",
  2: "partlyCloudy",
  3: "overcast",
  45: "fog",
  48: "fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "drizzle",
  57: "drizzle",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "rain",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
};

export const GET_ICON_BY_WEATHER_CODE: Record<string, StaticImageData> = {
  sunny: sunnyIcon,
  partlyCloudy: partlyCloudyIcon,
  overcast: overcastIcon,
  fog: fogIcon,
  drizzle: drizzleIcon,
  rain: rainIcon,
  snow: snowIcon,
  storm: stormIcon,
};

export function calculateAverageTemps(min: number, max: number): number {
  return Math.round((min + max) / 2);
}

export function getWeatherCode(code: number): string {
  return WEATHER_CODE_TO_ICON[code] ?? "sunny";
}

export interface format {
  hourFormat: "12" | "24";
  dayFormat: "dd" | "ddd" | "dddd";
}

export function groupByDay(
  data?: WeatherDataHourly,
  format?: format,
): DailyForecast[] {
  if (!format) format = { hourFormat: "12", dayFormat: "dddd" };
  const { hourFormat, dayFormat } = format;

  const days: DailyForecast[] = [];
  if (!data?.time?.length) return days;
  let currentDay = "";
  let currentDayIndex = -1;

  data.time.forEach((timeStr, index) => {
    const date = new Date(timeStr);
    const dateKey = date.toISOString().split("T")[0];
    if (dateKey !== currentDay) {
      currentDay = dateKey;
      currentDayIndex++;

      days.push({
        date: dateKey,
        dayName: formatDayOfWeek(date, dayFormat),
        hours: [],
      });
    }

    const code = getWeatherCode(data.weather_code[index]);
    const hourItem: HourlyItem = {
      hour: formatHourOfDay(date, hourFormat),
      temp: data.temperature_2m[index],
      weatherCode: data.weather_code[index],
      image: GET_ICON_BY_WEATHER_CODE[code],
    };

    days[currentDayIndex].hours.push(hourItem);
  });

  days.forEach((day) => {
    day.hours.sort((a, b) => {
      if (hourFormat === "12") {
        let hourA = getHourNumber(a.hour);
        let hourB = getHourNumber(b.hour);
        if (!hourA) hourA = 0;
        if (!hourB) hourB = 0;
        return hourA - hourB;
      } else {
        return parseInt(a.hour) - parseInt(b.hour);
      }
    });
  });

  return days;
}
