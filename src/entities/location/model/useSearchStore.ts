import { create } from "zustand"
import { persist } from "zustand/middleware"
import { DEFAULT_CITY_DATA } from "@/pages-flat/weather/lib/constants"
import { STORAGE_KEYS } from "@/shared/config/constants"
import { FoundCitySchema } from "@/shared/types"
import type { ActiveTab, SearchStore } from "./types"

const INITIAL_STATE = {
  inputValue: "",
  currentTab: "recent" as const,
  isOpen: false,
  _hasHydrated: false,
  lastValidatedCity: DEFAULT_CITY_DATA,
} as const

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setInputValue: (value: string) => set({ inputValue: value }),
      setCurrentTab: (tab: ActiveTab) => set({ currentTab: tab }),
      setIsOpen: (value: boolean) => set({ isOpen: value }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setLastValidatedCity: (cityData) => {
        const { data, success } = FoundCitySchema.safeParse(cityData)
        if (success) set({ lastValidatedCity: data })
      },

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: STORAGE_KEYS.SEARCH,
      partialize: (s) => ({
        lastValidatedCity: s.lastValidatedCity,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      version: 1,
    },
  ),
)
