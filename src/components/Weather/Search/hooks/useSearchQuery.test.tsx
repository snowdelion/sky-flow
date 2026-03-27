import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { createResultsMocks } from "@/testing/mocks/factories/search";
import { AppError } from "@/types/errors";

import { useSearchQuery } from "./useSearchQuery";

// --- 1. mocks ---
const mockFetchSearchResults = vi.hoisted(() => vi.fn());
vi.mock("@/components/Weather/Search/services/fetchSearchResults", () => ({
  fetchSearchResults: mockFetchSearchResults,
}));

// --- 2. tests ---
describe("useSearchQuery", () => {
  const [searchResults] = createResultsMocks();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchSearchResults.mockClear();
    testQueryClient.clear();
  });

  it("should fetch data", async () => {
    mockFetchSearchResults.mockResolvedValue(searchResults);
    const { result } = renderHookWithClient(() => useSearchQuery("Berlin"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(8);
    expect(result.current.data).toEqual(searchResults);
  });

  it("should return empty array when city not found", async () => {
    mockFetchSearchResults.mockResolvedValue([]);
    const { result } = renderHookWithClient(() =>
      useSearchQuery("nonExist123"),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(mockFetchSearchResults).toHaveBeenCalledTimes(1);
    expect(result.current.isError).toBe(false);
  });

  it("should handle API error", async () => {
    const error = new AppError(
      "FORECAST_FAILED",
      "Server is temporarily unaavailable...",
    );
    mockFetchSearchResults.mockRejectedValue(error);
    const { result } = renderHookWithClient(() => useSearchQuery("Berlin"));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
    expect(mockFetchSearchResults).toHaveBeenCalledTimes(3);
  });

  it("should not fetch when search result less than 2 character", async () => {
    const { result } = renderHookWithClient(() => useSearchQuery("A"));

    expect(mockFetchSearchResults).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
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
