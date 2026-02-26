import { useSettingsStore } from "@/stores/useSettingsStore";
import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";
import { formatDayOfWeek } from "@/utils/formatters";
import { calculateAverageTemps, groupByDay } from "@/utils/weather";

import { useDeviceType } from "./useDeviceType";

export interface UseChartDataReturn {
  getChartDailyData: (
    dailyData: WeatherDataDaily,
  ) => { day: string; temp: number }[];
  getChartHourlyData: (
    hourlyData: WeatherDataHourly,
  ) => { hour: string; temp: number }[];
}

export function useChartData(): UseChartDataReturn {
  const { isMobile, isTablet } = useDeviceType();
  const hourFormat = useSettingsStore((state) => state.units.time);
  const shouldReduce = isMobile ? "dd" : isTablet ? "ddd" : "dddd";

  const getChartDailyData = (
    dailyData: WeatherDataDaily,
  ): { day: string; temp: number }[] => {
    return dailyData.time.map((time, index) => {
      const min = dailyData.temperature_2m_min[index];
      const max = dailyData.temperature_2m_max[index];
      const date = new Date(time);

      return {
        day: formatDayOfWeek(date, shouldReduce),
        temp: calculateAverageTemps(min, max),
      };
    });
  };

  const getChartHourlyData = (
    hourlyData: WeatherDataHourly,
  ): { hour: string; temp: number }[] => {
    const filteredDays = groupByDay(hourlyData, {
      hourFormat,
      dayFormat: shouldReduce,
    });

    return filteredDays[1].hours.map((item) => ({
      hour: item.hour,
      temp: item.temp,
    }));
  };

  return {
    getChartDailyData,
    getChartHourlyData,
  };
}
