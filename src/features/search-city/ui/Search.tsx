"use client";

import { memo } from "react";
import { useSettingsStore } from "@/entities/settings";
import { useWeatherQuery } from "@/entities/weather";
import { type CityData } from "@/shared/types";
import { useSyncSearch } from "../model/useSyncSearch";
import { SearchForm } from "./SearchForm";

export function Search({ cityData }: { cityData: CityData }) {
  const units = useSettingsStore((s) => s.units);
  const { isError } = useWeatherQuery(cityData, units);

  useSyncSearch(cityData);

  return (
    <section className="mb-10">
      <SearchHeader />

      <SearchForm isError={isError} />
    </section>
  );
}

const SearchHeader = memo(function SearchHeader() {
  return (
    <h1 className="text-5xl bg-linear-to-b from-[#F0F9FF] via-[#9d9fff] to-[#413dac] bg-clip-text text-transparent max-w-80 sm:max-w-full leading-tight justify-self-center sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-15">
      How&apos;s the sky looking today?
    </h1>
  );
});
