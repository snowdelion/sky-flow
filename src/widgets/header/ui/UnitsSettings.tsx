"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import type { WeatherUnits } from "@/entities/weather"
import { AppIcon } from "@/shared/ui"
import { useUnitsSettings } from "./useUnitsSettings"

export default function UnitsSettings() {
  const { buttonRef, handleReset, handleSetUnit, units } = useUnitsSettings()

  return (
    <Menu>
      <div aria-label="Units" className="border border-white/0 active:border-white/20 rounded-lg">
        <MenuButton
          id="units-menu-button"
          type="button"
          ref={buttonRef}
          className="group flex items-center justify-center gap-2 px-2.5 py-2 sm:px-3 border focus:outline-none border-white/10 hover:opacity-80 bg-[hsl(243,23%,24%)] rounded-lg transition-opacity"
        >
          <AppIcon
            icon="units"
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-data-open:rotate-180 transition-transform duration-200"
          />
          <span className="text-xs sm:text-sm">Units</span>
          <AppIcon
            icon="dropdown"
            className="w-2.5 h-2.5 mt-px group-data-open:rotate-180 transition-transform duration-200"
          />
        </MenuButton>
      </div>

      <MenuItems
        className="w-45 sm:w-55 justify-self-center focus:outline-none border border-white/10 rounded-xl bg-[hsl(243,27%,20%)]
         shadow-[0_10px_12px_black]/25 transition-transform duration-75 [--anchor-gap:10px] data-closed:opacity-0 data-closed:scale-95 data-closed:-translate-y-2"
        transition
        modal={false}
        anchor="bottom end"
      >
        <div className="mx-2">
          <MenuItem>
            <button
              role="button"
              aria-label="default option"
              onClick={(e) => {
                e.stopPropagation()
                handleReset()
              }}
              className="w-full items-center text-start px-3 mt-2 -mb-2 py-3 hover:bg-[hsl(243,23%,30%)] active:bg-[hsl(243,23%,24%)] transition-colors rounded-xl cursor-pointer"
            >
              Switch to Imperial
            </button>
          </MenuItem>
        </div>

        {MENU_OPTIONS.map((group) => (
          <div key={group.id} className="mt-4 mx-2 border-b border-white/10 last:border-b-0">
            <h2 className="text-xs sm:text-sm text-white/70 ml-3">{group.title}</h2>

            {group.options.map((option) => (
              <MenuItem key={option.value}>
                <button
                  role="button"
                  aria-label={`${option.value} option`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSetUnit(group.unit, option.value)
                  }}
                  className="w-full flex justify-between items-center hover:bg-[hsl(243,23%,30%)] active:bg-[hsl(243,23%,24%)] transition-colors rounded-xl px-3 my-1.75 py-1.75 cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{option.label}</span>
                  {units[group.unit] === option.value && (
                    <AppIcon icon="checkmark" className="w-3 sm:w-3.5" alt="Checked" />
                  )}
                </button>
              </MenuItem>
            ))}
          </div>
        ))}
      </MenuItems>
    </Menu>
  )
}

const MENU_OPTIONS = [
  {
    id: 1,
    title: "Temperature",
    unit: "temperatureUnit" as keyof WeatherUnits,
    options: [
      { label: "Celsius (°C)", value: "celsius" },
      { label: "Fahrenheit (°F)", value: "fahrenheit" },
    ],
  },
  {
    id: 2,
    title: "Wind Speed",
    unit: "speedUnit" as keyof WeatherUnits,
    options: [
      { label: "Kilometers (km)", value: "kmh" },
      { label: "Miles (mi)", value: "mph" },
    ],
  },
  {
    id: 3,
    title: "Precipitation",
    unit: "precipitationUnit" as keyof WeatherUnits,
    options: [
      { label: "Millimeters (mm)", value: "mm" },
      { label: "Inches (in)", value: "inch" },
    ],
  },
  {
    id: 4,
    title: "Time Format",
    unit: "timeUnit" as keyof WeatherUnits,
    options: [
      { label: "12-hour", value: "12" },
      { label: "24-hour", value: "24" },
    ],
  },
]
