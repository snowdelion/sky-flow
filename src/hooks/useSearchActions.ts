import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useShallow } from "zustand/shallow";

import type { ActiveTab } from "@/components/SearchSection/SearchField.types";
import { fetchGeoData } from "@/services/fetchGeoData";
import { useSearchStore } from "@/stores/useSearchStore";
import type { CityData } from "@/types/api/CityData";
import { capitalizeString } from "@/utils/formatters";

import type { UseSearchActionsReturn } from "./useSearchActions.types";
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

  const handleChangeTab = (value: ActiveTab): void => {
    setCurrentTab(value);
  };

  const searchSelectedCity = (
    cityData: CityData,
    inputRef?: React.RefObject<HTMLInputElement | null>,
  ): void => {
    inputRef?.current?.blur();
    setIsOpen(false);
    setInputValue("");

    if (cityData) {
      addCity(cityData);
    }

    const latStr = cityData.lat.toString();
    const lonStr = cityData.lon.toString();

    const params = new URLSearchParams();
    params.set("city", capitalizeString(cityData.city));
    params.set("country", capitalizeString(cityData.country));
    params.set("lat", latStr);
    params.set("lon", lonStr);
    router.push(`${pathname}?${params.toString()}`);
  };

  const searchCityWithName = async (city: string): Promise<void> => {
    const targetCity = city.trim().toLowerCase();
    if (!targetCity) return;

    const geoData = await fetchGeoData(targetCity);

    const cityData = {
      city: geoData.results[0].name,
      country: geoData.results[0].country,
      lat: geoData.results[0].latitude,
      lon: geoData.results[0].longitude,
    };

    searchSelectedCity(cityData);
  };

  const handleKeydown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputRef: React.RefObject<HTMLInputElement | null>,
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
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  return {
    handleChangeTab,
    searchSelectedCity,
    handleKeydown,
    handleChangeInput,
    resultData,
    searchCityWithName,
    shouldSearchSkeleton,
  };
}
