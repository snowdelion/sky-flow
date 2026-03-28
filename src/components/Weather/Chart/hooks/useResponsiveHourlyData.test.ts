import { renderHook } from "@testing-library/react";

import { useDeviceType } from "@/shared/lib/useDeviceType";

import { useResponsiveHourlyData } from "./useResponsiveHourlyData";

vi.mock("@shared/lib/useDeviceType", () => ({
  useDeviceType: vi.fn(),
}));

describe("useResponsiveHourlyData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each([
    {
      device: {
        isMobile: true,
        isTablet: false,
        isDesk: false,
        isSmallDesk: false,
        isDesktopXl: false,
      },
      data: Array(8).fill({ hour: "0:00", temp: -2 }),
      expected: 2,
    },
    {
      device: {
        isMobile: false,
        isTablet: true,
        isDesk: false,
        isSmallDesk: false,
        isDesktopXl: false,
      },
      data: Array(8).fill({ hour: "0:00", temp: -2 }),
      expected: 4,
    },
    {
      device: {
        isMobile: false,
        isTablet: false,
        isDesk: true,
        isSmallDesk: false,
        isDesktopXl: false,
      },
      data: Array(8).fill({ hour: "0:00", temp: -2 }),
      expected: 8,
    },
    {
      device: {
        isMobile: false,
        isTablet: false,
        isDesk: false,
        isSmallDesk: true,
        isDesktopXl: false,
      },
      data: Array(8).fill({ hour: "0:00", temp: -2 }),
      expected: 8,
    },
  ])(
    "should return expected length for device",
    ({ device, data, expected }) => {
      vi.mocked(useDeviceType).mockReturnValue(device);
      const { result } = renderHook(() => useResponsiveHourlyData(data));

      expect(result.current.length).toBe(expected);
    },
  );
});
