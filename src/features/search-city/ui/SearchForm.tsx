import { useRef } from "react";
import { useSearchHandlers } from "../model/useSearchHandlers";
import { SearchBar } from "./search-bar/SearchBar";
import { SearchDropdown } from "./search-dropdown/SearchDropdown";

export function SearchForm({ isError }: SearchFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { handleSubmit } = useSearchHandlers();

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      role="form"
      className="flex flex-col sm:flex-row gap-3 max-w-98.25 sm:max-w-150 md:max-w-2xl mx-auto"
    >
      <div
        role="group"
        aria-label="Search input group"
        className={`relative grid w-full items-center flex-1 group bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,27%,20%)]/80 focus-within:bg-[hsl(243,27%,20%)]/80 focus-within:ring-2 focus-within:ring-[hsl(233,67%,56%)] transition duration-75 rounded-xl px-4 py-3 ${isError ? "ring-1 ring-red-500/50" : ""}`}
      >
        <SearchBar inputRef={inputRef} isError={isError} />
        <SearchDropdown inputRef={inputRef} dropdownRef={dropdownRef} />
      </div>

      <button
        type="submit"
        className="bg-[hsl(233,67%,56%)] text-white font-medium py-3 px-6 rounded-xl text-base sm:text-lg whitespace-nowrap hover:opacity-90 transition-opacity"
      >
        Search
      </button>
    </form>
  );
}

interface SearchFormProps {
  isError: boolean;
}
