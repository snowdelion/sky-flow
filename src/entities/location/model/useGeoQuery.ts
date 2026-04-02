import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AppError } from "@/shared/api";
import type { Geo } from "@/shared/types";
import { fetchGeoData } from "../api/location.api";

export function useGeoQuery(
  query: string | null | undefined,
): UseQueryResult<Geo, AppError> {
  const validatedQuery = query?.trim().toLowerCase();

  return useQuery<Geo, AppError>({
    queryKey: ["location", validatedQuery],

    queryFn: async ({ signal }) => {
      const timeoutSignal = AbortSignal.timeout(5000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

      const data = await fetchGeoData(validatedQuery, combinedSignal);
      return data;
    },

    enabled: !!validatedQuery && validatedQuery.length > 1,
    retry: (failureCount) => failureCount < 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
