import { useMemo } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";
import { formatDayOfWeek } from "@/utils/formatters";
import { calculateAverageTemps, groupByDay } from "@/utils/weather";

export function useChartData(
  dailyData: WeatherDataDaily,
  hourlyData: WeatherDataHourly,
): UseChartDataReturn {
  const selectedDayIndex = useSettingsStore((state) => state.selectedDayIndex);
  const hourFormat = useSettingsStore((state) => state.units.time);

  const chartDailyData = useMemo(
    () =>
      dailyData.time.slice(0, 7).map((time, index) => {
        const min = dailyData.temperature_2m_min[index];
        const max = dailyData.temperature_2m_max[index];
        const date = new Date(time);

        return {
          day: formatDayOfWeek(date, "dddd"),
          temp: calculateAverageTemps(min, max),
        };
      }),
    [dailyData],
  );

  const chartHourlyData = useMemo(() => {
    const filteredDays = groupByDay(hourlyData, {
      hourFormat,
      dayFormat: "dddd",
    }).filter((day) => day.hours.length === 24);

    return filteredDays[selectedDayIndex]?.hours.map((item) => ({
      hour: item.hour,
      temp: item.temp,
    }));
  }, [hourlyData, hourFormat, selectedDayIndex]);

  return useMemo(
    () => ({
      chartDailyData,
      chartHourlyData,
    }),
    [chartDailyData, chartHourlyData],
  );
}

interface UseChartDataReturn {
  chartDailyData: {
    day: string;
    temp: number;
  }[];
  chartHourlyData: {
    hour: string;
    temp: number;
  }[];
}
