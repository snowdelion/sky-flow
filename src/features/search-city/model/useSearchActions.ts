"use client";
import { usePathname, useRouter } from "next/navigation";
import { RefObject, useCallback, useMemo } from "react";
import { useGeoQuery, useSearchHistory } from "@/entities/location";
import { useSearchState } from "@/entities/location";
import { type CityData, isFoundCity } from "@/shared/types";
import { mapCityToUrlParams } from "./mapCityToUrlParams";

export function useSearchActions() {
  const { setInputValue, setIsOpen, inputValue } = useSearchState();

  const { addCity } = useSearchHistory();
  const router = useRouter();
  const pathname = usePathname();

  const searchSelectedCity = useCallback(
    (cityData: CityData, inputRef?: RefObject<HTMLInputElement | null>) => {
      inputRef?.current?.blur();
      setIsOpen(false);
      setInputValue("");

      const params = mapCityToUrlParams(cityData);
      if (isFoundCity(cityData)) addCity(cityData);

      router.push(`${pathname}?${params.toString()}`);
    },
    [addCity, pathname, router, setInputValue, setIsOpen],
  );

  const { refetch } = useGeoQuery(inputValue);
  const searchCityWithName = useCallback(
    async (city: string) => {
      const targetCity = city.trim().toLowerCase();
      if (!targetCity) return;
      const { data: geoData } = await refetch();

      if (!geoData || geoData.results.length === 0) {
        searchSelectedCity({ status: "not-found", city: inputValue });
        return;
      }

      searchSelectedCity({
        status: "found",
        city: geoData.results[0].city,
        country: geoData.results?.[0]?.country,
        region: geoData.results?.[0]?.region,
        code: geoData.results?.[0]?.code,
        lat: geoData.results[0].lat,
        lon: geoData.results[0].lon,
      });
    },
    [searchSelectedCity, inputValue, refetch],
  );

  return useMemo(
    () => ({
      searchSelectedCity,
      searchCityWithName,
    }),
    [searchSelectedCity, searchCityWithName],
  );
}
