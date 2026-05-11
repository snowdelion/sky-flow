import { ERROR_CODES, handleApiError, request } from "@/shared/api";
import { AppError, getBaseUrl } from "@/shared/api";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import { isFoundCity, type CityData } from "@/shared/types";
import type { Units } from "@/shared/types";
import { createForecastParams } from "../lib/createForecastParams";
import { mapToForecastData } from "../model/mapper";
import { WeatherDtoSchema } from "./dto/forecast.dto";

export async function fetchForecastData({
  cityData,
  units = DEFAULT_UNITS,
  signal,
}: FetchForecastDataArgs) {
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

    const response = await request({
      url,
      signal,
      errorCode: ERROR_CODES.FORECAST,
      schema: WeatherDtoSchema,
    });

    return mapToForecastData(response.data, cityData);
  } catch (error) {
    handleApiError(error, ERROR_CODES.FORECAST);
  }
}

type FetchForecastDataArgs = {
  cityData: CityData;
  units: Units;
  signal?: AbortSignal;
};
