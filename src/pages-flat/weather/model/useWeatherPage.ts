import { useMemo } from "react";
import { useGeoQuery } from "@/entities/location";
import { useSettingsStore } from "@/entities/settings";
import { useWeatherQuery } from "@/entities/weather";
import { useDeviceType } from "@/shared/lib";
import { type CityData, isFoundCity, isNotFoundCity } from "@/shared/types";

export function useWeatherPage(cityData: CityData) {
  const { isDesk, isMobile, isSmallDesk, isTablet } = useDeviceType();
  const hasCoords =
    isFoundCity(cityData) &&
    typeof cityData.lat === "number" &&
    typeof cityData.lon === "number";

  const {
    data: geoData,
    isFetching: isGeoFetching,
    isFetched: isGeoFetched,
  } = useGeoQuery(cityData.city);

  const finalCoords = useMemo(() => {
    if (hasCoords) return { lat: cityData.lat, lon: cityData.lon };
    if (geoData?.results?.[0])
      return {
        lat: geoData.results[0].lat,
        lon: geoData.results[0].lon,
      };
  }, [hasCoords, cityData, geoData]);

  const finalCityData = useMemo<CityData>(() => {
    if (!finalCoords || isNotFoundCity(cityData))
      return { status: "not-found" as const, city: cityData.city };

    return {
      status: "found" as const,
      city: cityData.city,
      country: cityData.country,
      lat: finalCoords.lat,
      lon: finalCoords.lon,
      region: cityData.region,
      code: cityData.code,
    };
  }, [cityData, finalCoords]);

  const units = useSettingsStore((s) => s.units);
  const {
    data: weatherData,
    isFetching: isWeatherFetching,
    isFetched: isWeatherFetched,
    isError,
    error,
    refetch,
  } = useWeatherQuery(finalCityData, units);

  const isPending =
    (!hasCoords && !isGeoFetched && isGeoFetching) ||
    (finalCoords && !isWeatherFetched && isWeatherFetching) ||
    false;

  return {
    data: weatherData,
    isPending,
    isError,
    error,
    refetch,
    devices: { isDesk, isMobile, isSmallDesk, isTablet },
  };
}
