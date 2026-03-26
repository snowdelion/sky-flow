import DailyForecastSkeleton from "./DailyForecast.skeleton";
import HourlyForecastSkeleton from "./HourlyForecast.skeleton";
import TodayWeatherSkeleton from "./TodayWeather.skeleton";
import WeatherDetailsSkeleton from "./WeatherDetails.skeleton";

export default function WeatherContentSkeleton() {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-col w-full xl:w-full max-w-99 sm:max-w-304 lg:gap-4 xl:gap-8 mb-8 lg:mb-0 items-center lg:items-start lg:flex-row">
          <div className="w-full lg:min-w-150 lg:max-w-154 xl:max-w-200 mx-auto mb-8">
            <TodayWeatherSkeleton />
            <WeatherDetailsSkeleton />
            <DailyForecastSkeleton />
          </div>

          <HourlyForecastSkeleton />
        </div>
      </div>
    </>
  );
}
