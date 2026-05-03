import { useDebounce } from "use-debounce";
import { useSearchStore } from "@/entities/location";
import { useGeoQuery } from "@/entities/location";
import { useSettingsStore } from "@/entities/settings";
import { useSearchQuery } from "@/entities/weather";

export function useSearchCity() {
  const inputValue = useSearchStore((s) => s.inputValue);
  const [delayValue, { isPending }] = useDebounce(inputValue, 500);
  const isDebouncing = isPending();

  const { data, isFetching: isGeoFetching } = useGeoQuery(delayValue);

  const units = useSettingsStore((s) => s.units);
  const { data: resultData, isFetching: isDelayFetching } = useSearchQuery(
    data || { results: [] },
    units,
  );

  const shouldSearchSkeleton =
    (isDebouncing || isDelayFetching || isGeoFetching) && !!inputValue.trim();

  return {
    shouldSearchSkeleton,
    resultData,
  };
}
