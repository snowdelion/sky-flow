import { http, HttpResponse } from "msw"
import { CITY_BASE_DATA } from "../mocks/data/cities"

export const handlers = [
  http.get("/api/geocoding", ({ request }) => {
    const url = new URL(request.url)
    const name = url.searchParams.get("name")

    if (!name) return HttpResponse.json({ results: [] }, { status: 200 })

    const cityKey = Object.keys(CITY_RESPONSES).find(
      (key) => key.toLowerCase() === name.toLowerCase(),
    )

    if (cityKey)
      return HttpResponse.json(
        { results: CITY_RESPONSES[cityKey as keyof typeof CITY_RESPONSES] },
        { status: 200 },
      )

    return HttpResponse.json({ results: [] }, { status: 200 })
  }),

  http.get("/api/forecast", ({ request }) => {
    const url = new URL(request.url)
    const city = url.searchParams.get("city")
    const region = url.searchParams.get("region")
    const code = url.searchParams.get("code")
    const country = url.searchParams.get("country")
    const latitudes = url.searchParams.get("latitude")?.split(",") ?? []
    const longitudes = url.searchParams.get("longitude")?.split(",") ?? []
    const count = Math.max(latitudes.length, 1)

    const forecasts = Array.from({ length: count }, (_, index) => ({
      current: {
        time: new Date().toISOString(),
        apparent_temperature: -2,
        city,
        country,
        region,
        code,
        precipitation: 0,
        relative_humidity_2m: 10,
        temperature_2m: -2,
        weather_code: 0,
        wind_speed_10m: 10,
        latitude: 53.9,
        longitude: 27.56667,
      },
      hourly: {
        temperature_2m: Array.from({ length: 24 }, () => -2),
        time: Array.from({ length: 24 }, () => new Date().toISOString()),
        weather_code: Array.from({ length: 24 }, () => 0),
      },
      daily: {
        apparent_temperature_max: Array.from({ length: 7 }, () => -2),
        apparent_temperature_min: Array.from({ length: 7 }, () => -4),
        temperature_2m_max: Array.from({ length: 7 }, () => -4),
        temperature_2m_min: Array.from({ length: 7 }, () => -2),
        time: Array.from({ length: 7 }, () => new Date().toISOString().split("T")[0]),
        weather_code: Array.from({ length: 7 }, () => 0),
      },
      current_units: {
        temperature_2m: "°C",
        apparent_temperature: "°C",
        wind_speed_10m: "km/h",
        precipitation: "mm",
      },
      elevation: 100 + index,
      generationtime_ms: 0.5,
      latitude: Number(latitudes[index] ?? 53.9),
      longitude: Number(longitudes?.[index] ?? 27.56667),
      timezone: "auto",
      timezone_abbreviation: "MSK",
      utc_offset_seconds: 10800,
    }))

    return HttpResponse.json(count === 1 ? forecasts[0] : forecasts)
  }),

  http.get("/api/search", ({ request }) => {
    const url = new URL(request.url)
    const latitudes = url.searchParams.get("latitude")?.split(",") ?? []
    const count = Math.max(latitudes.length, 1)

    const results = Array.from({ length: count }, () => ({
      current: {
        temperature_2m: -2,
        time: new Date().toISOString(),
        weather_code: 0,
      },
      current_units: {
        temperature_2m: "°C",
      },
    }))

    return HttpResponse.json(results)
  }),
]

const CITY_RESPONSES: Record<string, mockCityResponse[]> = Object.entries(CITY_BASE_DATA).reduce(
  (acc, [name, data]) => ({
    ...acc,
    [name]: [
      ...Array(7).fill({
        id: data.first.id,
        name: data.first.name,
        admin1: data.first.region,
        feature_code: data.first.code,
        country: data.first.country,
        latitude: data.first.lat,
        longitude: data.first.lon,
        timezone: data.first.timezone,
      }),
      {
        id: data.last.id,
        name: data.last.name,
        admin1: data.last.region,
        feature_code: data.last.code,
        country: data.last.country,
        latitude: data.last.lat,
        longitude: data.last.lon,
        timezone: data.last.timezone,
      },
    ],
  }),
  {},
)

interface mockCityResponse {
  id: number
  name: string
  admin1: string
  feature_code: string
  country: string
  latitude: number
  longitude: number
  timezone: string
}
