import { SearchIcon, FailedSearchIcon } from "@shared/ui"

export function SearchPlaceholder({ inputValue, isError }: SearchPlaceholderProps) {
  const isNotEnoughChars = inputValue.length > 0 && inputValue.length < 2

  let message = "City not found!"
  if (isError) message = "Check your network connection!"
  else if (isNotEnoughChars) message = "Type at least 2 characters to search..."
  else if (inputValue.length <= 50) message = `City ${inputValue} not found!`

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
          {message}
        </span>
      </div>
    </div>
  )
}

type SearchPlaceholderProps = {
  inputValue: string
  isError: boolean
}
