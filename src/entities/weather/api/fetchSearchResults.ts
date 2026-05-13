import { ERROR_CODES, handleApiError, request, getBaseUrl } from "@/shared/api"
import { DEFAULT_UNITS } from "@/shared/config/constants"
import type { Geo, GeoItem, Units } from "@/shared/types"
import { createSearchResultsParams } from "../lib/createSearchResultsParams"
import { mapToResultsData } from "../model/mapper"
import { SearchResultsDtoSchema } from "./dto/search.dto"

export const fetchSearchResults = async ({
  geoData,
  units = DEFAULT_UNITS,
  signal,
}: FetchSearchResultsArgs) => {
  try {
    const onlyLats = geoData.results.map((item: GeoItem) => item.lat).join(",")
    const onlyLons = geoData.results.map((item: GeoItem) => item.lon).join(",")

    const params = createSearchResultsParams(onlyLats, onlyLons, units.temperatureUnit)
    const url = `${getBaseUrl()}/api/search?${params}`

    const response = await request({
      url,
      signal,
      errorCode: ERROR_CODES.SEARCH,
      schema: SearchResultsDtoSchema,
    })

    return mapToResultsData(response.data, geoData)
  } catch (error) {
    handleApiError(error, ERROR_CODES.SEARCH)
  }
}

type FetchSearchResultsArgs = {
  geoData: Geo
  units: Units
  signal?: AbortSignal
}
