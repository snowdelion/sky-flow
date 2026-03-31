"use client";
import { isNotFoundCity, type CityData } from "@/entities/location";
import { useWeatherQuery } from "@/entities/weather";
import { SearchError } from "@/features/search-city";
import { AppError } from "@/shared/api";
import { NetworkError } from "@/shared/ui";
import { DailyForecast } from "@/widgets/daily-forecast";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { Chart } from "@/widgets/weather-chart";
import { Details } from "@/widgets/weather-details";
import { Today } from "@/widgets/weather-today";

import { WeatherPageSkeleton } from "./WeatherPageSkeleton";

export function PageClient({ cityData }: { cityData: CityData }) {
  const { data, isPending, isError, error, refetch } =
    useWeatherQuery(cityData);

  if (isNotFoundCity(cityData)) return <SearchError message={cityData.city} />;

  if (isPending) return <WeatherPageSkeleton />;
  if (isError || !data) {
    const message =
      error instanceof AppError && error.code === "FORECAST_FAILED"
        ? error.message
        : "Check your network connection...";
    return <NetworkError message={message} refetch={refetch} />;
  }

  const { current, daily, hourly, forecastUnits } = data;

  return (
    <>
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
    </>
  );
}
