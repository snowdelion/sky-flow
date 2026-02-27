"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

import checkmarkIcon from "@/../public/icons/icon-checkmark.svg";
import dropdownIcon from "@/../public/icons/icon-dropdown.svg";
import unitsIcon from "@/../public/icons/icon-units.svg";
import { useSettingsStore } from "@/stores/useSettingsStore";

import { MENU_OPTIONS } from "./UnitsSettings.constants";

export default function UnitsSettings() {
  const units = useSettingsStore((state) => state.units);
  const setUnits = useSettingsStore((state) => state.setUnits);
  const reset = useSettingsStore((state) => state.reset);

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

        {MENU_OPTIONS.map((group) => (
          <div
            key={group.id}
            className="mt-4 mx-2 border-b border-white/10 last:border-b-0"
          >
            <h2 className="text-sm text-white/70 ml-3">{group.title}</h2>

            {group.options.map((option) => (
              <MenuItem key={option.value}>
                <div
                  aria-label={`${option.value} option`}
                  aria-selected="false"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUnits({ [group.unit]: option.value });
                  }}
                  className="flex justify-between items-center hover:bg-[hsl(243,23%,30%)] active:bg-[hsl(243,23%,24%)] transition-colors rounded-xl px-3 my-2 py-3 cursor-pointer"
                >
                  <span>{option.label}</span>
                  {units[group.unit] === option.value && (
                    <Image src={checkmarkIcon} alt="Checked" />
                  )}
                </div>
              </MenuItem>
            ))}
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
}
