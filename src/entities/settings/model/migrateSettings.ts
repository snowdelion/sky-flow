import { DEFAULT_UNITS } from "@/shared/config/constants";
import type { SettingsStore } from "./useSettingsStore.types";

export const migrateSettings = (persistedState: unknown, version: number) => {
  if (version === 0) {
    const state = persistedState as persistOld;

    if (state.units) {
      const {
        temperatureUnit: defTemp,
        speedUnit: defSpeed,
        precipitationUnit: defPrecip,
        timeUnit: defTime,
      } = DEFAULT_UNITS;
      const { units } = state;
      const { temperature, speed, precipitation, time } = units;

      units.temperatureUnit = temperature ?? defTemp;
      units.speedUnit = speed ?? defSpeed;
      units.precipitationUnit = precipitation ?? defPrecip;
      units.timeUnit = time ?? defTime;

      const oldUnits = units as Record<string, unknown>;
      delete oldUnits.temperature;
      delete oldUnits.speed;
      delete oldUnits.precipitation;
      delete oldUnits.time;
    }
    return state as unknown as SettingsStore;
  }
  return persistedState as SettingsStore;
};

type persistOld = {
  units: {
    temperature?: "celsius" | "fahrenheit";
    speed?: "kmh" | "mph";
    precipitation?: "mm" | "inch";
    time?: "12" | "24";

    temperatureUnit?: "celsius" | "fahrenheit";
    speedUnit?: "kmh" | "mph";
    precipitationUnit?: "mm" | "inch";
    timeUnit?: "12" | "24";
  };
};
