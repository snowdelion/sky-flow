import { renderHook } from "@testing-library/react";

import { createWeatherDataMocks } from "@/testing/mocks/factories/weather";

import { useDailyForecast } from "./useDailyForecast";

describe("useDailyForecast", () => {
  const { dailyData } = createWeatherDataMocks();

  it("should correct format days", () => {
    const { result } = renderHook(() => useDailyForecast(dailyData));

    expect(result.current.formattedDays[0].temp).toBe("1°");
    expect(result.current.formattedDays[0].day).toBe("Sunday");

    expect(result.current.formattedDays[1].temp).toBe("2°");
    expect(result.current.formattedDays[1].day).toBe("Monday");
  });
});
