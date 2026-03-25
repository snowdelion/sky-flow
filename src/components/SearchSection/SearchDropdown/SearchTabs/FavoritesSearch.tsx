import React, { useCallback, useMemo } from "react";

import { FavoriteIcon } from "@/components/icons";
import { useSearchActions } from "@/components/SearchSection/hooks/useSearchActions";
import { useSearchHistory } from "@/components/SearchSection/hooks/useSearchHistory";
import type { SearchTabProps } from "@/components/SearchSection/types/history";
import { isFoundCity } from "@/types/location";

export const FavoritesSearch = React.memo(function FavoritesSearch({
  data,
  inputRef,
  dropdownRef,
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
      className="flex justify-between h-9.5 sm:h-8.5 xl:h-10 gap-4 mx-2 px-5 my-2 text-white hover:bg-[hsl(243,23%,30%)] rounded-xl"
    >
      <button
        role="button"
        type="button"
        aria-label={`Select ${displayName}`}
        onClick={handleClick}
        className="font-light leading-4 lg:leading-5 py-2 text-xs sm:text-sm xl:text-base flex flex-1 text-start items-center gap-1 sm:gap-2 cursor-pointer"
      >
        {displayName}
      </button>

      <button
        role="button"
        type="button"
        aria-label="Remove from favorites"
        tabIndex={-1}
        onPointerDown={(e) => {
          e.preventDefault();
          inputRef.current?.blur();
          dropdownRef.current?.focus();
        }}
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
