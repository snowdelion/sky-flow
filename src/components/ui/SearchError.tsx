"use client";

import Image from "next/image";

import retryIcon from "@/../public/icons/icon-retry.svg";
import { useSearchStore } from "@/stores/useSearchStore";

import { useSearchActions } from "../Weather/Search/hooks/useSearchActions";

export function SearchError({ message }: { message: string }) {
  const lastValidatedCity = useSearchStore((s) => s.lastValidatedCity);
  const { searchSelectedCity } = useSearchActions();

  return (
    <div className="flex flex-col items-center gap-10">
      <h2 className="text-3xl font-bold">{`City ${message} not found...`}</h2>
      <button
        onClick={() => searchSelectedCity(lastValidatedCity)}
        className="flex items-center gap-2 px-4 py-3 bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,23%,24%)] transition rounded-lg"
      >
        <Image src={retryIcon} alt="Retry" />
        <span>Go back</span>
      </button>
    </div>
  );
}
