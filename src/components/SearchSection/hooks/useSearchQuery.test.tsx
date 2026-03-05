import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { AppError } from "@/types/errors";

import { useSearchQuery } from "./useSearchQuery";

const mockFetchSearchResults = vi.hoisted(() => vi.fn());
vi.mock("@/components/SearchSection/services/fetchSearchResults", () => ({
  fetchSearchResults: mockFetchSearchResults,
}));

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

describe("useSearchQuery", () => {
  let searchResult: string;
  const mockSearchResults = [
    {
      city: "Berlin",
      country: "Germany",
      id: 123,
      latitude: 10,
      longitude: 20,
      temperature: -2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchSearchResults.mockClear();
    testQueryClient.clear();

    searchResult = "Berlin";
  });

  it("should fetch data", async () => {
    mockFetchSearchResults.mockResolvedValue(mockSearchResults);
    const { result } = renderHookWithClient(() => useSearchQuery(searchResult));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockSearchResults);
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
    const { result } = renderHookWithClient(() => useSearchQuery(searchResult));

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
