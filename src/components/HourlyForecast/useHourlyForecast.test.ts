import { act, renderHook } from "@testing-library/react";

import { createWeatherDataMocks } from "@/testing/mocks/factories/weather";

import { useHourlyForecast } from "./useHourlyForecast";

const mockUseDeviceType = vi.fn();
vi.mock("@/hooks/useDeviceType", () => ({
  useDeviceType: () => mockUseDeviceType(),
}));

describe("useHourlyForecast", () => {
  const { hourlyData } = createWeatherDataMocks();

  beforeEach(() => {
    mockUseDeviceType.mockReturnValue({ isMobile: true });
  });

  it("should get days", () => {
    const { result } = renderHook(() => useHourlyForecast(hourlyData));

    expect(result.current.days).toHaveLength(2);

    expect(result.current.days[0].hours[0].temp).toBe(0);
    expect(result.current.days[0].hours[0].hour).toBe("12 AM");

    expect(result.current.days[1].hours[0].temp).toBe(1);
    expect(result.current.days[1].hours[1].hour).toBe("1 AM");
  });

  it("should immediately open hourly forecast on desktop when closed", () => {
    mockUseDeviceType.mockReturnValue({ isDesk: true });
    const { result } = renderHook(() => useHourlyForecast(hourlyData));

    expect(result.current.isHourlyOpen).toBe(true);

    act(() => result.current.setIsHourlyOpen(false));
    expect(result.current.isHourlyOpen).toBe(true);
  });

  it("should stay closed on mobile", () => {
    mockUseDeviceType.mockReturnValue({ isMobile: true });
    const { result } = renderHook(() => useHourlyForecast(hourlyData));

    act(() => result.current.setIsHourlyOpen(false));
    expect(result.current.isHourlyOpen).toBe(false);
  });
});
