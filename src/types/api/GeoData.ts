import { z } from "zod";

export const GeoDataItemSchema = z
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

export const GeoDataSchema = z.object({
  results: z.array(GeoDataItemSchema).optional().default([]),
});

export type GeoDataItem = z.infer<typeof GeoDataItemSchema>;
export type GeoData = z.infer<typeof GeoDataSchema>;
