import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import React, {
  type SetStateAction,
  type Dispatch,
  startTransition,
  useCallback,
} from "react";
import { useSearchStore } from "@/entities/location";
import { DailyForecast } from "@/entities/weather";
import { CommonIcon } from "@/shared/ui/CommonIcon";

export const DaySelector = React.memo(function DaySelector({
  days,
  selectedDayIndex,
  handleChangeDay,
  setIsHourlyOpen,
  formattedDates,
}: DaySelectorProps) {
  const setIsOpen = useSearchStore(useCallback((s) => s.setIsOpen, []));
  const currentDay = days[selectedDayIndex]?.dayName || days[0].dayName;

  const handleChangeListbox = (index: number) => {
    startTransition(() => handleChangeDay(index));
  };

  return (
    <Listbox value={selectedDayIndex} onChange={handleChangeListbox}>
      <div className="relative border border-white/0 active:border-white/20 rounded-lg">
        <ListboxButton
          onClick={() => {
            setIsOpen(false);
            setIsHourlyOpen(true);
          }}
          className="group flex items-center justify-center gap-1 sm:gap-2 focus:outline-none bg-[hsl(243,23%,30%)] border border-white/10 hover:opacity-80 px-3 sm:px-5 py-2 rounded-lg transition-opacity"
        >
          <span className="text-xs sm:text-base">{currentDay}</span>
          <CommonIcon
            icon="dropdown"
            className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mt-0.5 group-data-open:rotate-180 transition-transform duration-200"
          />
        </ListboxButton>
      </div>

      <ListboxOptions
        className="
          absolute right-6.75 sm:right-7.75 top-16 sm:top-20 bg-[hsl(243,27%,20%)] focus:outline-none border border-white/10 rounded-xl w-45 sm:w-55 justify-self-center
          shadow-[0_10px_12px_black]/25 transition-transform duration-75 data-closed:opacity-0 data-closed:scale-95 data-closed:-translate-y-2 z-10"
        modal={false}
        transition
      >
        {days.map(({ dayName }, index) => (
          <ListboxOption
            key={`${dayName}-${index}`}
            value={index}
            className="hover:bg-[hsl(243,23%,30%)] flex justify-between items-center rounded-xl mx-2 px-3 my-2 py-2.5 sm:py-3 cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <span className="text-sm sm:text-base">{dayName}</span>
              <span className="text-white/70 text-[0.625rem] sm:text-xs">
                ({formattedDates[index]})
              </span>
            </div>

            {dayName === days[selectedDayIndex].dayName && (
              <CommonIcon
                icon="checkmark"
                className="w-3 sm:w-3.5"
                alt="Checked"
              />
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
});

interface DaySelectorProps {
  days: DailyForecast[];
  selectedDayIndex: number;
  handleChangeDay: (index: number) => void;
  setIsHourlyOpen: Dispatch<SetStateAction<boolean>>;
  formattedDates: string[];
}
