"use client";
import Image from "next/image";

import { WeatherDataHourly, WeatherDataUnits } from "@/types/api/WeatherData";

import ChangeSelectedDay from "./ChangeSelectedDay";
import { getHour } from "./hourly-utils";
import { useHourlyForecast } from "./useHourlyForecast";

export default function HourlyForecast({
  hourlyData,
  forecastUnits,
}: HourlyForecastProps) {
  const {
    hoursRef,
    days,
    hours,
    handleChangeDay,
    hourFormat,
    selectedDayIndex,
  } = useHourlyForecast(hourlyData);

  return (
    <section
      aria-label="Hourly Forecast"
      className="lg:max-w-90 xl:min-w-96 w-full max-h-full"
    >
      <div className="bg-[hsl(243,27%,20%)] max-h-full p-5 sm:p-6 rounded-2xl border border-white/10 sticky top-6">
        <div className="flex justify-between items-center mb-6 lg:h-10.5">
          <h3 className="text-lg md:text-xl font-bold white">
            Hourly forecast
          </h3>
          <ChangeSelectedDay
            days={days}
            selectedDayIndex={selectedDayIndex}
            handleChangeDay={handleChangeDay}
          />
        </div>

        <ul
          className="space-y-2.5 overflow-auto max-h-136 px-1 custom-scrollbar"
          ref={hoursRef}
        >
          {hours.map(({ hour, image, temp }, index) => (
            <li
              key={`${hour}-${index}`}
              className="flex items-center justify-between bg-[hsl(243,23%,24%)] hover:opacity-75 py-1 md:py-1.5 px-3 lg:py-1.75 xl:p-3 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={image}
                  alt={`${hour} weather`}
                  className="object-contain relative w-8 h-8"
                />
                {getHour(hour, hourFormat)}
              </div>

              <div className="flex items-center gap-1">
                <span className="text-md xl:text-xl font-bold">
                  {temp.toFixed(1)}
                </span>
                <span className="text-white/70 text-base xl:text-lg">
                  {forecastUnits.temperature}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export interface HourlyForecastProps {
  hourlyData: WeatherDataHourly;
  forecastUnits: WeatherDataUnits;
}
