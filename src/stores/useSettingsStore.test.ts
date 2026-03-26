import { DEFAULT_UNITS, useSettingsStore } from "./useSettingsStore";

describe("useSettingsStore", () => {
  beforeEach(() => {
    useSettingsStore.getState().reset();
  });

  it("should set units", () => {
    useSettingsStore.getState().setUnits({ temperature: "fahrenheit" });
    useSettingsStore.getState().setUnits({ speed: "mph" });

    expect(useSettingsStore.getState().units.temperature).toBe("fahrenheit");
    expect(useSettingsStore.getState().units.speed).toBe("mph");
    expect(useSettingsStore.getState().units.precipitation).toBe("mm");

    useSettingsStore.getState().setUnits({
      temperature: "celsius",
      speed: "kmh",
    });

    expect(useSettingsStore.getState().units).toEqual(DEFAULT_UNITS);
  });

  it("should reset to default values", () => {
    useSettingsStore.setState({
      units: {
        temperature: "fahrenheit",
        speed: "mph",
        precipitation: "inch",
        time: "24",
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
        temperature: "fahrenheit",
      },
    });

    const storage = JSON.parse(
      window.localStorage.getItem("weather-settings") as string,
    );

    expect(storage).toEqual({
      state: {
        units: {
          ...DEFAULT_UNITS,
          temperature: "fahrenheit",
        },
      },
      version: 0,
    });
    expect(storage).not.toHaveProperty("selectedDayIndex");
  });
});
