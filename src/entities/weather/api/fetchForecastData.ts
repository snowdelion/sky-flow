import { ERROR_CODES, handleApiError, request } from "@/shared/api";
import { AppError } from "@/shared/api";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import { getBaseUrl } from "@/shared/lib";
import { isFoundCity, type CityData } from "@/shared/types";
import type { Units } from "@/shared/types";
import { createForecastParams } from "../model/createForecastParams";
import { mapToForecastData } from "../model/mapper";
import { WeatherDtoSchema } from "./dto/forecast.dto";

export async function fetchForecastData(
  cityData: CityData,
  units: Units = DEFAULT_UNITS,
  signal?: AbortSignal,
) {
  try {
    if (!isFoundCity(cityData))
      throw new AppError(
        ERROR_CODES.FORECAST,
        "Cannot fetch weather! City coords not found...",
      );

    const { city, lat, lon } = cityData;
    if (!city || !lat || !lon)
      throw new AppError(ERROR_CODES.FORECAST, "Invalid city data");

    const params = createForecastParams(lat, lon, units);
    const url = `${getBaseUrl()}/api/forecast?${params}`;

    const res = await request({ url, signal, errorCode: ERROR_CODES.FORECAST });

    if (!res?.data)
      throw new AppError(
        ERROR_CODES.FORECAST,
        "No data received from weather API",
      );

    const result = WeatherDtoSchema.parse(res.data);
    return mapToForecastData(result, cityData);
  } catch (error) {
    handleApiError(error, ERROR_CODES.FORECAST);
  }
}
