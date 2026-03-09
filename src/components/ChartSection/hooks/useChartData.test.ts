import { act, renderHook } from "@testing-library/react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { createWeatherDataMocks } from "@/testing/mocks/factories/weather";

import { useChartData } from "./useChartData";

describe("useChartData", () => {
  const { dailyData, hourlyData } = createWeatherDataMocks();

  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.getState().reset();
  });

  it("should return formatted chart data", () => {
    const { result } = renderHook(() => useChartData(dailyData, hourlyData));

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

  it("should change selected day index", async () => {
    const { result } = renderHook(() => useChartData(dailyData, hourlyData));

    expect(result.current.chartHourlyData[0]).toEqual({
      hour: "12 AM",
      temp: 0,
    });

    await act(() => useSettingsStore.setState({ selectedDayIndex: 1 }));

    expect(result.current.chartHourlyData[0]).toEqual({
      hour: "12 AM",
      temp: 1,
    });
  });

  it("should return correct hour format", () => {
    act(() =>
      useSettingsStore.setState({
        units: { ...useSettingsStore.getState().units, time: "24" },
        selectedDayIndex: 0,
      }),
    );

    const { result } = renderHook(() => useChartData(dailyData, hourlyData));

    expect(result.current.chartHourlyData).toHaveLength(24);
    expect(result.current.chartHourlyData[0].hour).toBe("00:00");
    expect(result.current.chartHourlyData[23].hour).toBe("23:00");
  });
});
