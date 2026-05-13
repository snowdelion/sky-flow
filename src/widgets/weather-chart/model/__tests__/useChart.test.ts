import { act, renderHook } from "@testing-library/react"
import { useSettingsStore } from "@/entities/settings"
import { createForecastData } from "@/shared/lib/testing"
import { useChart } from "../useChart"

describe("useChart", () => {
  const { dailyData, hourlyData } = createForecastData()

  beforeEach(() => {
    vi.clearAllMocks()
    useSettingsStore.getState().reset()
  })

  describe("activeData", () => {
    it("should switch data and keys when tab changes", () => {
      const { result } = renderHook(() => useChart(dailyData, hourlyData))

      expect(result.current.isDailyTab).toBe(true)
      expect(result.current.formatters.dataKey).toBe("day")
      expect(result.current.activeData.length).toBe(7)

      act(() => result.current.setCurrentChartTab("hourly"))

      expect(result.current.isDailyTab).toBe(false)
      expect(result.current.formatters.dataKey).toBe("hour")
      expect(result.current.activeData.length).toBe(24)
    })
  })

  describe("units", () => {
    it("shoud update currentUnit when settings change", () => {
      const { result } = renderHook(() => useChart(dailyData, hourlyData))

      expect(result.current.formatters.currentUnit).toBe("°C")

      act(() =>
        useSettingsStore.setState({
          units: {
            ...useSettingsStore.getState().units,
            temperatureUnit: "fahrenheit",
          },
        }),
      )

      expect(result.current.formatters.currentUnit).toBe("°F")
    })
  })

  describe("isResizing", () => {
    it("should reflect resizing state", () => {
      const { result } = renderHook(() => useChart(dailyData, hourlyData))

      expect(result.current.isResizing).toBe(false)
      act(() => window.dispatchEvent(new Event("resize")))
      expect(result.current.isResizing).toBe(true)
    })
  })
})
