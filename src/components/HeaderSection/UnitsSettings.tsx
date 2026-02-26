"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import { useShallow } from "zustand/shallow";

import checkmarkIcon from "@/../public/icons/icon-checkmark.svg";
import dropdownIcon from "@/../public/icons/icon-dropdown.svg";
import unitsIcon from "@/../public/icons/icon-units.svg";
import { useSettingsStore } from "@/stores/useSettingsStore";
import type { WeatherDataUnits } from "@/types/api/WeatherData";

export const DEFAULT_UNITS: WeatherDataUnits = {
  temperature: "celsius",
  speed: "kmh",
  precipitation: "mm",
};

export default function UnitsSettings() {
  const { units, setUnits, reset } = useSettingsStore(
    useShallow((state) => ({
      units: state.units,
      setUnits: state.setUnits,
      reset: state.reset,
    })),
  );

  const menuOptions = [
    {
      id: 1,
      title: "Temperature",
      unit: "temperature" as keyof WeatherDataUnits,
      option1: "Celsius (°C)",
      value1: "celsius",
      option2: "Fahrenheit (°F)",
      value2: "fahrenheit",
    },
    {
      id: 2,
      title: "Wind Speed",
      unit: "speed" as keyof WeatherDataUnits,
      option1: "Kilometers (km)",
      value1: "kmh",
      option2: "Miles (mi)",
      value2: "mph",
    },
    {
      id: 3,
      title: "Precipitation",
      unit: "precipitation" as keyof WeatherDataUnits,
      option1: "Millimeters (mm)",
      value1: "mm",
      option2: "Inches (in)",
      value2: "inch",
    },
  ];

  return (
    <Menu>
      <div
        aria-label="Units"
        className="border border-white/0 active:border-white/20 rounded-lg"
      >
        <MenuButton className="group flex items-center justify-center gap-2 focus:outline-none bg-[hsl(243,23%,24%)] border border-white/10 hover:opacity-80 px-3 py-2 rounded-lg transition-opacity">
          <Image src={unitsIcon} className="w-3.5" alt="Units Icon" />
          <span className="text-[14px]">Units</span>
          <Image src={dropdownIcon} className="w-2.5" alt="Dropdown Icon" />
        </MenuButton>
      </div>

      <MenuItems
        className="bg-[hsl(243,27%,20%)] [--anchor-gap:10px] focus:outline-none border border-white/10 rounded-xl w-55 justify-self-center shadow-[0_10px_12px_black]/25 transition-transform duration-75 data-closed:opacity-0 data-closed:scale-95 data-closed:-translate-y-2"
        transition
        modal={false}
        anchor="bottom end"
      >
        <MenuItem>
          <div
            aria-label="default option"
            aria-selected="false"
            onClick={(e) => {
              e.stopPropagation();
              reset();
            }}
            className="hover:bg-[hsl(243,23%,30%)] active:bg-[hsl(243,23%,24%)] transition-colors rounded-xl mx-2 px-3 mt-2 -mb-2 py-3 cursor-pointer"
          >
            Switch to Imperial
          </div>
        </MenuItem>

        {menuOptions.map((option) => (
          <div
            key={option.id}
            className="mt-4 mx-2 border-b border-white/10 last:border-b-0"
          >
            <h2 className="text-sm text-white/70 ml-3">{option.title}</h2>
            <MenuItem>
              <div
                aria-label={`${option.value1} option`}
                aria-selected="false"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setUnits({ [option.unit]: option.value1 });
                }}
                className="flex justify-between items-center hover:bg-[hsl(243,23%,30%)] active:bg-[hsl(243,23%,24%)] transition-colors rounded-xl px-3 my-2 py-3 cursor-pointer"
              >
                <span>{option.option1}</span>
                {units[option.unit] === option.value1 && (
                  <Image src={checkmarkIcon} alt="Checked" />
                )}
              </div>
            </MenuItem>

            <MenuItem>
              <div
                aria-label={`${option.value2} option`}
                aria-selected="false"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setUnits({ [option.unit]: option.value2 });
                }}
                className="flex justify-between items-center hover:bg-[hsl(243,23%,30%)] active:bg-[hsl(243,23%,24%)] transition-colors rounded-xl px-3 my-2 py-3 cursor-pointer"
              >
                <span>{option.option2}</span>
                {units[option.unit] === option.value2 && (
                  <Image src={checkmarkIcon} alt="Checked" />
                )}
              </div>
            </MenuItem>
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
}
