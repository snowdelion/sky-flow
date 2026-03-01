import { act, renderHook } from "@testing-library/react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";

import { useWeatherChart } from "./useWeatherChart";

describe("useWeatherChart", () => {
  const mockDailyData = {
    temperature_2m_min: [-0],
    temperature_2m_max: [-8],
    time: ["2026-02-28"],
    weather_code: [0],
  } as unknown as WeatherDataDaily;
  const mockHourlyData = {
    temperature_2m: [0, -2],
    time: ["2026-02-28T00:00", "2026-02-28T14:00"],
    weather_code: [0, 0],
  } as unknown as WeatherDataHourly;

  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.getState().reset();
  });

  it("should return formatted chartData", () => {
    const { result } = renderHook(() =>
      useWeatherChart(mockDailyData, mockHourlyData),
    );

    expect(result.current.chartDailyData).toEqual([
      { day: "Saturday", temp: -4 },
    ]);
    expect(result.current.chartHourlyData).toEqual([
      { hour: "2 PM", temp: -2 },
    ]);
  });

  it("should show correct units", () => {
    const { result } = renderHook(() =>
      useWeatherChart(mockDailyData, mockHourlyData),
    );

    act(() =>
      useSettingsStore.setState({
        units: {
          ...useSettingsStore.getState().units,
          temperature: "fahrenheit",
        },
      }),
    );

    expect(result.current.currentUnit).toBe("°F");
  });

  it("should get ticks", () => {
    const { result } = renderHook(() =>
      useWeatherChart(mockDailyData, mockHourlyData),
    );

    expect(result.current.dailyTicks).toEqual([
      -8, -7, -6, -5, -4, -3, -2, -1, 0,
    ]);
  });
});
