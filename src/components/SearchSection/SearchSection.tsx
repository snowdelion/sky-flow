"use client";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

import { useSearchActions } from "@/hooks/useSearchActions";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { useSearchStore } from "@/stores/useSearchStore";
import type { CityData } from "@/types/api/CityData";

import { SearchBar } from "./SearchBar";
import { SearchDropdown } from "./SearchDropdown";

export default function SearchSection({ cityData }: { cityData: CityData }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchCityWithName } = useSearchActions();
  const { inputValue, _hasHydrated, setIsOpen } = useSearchStore(
    useShallow((state) => ({
      inputValue: state.inputValue,
      _hasHydrated: state._hasHydrated,
      setIsOpen: state.setIsOpen,
    })),
  );
  const { addCity } = useSearchHistory();

  const { isError, error } = useWeatherQuery(cityData);

  const isSync = useRef(false);

  useEffect(() => {
    if (isSync.current || !_hasHydrated) return;

    if (cityData) {
      setIsOpen(false);
      addCity({ ...cityData });
    }

    isSync.current = true;
  }, [addCity, cityData, _hasHydrated, setIsOpen]);

  return (
    <section className="mb-10">
      <h1 className="text-5xl bg-linear-to-b from-[#F0F9FF] via-[#9d9fff] to-[#413dac] bg-clip-text text-transparent max-w-80 sm:max-w-full leading-tight justify-self-center sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-15">
        How&apos;s the sky looking today?
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchCityWithName(inputValue);
        }}
        className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
      >
        <div
          role="group"
          aria-label="Search input group"
          className={`relative grid w-full items-center flex-1 group bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,27%,20%)]/80 focus-within:bg-[hsl(243,27%,20%)]/80 focus-within:ring-2 focus-within:ring-[hsl(233,67%,56%)] transition duration-75 rounded-xl px-4 py-3 ${isError ? "ring-1 ring-red-500/50" : ""}`}
        >
          <SearchBar inputRef={inputRef} error={error} />
          <SearchDropdown inputRef={inputRef} />
        </div>

        <button className="bg-[hsl(233,67%,56%)] text-white font-medium py-3 px-6 rounded-xl text-base sm:text-lg whitespace-nowrap hover:opacity-90 transition-opacity">
          Search
        </button>
      </form>
    </section>
  );
}
