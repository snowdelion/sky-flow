import { memo, useCallback } from "react";
import { WeatherIcon } from "@/entities/weather";

export const DailyItem = memo(function DailyItem({
  formattedDay,
  changeDayIndex,
  index,
}: DailyItemProps) {
  const { weatherCode, temp, feelsLike, day } = formattedDay;

  const handleItemClick = useCallback(
    () => changeDayIndex(index),
    [changeDayIndex, index],
  );

  return (
    <li
      onClick={handleItemClick}
      className="flex flex-col gap-3 lg:gap-4 items-center bg-[hsl(243,27%,20%)] py-4 px-3 lg:h-37.5 border border-white/10 cursor-pointer hover:opacity-75 transition duration-75 rounded-xl"
    >
      <p className="font-medium text-sm sm:text-base md:text-sm lg:text-xs xl:text-sm">
        {day}
      </p>
      <div className="relative">
        <WeatherIcon code={weatherCode} className="object-contain w-12 h-12" />
      </div>
      <div
        className="flex items-center self-center justify-between
                w-full max-w-20
                sm:max-w-22 sm:text-lg
                md:text-base md:max-w-18
                lg:text-sm lg:max-w-16"
      >
        <span className="font-bold">{temp}</span>
        <span className="text-white/70">{feelsLike}</span>
      </div>
    </li>
  );
});

interface DailyItemProps {
  formattedDay: {
    day: string;
    weatherCode: number;
    temp: string;
    feelsLike: string;
    date: string;
  };
  changeDayIndex: (index: number) => void;
  index: number;
}
