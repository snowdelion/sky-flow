import { FailedSearchIcon } from "@/components/icons";
import { SearchIcon } from "@/components/icons/SearchIcon";

export function SearchPlaceholder({ inputValue }: { inputValue: string }) {
  const isNotEnoughChars = inputValue.length > 0 && inputValue.length < 2;

  const text = isNotEnoughChars
    ? `Type at least 2 characters to search...`
    : inputValue.length <= 50
      ? `City ${inputValue} not found!`
      : "City not found!";

  return (
    <div
      role="listbox"
      onMouseDown={(e) => e.preventDefault()}
      className="absolute -left-5 top-5 sm:top-6 right-0 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-10 mt-1"
    >
      <div className="h-75 flex flex-col items-center justify-center mb-5 gap-5">
        {isNotEnoughChars ? (
          <SearchIcon className="w-22 h-22 opacity-50" stroke="#60A5FA" />
        ) : (
          <FailedSearchIcon className="w-22 h-22 opacity-50" stroke="#60A5FA" />
        )}
        <span className="text-[#BFDBFE] opacity-75 text-base font-medium tracking-wide text-center">
          {text}
        </span>
      </div>
    </div>
  );
}
