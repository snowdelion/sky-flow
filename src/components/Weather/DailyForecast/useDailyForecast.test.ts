import { act, renderHook } from "@testing-library/react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { createForecastData } from "@/testing/mocks/factories/weather";

import { useDailyForecast } from "./useDailyForecast";

describe("useDailyForecast", () => {
  const { dailyData } = createForecastData();

  beforeEach(() => useSettingsStore.getState().reset());

  it("should correct format days", () => {
    const { result } = renderHook(() => useDailyForecast(dailyData));

    expect(result.current.formattedDays[0].temp).toBe("1°");
    expect(result.current.formattedDays[0].day).toBe("Sunday");

    expect(result.current.formattedDays[1].temp).toBe("2°");
    expect(result.current.formattedDays[1].day).toBe("Monday");
  });

  it("should change selected day on click", () => {
    const { result } = renderHook(() => useDailyForecast(dailyData));

    expect(useSettingsStore.getState().selectedDayIndex).toBe(0);
    act(() => result.current.handleClick(1));
    expect(useSettingsStore.getState().selectedDayIndex).toBe(1);
  });
});
