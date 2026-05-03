import { useCallback, useMemo } from "react";
import { useSettingsStore } from "@/entities/settings";
import { getAspect, getTicks, getXTickFormatter } from "./chart.utils";

export function useChartFormat(
  activeData: ActiveData,
  isDailyTab: boolean,
  currentChartTab: string,
  devices: {
    isMobile: boolean;
    isTablet: boolean;
    isDesk: boolean;
    isSmallDesk: boolean;
  },
) {
  const units = useSettingsStore((s) => s.units);
  const { isMobile, isTablet, isDesk, isSmallDesk } = devices;

  const handleXAxisTickFormat = useCallback(
    (value: string) => {
      if (isDailyTab)
        return isMobile
          ? value.slice(0, 2)
          : isTablet
            ? value.slice(0, 3)
            : value;
      return getXTickFormatter(value, {
        currentChartTab,
        isDesk,
        isSmallDesk,
        hourUnit: units.timeUnit,
      });
    },
    [
      isDailyTab,
      isMobile,
      isTablet,
      isDesk,
      isSmallDesk,
      units.timeUnit,
      currentChartTab,
    ],
  );

  const yTicks = useMemo(() => getTicks(activeData), [activeData]);
  const yDomain = useMemo(
    () => [yTicks[0], yTicks[yTicks.length - 1]],
    [yTicks],
  );
  const aspect = getAspect(isMobile, isTablet);

  return useMemo(
    () => ({
      handleXAxisTickFormat,
      yTicks,
      yDomain,
      currentUnit: units.temperatureUnit === "celsius" ? "°C" : "°F",
      dataKey: isDailyTab ? "day" : "hour",
      aspect,
    }),
    [
      handleXAxisTickFormat,
      yTicks,
      yDomain,
      aspect,
      isDailyTab,
      units.temperatureUnit,
    ],
  );
}

type ActiveData =
  | {
      day: string;
      temp: number;
    }[]
  | {
      hour: string;
      temp: number;
    }[];
