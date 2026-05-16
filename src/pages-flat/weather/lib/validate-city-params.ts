import { fetchGeoData } from "@/entities/location"
import { FoundCitySchema } from "@/shared/types"
import {
  createDefaultRedirect,
  createNotFoundResponse,
  createSearchParams,
  findCityFromParamsOrIP,
  findMatch,
  needsRedirectCheck,
  type WeatherParams,
} from "./utils"

export async function validateCityParams(params: WeatherParams) {
  const resolvedCity = await findCityFromParamsOrIP(params)

  if (resolvedCity.status === "redirect") return createDefaultRedirect()

  const { city, lat, lon, region, country } = resolvedCity
  const geoData = await fetchGeoData({ city, count: 20 })

  if (!geoData?.results?.length)
    return params.city ? createNotFoundResponse(city) : createDefaultRedirect()

  const match = findMatch(geoData, { lat, lon, region, country })
  const { data, success } = FoundCitySchema.safeParse(match)

  if (!success) return params.city ? createNotFoundResponse(city) : createDefaultRedirect()

  if (needsRedirectCheck(params, data))
    return {
      status: "redirect" as const,
      url: `/weather?${createSearchParams(data).toString()}`,
    }

  return data
}
