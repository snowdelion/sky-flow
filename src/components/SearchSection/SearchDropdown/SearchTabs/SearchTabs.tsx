import { useShallow } from "zustand/shallow";

import { FavoriteIcon, HistoryIcon } from "@/components/icons";
import { useSearchHistory } from "@/components/SearchSection/hooks/useSearchHistory";
import type { ActiveTab } from "@/components/SearchSection/types/history";
import { useSearchStore } from "@/stores/useSearchStore";

import { CurrentTab } from "./CurrentTab";

export function SearchTabs({ inputRef, handleChangeTab }: SearchTabsProps) {
  const { currentTab, isOpen } = useSearchStore(
    useShallow((state) => ({
      currentTab: state.currentTab,
      isOpen: state.isOpen,
    })),
  );
  const { recent, favorites } = useSearchHistory();

  return (
    <div
      role="listbox"
      onMouseDown={(e) => e.preventDefault()}
      className={`absolute overflow-y-hidden -left-5 top-5 sm:top-6 right-0 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-100 mt-1 ${isOpen ? "visible" : "invisible"}`}
    >
      {/* recents/favorites tabs */}
      <ul
        role="tablist"
        className="flex items-center border-b border-white/10 mx-6 py-5"
      >
        {TABS.map(({ tab, label, Icon }) => {
          const isActive = currentTab === tab;
          const count = tab === "recent" ? recent.length : favorites.length;

          return (
            <li
              role="tab"
              key={tab}
              aria-selected={isActive}
              aria-label={`${label} searches`}
              onClick={() => handleChangeTab(tab as ActiveTab)}
              className={`gap-1.5 cursor-pointer hover:opacity-80 transition flex w-auto justify-center items-center flex-1 mx-auto text-xl font-bold tracking-wider ${isActive ? "text-[hsl(233,100%,70%)]" : ""}`}
            >
              <Icon
                isFilled={tab === "favorites" && currentTab === "favorites"}
                className={
                  tab === "recent"
                    ? "w-4.25 h-4.25 sm:w-5 sm:h-5"
                    : "w-4 h-4 sm:w-5 sm:h-5"
                }
              />
              <span className="text-sm sm:text-lg lg:text-xl whitespace-nowrap">{`${label} (${count})`}</span>
            </li>
          );
        })}
      </ul>

      <CurrentTab inputRef={inputRef} />
    </div>
  );
}

const TABS = [
  {
    tab: "recent",
    label: "Recent",
    Icon: HistoryIcon,
  },

  {
    tab: "favorites",
    label: "Favorites",
    Icon: FavoriteIcon,
  },
];

interface SearchTabsProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleChangeTab: (value: ActiveTab) => void;
}
