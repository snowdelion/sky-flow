import z from "zod";

export const FoundCitySchema = z.object({
  status: z.literal("found"),
  city: z.string(),
  country: z.string(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const NotFoundCitySchema = z.object({
  status: z.literal("not-found"),
  city: z.string(),
});

export const CityDataSchema = z.discriminatedUnion("status", [
  FoundCitySchema,
  NotFoundCitySchema,
]);

export type CityData = z.infer<typeof CityDataSchema>;
export type FoundCity = z.infer<typeof FoundCitySchema>;
export type NotFoundCity = z.infer<typeof NotFoundCitySchema>;

export const isFoundCity = (data: CityData): data is FoundCity =>
  FoundCitySchema.safeParse(data).success;

export const isNotFoundCity = (data: CityData): data is NotFoundCity =>
  NotFoundCitySchema.safeParse(data).success;
