import { useEffect, useMemo, useState } from "react";
import { useSettingsStore } from "@/entities/settings";
import { type WeatherDaily, type WeatherHourly } from "@/entities/weather";
import { getTicks } from "./chart.utils";
import { useChartData } from "./useChartData";
import { useResponsiveHourlyData } from "./useResponsiveHourlyData";

export function useChart(
  dailyData: WeatherDaily | undefined,
  hourlyData: WeatherHourly | undefined,
): UseChartViewReturn {
  // Chart.tsx
  const [currentChartTab, setCurrentChartTab] = useState("daily");
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleResize = (): void => {
      setIsResizing(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsResizing(false), 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ChartView.tsx
  const { chartDailyData, chartHourlyData: fullHourlyData } = useChartData(
    dailyData,
    hourlyData,
  );
  const tempUnit = useSettingsStore((state) => state.units.temperatureUnit);
  const hourUnit = useSettingsStore((state) => state.units.timeUnit);
  const currentUnit = tempUnit === "celsius" ? "°C" : "°F";

  const chartHourlyData = useResponsiveHourlyData(fullHourlyData);

  const dailyTicks = useMemo(() => getTicks(chartDailyData), [chartDailyData]);
  const hourlyTicks = useMemo(() => getTicks(fullHourlyData), [fullHourlyData]);

  return useMemo(
    () => ({
      currentChartTab,
      setCurrentChartTab,
      isResizing,
      hourUnit,
      currentUnit,
      chartDailyData,
      chartHourlyData,
      dailyTicks,
      hourlyTicks,
    }),
    [
      currentChartTab,
      setCurrentChartTab,
      isResizing,
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
  currentChartTab: string;
  setCurrentChartTab: React.Dispatch<React.SetStateAction<string>>;
  isResizing: boolean;
}
