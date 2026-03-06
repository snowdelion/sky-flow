import { act, renderHook } from "@testing-library/react";

import { mockHourlyData } from "@/testing/mocks/factories/weather";

import { useHourlyForecast } from "./useHourlyForecast";

const mockUseDeviceType = vi.fn();
vi.mock("@/components/ChartSection/hooks/useDeviceType", () => ({
  useDeviceType: () => mockUseDeviceType(),
}));

describe("useHourlyForecast", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-02-28T12:00:00Z"));
    mockUseDeviceType.mockReturnValue({ isMobile: true });
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("should get days", () => {
    const { result } = renderHook(() => useHourlyForecast(mockHourlyData));

    expect(result.current.days).toHaveLength(2);

    expect(result.current.days[0].hours[0].temp).toBe(21);
    expect(result.current.days[0].hours[0].hour).toBe("12 AM");

    expect(result.current.days[1].hours[0].temp).toBe(22);
    expect(result.current.days[1].hours[1].hour).toBe("1 AM");
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
