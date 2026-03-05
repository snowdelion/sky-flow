"use client";
import Image from "next/image";

import type { WeatherDataDaily } from "@/types/api/WeatherData";

import { useDailyForecast } from "./useDailyForecast";

export default function DailyForecast({ dailyData }: DailyForecastProps) {
  const { formattedDays, handleClick } = useDailyForecast(dailyData);

  return (
    <section aria-label="Daily Forecast">
      <h3 className="text-xl sm:text-2xl font-bold mb-5">Daily forecast</h3>
      <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {formattedDays.map(({ day, image, temp, feelsLike }, index) => (
          <li
            key={`${day}-${index}`}
            onClick={() => handleClick(index)}
            className="bg-[hsl(243,27%,20%)] hover:opacity-75 transition duration-75 p-4 rounded-xl border border-white/10 cursor-pointer flex flex-col items-center"
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

export interface DailyForecastProps {
  dailyData: WeatherDataDaily;
}
