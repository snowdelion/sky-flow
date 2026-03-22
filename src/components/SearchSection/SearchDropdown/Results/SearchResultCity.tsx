import Image from "next/image";
import React from "react";

import type { SearchDataItem } from "@/components/SearchSection/types/SearchData";

import { useSearchResultCity } from "./useSearchResultCity";

export const SearchResultCity = React.memo(function SearchResultCity({
  data,
  inputRef,
}: SearchResultCityProps) {
  const { handleClick, icon, displayName, temperature, temperatureUnit } =
    useSearchResultCity(data, inputRef);

  return (
    <li
      onClick={handleClick}
      className="h-(--item-height) flex justify-between font-medium gap-4 sm:gap-8 mx-1 px-2 sm:mx-2 sm:px-3 text-white hover:bg-[hsl(243,23%,30%)] active:opacity-75 rounded-xl cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <Image
          src={icon}
          className="w-8 h-8 lg:w-10 lg:h-10"
          alt="Weather Icon"
        />
        <span className="text-sm sm:text-base" title={displayName}>
          {displayName}
        </span>
      </div>

      <div className="flex items-center gap-1 font-bold">
        <span className="text-base md:text-lg">{Math.round(temperature)}</span>
        <span className="text-white/70 text-sm md:text-base">
          {temperatureUnit}
        </span>
      </div>
    </li>
  );
});

interface SearchResultCityProps {
  data: SearchDataItem;
  inputRef: React.RefObject<HTMLInputElement | null>;
}
