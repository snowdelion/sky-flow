import type { StaticImageData } from "next/image";
import { useCallback, useMemo } from "react";

import { useSettingsStore } from "@/entities/settings";
import {
  calculateAverageTemps,
  getWeatherIcon,
  type WeatherDaily,
} from "@/entities/weather";
import { formatDayOfWeek } from "@/shared/lib";

export function useDailyForecast(
  dailyData: WeatherDaily,
): UseDailyForecastReturn {
  const setSelectedDayIndex = useSettingsStore((s) => s.setSelectedDayIndex);

  const formattedDays = useMemo(() => {
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
      const icon = getWeatherIcon(weatherCode[index]);

      return {
        day: formatDayOfWeek(date, "dddd"),
        weatherCode: weatherCode?.[index] || 0,
        temp: `${calculateAverageTemps(temperatureMin[index], temperatureMax[index])}°`,
        feelsLike: `${calculateAverageTemps(feelsLikeMin[index], feelsLikeMax[index])}°`,
        date: dateStr,
        image: icon,
      };
    });
  }, [dailyData]);

  const handleClick = useCallback(
    (index: number): void => {
      setSelectedDayIndex(index);
    },
    [setSelectedDayIndex],
  );

  return { formattedDays, handleClick };
}

interface UseDailyForecastReturn {
  formattedDays: {
    day: string;
    weatherCode: number;
    temp: string;
    feelsLike: string;
    date: string;
    image: StaticImageData;
  }[];
  handleClick: (index: number) => void;
}
