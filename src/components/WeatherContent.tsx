"use client";

import { SearchError } from "@/components/ui/SearchError";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { AppError } from "@/types/errors";
import { isNotFoundCity, type CityData } from "@/types/location";

import { ChartSection } from "./ChartSection";
import { DailyForecast } from "./DailyForecast";
import { HourlyForecast } from "./HourlyForecast";
import { TodayWeather } from "./TodayWeather";
import { NetworkError } from "./ui/NetworkError";
import { WeatherDetails } from "./WeatherDetails";
import { WeatherContentSkeleton } from "./WeatherSkeleton";

export function WeatherContent({ cityData }: { cityData: CityData }) {
  const { data, isPending, isError, error, refetch } =
    useWeatherQuery(cityData);

  if (isNotFoundCity(cityData)) return <SearchError message={cityData.city} />;

  if (isPending) return <WeatherContentSkeleton />;
  if (isError || !data) {
    const message =
      error instanceof AppError && error.code === "FORECAST_FAILED"
        ? error.message
        : "Check your network connection...";
    return <NetworkError message={message} refetch={refetch} />;
  }

  const { current, daily, hourly, forecastUnits } = data;

  return (
    <div className="flex flex-col w-auto justify-center items-center">
      <div className="flex flex-col items-center lg:items-start lg:flex-row lg:gap-4 xl:gap-8 mb-8 lg:mb-0">
        <div className="flex-1 w-full xl:max-w-200 mb-8">
          <TodayWeather currentData={current} forecastUnits={forecastUnits} />
          <WeatherDetails currentData={current} forecastUnits={forecastUnits} />
          <DailyForecast dailyData={daily} />
        </div>
        <HourlyForecast hourlyData={hourly} forecastUnits={forecastUnits} />
      </div>

      <ChartSection dailyData={daily} hourlyData={hourly} />
    </div>
  );
}
