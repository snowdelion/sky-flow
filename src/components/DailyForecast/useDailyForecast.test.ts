import { renderHook } from "@testing-library/react";

import type { WeatherDataDaily } from "@/types/api/WeatherData";

import { useDailyForecast } from "./useDailyForecast";

describe("useDailyForecast", () => {
  let mockDailyData: WeatherDataDaily;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDailyData = {
      temperature_2m_min: [-2, -4],
      temperature_2m_max: [-4, -8],
      time: ["2026-03-01", "2026-03-02"],
      weather_code: [0, 1],
      apparent_temperature_min: [-2, -4],
      apparent_temperature_max: [-4, -8],
    } as WeatherDataDaily;
  });

  it("should correct format days", () => {
    const { result } = renderHook(() => useDailyForecast(mockDailyData));

    expect(result.current.formattedDays[0].temp).toBe("-3°");
    expect(result.current.formattedDays[0].day).toBe("Sunday");

    expect(result.current.formattedDays[1].temp).toBe("-6°");
    expect(result.current.formattedDays[1].day).toBe("Monday");
  });
});
