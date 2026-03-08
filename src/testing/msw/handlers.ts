import { http, HttpResponse } from "msw";

import { CITY_BASE_DATA } from "../mocks/data/cities";

export const handlers = [
  http.get("https://geocoding-api.open-meteo.com/v1/search", ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");

    if (!name) return HttpResponse.json({ results: [] }, { status: 200 });

    const cityKey = Object.keys(CITY_RESPONSES).find(
      (key) => key.toLowerCase() === name.toLowerCase(),
    );

    return HttpResponse.json(
      { results: cityKey ? CITY_RESPONSES[cityKey] : [] },
      { status: 200 },
    );
  }),

  http.get("https://api.open-meteo.com/v1/forecast", ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const country = url.searchParams.get("country");
    const latitudes = url.searchParams.get("latitude")?.split(",") ?? [];
    const longitudes = url.searchParams.get("longitude")?.split(",") ?? [];
    const count = Math.max(latitudes.length, 1);

    const forecasts = Array.from({ length: count }, (_, index) => ({
      current: {
        time: new Date().toISOString(),
        apparent_temperature: -2,
        city,
        country,
        interval: 10,
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
        time: Array.from(
          { length: 7 },
          () => new Date().toISOString().split("T")[0],
        ),
        weather_code: Array.from({ length: 7 }, () => 0),
      },
      current_units: {
        temperature_2m: "°C",
        apparent_temperature: "°C",
      },
      elevation: 100 + index,
      generationtime_ms: 0.5,
      latitude: Number(latitudes[index] || 53.9),
      longitude: Number(longitudes?.[index] || 27.56667),
      timezone:
        url.searchParams.get("timezone")?.split(",")?.[index] || "Europe/Minsk",
      timezone_abbreviation: "MSK",
      utc_offset_seconds: 10800,
    }));

    return HttpResponse.json(count === 1 ? forecasts[0] : forecasts);
  }),
];

const CITY_RESPONSES: Record<string, mockCityResponse[]> = Object.entries(
  CITY_BASE_DATA,
).reduce(
  (acc, [name, data]) => ({
    ...acc,
    [name]: [
      ...Array(7).fill({
        id: data.first.id,
        name: data.first.city,
        country: data.first.country,
        latitude: data.first.lat,
        longitude: data.first.lon,
        timezone: data.first.timezone,
      }),
      {
        id: data.last.id,
        name: data.last.city,
        country: data.last.country,
        latitude: data.last.lat,
        longitude: data.last.lon,
        timezone: data.last.timezone,
      },
    ],
  }),
  {},
);

interface mockCityResponse {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
