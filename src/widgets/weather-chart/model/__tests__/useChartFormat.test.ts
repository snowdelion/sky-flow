import { renderHook } from "@testing-library/react"
import { useDeviceType } from "@/shared/lib"
import { createChartData } from "@/shared/lib/testing/mocks/factories/chart-data"
import { useChartFormat } from "../useChartFormat"

// --- 1. mocks ---
vi.mock("@/shared/lib", () => ({
  useDeviceType: vi.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesk: true,
  })),
}))
vi.mock("@/entities/settings", () => ({
  useSettingsStore: vi.fn((selector) =>
    selector({
      units: { temperatureUnit: "celsius", timeUnit: "12" },
    }),
  ),
}))

// --- 2. tests ---
describe("useChartFormat", () => {
  const { dailyChartData } = createChartData()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("handleXAxisTickFormat", () => {
    const cases = [
      {
        label: "mobile (2 chars)",
        device: { isMobile: true },
        expected: "Sa",
      },
      {
        label: "tablet (3 chars)",
        device: { isTablet: true },
        expected: "Sat",
      },
      {
        label: "desktop (full)",
        device: { isDesk: true },
        expected: "Saturday",
      },
    ]

    test.each(cases)("should return $expected depence on $label", ({ device, expected }) => {
      vi.mocked(useDeviceType).mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesk: false,
        isDesktopXl: false,
        isSmallDesk: false,
        ...device,
      })
      const { result } = renderHook(() =>
        useChartFormat(dailyChartData, true, "daily", useDeviceType()),
      )

      expect(result.current.handleXAxisTickFormat("Saturday")).toBe(expected)
    })
  })

  describe("yTicks & yDomain", () => {
    it("should calculate yDomain from the first and last elements of yTicks", () => {
      const { result } = renderHook(() =>
        useChartFormat(dailyChartData, true, "daily", useDeviceType()),
      )

      const { yTicks, yDomain } = result.current
      expect(yDomain[0]).toBe(yTicks[0])
      expect(yDomain[1]).toBe(yTicks[yTicks.length - 1])
    })
  })

  describe("units and keys", () => {
    it("should return correct unit and dataKey for daily tab", () => {
      const { result } = renderHook(() => useChartFormat([], true, "daily", useDeviceType()))
      expect(result.current.currentUnit).toBe("°C")
      expect(result.current.dataKey).toBe("day")
    })

    it("should switch dataKey to hour for hourly tab", () => {
      const { result } = renderHook(() => useChartFormat([], false, "hourly", useDeviceType()))
      expect(result.current.dataKey).toBe("hour")
    })
  })
})
