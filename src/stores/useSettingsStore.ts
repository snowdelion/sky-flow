import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Units } from "@/types/weather";

export interface SettingsStore {
  units: Units;
  selectedDayIndex: number;

  setUnits: (update: Partial<Units> | ((prev: Units) => Units)) => void;
  setSelectedDayIndex: (day: number) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      units: {
        temperature: "celsius",
        speed: "kmh",
        precipitation: "mm",
        time: "12",
      },
      selectedDayIndex: 0,

      setUnits: (update: Partial<Units> | ((prev: Units) => Units)) =>
        set((state) => ({
          units:
            typeof update === "function"
              ? update(state.units)
              : { ...state.units, ...update },
        })),

      setSelectedDayIndex: (day: number) => set({ selectedDayIndex: day }),

      reset: () =>
        set({
          units: {
            temperature: "celsius",
            speed: "kmh",
            precipitation: "mm",
            time: "12",
          },
        }),
    }),
    {
      name: "weather-settings",
      partialize: (s) => ({
        units: s.units,
      }),
    },
  ),
);

export const DEFAULT_UNITS: Units = {
  temperature: "celsius",
  speed: "kmh",
  precipitation: "mm",
  time: "12",
};
