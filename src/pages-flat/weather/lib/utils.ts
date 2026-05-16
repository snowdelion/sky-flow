import { headers } from "next/headers"
import { fetchGeoData } from "@/entities/location"
import { FoundCity, type Geo, type GeoItem } from "@/shared/types"
import { DEFAULT_CITY_DATA } from "./constants"

export interface WeatherParams {
  city?: string
  region?: string
  country?: string
  code?: string
  lat?: string
  lon?: string
}

export const getCityDataFromIP = async () => {
  const headersList = await headers()

  const lat = headersList.get("x-vercel-ip-latitude") ?? undefined
  const lon = headersList.get("x-vercel-ip-longitude") ?? undefined

  const rawCity = headersList.get("x-vercel-ip-city") ?? undefined
  const rawCountry = headersList.get("x-vercel-ip-country") ?? undefined
  const rawRegion = headersList.get("x-vercel-ip-country-region") ?? undefined

  const city = rawCity ? decodeURIComponent(rawCity) : undefined
  const country = rawCountry ? decodeURIComponent(rawCountry) : undefined
  const region = rawRegion ? decodeURIComponent(rawRegion) : undefined

  return { city, country, lat, lon, region }
}

export const createSearchParams = (data: FoundCity) => {
  const { city, region, country, code, lat, lon } = data
  const params = new URLSearchParams()

  params.set("city", city)
  if (region) params.set("region", region)
  if (country) params.set("country", country)
  if (code) params.set("code", code)
  params.set("lat", lat.toString())
  params.set("lon", lon.toString())
  return params
}

export const findMatch = (
  geoData: Geo,
  query: { lat?: number; lon?: number; region?: string; country?: string },
) => {
  const { results } = geoData
  if (query.lat !== undefined && query.lon !== undefined) {
    const isValid =
      !isNaN(query.lat) &&
      !isNaN(query.lon) &&
      query.lat >= -90 &&
      query.lat <= 90 &&
      query.lon >= -180 &&
      query.lon <= 180

    if (isValid) {
      const match = results.find(
        (item: GeoItem) => item.lat === query.lat && item.lon === query.lon,
      )

      if (match) return createCityData(match)
    }
  }

  if (query.region || query.country) {
    const match = results.find((item: GeoItem) => {
      const matchRegion =
        query.region && item.region?.toLowerCase().includes(query.region.toLowerCase())
      const matchCountry =
        query.country && item.country?.toLowerCase().includes(query.country.toLowerCase())
      return matchRegion || matchCountry
    })
    if (match) return createCityData(match)
  }

  return createCityData(results[0])
}

export const needsRedirectCheck = (params: WeatherParams, data: FoundCity) => {
  const hasExtraParams = Object.keys(params).some(
    (key) => !["city", "region", "country", "code", "lat", "lon"].includes(key),
  )

  if (hasExtraParams) return true

  const isDifferent =
    Number(params.lat) !== data?.lat ||
    Number(params.lon) !== data?.lon ||
    params.region !== data?.region ||
    params.country !== data?.country ||
    params.code !== data?.code

  return isDifferent
}

export async function findCityFromParamsOrIP(params: WeatherParams) {
  if (params.city)
    return {
      status: "found" as const,
      city: params.city,
      lat: Number(params.lat),
      lon: Number(params.lon),
      region: params.region,
      country: params.country,
    }

  const ipData = await getCityDataFromIP()

  if (ipData.city)
    return {
      status: "found" as const,
      city: ipData.city,
      lat: Number(ipData.lat),
      lon: Number(ipData.lon),
      region: ipData.region,
      country: ipData.country,
    }

  if (ipData.country) {
    const countryData = await fetchGeoData({ city: ipData.country, count: 3 })

    if (countryData?.results?.length) {
      const match =
        countryData.results.find((item) => item.code === "PCLI") ?? countryData.results[0]

      return {
        status: "found" as const,
        city: match.city,
        country: match.country,
        region: match.region,
        code: match.code,
        lat: match.lat,
        lon: match.lon,
      }
    }
  }

  return { status: "redirect" as const }
}

export function createDefaultRedirect() {
  const defaultParams = createSearchParams(DEFAULT_CITY_DATA)
  return { status: "redirect" as const, url: `/weather?${defaultParams.toString()}` }
}

export function createNotFoundResponse(city: string) {
  return { status: "not-found" as const, city }
}

const createCityData = (data: GeoItem) => ({
  status: "found",
  city: data.city,
  region: data.region,
  country: data.country,
  code: data.code,
  lat: data.lat,
  lon: data.lon,
})
