import { z } from "zod";

export const GeoItemDtoSchema = z
  .object({
    admin1: z.string().optional(),
    feature_code: z.string().optional(),
    name: z.string(),
    country: z.string().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    timezone: z.string().optional(),
    id: z.number().min(0).int(),
  })
  .strip();

export const GeoResponseDtoSchema = z.object({
  results: z.array(GeoItemDtoSchema),
});

export type GeoItemDto = z.infer<typeof GeoItemDtoSchema>;
export type GeoResponseDto = z.infer<typeof GeoResponseDtoSchema>;
