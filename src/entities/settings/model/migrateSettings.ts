import { DEFAULT_UNITS } from "@/shared/config/constants"
import type { PersistOld, SettingsStore } from "./types"

export const migrateSettings = (persistedState: unknown, version: number) => {
  if (version === 0) {
    const state = persistedState as PersistOld

    if (state.units) {
      const {
        temperatureUnit: defTemp,
        speedUnit: defSpeed,
        precipitationUnit: defPrecip,
        timeUnit: defTime,
      } = DEFAULT_UNITS
      const { units } = state
      const { temperature, speed, precipitation, time } = units

      units.temperatureUnit = temperature ?? defTemp
      units.speedUnit = speed ?? defSpeed
      units.precipitationUnit = precipitation ?? defPrecip
      units.timeUnit = time ?? defTime

      const oldUnits = units as Record<string, unknown>
      delete oldUnits.temperature
      delete oldUnits.speed
      delete oldUnits.precipitation
      delete oldUnits.time
    }
    return state as unknown as SettingsStore
  }
  return persistedState as SettingsStore
}
