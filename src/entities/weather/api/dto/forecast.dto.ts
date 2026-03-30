import { z } from "zod";

export const WeatherUnitsDtoSchema = z
  .object({
    temperature_2m: z.string().transform((i) => {
      if (i === "°C" || i === "celsius") return "°C";
      if (i === "°F" || i === "fahrenheit") return "°F";
      return "°C";
    }),
    wind_speed_10m: z.string().transform((i) => {
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

export const WeatherCurrentDtoSchema = z
  .object({
    apparent_temperature: z.number(),
    precipitation: z.number().min(0),
    relative_humidity_2m: z.number().min(0).max(100),
    temperature_2m: z.number(),
    time: z.string(),
    weather_code: z.number().min(0).max(99),
    wind_speed_10m: z.number().min(0),
  })
  .strip();

export const WeatherHourlyDtoSchema = z
  .object({
    temperature_2m: z.array(z.number()),
    time: z.array(z.string()),
    weather_code: z.array(z.number().min(0).max(99)),
  })
  .strip();

export const WeatherDailyDtoSchema = z
  .object({
    apparent_temperature_max: z.array(z.number()),
    apparent_temperature_min: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    time: z.array(z.string()),
    weather_code: z.array(z.number().min(0).max(99)),
  })
  .strip();

export const WeatherDtoSchema = z
  .object({
    current: WeatherCurrentDtoSchema,
    hourly: WeatherHourlyDtoSchema,
    daily: WeatherDailyDtoSchema,
    current_units: WeatherUnitsDtoSchema,
  })
  .strip();

export type WeatherDto = z.infer<typeof WeatherDtoSchema>;
export type WeatherCurrentDto = z.infer<typeof WeatherCurrentDtoSchema>;
export type WeatherHourlyDto = z.infer<typeof WeatherHourlyDtoSchema>;
export type WeatherDailyDto = z.infer<typeof WeatherDailyDtoSchema>;
export type WeatherUnitsDto = z.infer<typeof WeatherUnitsDtoSchema>;
