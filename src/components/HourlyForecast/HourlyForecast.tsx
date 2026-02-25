"use client";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { groupByDay } from "@/utils/weather";

import ChangeSelectedDay from "./ChangeSelectedDay";
import type { HourlyForecastProps } from "./HourlyForecast.types";

export default function HourlyForecast({
  hourlyData,
  forecastUnits,
}: HourlyForecastProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const hoursRef = useRef<HTMLUListElement>(null);

  const days = useMemo(() => {
    return groupByDay(hourlyData).slice(1);
  }, [hourlyData]);

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

  return (
    <section
      aria-label="Hourly Forecast"
      className="lg:max-w-90 xl:max-w-96 w-full max-h-full"
    >
      <div className="bg-[hsl(243,27%,20%)] max-h-full p-5 sm:p-6 rounded-2xl border border-white/10 sticky top-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Hourly forecast</h3>
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
              className="flex items-center justify-between bg-[hsl(243,23%,24%)] hover:opacity-75 p-3 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={image}
                  alt={`${hour} weather`}
                  className="object-contain relative w-8 h-8"
                />
                <span className="font-medium">{hour}</span>
              </div>
              <span className="text-xl font-bold">
                {temp.toFixed(1)}{" "}
                <span className="text-white/70 text-lg">
                  {forecastUnits.temperature}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
