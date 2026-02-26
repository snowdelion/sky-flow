"use client";
import Image from "next/image";
import { useMemo, useRef } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { groupByDay } from "@/utils/weather";

import ChangeSelectedDay from "./ChangeSelectedDay";
import type { HourlyForecastProps } from "./HourlyForecast.types";

export default function HourlyForecast({
  hourlyData,
  forecastUnits,
}: HourlyForecastProps) {
  const selectedDayIndex = useSettingsStore((state) => state.selectedDayIndex);
  const setSelectedDayIndex = useSettingsStore(
    (state) => state.setSelectedDayIndex,
  );
  const hourFormat = useSettingsStore((state) => state.units.time);
  const hoursRef = useRef<HTMLUListElement>(null);

  const days = useMemo(() => {
    return groupByDay(hourlyData, { hourFormat, dayFormat: "dddd" })
      .slice(1)
      .filter((day) => day.hours.length === 24);
  }, [hourlyData, hourFormat]);

  const selectedDay = days[selectedDayIndex] || {
    date: "",
    dayName: "",
    hours: [],
  };
  const hours = selectedDay.hours;

  const handleChangeDay = (index: number) => {
    setSelectedDayIndex(index);
    hoursRef.current?.scrollTo({ top: 0 });
  };

  const getHour = (hour: string) => {
    if (hourFormat === "12") {
      const hours = hour.replace(/[a-z]/gi, "");
      const chars = hour.replace(/[0-9]/g, "");
      return (
        <div className="flex items-center gap-1 font-medium text-sm lg:text-lg">
          <span>{hours}</span>
          <span className=" text-white/50">{chars}</span>
        </div>
      );
    } else {
      const [h, m] = hour.split(":");

      return (
        <div className="flex items-center gap-0.75 text-sm lg:text-lg">
          <div className="flex items-center gap-0.5 font-medium">
            <span>{`${h[0] === "0" ? h.replace("0", "") : h}`}</span>
            <span>:</span>
          </div>
          <span className=" text-white/50 font-normal">{m}</span>
        </div>
      );
    }
  };

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
            setSelectedDayIndex={handleChangeDay}
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
                {getHour(hour)}
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
