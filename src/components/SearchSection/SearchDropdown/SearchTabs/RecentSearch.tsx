import React, { useCallback, useMemo } from "react";

import { XIcon } from "@/components/icons";
import { FavoriteIcon } from "@/components/icons";
import { useSearchActions } from "@/components/SearchSection/hooks/useSearchActions";
import { useSearchHistory } from "@/components/SearchSection/hooks/useSearchHistory";
import type { SearchTabProps } from "@/components/SearchSection/types/history";
import { isFoundCity } from "@/types/location";
import { capitalizeString } from "@/utils/formatters";

export const RecentSearch = React.memo(function RecentSearch({
  data,
  inputRef,
}: SearchTabProps) {
  const { searchSelectedCity } = useSearchActions();

  const { toggleFavorite, removeCity } = useSearchHistory();

  const displayPlace = useMemo(
    () => `${capitalizeString(data.city)}, ${capitalizeString(data.country)}`,
    [data.city, data.country],
  );

  const handleFavoriteIcon = useCallback(() => {
    toggleFavorite(data.id);
  }, [toggleFavorite, data.id]);

  const handleClick = useCallback(() => {
    const { city, country, latitude: lat, longitude: lon } = data;
    if (isFoundCity({ status: "found", city, country, lat, lon }))
      searchSelectedCity(
        { status: "found", city, country, lat, lon },
        inputRef,
      );
  }, [data, searchSelectedCity, inputRef]);

  return (
    <li
      role="option"
      aria-selected="false"
      aria-label={displayPlace}
      className="flex justify-between font-medium mx-2 px-5 py-3 my-3 text-white hover:bg-[hsl(243,23%,30%)] rounded-xl"
    >
      <button
        role="button"
        aria-label={`Select ${displayPlace}`}
        onClick={handleClick}
        className="font-normal text-sm sm:text-base md:text-lg flex flex-1 text-start items-center gap-1 sm:gap-2 cursor-pointer"
      >
        {displayPlace}
      </button>

      <div className="flex items-center gap-1 sm:gap-3 opacity-70">
        <button
          role="button"
          aria-label="Toggle favorite"
          onClick={handleFavoriteIcon}
        >
          <FavoriteIcon
            isFavorite={data.isFavorite}
            className="w-5 h-5 sm:w-6 sm:h-6 focus:outline-none hover:text-[hsl(233,100%,70%)] transition duration-100 cursor-pointer"
          />
        </button>
        <button
          role="button"
          aria-label="Remove from history"
          onClick={() => removeCity(data.id)}
        >
          <XIcon className="w-5.5 h-5.5 sm:w-6 sm:h-6 hover:text-red-400 cursor-pointer" />
        </button>
      </div>
    </li>
  );
});
