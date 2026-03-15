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
      <ul
        role="list"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 xl:gap-4"
      >
        {weatherDetails.map(({ title, value, unit }) => (
          <li
            key={title}
            role="listitem"
            aria-label={title}
            className="bg-[hsl(243,27%,20%)] flex flex-col gap-2 sm:gep-4 hover:opacity-75 transition duration-75 p-4 lg:py-5 lg:px-3.5 xl:p-5 lg:h-28.5 rounded-xl border border-white/10"
          >
            <p className="text-white/70 text-base sm:text-lg">{title}</p>

            <p
              className={`flex items-center font-light text-xl sm:text-2xl xl:text-3xl whitespace-nowrap ${unit.length > 1 ? "gap-1 sm:gap-1.5 md:gap-2" : "gap-0"}`}
            >
              <span>{value}</span>
              <span>{unit}</span>
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
) => {
  const {
    apparent_temperature: apparentTemp,
    relative_humidity_2m: humidity,
    wind_speed_10m: wind,
    precipitation,
  } = data;

  const currentToFixed = units.precipitation === "mm" ? 1 : 3;
  const currentPrecipUnit = units.precipitation === "mm" ? "mm" : "in";

  return [
    {
      title: "Feels Like",
      value: Math.round(apparentTemp),
      unit: "°",
    },
    {
      title: "Humidity",
      value: humidity.toString(),
      unit: "%",
    },
    {
      title: "Wind",
      value: Math.round(wind).toString(),
      unit: units.speed,
    },
    {
      title: "Precipitation",
      value: precipitation
        .toFixed(precipitation === 0 ? 0 : currentToFixed)
        .toString(),
      unit: currentPrecipUnit,
    },
  ];
};

interface WeatherDetailsProps {
  currentData: WeatherDataCurrent;
  forecastUnits: WeatherDataUnits;
}
