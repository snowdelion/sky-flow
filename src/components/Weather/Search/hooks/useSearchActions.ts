import { usePathname, useRouter } from "next/navigation";
import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  SubmitEvent,
  useCallback,
  useMemo,
} from "react";
import { useDebounce } from "use-debounce";
import { useShallow } from "zustand/shallow";

import type { ActiveTab } from "@/components/Weather/Search/types/history";
import { SearchDataItem } from "@/components/Weather/Search/types/SearchData";
import { fetchGeoData } from "@/services/fetchGeoData";
import { useSearchStore } from "@/stores/useSearchStore";
import { isFoundCity, type CityData } from "@/types/location";

import { useSearchHistory } from "./useSearchHistory";
import { useSearchQuery } from "./useSearchQuery";

export function useSearchActions(): UseSearchActionsReturn {
  const { setInputValue, setCurrentTab, inputValue, setIsOpen } =
    useSearchStore(
      useShallow((state) => ({
        setInputValue: state.setInputValue,
        setCurrentTab: state.setCurrentTab,
        inputValue: state.inputValue,
        setIsOpen: state.setIsOpen,
      })),
    );

  const [delayValue, { isPending }] = useDebounce(inputValue, 500);
  const isDebouncing = isPending();

  const { data: resultData, isFetching: isDelayFetching } =
    useSearchQuery(delayValue);

  const shouldSearchSkeleton =
    (isDebouncing || isDelayFetching) && !!inputValue.trim();

  const { addCity } = useSearchHistory();

  const router = useRouter();
  const pathname = usePathname();

  const handleChangeTab = useCallback(
    (value: ActiveTab): void => {
      setCurrentTab(value);
    },
    [setCurrentTab],
  );

  const searchSelectedCity = useCallback(
    (
      cityData: CityData,
      inputRef?: RefObject<HTMLInputElement | null>,
    ): void => {
      inputRef?.current?.blur();
      setIsOpen(false);
      setInputValue("");

      const { city } = cityData;

      const params = new URLSearchParams();
      params.set("city", city);

      if (isFoundCity(cityData)) {
        const { country, lat, lon, region, code } = cityData;
        if (region) params.set("region", region);
        if (country) params.set("country", country);
        if (code) params.set("code", code);
        params.set("lat", lat.toString());
        params.set("lon", lon.toString());

        addCity(cityData);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [addCity, pathname, router, setInputValue, setIsOpen],
  );

  const searchCityWithName = useCallback(
    async (city: string): Promise<void> => {
      const targetCity = city.trim().toLowerCase();
      if (!targetCity) return;
      const geoData = await fetchGeoData(targetCity);

      if (!geoData || geoData.results.length === 0) {
        searchSelectedCity({ status: "not-found", city: inputValue });
        return;
      }

      searchSelectedCity({
        status: "found",
        city: geoData.results[0].name,
        country: geoData.results?.[0]?.country,
        region: geoData.results?.[0]?.admin1,
        code: geoData.results?.[0]?.feature_code,
        lat: geoData.results[0].latitude,
        lon: geoData.results[0].longitude,
      });
    },
    [searchSelectedCity, inputValue],
  );

  const handleKeydown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      inputRef: RefObject<HTMLInputElement | null>,
    ): void => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchCityWithName(inputValue);
        inputRef?.current?.blur();
        setIsOpen(false);
        setInputValue("");
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        if (inputRef.current) inputRef.current.blur();
      }
    },
    [inputValue, searchCityWithName, setInputValue, setIsOpen],
  );

  const handleChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setInputValue(e.target.value);
      setIsOpen(true);
    },
    [setIsOpen, setInputValue],
  );

  const handleSubmit = useCallback(
    (e: SubmitEvent<HTMLFormElement>): void => {
      e.preventDefault();
      searchCityWithName(inputValue);
    },
    [searchCityWithName, inputValue],
  );

  return useMemo(
    () => ({
      handleChangeTab,
      searchSelectedCity,
      handleKeydown,
      handleChangeInput,
      resultData,
      searchCityWithName,
      shouldSearchSkeleton,
      handleSubmit,
    }),
    [
      handleChangeTab,
      searchSelectedCity,
      handleKeydown,
      handleChangeInput,
      resultData,
      searchCityWithName,
      shouldSearchSkeleton,
      handleSubmit,
    ],
  );
}

interface UseSearchActionsReturn {
  handleChangeTab: (value: ActiveTab) => void;
  searchSelectedCity: (
    cityData: CityData,
    inputRef?: RefObject<HTMLInputElement | null>,
  ) => void;
  handleKeydown: (
    e: KeyboardEvent<HTMLInputElement>,
    inputRef: RefObject<HTMLInputElement | null>,
  ) => void;
  handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  resultData: SearchDataItem[] | null | undefined;
  searchCityWithName: (city: string) => Promise<void>;
  shouldSearchSkeleton: boolean;
  handleSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}
