import React, { useCallback, useMemo } from "react";

import { FavoriteIcon } from "@/components/icons";
import { useSearchActions } from "@/components/SearchSection/hooks/useSearchActions";
import { useSearchHistory } from "@/components/SearchSection/hooks/useSearchHistory";
import type { SearchTabProps } from "@/components/SearchSection/types/history";
import { isFoundCity } from "@/types/location";
import { capitalizeString } from "@/utils/formatters";

export const FavoritesSearch = React.memo(function FavoritesSearch({
  data,
  inputRef,
}: SearchTabProps) {
  const { searchSelectedCity } = useSearchActions();
  const { removeFavorite } = useSearchHistory();

  const displayPlace = useMemo(
    () => `${capitalizeString(data.city)}, ${capitalizeString(data.country)}`,
    [data.city, data.country],
  );

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
        className="flex flex-1 items-center text-start gap-1 sm:gap-2 cursor-pointer font-normal text-sm sm:text-base md:text-lg"
      >
        {displayPlace}
      </button>

      <button
        role="button"
        aria-label="Remove from favorites"
        onClick={() => removeFavorite(data.id)}
        className="flex items-center gap-1 sm:gap-3 opacity-70"
      >
        <FavoriteIcon
          isFilled={true}
          className="w-5 h-5 sm:w-6 sm:h-6 focus:outline-none hover:text-[hsl(233,100%,70%)] transition duration-100 cursor-pointer"
        />
      </button>
    </li>
  );
});
