import { useMemo } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";

import { getTicks } from "../chart-utils";

import { useChartData } from "./useChartData";
import { useResponsiveHourlyData } from "./useResponsiveHourlyData";

export function useChartView(
  dailyData: WeatherDataDaily,
  hourlyData: WeatherDataHourly,
): UseChartViewReturn {
  const { chartDailyData, chartHourlyData: fullHourlyData } = useChartData(
    dailyData,
    hourlyData,
  );
  const tempUnit = useSettingsStore((state) => state.units.temperature);
  const hourUnit = useSettingsStore((state) => state.units.time);
  const currentUnit = tempUnit === "celsius" ? "°C" : "°F";
  const chartHourlyData = useResponsiveHourlyData(fullHourlyData);

  const dailyTicks = useMemo(() => getTicks(chartDailyData), [chartDailyData]);
  const hourlyTicks = useMemo(() => getTicks(fullHourlyData), [fullHourlyData]);

  return useMemo(
    () => ({
      hourUnit,
      currentUnit,
      chartDailyData,
      chartHourlyData,
      dailyTicks,
      hourlyTicks,
    }),
    [
      hourUnit,
      currentUnit,
      chartDailyData,
      chartHourlyData,
      dailyTicks,
      hourlyTicks,
    ],
  );
}

interface UseChartViewReturn {
  hourUnit: "12" | "24";
  currentUnit: "°C" | "°F";
  chartDailyData: {
    day: string;
    temp: number;
  }[];
  chartHourlyData: {
    hour: string;
    temp: number;
  }[];
  dailyTicks: number[];
  hourlyTicks: number[];
}
