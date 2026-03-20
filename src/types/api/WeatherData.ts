import { z } from "zod";

export const WeatherDataUnitsSchema = z
  .object({
    temperature: z.string().transform((i) => {
      if (i === "°C" || i === "celsius") return "°C";
      if (i === "°F" || i === "fahrenheit") return "°F";
      return "°C";
    }),
    speed: z.string().transform((i) => {
      if (i === "km/h" || i === "kmh") return "km/h";
      if (i === "mp/h" || i === "mph") return "mp/h";
      return "km/h";
    }),
    precipitation: z.string().transform((i) => {
      if (i === "inch" || i === "in") return "inch";
      return "mm";
    }),
  })
  .strip();

export const WeatherDataCurrentSchema = z
  .object({
    apparent_temperature: z.number(),
    precipitation: z.number().min(0),
    relative_humidity_2m: z.number().min(0).max(100),
    temperature_2m: z.number(),
    time: z.string(),
    weather_code: z.number().min(0).max(99),
    wind_speed_10m: z.number().min(0),
    city: z.string(),
    region: z.string().optional(),
    code: z.string().optional(),
    country: z.string().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strip();

export const WeatherDataHourlySchema = z
  .object({
    temperature_2m: z.array(z.number()),
    time: z.array(z.string()),
    weather_code: z.array(z.number().min(0).max(99)),
  })
  .strip();

export const WeatherDataDailySchema = z
  .object({
    apparent_temperature_max: z.array(z.number()),
    apparent_temperature_min: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    time: z.array(z.string()),
    weather_code: z.array(z.number().min(0).max(99)),
  })
  .strip();

export const WeatherDataSchema = z
  .object({
    current: WeatherDataCurrentSchema,
    hourly: WeatherDataHourlySchema,
    daily: WeatherDataDailySchema,
    forecastUnits: WeatherDataUnitsSchema,
  })
  .strip();

export type WeatherData = z.infer<typeof WeatherDataSchema>;
export type WeatherDataCurrent = z.infer<typeof WeatherDataCurrentSchema>;
export type WeatherDataHourly = z.infer<typeof WeatherDataHourlySchema>;
export type WeatherDataDaily = z.infer<typeof WeatherDataDailySchema>;
export type WeatherDataUnits = z.infer<typeof WeatherDataUnitsSchema>;
