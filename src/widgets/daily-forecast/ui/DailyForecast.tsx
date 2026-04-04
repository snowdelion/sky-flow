"use client";
import { useMemo } from "react";
import { type WeatherDaily } from "@/entities/weather";
import { useDailyForecast } from "../model/useDailyForecast";
import { DailyForecastSkeleton } from "./DailyForecastSkeleton";
import { DailyItem } from "./DailyItem";

export function DailyForecast({ dailyData, isPending }: DailyForecastProps) {
  const { formattedDays, changeDayIndex } = useDailyForecast(dailyData);

  const content = useMemo(
    () => (
      <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.25 xl:gap-3">
        {formattedDays.map((formattedDay, index) => (
          <DailyItem
            key={`${formattedDay.date}`}
            formattedDay={formattedDay}
            index={index}
            changeDayIndex={changeDayIndex}
          />
        ))}
      </ul>
    ),
    [formattedDays, changeDayIndex],
  );

  return (
    <section aria-label="Daily Forecast">
      {isPending || !dailyData ? (
        <DailyForecastSkeleton />
      ) : (
        <>
          <h3 className="text-xl font-medium tracking-wide mb-5">
            Daily forecast
          </h3>
          {content}
        </>
      )}
    </section>
  );
}

export interface DailyForecastProps {
  dailyData?: WeatherDaily;
  isPending: boolean;
}
