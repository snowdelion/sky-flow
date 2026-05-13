import { DEFAULT_UNITS } from "@/shared/config/constants"
import { migrateSettings } from "../migrateSettings"

// --- 1. mocks ---
vi.mock("@/shared/config/constants", () => ({
  DEFAULT_UNITS: {
    temperatureUnit: "celsius",
    speedUnit: "kmh",
    precipitationUnit: "mm",
    timeUnit: "24",
  },
}))

describe("migrateSettings", () => {
  it("should return state if version is not 0", () => {
    const state = { data: "data" }
    expect(migrateSettings(state, 1)).toBe(state)
  })

  it("should migrate old units to new format with version 0", () => {
    const oldState = {
      units: {
        temperature: "fahrenheit",
        speed: "mph",
        precipitation: "inch",
        time: "12",
      },
    }

    const result = migrateSettings(oldState, 0)

    expect(result.units.temperatureUnit).toBe("fahrenheit")
    expect(result.units.precipitationUnit).toBe("inch")

    type oldUnits = {
      temperature: "fahrenheit"
      speed: "mph"
      precipitation: "inch"
      time: "12"
    }

    const units = result.units as unknown as oldUnits
    expect(units.temperature).toBeUndefined()
    expect(units.precipitation).toBeUndefined()
  })

  it("should use DEFAULT_UNITS if old values are missing during migration", () => {
    const emptyState = {
      units: {},
    }
    const result = migrateSettings(emptyState, 0)
    expect(result.units.temperatureUnit).toBe(DEFAULT_UNITS.temperatureUnit)
    expect(result.units.precipitationUnit).toBe(DEFAULT_UNITS.precipitationUnit)
  })
})
