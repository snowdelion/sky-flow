import { useMemo } from "react";
import { formatCityDisplay } from "@/entities/location";
import { type WeatherCurrent } from "@/entities/weather";
import { conditionMapper } from "./conditionMapper";

export function useToday(currentData?: WeatherCurrent) {
  return useMemo(() => {
    if (!currentData) return { displayName: "", aiRequestData: null };

    const displayName = formatCityDisplay({
      status: "found",
      city: currentData.city,
      country: currentData.country,
      region: currentData.region,
      code: currentData.code,
      lat: currentData.lat,
      lon: currentData.lon,
    });

    const weatherCode = currentData?.weatherCode ?? 0;
    const aiRequestData = {
      city: currentData?.city as string,
      country: currentData?.country,
      region: currentData?.region,
      lat: currentData?.lat as number,
      lon: currentData?.lon as number,
      temperature: currentData?.temperature,
      condition:
        weatherCode in conditionMapper
          ? conditionMapper[weatherCode]
          : "unknown",
    };

    return { displayName, aiRequestData };
  }, [currentData]);
}
