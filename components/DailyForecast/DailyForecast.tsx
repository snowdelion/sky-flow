"use client";
import Image from "next/image";
import { formatDayOfWeek } from "@/utils/formatDay";
import {
  getIconByWeatherCode,
  getWeatherCode,
} from "@/utils/getIconByWeatherCode";
import type { DailyForecastProps } from "./DailyForecastProps.types";
import { calculateAverageTemps } from "@/utils/calculateAverageTemps";

export default function DailyForecast({ dailyData }: DailyForecastProps) {
  const {
    temperature_2m_min: tempMin,
    temperature_2m_max: tempMax,
    time,
    weather_code: weatherCode,
    apparent_temperature_min: apparentTempMin,
    apparent_temperature_max: apparentTempMax,
  } = dailyData;

  const DailyForecast = time.map((dateStr: string, index: number) => {
    const date = new Date(dateStr);
    const code = getWeatherCode(weatherCode[index]);
    const image = getIconByWeatherCode[code];

    return {
      day: formatDayOfWeek(date),
      weatherCode: weatherCode?.[index] || 0,
      temp: `${calculateAverageTemps(tempMin[index], tempMax[index])}°`,
      feelsLike: `${calculateAverageTemps(apparentTempMin[index], apparentTempMax[index])}°`,
      date: dateStr,
      image,
    };
  });

  return (
    <section aria-label="Daily Forecast" className="mb-10">
      <h3 className="text-xl sm:text-2xl font-bold mb-5">Daily forecast</h3>
      <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {DailyForecast.map(({ day, image, temp, feelsLike }) => (
          <li
            key={day}
            className="bg-[hsl(243,27%,20%)] hover:opacity-75 transition duration-75 p-4 rounded-xl border border-white/10 flex flex-col items-center"
          >
            <p className="font-medium mb-3 lg:text-sm">{day}</p>
            <div className="relative w-12 h-12 mb-3">
              <Image
                src={image}
                alt={`${day} weather`}
                className="object-contain"
              />
            </div>
            <div className="flex items-center self-center justify-center gap-4 w-full">
              <span className="font-bold">{temp}</span>
              <span className="text-white/70">{feelsLike}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
