import { act, renderHook } from "@testing-library/react";

import type { WeatherDataHourly } from "@/types/api/WeatherData";

import { useHourlyForecast } from "./useHourlyForecast";

const mockUseDeviceType = vi.fn();
vi.mock("@/components/ChartSection/hooks/useDeviceType", () => ({
  useDeviceType: () => mockUseDeviceType(),
}));

describe("useHourlyForecast", () => {
  const mockHourlyData = {
    temperature_2m: [
      ...Array(24).fill(0),
      ...Array(24).fill(-2),
      ...Array(24).fill(-4),
    ],
    time: [
      ...Array.from(
        { length: 24 },
        (_, index) => `2026-03-01T${index < 10 ? "0" + index : index}:00Z`,
      ),
      ...Array.from(
        { length: 24 },
        (_, index) => `2026-03-02T${index < 10 ? "0" + index : index}:00Z`,
      ),
      ...Array.from(
        { length: 24 },
        (_, index) => `2026-03-03T${index < 10 ? "0" + index : index}:00Z`,
      ),
    ],
    weather_code: Array(72).fill(0),
  } as WeatherDataHourly;

  beforeEach(() => {
    vi.setSystemTime(new Date("2026-02-28T12:00:00Z"));
    mockUseDeviceType.mockReturnValue({ isMobile: true });
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("should get days", () => {
    const { result } = renderHook(() => useHourlyForecast(mockHourlyData));

    expect(result.current.days[0].hours[0].temp).toBe(0);
    expect(result.current.days[0].hours[0].hour).toBe("12 AM");

    expect(result.current.days[1].hours[0].temp).toBe(-2);
    expect(result.current.days[1].hours[1].hour).toBe("1 AM");

    expect(result.current.days[2].hours[0].temp).toBe(-4);

    expect(result.current.days.length).toBe(3);
  });

  it("should immediately open hourly forecast on desktop when closed", () => {
    mockUseDeviceType.mockReturnValue({ isDesk: true });
    const { result } = renderHook(() => useHourlyForecast(mockHourlyData));

    expect(result.current.isHourlyOpen).toBe(true);

    act(() => result.current.setIsHourlyOpen(false));
    expect(result.current.isHourlyOpen).toBe(true);
  });

  it("should stay closed on mobile", () => {
    mockUseDeviceType.mockReturnValue({ isMobile: true });
    const { result } = renderHook(() => useHourlyForecast(mockHourlyData));

    act(() => result.current.setIsHourlyOpen(false));
    expect(result.current.isHourlyOpen).toBe(false);
  });
});
