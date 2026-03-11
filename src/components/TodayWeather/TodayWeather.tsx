"use client";
import dayjs from "dayjs";
import Image from "next/image";

import bgTodayDesktop from "@/../public/images/bg-today-large.webp";
import type {
  WeatherDataCurrent,
  WeatherDataUnits,
} from "@/types/api/WeatherData";
import { getWeatherIcon } from "@/utils/weather";

export default function TodayWeather({
  currentData,
  forecastUnits,
}: TodayWeatherProps) {
  const icon = getWeatherIcon(currentData.weather_code);

  return (
    <section
      aria-label="Current Weather"
      className="relative rounded-2xl py-8 overflow-hidden mb-8"
    >
      <div className="absolute inset-0 -z-10 w-full h-full">
        <Image
          src={bgTodayDesktop}
          alt="Today background"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 800px) 100vw, 800px"
          className="object-cover object-[center_top] md:object-center"
        />
      </div>

      <div className="relative p-6 sm:p-8 md:p-10 lg:h-55">
        <div className="flex items-center flex-col sm:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold mb-2 capitalize text-center sm:text-start">
              <span>{currentData.city}, </span>
              <span>{currentData.country}</span>
            </h2>
            <p className="text-white/70 text-lg">
              {dayjs(currentData.time).format("dddd, MMM D, YYYY")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 sm:w-35 sm:h-35">
              <Image src={icon} alt="Sunny" className="object-contain" />
            </div>
            <div className="font-bold flex gap-5">
              <span className="text-5xl sm:text-6xl md:text-8xl italic">
                {currentData.temperature_2m.toFixed(1)}
              </span>
              <span className="text-4xl sm:text-5xl">
                {forecastUnits.temperature}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface TodayWeatherProps {
  currentData: WeatherDataCurrent;
  forecastUnits: WeatherDataUnits;
}
