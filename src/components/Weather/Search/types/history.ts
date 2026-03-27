import z from "zod";

export const HistoryItemSchema = z.object({
  id: z
    .string()
    .regex(/.+?-.+/)
    .transform((i) => i.toLowerCase()),
  city: z.string(),
  country: z.string().optional(),
  region: z.string().optional(),
  code: z.string().optional(),
  displayName: z.string(),
  isFavorite: z.boolean(),
  timestamp: z.number().positive(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const HistoryDataSchema = z.array(HistoryItemSchema);

export type HistoryItem = z.infer<typeof HistoryItemSchema>;
export type HistoryData = z.infer<typeof HistoryDataSchema>;

export interface SearchTabProps {
  data: HistoryItem;
  inputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export type ActiveTab = "recent" | "favorites";
