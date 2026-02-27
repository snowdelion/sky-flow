import type { WeatherDataUnits } from "@/types/api/WeatherData";

export const MENU_OPTIONS = [
  {
    id: 1,
    title: "Temperature",
    unit: "temperature" as keyof WeatherDataUnits,
    options: [
      { label: "Celsius (°C)", value: "celsius" },
      { label: "Fahrenheit (°F)", value: "fahrenheit" },
    ],
  },
  {
    id: 2,
    title: "Wind Speed",
    unit: "speed" as keyof WeatherDataUnits,
    options: [
      { label: "Kilometers (km)", value: "kmh" },
      { label: "Miles (mi)", value: "mph" },
    ],
  },
  {
    id: 3,
    title: "Precipitation",
    unit: "precipitation" as keyof WeatherDataUnits,
    options: [
      { label: "Millimeters (mm)", value: "mm" },
      { label: "Inches (in)", value: "inch" },
    ],
  },
  {
    id: 4,
    title: "Time Format",
    unit: "time" as keyof WeatherDataUnits,
    options: [
      { label: "12-hour", value: "12" },
      { label: "24-hour", value: "24" },
    ],
  },
];
