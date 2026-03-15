"use client";
import Image from "next/image";

import type { WeatherDataDaily } from "@/types/api/WeatherData";

import { useDailyForecast } from "./useDailyForecast";

export default function DailyForecast({ dailyData }: DailyForecastProps) {
  const { formattedDays, handleClick } = useDailyForecast(dailyData);

  return (
    <section aria-label="Daily Forecast">
      <h3 className="text-xl font-medium tracking-wide mb-5">Daily forecast</h3>

      <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.25 xl:gap-3">
        {formattedDays.map(({ day, image, temp, feelsLike }, index) => (
          <li
            key={`${day}-${index}`}
            onClick={() => handleClick(index)}
            className="flex flex-col gap-3 lg:gap-5 xl:gap-4 items-center bg-[hsl(243,27%,20%)] py-4 px-3 lg:h-37.5 border border-white/10 cursor-pointer hover:opacity-75 transition duration-75 rounded-xl"
          >
            <p className="font-medium text-sm sm:text-base md:text-sm lg:text-xs xl:text-sm">
              {day}
            </p>
            <div className="relative w-12 h-12">
              <Image
                src={image}
                alt={`${day} weather`}
                className="object-contain"
              />
            </div>
            <div className="flex items-center self-center justify-center gap-4 xl:gap-7 w-full">
              <span className="font-bold lg:text-sm xl:text-base">{temp}</span>
              <span className="text-white/70 lg:text-sm xl:text-base">
                {feelsLike}
              </span>
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
