"use client";
import dayjs from "dayjs";
import { AiDescriptionMenu } from "@/features/ai-description";
import type { WeatherCurrent, WeatherUnits } from "@/entities/weather";
import { WeatherIcon } from "@/entities/weather";
import { useToday } from "../model/useToday";
import { TodaySkeleton } from "./TodaySkeleton";

export function Today({ currentData, forecastUnits, isPending }: TodayProps) {
  const { displayName, aiRequestData } = useToday(currentData);

  return (
    <section
      aria-label="Current Weather"
      className="relative h-70 mb-8 grid-cols-1 content-center"
    >
      {/* background */}
      <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden rounded-2xl">
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet="/images/bg-today-small.webp"
          />
          <source
            media="(min-width: 640px"
            srcSet="/images/bg-today-large.webp"
          />
          <img
            src="/images/bg-today-large.webp"
            alt="Today background"
            fetchPriority="high"
            className={`w-full h-70 object-fill sm:object-cover ${isPending || !currentData || !forecastUnits ? "opacity-70" : ""}`}
          />
        </picture>
      </div>

      {/* content */}
      {isPending || !currentData || !forecastUnits ? (
        <TodaySkeleton />
      ) : (
        <>
          <div className="relative flex flex-col sm:flex-row justify-between items-center gap-2 px-6 md:px-8 h-55">
            {/* city and date */}
            <div className="flex flex-1 flex-col gap-2 items-center sm:items-start">
              <h2 className="text-xl sm:text-3xl font-bold capitalize">
                {displayName}
              </h2>
              <p className="text-white/70 text-lg">
                {dayjs(currentData.time).format("dddd, MMM D, YYYY")}
              </p>
              {/* AI description */}
              <AiDescriptionMenu
                key={`${currentData.lat}-${currentData.lon}`}
                aiRequestData={aiRequestData}
              />
            </div>

            {/* icon and temp */}
            <div className="flex flex-1 items-center justify-center sm:justify-end gap-4 w-full sm:w-auto">
              <WeatherIcon
                code={currentData.weatherCode}
                className="w-25 md:w-35 object-contain"
              />
              <div className="flex items-start font-bold">
                <span className="text-7xl md:text-8xl leading-none">
                  {Math.round(currentData.temperature)}
                </span>
                <span className="text-2xl sm:text-3xl text-white/70 ml-1">
                  {forecastUnits.temperatureUnit}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

interface TodayProps {
  currentData?: WeatherCurrent;
  forecastUnits?: WeatherUnits;
  isPending: boolean;
}
