"use client";
import dayjs from "dayjs";
import Image from "next/image";

import { formatCityDisplay } from "@/entities/location";
import {
  getWeatherIcon,
  type WeatherCurrent,
  type WeatherUnits,
} from "@/entities/weather";
import { bgTodayLarge, bgTodaySmall } from "@/shared/assets";
import { useDeviceType } from "@/shared/lib";

export function Today({ currentData, forecastUnits }: TodayProps) {
  const { isMobile } = useDeviceType();
  const currentSrc = isMobile ? bgTodaySmall : bgTodayLarge;
  const icon = getWeatherIcon(currentData.weatherCode);

  const displayName = formatCityDisplay({
    status: "found",
    city: currentData.city,
    country: currentData.country,
    region: currentData.region,
    code: currentData.code,
    lat: currentData.lat,
    lon: currentData.lon,
  });

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
            {displayName}
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
              {Math.round(currentData.temperature)}
            </span>
            <span className="text-3xl self-start sm:text-4xl text-white/70">
              {forecastUnits.temperatureUnit}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface TodayProps {
  currentData: WeatherCurrent;
  forecastUnits: WeatherUnits;
}
