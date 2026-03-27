import Image from "next/image";
import React from "react";

import type { HourlyItem } from "@/types/weather";

import { HourDisplay } from "./HourDisplay";

export default React.memo(function HourlyItem({
  hour,
  hourFormat,
  tempUnit,
}: HourlyItemProps) {
  const { hour: hourItem, image, temp } = hour;

  return (
    <li className="flex items-center justify-between bg-[hsl(243,23%,24%)] hover:opacity-75 px-3 py-2 lg:py-2.25 rounded-lg border border-white/10">
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Image
          src={image}
          alt={`${hourItem} weather`}
          className="object-contain relative w-10 h-10"
        />
        <HourDisplay hourItem={hourItem} hourFormat={hourFormat} />
      </div>

      <div className="flex items-center gap-1">
        <span className="text-lg font-light">{temp.toFixed(1)}</span>
        <span className="text-white/70 text-xs sm:text-sm xl:text-lg">
          {tempUnit}
        </span>
      </div>
    </li>
  );
});

interface HourlyItemProps {
  hour: HourlyItem;
  hourFormat: "12" | "24";
  tempUnit: "°C" | "°F";
}
