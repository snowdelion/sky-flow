import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useDebounce } from "use-debounce"
import { fetchGeoData, useSearchStore } from "@/entities/location"
import { useGeoQuery } from "@/entities/location"
import { useSettingsStore } from "@/entities/settings"
import { useSearchQuery } from "@/entities/weather"
import { queryRetry } from "@/shared/api"

export function useSearchCity() {
  const inputValue = useSearchStore((s) => s.inputValue)
  const [delayValue, { isPending }] = useDebounce(inputValue, 500)
  const isDebouncing = isPending()

  const { data, isFetching: isGeoFetching, isError: isGeoError } = useGeoQuery(delayValue)

  const queryClient = useQueryClient()
  const refetch = useCallback(async () => {
    const current = useSearchStore.getState().inputValue.trim()
    if (!current) return { data: EMPTY_GEO }

    return {
      data: await queryClient.fetchQuery({
        queryKey: ["location", current],
        queryFn: () => fetchGeoData({ city: current }),
        retry: (failureCount, error) => queryRetry(failureCount, error, 2),
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      }),
    }
  }, [queryClient])

  const units = useSettingsStore((s) => s.units)
  const {
    data: resultData,
    isFetching: isDelayFetching,
    isError: isSearchError,
  } = useSearchQuery(data || EMPTY_GEO, units)

  const isError = isGeoError || isSearchError
  const shouldSearchSkeleton =
    (isDebouncing || isDelayFetching || isGeoFetching) && !!inputValue.trim()

  return { shouldSearchSkeleton, resultData, isError, refetch }
}

const EMPTY_GEO = { results: [] }
