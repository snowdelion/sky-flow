import type { Units } from "@/shared/types"

export interface SettingsStore {
  units: Units
  selectedDayIndex: number

  setUnits: (update: Partial<Units> | ((prev: Units) => Units)) => void
  setSelectedDayIndex: (day: number) => void
  reset: () => void
}

export type PersistOld = {
  units: {
    temperature?: "celsius" | "fahrenheit"
    speed?: "kmh" | "mph"
    precipitation?: "mm" | "inch"
    time?: "12" | "24"

    temperatureUnit?: "celsius" | "fahrenheit"
    speedUnit?: "kmh" | "mph"
    precipitationUnit?: "mm" | "inch"
    timeUnit?: "12" | "24"
  }
}
