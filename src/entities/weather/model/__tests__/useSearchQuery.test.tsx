import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { AppError } from "@/shared/api";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import { createGeoData, createResultsMocks } from "@/shared/lib/testing";
import { useSearchQuery } from "../useSearchQuery";

// --- 1. mocks ---
const fetchSearchResults = vi.hoisted(() => vi.fn());
vi.mock("@/entities/weather/api/weather.api", () => ({
  fetchSearchResults,
}));

// --- 2. tests ---
describe("useSearchQuery", () => {
  const geoData = createGeoData();

  beforeEach(() => {
    vi.clearAllMocks();
    fetchSearchResults.mockClear();
    testQueryClient.clear();
  });

  it("should fetch data", async () => {
    const [searchData] = createResultsMocks();
    fetchSearchResults.mockResolvedValue(searchData);
    const { result } = renderHookWithClient(() =>
      useSearchQuery(geoData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(8);
    expect(result.current.data).toEqual(searchData);
  });

  it("should return empty array when city not found", async () => {
    fetchSearchResults.mockResolvedValue([]);
    const { result } = renderHookWithClient(() =>
      useSearchQuery({ results: [] }, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    expect(fetchSearchResults).not.toBeCalled();
  });

  it("should handle API error", async () => {
    const error = new AppError(
      "FORECAST_FAILED",
      "Server is temporarily unaavailable...",
    );
    fetchSearchResults.mockRejectedValue(error);
    const { result } = renderHookWithClient(() =>
      useSearchQuery(geoData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
    expect(fetchSearchResults).toHaveBeenCalledTimes(3);
  });
});

// --- 3. render with client ---
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, retryDelay: 0, gcTime: 0, staleTime: 0 },
  },
});

function renderHookWithClient<T>(hook: () => T) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
  return renderHook(hook, { wrapper });
}
