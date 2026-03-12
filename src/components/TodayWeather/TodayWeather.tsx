"use client";
import dayjs from "dayjs";
import Image from "next/image";

import bgTodayDesktop from "@/../public/images/bg-today-large.webp";
import bgTodayMobile from "@/../public/images/bg-today-small.webp";
import { useDeviceType } from "@/hooks/useDeviceType";
import type {
  WeatherDataCurrent,
  WeatherDataUnits,
} from "@/types/api/WeatherData";
import { getWeatherIcon } from "@/utils/weather";

export default function TodayWeather({
  currentData,
  forecastUnits,
}: TodayWeatherProps) {
  const { isMobile } = useDeviceType();
  const currentSrc = isMobile ? bgTodayMobile : bgTodayDesktop;
  const icon = getWeatherIcon(currentData.weather_code);

  return (
    <section
      aria-label="Current Weather"
      className="relative rounded-2xl overflow-hidden h-70 pt-8 mb-8"
    >
      <div className="absolute inset-0 -z-10 w-full h-full">
        <Image
          src={currentSrc}
          alt="Today background"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 800px) 100vw, 800px"
          className="object-fill sm:object-cover"
        />
      </div>

      <div className="relative flex flex-col sm:flex-row justify-between items-center gap-2 px-6 md:px-8 h-55">
        {/* city and date */}
        <div className="flex flex-1 flex-col items-center sm:items-start">
          <h2 className="text-xl sm:text-3xl font-bold mb-2 capitalize text-center sm:text-start">
            <span>{currentData.city}, </span>
            <span>{currentData.country}</span>
          </h2>
          <p className="text-white/70 text-lg">
            {dayjs(currentData.time).format("dddd, MMM D, YYYY")}
          </p>
        </div>

        {/* icon and temp */}
        <div className="flex flex-1 gap-2 justify-between sm:justify-end items-center max-w-65 sm:max-w-full">
          <div className="relative w-25 md:w-35">
            <Image src={icon} alt="Weather icon" className="object-contain" />
          </div>

          <div className="font-bold flex items-center gap-1">
            <span className="text-7xl md:text-8xl">
              {Math.round(currentData.temperature_2m)}
            </span>
            <span className="text-3xl self-start sm:text-4xl text-white/70">
              {forecastUnits.temperature}
            </span>
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
