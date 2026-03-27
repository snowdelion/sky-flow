import { useShallow } from "zustand/shallow";

import { useSearchActions } from "@/components/Weather/Search/hooks/useSearchActions";
import { useSearchStore } from "@/stores/useSearchStore";

import { SearchPlaceholder } from "./Results/SearchPlaceholder";
import { SearchResultCity } from "./Results/SearchResultCity";
import { SearchResultsSkeleton } from "./Results/SearchResultsSkeleton";
import { SearchTabs } from "./SearchTabs/SearchTabs";

export function SearchDropdown({
  inputRef,
  dropdownRef,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { isOpen, inputValue, setIsOpen } = useSearchStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      inputValue: s.inputValue,
      setIsOpen: s.setIsOpen,
    })),
  );

  const { resultData, shouldSearchSkeleton, handleChangeTab } =
    useSearchActions();

  if (!isOpen) return null;

  const renderContent = () => {
    if (inputValue.trim().length === 0)
      return (
        <SearchTabs
          handleChangeTab={handleChangeTab}
          inputRef={inputRef}
          dropdownRef={dropdownRef}
        />
      );

    if (shouldSearchSkeleton) return <SearchResultsSkeleton />;

    if (!resultData || resultData.length === 0) {
      return <SearchPlaceholder inputValue={inputValue} />;
    } else {
      return (
        <div
          role="listbox"
          tabIndex={-1}
          style={{ "--item-height": "60px" } as React.CSSProperties}
          className={`overflow-hidden absolute -left-5 top-5 sm:top-6 right-0 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-10 mt-1 ${isOpen ? "visible" : "invisible"}`}
        >
          <ul className="overflow-y-auto max-h-[calc(var(--item-height)*5)] xl:max-h-full my-2 custom-scrollbar">
            {resultData.map((data) => (
              <SearchResultCity key={data.id} data={data} inputRef={inputRef} />
            ))}
          </ul>
        </div>
      );
    }
  };

  return (
    <div
      tabIndex={-1}
      ref={dropdownRef}
      onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(e) => {
        if (e.relatedTarget?.closest('[role="listbox"]')) return;
        setIsOpen(false);
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {renderContent()}
    </div>
  );
}
