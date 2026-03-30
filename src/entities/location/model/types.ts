import z from "zod";

import { HistorySchema, HistoryItemSchema } from "./schema";

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

export type CityData = z.infer<typeof CityDataSchema>;
export type FoundCity = z.infer<typeof FoundCitySchema>;
export type NotFoundCity = z.infer<typeof NotFoundCitySchema>;

export const isFoundCity = (data: CityData): data is FoundCity =>
  FoundCitySchema.safeParse(data).success;

export const isNotFoundCity = (data: CityData): data is NotFoundCity =>
  NotFoundCitySchema.safeParse(data).success;

export type HistoryItem = z.infer<typeof HistoryItemSchema>;
export type HistoryData = z.infer<typeof HistorySchema>;

export interface SearchTabProps {
  data: HistoryItem;
  inputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export type ActiveTab = "recent" | "favorites";

export interface SearchStore {
  inputValue: string;
  currentTab: ActiveTab;
  isOpen: boolean;
  _hasHydrated: boolean;
  lastValidatedCity: CityData;

  setInputValue: (value: string) => void;
  setCurrentTab: (tab: ActiveTab) => void;
  setIsOpen: (value: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  setLastValidatedCity: (cityData: CityData) => void;

  reset: () => void;
}
