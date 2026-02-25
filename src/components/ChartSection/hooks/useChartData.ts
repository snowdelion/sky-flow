import { useMediaQuery } from "react-responsive";

import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";
import { formatDayOfWeek } from "@/utils/formatters";
import { calculateAverageTemps, groupByDay } from "@/utils/weather";

export interface UseChartDataReturn {
  getChartDailyData: (
    dailyData: WeatherDataDaily,
  ) => { day: string; temp: number }[];
  getChartHourlyData: (
    hourlyData: WeatherDataHourly,
  ) => { hour: string; temp: number }[];
}

export function useChartData(): UseChartDataReturn {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ maxWidth: 768 });

  const getChartDailyData = (
    dailyData: WeatherDataDaily,
  ): { day: string; temp: number }[] => {
    return dailyData.time.map((time, index) => {
      const min = dailyData.temperature_2m_min[index];
      const max = dailyData.temperature_2m_max[index];
      const date = new Date(time);

      const shouldReduce = isMobile || isTablet ? "ddd" : "dddd";

      return {
        day: formatDayOfWeek(date, shouldReduce),
        temp: calculateAverageTemps(min, max),
      };
    });
  };

  const getChartHourlyData = (
    hourlyData: WeatherDataHourly,
  ): { hour: string; temp: number }[] => {
    const filteredDays = groupByDay(hourlyData);

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
