import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import { useGeoQuery, useSearchStore } from "@/entities/location"
import { useSearchQuery } from "@/entities/weather"
import { useSearchCity } from "../useSearchCity"

// --- 1. mocks ---
vi.mock("@/entities/location", async () => {
  const actual = await vi.importActual("@/entities/location")
  return {
    ...actual,
    useGeoQuery: vi.fn(),
    useSearchStore: actual.useSearchStore,
  }
})

vi.mock("@/entities/weather", async () => {
  const actual = await vi.importActual("@/entities/weather")
  return { ...actual, useSearchQuery: vi.fn() }
})

// --- 2. setup ---
const setup = () => {
  const { result, rerender } = renderHookWithClient(() => useSearchCity())
  const SearchQuery = vi.mocked(useSearchQuery)
  const GeoQuery = vi.mocked(useGeoQuery)

  const timer = async (ms: number = 500) =>
    await act(async () => await vi.advanceTimersByTimeAsync(ms))

  return {
    result,
    rerender,
    SearchQuery,
    GeoQuery,
    timer,
    store: useSearchStore.getState(),
  }
}

// --- 3. tests ---
describe("useSearchCity", () => {
  type SearchReturn = ReturnType<typeof useSearchQuery>
  type GeoReturn = ReturnType<typeof useGeoQuery>

  beforeEach(() => {
    vi.useFakeTimers()
    useSearchStore.getState().reset()

    vi.mocked(useSearchQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
    } as SearchReturn)

    vi.mocked(useGeoQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
    } as GeoReturn)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shouldn't show skeleton when input is empty", () => {
    const { result, store } = setup()

    act(() => store.setInputValue(""))
    expect(result.current.shouldSearchSkeleton).toBe(false)
  })

  it("should show skeleton when typing", () => {
    const { result, store } = setup()

    act(() => store.setInputValue("Berlin"))
    expect(result.current.shouldSearchSkeleton).toBe(true)
  })

  it("should handle debounce and hide skeleton after delay", async () => {
    const { result, store, timer } = setup()

    act(() => store.setInputValue("Berlin"))
    expect(result.current.shouldSearchSkeleton).toBe(true)

    await timer()
    expect(result.current.shouldSearchSkeleton).toBe(false)
  })

  it("should show skeleton while fetching", async () => {
    const { result, GeoQuery, store, timer } = setup()
    GeoQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
    } as GeoReturn)

    act(() => store.setInputValue("Berlin"))
    expect(result.current.shouldSearchSkeleton).toBe(true)

    await timer()
    expect(result.current.shouldSearchSkeleton).toBe(true)
  })

  it("should hide skeleton after success data", async () => {
    const { result, rerender, GeoQuery, SearchQuery, store, timer } = setup()
    GeoQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
    } as GeoReturn)

    act(() => store.setInputValue("Berlin"))
    await timer()
    expect(result.current.shouldSearchSkeleton).toBe(true)

    GeoQuery.mockReturnValue({
      data: { results: [{ city: "Berlin" }] },
      isFetching: false,
    } as GeoReturn)
    rerender()
    expect(result.current.shouldSearchSkeleton).toBe(false)

    SearchQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
    } as SearchReturn)
    rerender()
    expect(result.current.shouldSearchSkeleton).toBe(true)

    SearchQuery.mockReturnValue({
      data: [{ city: "Berlin" }],
      isFetching: false,
    } as SearchReturn)
    rerender()
    expect(result.current.shouldSearchSkeleton).toBe(false)
  })
})

// --- 4. render with client ---
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
