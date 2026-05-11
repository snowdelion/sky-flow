import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/shared/config/constants";
import type { Units } from "@/shared/types";
import { migrateSettings } from "./migrateSettings";
import type { SettingsStore } from "./types";

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      units: {
        temperatureUnit: "celsius",
        speedUnit: "kmh",
        precipitationUnit: "mm",
        timeUnit: "12",
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
            temperatureUnit: "celsius",
            speedUnit: "kmh",
            precipitationUnit: "mm",
            timeUnit: "12",
          },
        }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      version: 1,
      migrate: (persistedState: unknown, version: number) =>
        migrateSettings(persistedState, version),
      partialize: (s) => ({
        units: s.units,
      }),
    },
  ),
);
