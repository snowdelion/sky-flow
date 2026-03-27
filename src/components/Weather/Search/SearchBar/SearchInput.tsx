import { ComponentPropsWithoutRef, forwardRef } from "react";

import { useSearchActions } from "@/components/Weather/Search/hooks/useSearchActions";
import { useSearchStore } from "@/stores/useSearchStore";

export const SearchInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>((props, ref) => {
  const { handleKeydown, handleChangeInput } = useSearchActions();
  const setIsOpen = useSearchStore((state) => state.setIsOpen);
  const inputValue = useSearchStore((state) => state.inputValue);

  return (
    <input
      {...props}
      ref={ref}
      aria-label="Search"
      value={inputValue}
      onKeyDown={(e) =>
        handleKeydown(e, ref as React.RefObject<HTMLInputElement>)
      }
      onChange={(e) => handleChangeInput(e)}
      onFocus={() => setIsOpen(true)}
      onBlur={(e) => {
        if (e.relatedTarget?.closest('[role="listbox"]')) return;
        setIsOpen(false);
      }}
      className="flex-1 w-full min-w-0 bg-transparent placeholder-white/70 text-base sm:text-lg outline-none"
    />
  );
});
SearchInput.displayName = "SearchInput";
