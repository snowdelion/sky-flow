import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook } from "@testing-library/react"
import { useGeoQuery } from "@/entities/location"
import { useWeatherQuery } from "@/entities/weather"
import type { CityData } from "@/shared/types"
import { useWeatherPage } from "./useWeatherPage"

// --- 1. mocks ---
vi.mock("@/entities/location", () => ({ useGeoQuery: vi.fn() }))
vi.mock("@/entities/settings", () => ({
  useSettingsStore: vi.fn((s) => s({ units: { temperatureUnit: "celsius" } })),
}))
vi.mock("@/entities/weather", () => ({ useWeatherQuery: vi.fn() }))

// --- 2. tests ---
describe("useWeatherPage", () => {
  const cityWithCoords = { status: "found", city: "Berlin", lat: 10, lon: 20 }
  const cityOnlyName = { status: "found", city: "Warsaw" }

  type GeoReturn = ReturnType<typeof useGeoQuery>
  type WeatherReturn = ReturnType<typeof useWeatherQuery>

  it("should skip geo query when coords already in city data", () => {
    vi.mocked(useGeoQuery).mockReturnValue({
      isFetching: false,
      isFetched: false,
    } as GeoReturn)
    vi.mocked(useWeatherQuery).mockReturnValue({
      data: { temperature: -2 },
      isFetching: false,
    } as unknown as WeatherReturn)
    const { result } = renderHookWithClient(() => useWeatherPage(cityWithCoords as CityData))

    expect(useWeatherQuery).toHaveBeenCalledWith(
      expect.objectContaining({ lat: 10, lon: 20 }),
      expect.any(Object),
    )
    expect(result.current.isPending).toBe(false)
  })

  it("should wait for geo data if coords are missing", () => {
    vi.mocked(useGeoQuery).mockReturnValue({
      data: { results: [{ lat: 10, lon: 20 }] },
      isFetching: false,
      isFetched: true,
    } as GeoReturn)
    vi.mocked(useWeatherQuery).mockReturnValue({
      isFetching: true,
      isFetched: false,
    } as WeatherReturn)
    const { result } = renderHookWithClient(() => useWeatherPage(cityOnlyName as CityData))

    expect(useWeatherQuery).toHaveBeenCalledWith(
      expect.objectContaining({ lat: 10, lon: 20 }),
      expect.any(Object),
    )
    expect(result.current.isPending).toBe(true)
  })

  it("should return isPending true while fetching weather", () => {
    vi.mocked(useGeoQuery).mockReturnValue({ isFetching: false } as GeoReturn)
    vi.mocked(useWeatherQuery).mockReturnValue({
      isFetching: true,
      isFetched: false,
    } as WeatherReturn)
    const { result } = renderHookWithClient(() => useWeatherPage(cityWithCoords as CityData))

    expect(result.current.isPending).toBe(true)
  })

  it("should handle 'not-found' city status", () => {
    const notFoundCity = { status: "not-found", city: "unknown" }
    vi.mocked(useGeoQuery).mockReturnValue({
      data: { results: [] },
      isFetched: true,
    } as unknown as GeoReturn)
    vi.mocked(useWeatherQuery).mockReturnValue({
      isFetched: false,
    } as WeatherReturn)
    const { result } = renderHookWithClient(() => useWeatherPage(notFoundCity as CityData))

    expect(result.current.data).toBeUndefined()
  })
})

// --- 3. render with client ---
function renderHookWithClient<T>(hook: () => T) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  })
}
