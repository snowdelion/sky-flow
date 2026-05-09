"use client";
import { DailyForecast } from "@/widgets/daily-forecast";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { Chart } from "@/widgets/weather-chart";
import { Details } from "@/widgets/weather-details";
import { Today } from "@/widgets/weather-today";
import { SearchError } from "@/features/search-city";
import { ERROR_CODES } from "@/shared/api";
import { isNotFoundCity, type CityData } from "@/shared/types";
import { NetworkError } from "@/shared/ui";
import { useWeatherPage } from "../model/useWeatherPage";

export function PageClient({ cityData }: { cityData: CityData }) {
  const { data, isPending, isError, error, refetch, devices } =
    useWeatherPage(cityData);

  if (isNotFoundCity(cityData)) {
    return <SearchError message={cityData.city} />;
  }

  if (isError) {
    const isAppError = error && typeof error === "object" && "code" in error;
    const message =
      isAppError && error.code === ERROR_CODES.FORECAST
        ? error.message
        : "Check your network connection...";
    return <NetworkError message={message} refetch={refetch} />;
  }

  const current = data?.current;
  const daily = data?.daily;
  const hourly = data?.hourly;
  const forecastUnits = data?.forecastUnits;

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-col w-full xl:w-auto max-w-99 sm:max-w-full lg:gap-4 xl:gap-8 mb-8 lg:mb-0 items-center lg:items-start lg:flex-row">
          <div className="w-full lg:min-w-150 xl:max-w-200 mb-8">
            <Today
              currentData={current}
              forecastUnits={forecastUnits}
              isPending={isPending}
            />
            <Details
              currentData={current}
              forecastUnits={forecastUnits}
              isPending={isPending}
            />
            <DailyForecast dailyData={daily} isPending={isPending} />
          </div>
          <HourlyForecast
            hourlyData={hourly}
            forecastUnits={forecastUnits}
            isPending={isPending}
          />
        </div>

        <Chart
          dailyData={daily}
          hourlyData={hourly}
          isPending={isPending}
          devices={devices}
        />
      </div>
    </>
  );
}
