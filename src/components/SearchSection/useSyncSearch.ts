import { useEffect, useRef } from "react";

import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";
import type { CityData } from "@/types/api/CityData";

export function useSyncSearch(cityData: CityData): void {
  const isSync = useRef(false);
  const { addCity } = useSearchHistory();
  const _hasHydrated = useSearchStore((state) => state._hasHydrated);
  const setIsOpen = useSearchStore((state) => state.setIsOpen);

  useEffect(() => {
    if (isSync.current || !_hasHydrated || !cityData) return;
    setIsOpen(false);
    addCity(cityData);
    isSync.current = true;
  }, [cityData, _hasHydrated, setIsOpen, addCity]);
}
