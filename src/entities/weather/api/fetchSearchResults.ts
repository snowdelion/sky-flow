import {
  AppError,
  ERROR_CODES,
  handleApiError,
  request,
  getBaseUrl,
} from "@/shared/api";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import type { Geo, GeoItem, Units } from "@/shared/types";
import { createSearchResultsParams } from "../lib/createSearchResultsParams";
import { mapToResultsData } from "../model/mapper";
import { SearchResultsDtoSchema } from "./dto/search.dto";

export const fetchSearchResults = async (
  geoData: Geo,
  units: Units = DEFAULT_UNITS,
  signal?: AbortSignal,
) => {
  try {
    const onlyLats = geoData.results.map((item: GeoItem) => item.lat).join(",");
    const onlyLons = geoData.results.map((item: GeoItem) => item.lon).join(",");

    const params = createSearchResultsParams(
      onlyLats,
      onlyLons,
      units.temperatureUnit,
    );
    const url = `${getBaseUrl()}/api/search?${params}`;
    const res = await request({ url, signal, errorCode: ERROR_CODES.SEARCH });

    if (!res?.data)
      throw new AppError(
        ERROR_CODES.SEARCH,
        "No data received from weather API",
      );

    const normalizeData = Array.isArray(res.data) ? res.data : [res.data];
    const data = SearchResultsDtoSchema.parse(normalizeData);

    return mapToResultsData(data, geoData);
  } catch (error) {
    handleApiError(error, ERROR_CODES.SEARCH);
  }
};
