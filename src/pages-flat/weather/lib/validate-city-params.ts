import { fetchGeoData } from "@/entities/location"
import { FoundCitySchema } from "@/shared/types"
import { DEFAULT_CITY_DATA } from "./constants"
import {
  createSearchParams,
  findMatch,
  getCityDataFromIP,
  needsRedirectCheck,
  type WeatherParams,
} from "./utils"

export async function validateCityParams(params: WeatherParams) {
  let city = params.city
  let lat = params.lat
  let lon = params.lon
  let region = params.region
  let country = params.country

  if (!city) {
    const cityDataFromIP = await getCityDataFromIP()

    if (cityDataFromIP.city) {
      city = cityDataFromIP.city
      lat = cityDataFromIP.lat
      lon = cityDataFromIP.lon
      region = cityDataFromIP.region
      country = cityDataFromIP.country
    } else {
      const defaultParams = createSearchParams(DEFAULT_CITY_DATA)
      return { status: "redirect" as const, url: `/weather?${defaultParams.toString()}` }
    }
  }

  const geoData = await fetchGeoData({ city, count: 20 })

  if (!geoData?.results?.length) {
    if (!params.city) {
      const defaultParams = createSearchParams(DEFAULT_CITY_DATA)
      return { status: "redirect" as const, url: `/weather?${defaultParams.toString()}` }
    }
    return { status: "not-found" as const, city }
  }

  const match = findMatch(geoData, { lat, lon, region, country })
  const { success, data } = FoundCitySchema.safeParse(match)

  if (!success) {
    if (!params.city) {
      const defaultParams = createSearchParams(DEFAULT_CITY_DATA)
      return { status: "redirect" as const, url: `/weather?${defaultParams.toString()}` }
    }
    return { status: "not-found" as const, city }
  }

  const needsRedirect = needsRedirectCheck(params, data)
  if (needsRedirect) {
    const redirectParams = createSearchParams(data)
    return { status: "redirect" as const, url: `/weather?${redirectParams.toString()}` }
  }

  return data
}
