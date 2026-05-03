import z from "zod";
import { type CityData } from "@/shared/types";
import { HistorySchema, HistoryItemSchema } from "./schema";

export type HistoryItem = z.infer<typeof HistoryItemSchema>;
export type History = z.infer<typeof HistorySchema>;

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
