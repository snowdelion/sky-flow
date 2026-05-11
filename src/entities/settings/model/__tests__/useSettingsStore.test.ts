import { DEFAULT_UNITS, STORAGE_KEYS } from "@/shared/config/constants";
import { useSettingsStore } from "../useSettingsStore";

describe("useSettingsStore", () => {
  beforeEach(() => {
    useSettingsStore.getState().reset();
  });

  it("should set units", () => {
    useSettingsStore.getState().setUnits({ temperatureUnit: "fahrenheit" });
    useSettingsStore.getState().setUnits({ speedUnit: "mph" });

    expect(useSettingsStore.getState().units.temperatureUnit).toBe(
      "fahrenheit",
    );
    expect(useSettingsStore.getState().units.speedUnit).toBe("mph");
    expect(useSettingsStore.getState().units.precipitationUnit).toBe("mm");

    useSettingsStore.getState().setUnits({
      temperatureUnit: "celsius",
      speedUnit: "kmh",
    });

    expect(useSettingsStore.getState().units).toEqual(DEFAULT_UNITS);
  });

  it("should reset to default values", () => {
    useSettingsStore.setState({
      units: {
        temperatureUnit: "fahrenheit",
        speedUnit: "mph",
        precipitationUnit: "inch",
        timeUnit: "24",
      },
    });

    useSettingsStore.getState().reset();

    expect(useSettingsStore.getState().units).toEqual(DEFAULT_UNITS);
  });

  it("should partialize save units to localStorage", () => {
    window.localStorage.clear();

    useSettingsStore.setState({
      units: {
        ...DEFAULT_UNITS,
        temperatureUnit: "fahrenheit",
      },
    });

    const storage = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.SETTINGS) as string,
    );

    expect(storage).toEqual({
      state: {
        units: {
          ...DEFAULT_UNITS,
          temperatureUnit: "fahrenheit",
        },
      },
      version: 1,
    });
    expect(storage).not.toHaveProperty("selectedDayIndex");
  });
});
