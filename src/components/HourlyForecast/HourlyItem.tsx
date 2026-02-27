import Image from "next/image";
import React from "react";

import type { HourlyItem } from "@/types/api/WeatherHourly";

import { getHour } from "./hourly-utils";

export default React.memo(function HourlyItem({
  hour,
  hourFormat,
  tempUnit,
}: HourlyItemProps) {
  const { hour: hourItem, image, temp } = hour;

  return (
    <li className="flex items-center justify-between bg-[hsl(243,23%,24%)] hover:opacity-75 py-1 md:py-1.5 px-3 lg:py-1.75 xl:p-3 rounded-lg border border-white/10">
      <div className="flex items-center gap-3">
        <Image
          src={image}
          alt={`${hourItem} weather`}
          className="object-contain relative w-8 h-8"
        />
        {getHour(hourItem, hourFormat)}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-md xl:text-xl font-bold">{temp.toFixed(1)}</span>
        <span className="text-white/70 text-base xl:text-lg">{tempUnit}</span>
      </div>
    </li>
  );
});

interface HourlyItemProps {
  hour: HourlyItem;
  hourFormat: "12" | "24";
  tempUnit: "°C" | "°F";
}
