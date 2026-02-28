import { renderHook } from "@testing-library/react";

vi.mock("@/utils/formatters");
vi.mock("@/utils/weather");

import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";
import { formatDayOfWeek } from "@/utils/formatters";
import { calculateAverageTemps, groupByDay } from "@/utils/weather";

import { useChartData } from "./useChartData";

describe("useChartData", () => {
  let mockDailyData: WeatherDataDaily;
  let mockHourlyData: WeatherDataHourly;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDailyData = {
      temperature_2m_min: [-2],
      temperature_2m_max: [-4],
      weather_code: [0],
      time: ["2026-02-28"],
    } as WeatherDataDaily;

    mockHourlyData = {
      temperature_2m: [-2],
      time: ["2026-02-28T00:00"],
      weather_code: [],
    } as WeatherDataHourly;
  });

  it("should return formatted DailyData", () => {
    const { result } = renderHook(() =>
      useChartData(mockDailyData, mockHourlyData),
    );

    expect(formatDayOfWeek).toHaveBeenCalledTimes(1);
    expect(calculateAverageTemps).toBeCalledTimes(1);
    expect(result.current.chartDailyData).toEqual([
      { day: expect.any(String), temp: expect.any(Number) },
    ]);
  });

  it("should return formatted HourlyData", () => {
    const { result } = renderHook(() =>
      useChartData(mockDailyData, mockHourlyData),
    );

    expect(groupByDay).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result.current.chartHourlyData)).toBe(true);
  });
});
