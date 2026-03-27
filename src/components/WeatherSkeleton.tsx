import { ChartSkeleton } from "./Chart/ChartSkeleton";
import DailyForecastSkeleton from "./DailyForecast/DailyForecastSkeleton";
import DetailsSkeleton from "./Details/DetailsSkeleton";
import HourlyForecastSkeleton from "./HourlyForecast/HourlyForecastSkeleton";
import TodaySkeleton from "./Today/TodaySkeleton";

export default function WeatherSkeleton() {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-col w-full xl:w-full max-w-99 sm:max-w-304 lg:gap-4 xl:gap-8 mb-8 lg:mb-0 items-center lg:items-start lg:flex-row">
          <div className="w-full lg:min-w-150 lg:max-w-217.75 xl:max-w-200 mx-auto mb-8">
            <TodaySkeleton />
            <DetailsSkeleton />
            <DailyForecastSkeleton />
          </div>

          <HourlyForecastSkeleton />
        </div>

        <ChartSkeleton />
      </div>
    </>
  );
}
