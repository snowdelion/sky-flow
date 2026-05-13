import { createForecastData } from "@/shared/lib/testing"
import { groupByDay } from "./weather.utils"

describe("weather", () => {
  describe("groupByDay", () => {
    it("should sort days and hours", () => {
      const { hourlyData } = createForecastData()

      const days = groupByDay(hourlyData)

      expect(days).toHaveLength(2)
      expect(days[0].date).toBe("2026-03-01")

      expect(days[0].hours[0]).toEqual({
        hour: "12 AM",
        temp: 0,
        weatherCode: 0,
      })

      expect(days[0].hours[1].hour).toBe("1 AM")
      expect(days[0].hours[1].weatherCode).toBe(0)
    })
  })
})
