import type { StaticImageData } from "next/image";
import { useCallback, useMemo } from "react";

import { useSearchActions } from "@/components/Weather/Search/hooks/useSearchActions";
import type { SearchDataItem } from "@/components/Weather/Search/types/SearchData";
import { isFoundCity } from "@/types/location";
import { formatCityDisplay } from "@/utils/formatters";
import { getWeatherIcon } from "@/utils/weather";

export function useSearchResultCity(
  data: SearchDataItem,
  inputRef: React.RefObject<HTMLInputElement | null>,
): UseSearchResultCityReturn {
  const {
    weatherCode,
    city,
    country,
    temperature,
    temperatureUnit,
    latitude: lat,
    longitude: lon,
    code,
    region,
  } = data;
  const { searchSelectedCity } = useSearchActions();

  const icon = useMemo(() => getWeatherIcon(weatherCode), [weatherCode]);
  const cityData = useMemo(
    () => ({
      status: "found" as const,
      city,
      country,
      lat,
      lon,
      code,
      region,
    }),
    [city, country, lat, lon, code, region],
  );

  const displayName = useMemo(() => formatCityDisplay(cityData), [cityData]);

  const handleClick = useCallback(() => {
    if (isFoundCity(cityData)) searchSelectedCity(cityData, inputRef);
  }, [searchSelectedCity, cityData, inputRef]);

  return useMemo(
    () => ({
      handleClick,
      icon,
      city,
      country,
      temperature,
      temperatureUnit,
      displayName,
    }),
    [
      handleClick,
      icon,
      city,
      country,
      temperature,
      temperatureUnit,
      displayName,
    ],
  );
}

interface UseSearchResultCityReturn {
  handleClick: () => void;
  icon: StaticImageData;
  city: string;
  country?: string;
  temperature: number;
  temperatureUnit: string;
  displayName: string;
}
