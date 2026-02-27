import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import Image from "next/image";

import dropdownIcon from "@/../public/icons/icon-dropdown.svg";
import type { DailyForecast } from "@/types/api/WeatherHourly";

export default function ChangeSelectedDay({
  days,
  selectedDayIndex,
  handleChangeDay,
}: ChangeSelectedDayProps) {
  const currentDay = days[selectedDayIndex]?.dayName || days[0].dayName;

  return (
    <Listbox value={selectedDayIndex} onChange={handleChangeDay}>
      <div className="border border-white/0 active:border-white/20 rounded-lg">
        <ListboxButton className="group flex items-center justify-center gap-2 focus:outline-none bg-[hsl(243,23%,30%)] border border-white/10 hover:opacity-80 px-3 sm:px-5 py-2 rounded-lg transition-opacity">
          <span>{currentDay}</span>
          <Image
            src={dropdownIcon}
            className="w-3 h-3 sm:w-4 sm:h-4 group-data-open:rotate-180 transition-transform duration-200"
            alt="Dropdown"
          />
        </ListboxButton>
      </div>

      <ListboxOptions
        className="bg-[hsl(243,27%,20%)] [--anchor-gap:10px] focus:outline-none border border-white/10 rounded-xl w-55 justify-self-center shadow-[0_10px_12px_black]/25 transition-transform duration-150  data-closed:opacity-0 data-closed:scale-95 data-closed:-translate-y-2"
        modal={false}
        transition
        anchor="bottom end"
      >
        {days.map(({ dayName }, index) => (
          <ListboxOption
            key={`${dayName}-${index}`}
            value={index}
            className="hover:bg-[hsl(243,23%,30%)] rounded-xl mx-2 px-3 my-2 py-3 cursor-pointer"
          >
            {dayName}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}

interface ChangeSelectedDayProps {
  days: DailyForecast[];
  selectedDayIndex: number;
  handleChangeDay: (index: number) => void;
}
