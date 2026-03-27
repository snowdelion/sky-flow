import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

import { useSearchHistory } from "@/components/Weather/Search/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";
import { isNotFoundCity, type CityData } from "@/types/location";

export function useSyncSearch(cityData: CityData): void {
  const { _hasHydrated, setIsOpen } = useSearchStore(
    useShallow((s) => ({
      _hasHydrated: s._hasHydrated,
      setIsOpen: s.setIsOpen,
    })),
  );
  const isSync = useRef(false);
  const { addCity } = useSearchHistory();
  const shouldReturn =
    isSync.current || !_hasHydrated || isNotFoundCity(cityData);

  useEffect(() => {
    if (shouldReturn) return;

    setIsOpen(false);
    if (cityData) addCity(cityData);
    isSync.current = true;
  }, [cityData, _hasHydrated, addCity, shouldReturn, setIsOpen]);
}
