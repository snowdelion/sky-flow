import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";

export const mockDailyData = {
  temperature_2m_min: Array.from({ length: 8 }, (_, i) => i),
  temperature_2m_max: Array.from({ length: 8 }, (_, i) => i + 2),
  apparent_temperature_min: Array.from({ length: 8 }, (_, i) => i),
  apparent_temperature_max: Array.from({ length: 8 }, (_, i) => i + 2),
  time: Array.from(
    { length: 8 },
    (_, i) => `2026-03-${(i + 1).toString().padStart(2, "0")}`,
  ),
  weather_code: Array.from({ length: 8 }, (_, i) => i),
} as WeatherDataDaily;

export const mockHourlyData = {
  temperature_2m: [
    ...Array.from({ length: 24 }, (_, i) => i),
    ...Array.from({ length: 24 }, (_, i) => i + 1),
  ],
  time: [
    ...Array.from(
      { length: 24 },
      (_, i) => `2026-03-01T${i.toString().padStart(2, "0")}:00Z`,
    ),
    ...Array.from(
      { length: 24 },
      (_, i) => `2026-03-02T${i.toString().padStart(2, "0")}:00Z`,
    ),
  ],
  weather_code: [...Array(24).fill(0), ...Array(24).fill(1)],
} as WeatherDataHourly;
