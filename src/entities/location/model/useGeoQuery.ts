import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchGeoData } from "../api/fetchGeoData";

export function useGeoQuery(query: string) {
  const validatedQuery = query?.trim().toLowerCase();

  return useQuery({
    queryKey: ["location", validatedQuery],

    queryFn: async ({ signal }) => {
      return await fetchGeoData(validatedQuery, signal);
    },

    enabled: validatedQuery.length > 1,

    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
