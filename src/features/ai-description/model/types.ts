import z from "zod";

export type RequestData = {
  city: string;
  country?: string;
  region?: string;
  lat: number;
  lon: number;
  temperature?: number;
  condition?: string;
};

export const AiRequestsSchema = z.object({
  option: z.enum(["location", "weather"]),
  city: z.string(),
  country: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  temperature: z.number().optional(),
  condition: z.string().optional(),
});

export type ServerRequestData = z.infer<typeof AiRequestsSchema>;

export type AiErrorCode =
  | "RATE_LIMIT_EXCEEDED"
  | "INVALID_REQUEST_DATA"
  | "SERVICE_UNAVAILABLE";
