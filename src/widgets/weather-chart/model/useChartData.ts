import { useMemo } from "react";
import { useSettingsStore } from "@/entities/settings";
import {
  type HourlyItem,
  type WeatherDaily,
  type WeatherHourly,
  calculateAverageTemps,
  groupByDay,
} from "@/entities/weather";
import { formatDayOfWeek } from "@/shared/lib";

export function useChartData(
  dailyData: WeatherDaily | undefined,
  hourlyData: WeatherHourly | undefined,
) {
  const selectedDayIndex = useSettingsStore((state) => state.selectedDayIndex);
  const hourFormat = useSettingsStore((state) => state.units.timeUnit);

  const chartDailyData = useMemo(() => {
    if (!dailyData) return [];
    return dailyData.time.slice(0, 7).map((time, index) => {
      const min = dailyData.temperatureMin[index];
      const max = dailyData.temperatureMax[index];
      const date = new Date(time);

      return {
        day: formatDayOfWeek(date, "dddd"),
        temp: calculateAverageTemps(min, max),
      };
    });
  }, [dailyData]);

  const chartHourlyData = useMemo(() => {
    if (!hourlyData) return [];
    const filteredDays = groupByDay(hourlyData, {
      hourFormat,
      dayFormat: "dddd",
    }).filter((day) => day.hours.length === 24);

    return filteredDays[selectedDayIndex]?.hours.map((item: HourlyItem) => ({
      hour: item.hour,
      temp: item.temp,
    }));
  }, [hourlyData, hourFormat, selectedDayIndex]);

  return useMemo(
    () => ({
      chartDailyData,
      chartHourlyData: chartHourlyData ?? [],
    }),
    [chartDailyData, chartHourlyData],
  );
}
