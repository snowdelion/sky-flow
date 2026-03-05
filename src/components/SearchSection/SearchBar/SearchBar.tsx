import Image from "next/image";

import searchIcon from "@/../public/icons/icon-search.svg";
import { XIcon } from "@/components/icons";
import { useSearchActions } from "@/components/SearchSection/hooks/useSearchActions";
import { useSearchStore } from "@/stores/useSearchStore";

import { SearchInput } from "./SearchInput";

export function SearchBar({ inputRef, isError }: SearchBarProps) {
  const { searchCityWithName } = useSearchActions();
  const inputValue = useSearchStore((state) => state.inputValue);
  const setInputValue = useSearchStore((state) => state.setInputValue);

  return (
    <div className="relative col-start-1 row-start-1 flex items-center w-full group">
      <Image
        src={searchIcon}
        className="w-5 h-5 mr-3 cursor-pointer shrink-0"
        alt="Search"
        onClick={() => searchCityWithName(inputValue)}
      />
      <SearchInput
        ref={inputRef}
        placeholder={
          isError ? "Something went wrong..." : "Search for a place..."
        }
      />

      {inputValue.length > 0 && (
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setInputValue("")}
          className="absolute -right-2.5 hover:cursor-pointer p-2.5 hover:bg-[#888888]/20 hover:rounded-full"
        >
          <XIcon className="w-5.5 h-5.5 opacity-50" />
        </button>
      )}
    </div>
  );
}

interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  isError: boolean;
}
