import z from "zod";

export const FoundCitySchema = z.object({
  status: z.literal("found"),
  city: z.string(),
  country: z.string().optional(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  code: z.string().optional(),
  region: z.string().optional(),
});

export const NotFoundCitySchema = z.object({
  status: z.literal("not-found"),
  city: z.string(),
});

export const CityDataSchema = z.discriminatedUnion("status", [
  FoundCitySchema,
  NotFoundCitySchema,
]);
