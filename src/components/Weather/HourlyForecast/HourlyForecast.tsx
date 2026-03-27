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
      className="w-full lg:max-w-82 xl:min-w-96 xl:max-w-96"
    >
      <div className="lg:max-h-166 p-5 sm:px-6 sm:py-7 rounded-2xl border bg-[hsl(243,27%,20%)] border-white/10 sticky top-6">
        <div
          className={`flex mx-1.5 gap-4 lg:gap-3 xl:gap-4 sm:flex-row justify-between items-center lg:h-10.5 ${isHourlyOpen ? "mb-6" : ""}`}
        >
          <h3
            onClick={() => !isDesk && setIsHourlyOpen((prev) => !prev)}
            className="flex items-center gap-1 sm:gap-2 cursor-pointer lg:cursor-auto"
          >
            <span className="text-[0.95rem] sm:text-lg md:text-xl lg:text-lg xl:text-xl font-bold tracking-wider lg:tracking-wide whitespace-nowrap">
              Hourly forecast
            </span>
            <Image
              src={dropdownIcon}
              className={`block mt-px lg:hidden w-2.5 h-2.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isHourlyOpen ? "rotate-0" : "rotate-180"}`}
              alt="Dropdown"
            />
          </h3>
          <ChangeSelectedDay
            setIsHourlyOpen={setIsHourlyOpen}
            days={days}
            selectedDayIndex={selectedDayIndex}
            handleChangeDay={handleChangeDay}
          />
        </div>

        {isHourlyOpen && (
          <ul
            className="space-y-2.5 sm:space-y-3 lg:space-y-3.5 pr-2 overflow-auto max-h-136 px-1 custom-scrollbar"
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
