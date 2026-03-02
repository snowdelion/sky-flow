import type { StaticImageData } from "next/image";
import { useCallback, useMemo } from "react";

import { useSearchActions } from "@/components/SearchSection/hooks/useSearchActions";
import type { SearchDataItem } from "@/components/SearchSection/types/SearchData";
import { getWeatherIcon } from "@/utils/weather";

export function useSearchResultCity(
  data: SearchDataItem,
): UseSearchResultCityReturn {
  const {
    weatherCode,
    city,
    country,
    temperature,
    temperatureUnit,
    latitude,
    longitude,
  } = data;
  const { searchSelectedCity } = useSearchActions();

  const icon = useMemo(() => getWeatherIcon(weatherCode), [weatherCode]);

  const handleClick = useCallback(() => {
    searchSelectedCity({
      lat: latitude,
      lon: longitude,
      city,
      country,
    });
  }, [searchSelectedCity, latitude, city, longitude, country]);

  return useMemo(
    () => ({
      handleClick,
      icon,
      city,
      country,
      temperature,
      temperatureUnit,
    }),
    [handleClick, icon, city, country, temperature, temperatureUnit],
  );
}

interface UseSearchResultCityReturn {
  handleClick: () => void;
  icon: StaticImageData;
  city: string;
  country: string;
  temperature: number;
  temperatureUnit: string;
}
