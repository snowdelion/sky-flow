"use client";
import { useMemo } from "react";

import type {
  WeatherDataCurrent,
  WeatherDataUnits,
} from "@/types/api/WeatherData";

export default function WeatherDetails({
  currentData,
  forecastUnits,
}: WeatherDetailsProps) {
  const weatherDetails = useMemo(
    () => formatWeatherDetails(currentData, forecastUnits),
    [currentData, forecastUnits],
  );

  return (
    <section aria-label="Weather Details" className="mb-10">
      <h2 className="sr-only">Weather Details</h2>
      <ul role="list" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {weatherDetails.map(({ title, value, unit }) => (
          <li
            key={title}
            role="listitem"
            aria-label={title}
            className="bg-[hsl(243,27%,20%)] hover:opacity-75 transition duration-75 p-4 sm:p-5 rounded-xl border border-white/10"
          >
            <p className="text-white/70 text-sm mb-2">{title}</p>
            <p className="flex items-center gap-1.25 font-semibold">
              <span className="text-xl xl:text-2xl">{value}</span>
              <span className="text-white/70 text-lg xl:text-xl">{unit}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const formatWeatherDetails = (
  data: WeatherDataCurrent,
  units: WeatherDataUnits,
) => [
  {
    title: "Feels Like",
    value: data.apparent_temperature.toFixed(1),
    unit: units.temperature,
  },
  {
    title: "Humidity",
    value: data.relative_humidity_2m.toString(),
    unit: "%",
  },
  {
    title: "Wind",
    value: data.wind_speed_10m.toString(),
    unit: units.speed,
  },
  {
    title: "Precipitation",
    value: data.precipitation.toString(),
    unit: units.precipitation,
  },
];

interface WeatherDetailsProps {
  currentData: WeatherDataCurrent;
  forecastUnits: WeatherDataUnits;
}
