import z from "zod";

export const SearchResultCurrentDtoSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
    time: z.string(),
    weather_code: z.number().min(0).max(99),
  }),
});

export const SearchResultUnitsDtoSchema = z.object({
  current_units: z.object({
    temperature_2m: z.string(),
  }),
});

export const SearchResultDtoSchema = SearchResultCurrentDtoSchema.extend(
  SearchResultUnitsDtoSchema.shape,
);
export const SearchResultsDtoSchema = z.array(SearchResultDtoSchema);

export type SearchResultDto = z.infer<typeof SearchResultCurrentDtoSchema>;
export type SearchResultsDto = z.infer<typeof SearchResultsDtoSchema>;
