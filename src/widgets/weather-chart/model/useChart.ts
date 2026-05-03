import { useMemo, useState } from "react";
import { type WeatherDaily, type WeatherHourly } from "@/entities/weather";
import { useDeviceType } from "@/shared/lib";
import { useChartData } from "./useChartData";
import { useChartFormat } from "./useChartFormat";
import { useChartResize } from "./useChartResize";
import { useResponsiveHourlyData } from "./useResponsiveHourlyData";

export function useChart(
  dailyData: WeatherDaily | undefined,
  hourlyData: WeatherHourly | undefined,
) {
  const { isMobile, isTablet, isDesk, isSmallDesk } = useDeviceType();
  const [currentChartTab, setCurrentChartTab] = useState("daily");
  const { chartDailyData, chartHourlyData: fullHourlyData } = useChartData(
    dailyData,
    hourlyData,
  );
  const chartHourlyData = useResponsiveHourlyData(fullHourlyData);
  const isResizing = useChartResize();
  const isDailyTab = currentChartTab === "daily";

  const activeData = useMemo(
    () => (isDailyTab ? chartDailyData : chartHourlyData),
    [isDailyTab, chartDailyData, chartHourlyData],
  );

  const formatters = useChartFormat(
    isDailyTab ? chartDailyData : fullHourlyData,
    isDailyTab,
    currentChartTab,
    {
      isMobile,
      isTablet,
      isDesk,
      isSmallDesk,
    },
  );

  return useMemo(
    () => ({
      currentChartTab,
      activeData,
      isDailyTab,
      isResizing,
      setCurrentChartTab,
      formatters,
      currentDevice: {
        isMobile,
        isTablet,
        isDesk,
        isSmallDesk,
      },
    }),
    [
      currentChartTab,
      activeData,
      isDailyTab,
      isResizing,
      setCurrentChartTab,
      formatters,
      isMobile,
      isTablet,
      isDesk,
      isSmallDesk,
    ],
  );
}
