"use client";

import { WeatherDataHourly, WeatherDataUnits } from "@/types/api/WeatherData";

import ChangeSelectedDay from "./ChangeSelectedDay";
import HourlyItem from "./HourlyItem";
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
          {hours.map((hour, index) => (
            <HourlyItem
              key={`${hour.hour}-${index}`}
              hour={hour}
              hourFormat={hourFormat}
              tempUnit={forecastUnits.temperature}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

interface HourlyForecastProps {
  hourlyData: WeatherDataHourly;
  forecastUnits: WeatherDataUnits;
}
