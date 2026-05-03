import { startTransition, useCallback, useMemo } from "react";
import { useSettingsStore } from "@/entities/settings";
import { calculateAverageTemps, type WeatherDaily } from "@/entities/weather";
import { formatDayOfWeek } from "@/shared/lib";

export function useDailyForecast(dailyData: WeatherDaily | undefined) {
  const setSelectedDayIndex = useSettingsStore((s) => s.setSelectedDayIndex);

  const formattedDays = useMemo(() => {
    if (!dailyData) return [];
    const {
      feelsLikeMax,
      feelsLikeMin,
      temperatureMax,
      temperatureMin,
      weatherCode,
      time,
    } = dailyData;

    return time.slice(0, 7).map((dateStr: string, index: number) => {
      const date = new Date(dateStr);

      return {
        day: formatDayOfWeek(date, "dddd"),
        weatherCode: weatherCode?.[index] || 0,
        temp: `${calculateAverageTemps(temperatureMin[index], temperatureMax[index])}°`,
        feelsLike: `${calculateAverageTemps(feelsLikeMin[index], feelsLikeMax[index])}°`,
        date: dateStr,
      };
    });
  }, [dailyData]);

  const changeDayIndex = useCallback(
    (index: number) => startTransition(() => setSelectedDayIndex(index)),
    [setSelectedDayIndex],
  );

  return { formattedDays, changeDayIndex };
}
