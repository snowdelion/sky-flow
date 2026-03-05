"use client";
import Image from "next/image";

import dropdownIcon from "@/../public/icons/icon-dropdown.svg";
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
    isHourlyOpen,
    setIsHourlyOpen,
    isDesk,
  } = useHourlyForecast(hourlyData);

  return (
    <section
      aria-label="Hourly Forecast"
      className="lg:max-w-90 xl:min-w-96 w-full max-h-full"
    >
      <div className="bg-[hsl(243,27%,20%)] max-h-full p-5 sm:p-6 rounded-2xl border border-white/10 sticky top-6">
        <div
          className={`flex flex-col gap-4 sm:flex-row justify-between items-center lg:h-10.5 ${isHourlyOpen ? "mb-6" : ""}`}
        >
          <h3
            onClick={() => !isDesk && setIsHourlyOpen((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer lg:cursor-auto"
          >
            <span className="text-lg md:text-xl font-bold">
              Hourly forecast
            </span>
            <Image
              src={dropdownIcon}
              className="block lg:hidden w-3 h-3 sm:w-4 sm:h-4"
              alt="Dropdown"
            />
          </h3>
          <ChangeSelectedDay
            days={days}
            selectedDayIndex={selectedDayIndex}
            handleChangeDay={handleChangeDay}
          />
        </div>
        {isHourlyOpen && (
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
        )}
      </div>
    </section>
  );
}

interface HourlyForecastProps {
  hourlyData: WeatherDataHourly;
  forecastUnits: WeatherDataUnits;
}
