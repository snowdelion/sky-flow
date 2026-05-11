import z from "zod";
import {
  CityDataSchema,
  FoundCitySchema,
  NotFoundCitySchema,
} from "./city-data.schema";

export type CityData = z.infer<typeof CityDataSchema>;
export type FoundCity = z.infer<typeof FoundCitySchema>;
export type NotFoundCity = z.infer<typeof NotFoundCitySchema>;

export const isFoundCity = (data: CityData): data is FoundCity =>
  FoundCitySchema.safeParse(data).success;

export const isNotFoundCity = (data: CityData): data is NotFoundCity =>
  NotFoundCitySchema.safeParse(data).success;
