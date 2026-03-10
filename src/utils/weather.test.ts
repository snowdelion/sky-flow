import fogIcon from "@/../public/icons/icon-fog.webp";
import overcastIcon from "@/../public/icons/icon-overcast.webp";
import sunnyIcon from "@/../public/icons/icon-sunny.webp";
import { createForecastData } from "@/testing/mocks/factories/weather";

import { groupByDay } from "./weather";
import { getWeatherIcon } from "./weather";

describe("weather", () => {
  describe("groupByDay", () => {
    it("should sort days and hours", () => {
      const { hourlyData } = createForecastData();

      const days = groupByDay(hourlyData);

      expect(days).toHaveLength(2);
      expect(days[0].date).toBe("2026-03-01");

      expect(days[0].hours[0]).toEqual({
        hour: "12 AM",
        image: sunnyIcon,
        temp: 0,
        weatherCode: 0,
      });

      expect(days[0].hours[1].hour).toBe("1 AM");
      expect(days[0].hours[1].image).toBe(sunnyIcon);
    });
  });

  describe("getIconByWeatherCode", () => {
    test.each([
      { code: 1, expected: sunnyIcon },
      { code: 3, expected: overcastIcon },
      { code: 45, expected: fogIcon },
    ])("it should get expected code", ({ code, expected }) => {
      const getSrc = getWeatherIcon(code);
      expect(getSrc).toBe(expected);
    });
  });
});
