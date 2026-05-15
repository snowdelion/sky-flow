import { fetchGeoData } from "@/entities/location"
import { FoundCitySchema } from "@/shared/types"
import { DEFAULT_CITY_DATA } from "./constants"
import { createSearchParams, findMatch, needsRedirectCheck, type WeatherParams } from "./utils"

export async function validateCityParams(params: WeatherParams) {
  if (!params.city) {
    const defaultParams = createSearchParams(DEFAULT_CITY_DATA)
    return { status: "redirect" as const, url: `/weather?${defaultParams.toString()}` }
  }

  const { city, lat, lon, region, country } = params
  const geoData = await fetchGeoData({ city, count: 20 })

  if (!geoData?.results?.length)
    return {
      status: "not-found" as const,
      city,
    }

  const match = findMatch(geoData, { lat, lon, region, country })
  const { success, data } = FoundCitySchema.safeParse(match)

  if (!success) return { status: "not-found" as const, city }

  const needsRedirect = needsRedirectCheck(params, data)
  if (needsRedirect) {
    const params = createSearchParams(data)
    return { status: "redirect" as const, url: `/weather?${params.toString()}` }
  }

  return data
}
