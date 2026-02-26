import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { WeatherDataUnits } from "@/types/api/WeatherData";

export interface SettingsStore {
  units: WeatherDataUnits;

  setUnits: (
    update:
      | Partial<WeatherDataUnits>
      | ((prev: WeatherDataUnits) => WeatherDataUnits),
  ) => void;
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

      setUnits: (
        update:
          | Partial<WeatherDataUnits>
          | ((prev: WeatherDataUnits) => WeatherDataUnits),
      ) =>
        set((state) => ({
          units:
            typeof update === "function"
              ? update(state.units)
              : { ...state.units, ...update },
        })),

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
    },
  ),
);
