import { useCallback } from "react";
import { useDebounce } from "use-debounce";
import { useSearchStore } from "@/entities/location";
import { useGeoQuery } from "@/entities/location";
import { useSettingsStore } from "@/entities/settings";
import { useSearchQuery } from "@/entities/weather";

export function useSearchCity() {
  const inputValue = useSearchStore((s) => s.inputValue);
  const [delayValue, { isPending, flush }] = useDebounce(inputValue, 500);
  const isDebouncing = isPending();

  const {
    data,
    isFetching: isGeoFetching,
    isError: isGeoError,
    refetch: geoRefetch,
  } = useGeoQuery(delayValue);

  const refetch = useCallback(async () => {
    flush();
    await Promise.resolve();
    return await geoRefetch({ cancelRefetch: true });
  }, [flush, geoRefetch]);

  const units = useSettingsStore((s) => s.units);
  const {
    data: resultData,
    isFetching: isDelayFetching,
    isError: isSearchError,
  } = useSearchQuery(data || EMPTY_GEO, units);

  const isError = isGeoError || isSearchError;
  const shouldSearchSkeleton =
    (isDebouncing || isDelayFetching || isGeoFetching) && !!inputValue.trim();

  return { shouldSearchSkeleton, resultData, isError, refetch };
}

const EMPTY_GEO = { results: [] };
