import type { Geo, FoundCity } from "@/shared/types";
import { type WeatherDto } from "../api/dto/forecast.dto";
import { SearchResultsDto } from "../api/dto/search.dto";

export const mapToForecastData = (data: WeatherDto, cityData: FoundCity) => ({
  current: {
    feelsLike: data.current.apparent_temperature,
    precipitation: data.current.precipitation,
    humidity: data.current.relative_humidity_2m,
    temperature: data.current.temperature_2m,
    time: data.current.time,
    weatherCode: data.current.weather_code,
    speed: data.current.wind_speed_10m,

    city: cityData.city,
    country: cityData?.country,
    region: cityData?.region,
    code: cityData?.code,
    lat: cityData.lat,
    lon: cityData.lon,
  },
  hourly: {
    temperature: data.hourly.temperature_2m,
    time: data.hourly.time,
    weatherCode: data.hourly.weather_code,
  },
  daily: {
    feelsLikeMax: data.daily.apparent_temperature_max,
    feelsLikeMin: data.daily.apparent_temperature_min,
    temperatureMax: data.daily.temperature_2m_max,
    temperatureMin: data.daily.temperature_2m_min,
    time: data.daily.time,
    weatherCode: data.daily.weather_code,
  },
  forecastUnits: {
    temperatureUnit: data.current_units.temperature_2m,
    speedUnit: data.current_units.wind_speed_10m,
    precipitationUnit: data.current_units.precipitation,
  },
});

export const mapToResultsData = (
  searchData: SearchResultsDto,
  GeoData: Geo,
) => {
  return GeoData.results.map((item, index) => {
    const weather = searchData[index];

    return {
      region: item?.region,
      code: item?.code,
      city: item.city,
      country: item?.country,
      id: item.id,
      lat: item.lat,
      lon: item.lon,
      temperature: weather?.current?.temperature_2m,
      temperatureUnit: weather?.current_units?.temperature_2m,
      weatherCode: weather?.current?.weather_code,
    };
  });
};
