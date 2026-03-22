import React, { useCallback, useMemo } from "react";

import { FavoriteIcon } from "@/components/icons";
import { useSearchActions } from "@/components/SearchSection/hooks/useSearchActions";
import { useSearchHistory } from "@/components/SearchSection/hooks/useSearchHistory";
import type { SearchTabProps } from "@/components/SearchSection/types/history";
import { isFoundCity } from "@/types/location";

export const FavoritesSearch = React.memo(function FavoritesSearch({
  data,
  inputRef,
}: SearchTabProps) {
  const { searchSelectedCity } = useSearchActions();
  const { removeFavorite } = useSearchHistory();

  const displayName = useMemo(
    () => data.displayName ?? `${data.city}, ${data.country}`,
    [data.city, data.country, data.displayName],
  );

  const handleClick = useCallback(() => {
    const cityData = {
      status: "found" as const,
      city: data.city,
      country: data.country,
      lat: data.latitude,
      lon: data.longitude,
      region: data.region,
      code: data.code,
    };

    if (isFoundCity(cityData)) searchSelectedCity(cityData, inputRef);
  }, [data, searchSelectedCity, inputRef]);

  return (
    <li
      role="option"
      aria-selected="false"
      aria-label={displayName}
      className="flex justify-between gap-4 font-medium mx-2 px-5 my-2 text-white hover:bg-[hsl(243,23%,30%)] rounded-xl"
    >
      <button
        role="button"
        aria-label={`Select ${displayName}`}
        onClick={handleClick}
        className="font-normal py-2 text-sm md:text-base flex flex-1 text-start items-center gap-1 sm:gap-2 cursor-pointer"
      >
        {displayName}
      </button>

      <button
        role="button"
        aria-label="Remove from favorites"
        onClick={() => removeFavorite(data.id)}
        className="flex items-center opacity-70"
      >
        <FavoriteIcon
          isFilled={true}
          className="w-5 h-5 focus:outline-none hover:text-[hsl(233,100%,70%)] transition duration-100 cursor-pointer"
        />
      </button>
    </li>
  );
});
