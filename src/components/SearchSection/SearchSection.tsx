"use client";

import { useRef } from "react";

import { useSearchActions } from "@/hooks/useSearchActions";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { useSearchStore } from "@/stores/useSearchStore";
import type { CityData } from "@/types/api/CityData";

import { SearchBar } from "./SearchBar";
import { SearchDropdown } from "./SearchDropdown";
import { useSyncSearch } from "./useSyncSearch";

export default function SearchSection({ cityData }: { cityData: CityData }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchCityWithName } = useSearchActions();
  const { isError, error } = useWeatherQuery(cityData);
  const inputValue = useSearchStore((state) => state.inputValue);

  useSyncSearch(cityData);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    searchCityWithName(inputValue);
  };

  return (
    <section className="mb-10">
      <h1 className="text-5xl bg-linear-to-b from-[#F0F9FF] via-[#9d9fff] to-[#413dac] bg-clip-text text-transparent max-w-80 sm:max-w-full leading-tight justify-self-center sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-15">
        How&apos;s the sky looking today?
      </h1>

      <form
        onSubmit={handleSubmit}
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
