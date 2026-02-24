"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

import { useSearchActions } from "@/hooks/useSearchActions";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";

import { SearchField } from "./SearchField";

export default function SearchSection() {
  const { searchCityWithName } = useSearchActions();
  const { inputValue, _hasHydrated, setIsOpen } = useSearchStore(
    useShallow((state) => ({
      inputValue: state.inputValue,
      _hasHydrated: state._hasHydrated,
      setIsOpen: state.setIsOpen,
    })),
  );
  const { addCity } = useSearchHistory();
  const searchParams = useSearchParams();

  const isSync = useRef(false);

  useEffect(() => {
    if (isSync.current || !_hasHydrated) return;

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const city = searchParams.get("city");
    const country = searchParams.get("country");

    if (lat && lon && city && country) {
      setIsOpen(false);
      addCity({ city, country, lat: +lat, lon: +lon });
    }
    isSync.current = true;
  }, [addCity, searchParams, _hasHydrated, setIsOpen]);

  return (
    <section className="mb-10">
      <h1 className="text-5xl bg-linear-to-b from-[#F0F9FF] via-[#6366F1] to-[#312E81] bg-clip-text text-transparent max-w-80 sm:max-w-full leading-tight justify-self-center sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-15">
        How&apos;s the sky looking today?
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchCityWithName(inputValue);
        }}
        className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
      >
        <SearchField />
        <button className="bg-[hsl(233,67%,56%)] text-white font-medium py-3 px-6 rounded-xl text-base sm:text-lg whitespace-nowrap hover:opacity-90 transition-opacity">
          Search
        </button>
      </form>
    </section>
  );
}
