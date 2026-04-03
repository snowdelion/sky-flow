import { act, renderHook } from "@testing-library/react";
import { useSettingsStore } from "@/entities/settings";
import { createForecastData } from "@/shared/lib/testing";
import { useChart } from "../useChart";

describe("useChart", () => {
  const { dailyData, hourlyData } = createForecastData();

  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.getState().reset();
  });

  it("should return formatted chartData", () => {
    const { result } = renderHook(() => useChart(dailyData, hourlyData));

    expect(result.current.chartDailyData).toHaveLength(7);
    expect(result.current.chartDailyData[0]).toEqual({
      day: "Sunday",
      temp: 1,
    });
    expect(result.current.chartDailyData[6]).toEqual({
      day: "Saturday",
      temp: 7,
    });

    expect(result.current.chartHourlyData).toHaveLength(24);
    expect(result.current.chartHourlyData[0]).toEqual({
      hour: "12 AM",
      temp: 0,
    });
    expect(result.current.chartHourlyData[23]).toEqual({
      hour: "11 PM",
      temp: 23,
    });
  });

  it("should show correct units", () => {
    const { result } = renderHook(() => useChart(dailyData, hourlyData));

    act(() =>
      useSettingsStore.setState({
        units: {
          ...useSettingsStore.getState().units,
          temperatureUnit: "fahrenheit",
        },
      }),
    );

    expect(result.current.currentUnit).toBe("°F");
  });

  it("should get ticks", () => {
    const { result } = renderHook(() => useChart(dailyData, hourlyData));

    expect(result.current.dailyTicks).toEqual([-2, +0, 2, 4, 6, 8, 10]);
  });
});
