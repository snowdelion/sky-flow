"use client";

import { SearchError } from "@/components/ui/SearchError";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { AppError } from "@/types/errors";
import { isNotFoundCity, type CityData } from "@/types/location";

import { NetworkError } from "../ui/NetworkError";

import { Chart } from "./Chart";
import { DailyForecast } from "./DailyForecast";
import { Details } from "./Details";
import { HourlyForecast } from "./HourlyForecast";
import { Today } from "./Today";
import WeatherSkeleton from "./WeatherSkeleton";

export function Weather({ cityData }: { cityData: CityData }) {
  const { data, isPending, isError, error, refetch } =
    useWeatherQuery(cityData);

  if (isNotFoundCity(cityData)) return <SearchError message={cityData.city} />;

  if (isPending) return <WeatherSkeleton />;
  if (isError || !data) {
    const message =
      error instanceof AppError && error.code === "FORECAST_FAILED"
        ? error.message
        : "Check your network connection...";
    return <NetworkError message={message} refetch={refetch} />;
  }

  const { current, daily, hourly, forecastUnits } = data;

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-col w-full xl:w-auto max-w-99 sm:max-w-full lg:gap-4 xl:gap-8 mb-8 lg:mb-0 items-center lg:items-start lg:flex-row">
        <div className="w-full lg:min-w-150 xl:max-w-200 mb-8">
          <Today currentData={current} forecastUnits={forecastUnits} />
          <Details currentData={current} forecastUnits={forecastUnits} />
          <DailyForecast dailyData={daily} />
        </div>
        <HourlyForecast hourlyData={hourly} forecastUnits={forecastUnits} />
      </div>

      <Chart dailyData={daily} hourlyData={hourly} />
    </div>
  );
}
