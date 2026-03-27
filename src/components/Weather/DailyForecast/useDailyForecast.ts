import type { StaticImageData } from "next/image";
import { useCallback, useMemo } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import type { WeatherDataDaily } from "@/types/api/WeatherData";
import { formatDayOfWeek } from "@/utils/formatters";
import { getWeatherIcon, calculateAverageTemps } from "@/utils/weather";

export function useDailyForecast(
  dailyData: WeatherDataDaily,
): UseDailyForecastReturn {
  const setSelectedDayIndex = useSettingsStore((s) => s.setSelectedDayIndex);

  const formattedDays = useMemo(() => {
    const {
      temperature_2m_min: tempMin,
      temperature_2m_max: tempMax,
      time,
      weather_code: weatherCode,
      apparent_temperature_min: apparentTempMin,
      apparent_temperature_max: apparentTempMax,
    } = dailyData;

    return time.slice(0, 7).map((dateStr: string, index: number) => {
      const date = new Date(dateStr);
      const icon = getWeatherIcon(weatherCode[index]);

      return {
        day: formatDayOfWeek(date, "dddd"),
        weatherCode: weatherCode?.[index] || 0,
        temp: `${calculateAverageTemps(tempMin[index], tempMax[index])}°`,
        feelsLike: `${calculateAverageTemps(apparentTempMin[index], apparentTempMax[index])}°`,
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
