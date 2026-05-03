import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { AppError } from "@/shared/api";
import { fetchGeoData } from "../../api/location.api";
import { useGeoQuery } from "../useGeoQuery";

// --- 1. mocks ---
vi.mock("../../api/location.api", () => ({
  fetchGeoData: vi.fn(),
}));

// --- 2. tests ---
describe("useGeoQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testQueryClient.clear();
    testQueryClient.getQueryCache().clear();
  });

  it("should be disabled for < 2 query length", () => {
    const { result } = renderHookWithClient(() => useGeoQuery("1"));

    expect(result.current.fetchStatus).toBe("idle");
    expect(fetchGeoData).not.toHaveBeenCalled();
  });

  it("should fetch data for valid queries", async () => {
    const geoData = {
      results: [
        {
          id: 1,
          city: "Warsaw",
          lat: 10,
          lon: 20,
          region: "Mazovia",
          country: "Poland",
          code: "PL",
          timezone: "Europe/Warsaw",
        },
      ],
    };
    vi.mocked(fetchGeoData).mockResolvedValue(geoData);
    const { result } = renderHookWithClient(() => useGeoQuery("Warsaw"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(geoData);
    expect(fetchGeoData).toHaveBeenCalledWith(
      "warsaw",
      expect.any(AbortSignal),
    );
  });

  it("should handle API errors", async () => {
    const error = new AppError(
      "FORECAST_FAILED",
      "Server is temporarily unaavailable...",
    );
    vi.mocked(fetchGeoData).mockRejectedValue(error);
    const { result } = renderHookWithClient(() => useGeoQuery("Warsaw"));

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 4000,
    });
    expect(fetchGeoData).toHaveBeenCalledTimes(3);
    expect(result.current.error).toEqual(error);
  });
});

// --- 3. render with client ---
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, retryDelay: 0, gcTime: 0, staleTime: 0 },
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
