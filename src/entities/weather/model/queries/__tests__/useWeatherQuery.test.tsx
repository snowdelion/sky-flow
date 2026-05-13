import { QueryClient, QueryClientProvider, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import { AppError, ERROR_CODES } from "@/shared/api"
import { DEFAULT_UNITS } from "@/shared/config/constants"
import { createCityData } from "@/shared/lib/testing"
import { createWeatherData } from "@/shared/lib/testing"
import { isFoundCity, type CityData } from "@/shared/types"
import { useWeatherQuery } from "../useWeatherQuery"

// --- 1. mocks ---
vi.mock("@tanstack/react-query", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query")
  return {
    ...actual,
    useQuery: vi.fn((options: UseQueryOptions) =>
      actual.useQuery({
        ...options,
        retry: false,
        retryDelay: 0,
      }),
    ),
  }
})

const fetchForecastData = vi.hoisted(() => vi.fn())
vi.mock("@/entities/weather/api/fetchForecastData.ts", () => ({
  fetchForecastData,
}))

vi.mock("@/shared/types/city/city-data.types.ts", () => ({
  isFoundCity: vi.fn(),
}))

// --- 2. tests ---
describe("useWeatherQuery", () => {
  const { minskCityData } = createCityData()
  const weatherData = createWeatherData()

  beforeEach(() => {
    vi.clearAllMocks()
    testQueryClient.clear()
    fetchForecastData.mockClear()
    vi.mocked(isFoundCity).mockReturnValue(true)
  })

  describe("fetching", () => {
    it("should fetch data", async () => {
      fetchForecastData.mockResolvedValue(weatherData)
      const { result } = renderHookWithClient(() => useWeatherQuery(minskCityData, DEFAULT_UNITS))

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(weatherData)
    })

    it("shouldn't fetch when city is not found", async () => {
      vi.mocked(isFoundCity).mockReturnValue(false)
      const notFoundCityData: CityData = {
        status: "not-found",
        city: "nonExist123",
      }
      const { result } = renderHookWithClient(() =>
        useWeatherQuery(notFoundCityData, DEFAULT_UNITS),
      )

      expect(fetchForecastData).not.toHaveBeenCalled()
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("shouldn't run query when city isFoundCity is false", () => {
      vi.mocked(isFoundCity).mockReturnValue(false)
      const notFoundCity: CityData = { status: "not-found", city: "Unknown" }
      const { result } = renderHookWithClient(() => useWeatherQuery(notFoundCity, DEFAULT_UNITS))

      expect(result.current.fetchStatus).toBe("idle")
      expect(result.current.isEnabled).toBe(false)
      expect(fetchForecastData).not.toHaveBeenCalled()
    })
  })

  describe("error handling: API", () => {
    it("should handle API errors", async () => {
      const error = new AppError(ERROR_CODES.FORECAST, "Server is temporarily unavailable...")
      fetchForecastData.mockRejectedValue(error)

      const { result } = renderHookWithClient(() => useWeatherQuery(minskCityData, DEFAULT_UNITS))

      await waitFor(() => expect(result.current.isError).toBe(true))
      expect(result.current.error).toBe(error)
      expect((result.current.error as AppError).code).toBe(ERROR_CODES.FORECAST)
      expect(fetchForecastData).toHaveBeenCalled()
    })

    it("should handle network errors", async () => {
      const error = new AppError(ERROR_CODES.UNKNOWN, "Check your network connection...")
      fetchForecastData.mockRejectedValue(error)

      const { result } = renderHookWithClient(() => useWeatherQuery(minskCityData, DEFAULT_UNITS))

      await waitFor(() => expect(result.current.isError).toBe(true))
      expect((result.current.error as AppError).code).toBe(ERROR_CODES.UNKNOWN)
      expect(fetchForecastData).toHaveBeenCalled()
    })

    it("should handle error state", async () => {
      fetchForecastData.mockRejectedValue(new AppError(ERROR_CODES.UNKNOWN, "Network error"))
      const { result } = renderHookWithClient(() => useWeatherQuery(minskCityData, DEFAULT_UNITS))

      await waitFor(() => expect(result.current.isError).toBe(true))
      expect((result.current.error as AppError).code).toBe(ERROR_CODES.UNKNOWN)
    })

    it("should throw 'forecast' error in queryFn when city becomes not-found", async () => {
      vi.mocked(isFoundCity).mockReturnValueOnce(true).mockReturnValueOnce(false)

      const { result } = renderHookWithClient(() => useWeatherQuery(minskCityData, DEFAULT_UNITS))

      await waitFor(() => expect(result.current.isError).toBe(true))
      expect((result.current.error as AppError).code).toBe(ERROR_CODES.FORECAST)
      expect(fetchForecastData).not.toHaveBeenCalled()
    })

    it("should pass queryRetry callback", async () => {
      const mockUseQuery = vi.mocked(useQuery)

      renderHookWithClient(() => useWeatherQuery(minskCityData, DEFAULT_UNITS))

      const options = mockUseQuery.mock.calls[0][0]
      const retryFn = options.retry as (failureCount: number, error: unknown) => boolean

      const abortError = new DOMException("Aborted", "AbortError")

      expect(retryFn(0, abortError)).toBe(false)
      expect(retryFn(0, new Error())).toBe(true)
      expect(retryFn(2, new Error())).toBe(false)
    })
  })

  describe("error handling: abort", () => {
    it("should handle abort signals", async () => {
      const abortError = new Error("AbortError")
      abortError.name = "AbortError"
      fetchForecastData.mockRejectedValue(abortError)

      const { result } = renderHookWithClient(() => useWeatherQuery(minskCityData, DEFAULT_UNITS))

      await waitFor(() => expect(result.current.isError).toBe(true))
      expect(result.current.error).toBe(abortError)
    })

    it("should pass combined signal to fetchForecastData", async () => {
      fetchForecastData.mockResolvedValue(weatherData)

      renderHookWithClient(() => useWeatherQuery(minskCityData, DEFAULT_UNITS))

      await waitFor(() => expect(fetchForecastData).toHaveBeenCalled())
      const call = fetchForecastData.mock.calls[0]

      expect(call[0].signal).toBeInstanceOf(AbortSignal)
    })
  })
})

// --- 3. render with client ---
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryDelay: 0,
      gcTime: 0,
      staleTime: 0,
    },
  },
})

function renderHookWithClient<T>(hook: () => T) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  )
  return renderHook(hook, { wrapper })
}
