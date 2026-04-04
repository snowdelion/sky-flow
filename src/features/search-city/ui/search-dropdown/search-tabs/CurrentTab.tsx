import { memo } from "react";
import { useSearchHistory, useSearchStore } from "@/entities/location";
import { RecentAlertIcon, UnfavoriteIcon } from "@shared/ui";
import { FavoritesSearch } from "./FavoritesSearch";
import { RecentSearch } from "./RecentSearch";

export const CurrentTab = memo(function CurrentTab({
  inputRef,
  dropdownRef,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}) {
  const currentTab = useSearchStore((state) => state.currentTab);
  const { Component, Icon, message } = TAB_DATA[currentTab];
  const items = useSearchHistory()[currentTab];

  return (
    <ul className="max-h-60 sm:max-h-86 xl:max-h-98 overflow-y-auto custom-scrollbar">
      {items.length > 0 ? (
        items.map((data) => (
          <Component
            key={data.id}
            data={data}
            inputRef={inputRef}
            dropdownRef={dropdownRef}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-items-center my-20 sm:my-30 gap-2">
          <Icon className="w-8 h-8" />
          <span className="text-base sm:text-lg font-bold tracking-wider text-white/90 text-center">
            {message}
          </span>
        </div>
      )}
    </ul>
  );
});

const TAB_DATA = {
  recent: {
    Component: RecentSearch,
    Icon: RecentAlertIcon,
    message: "There is no city you seen recently!",
  },
  favorites: {
    Component: FavoritesSearch,
    Icon: UnfavoriteIcon,
    message: "There is no city you have in favorites!",
  },
};
