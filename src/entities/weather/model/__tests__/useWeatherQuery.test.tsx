import {
  QueryClient,
  QueryClientProvider,
  UseQueryOptions,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { AppError } from "@/shared/api";
import { DEFAULT_UNITS } from "@/shared/config/constants";
import { createCityData } from "@/shared/lib/testing";
import { createWeatherData } from "@/shared/lib/testing";
import type { CityData } from "@/shared/types";
import { useWeatherQuery } from "../useWeatherQuery";

// --- 1. mocks ---
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQuery: (options: UseQueryOptions) =>
      actual.useQuery({
        ...options,
        retry: false,
        retryDelay: 0,
      }),
  };
});

const mockFetchForecastData = vi.hoisted(() => vi.fn());
vi.mock("@/entities/weather/api/weather.api", () => ({
  fetchForecastData: mockFetchForecastData,
}));

// --- 2. tests ---
describe("useWeatherQuery", () => {
  const { minskCityData } = createCityData();
  const weatherData = createWeatherData();

  beforeEach(() => {
    vi.clearAllMocks();
    testQueryClient.clear();
    mockFetchForecastData.mockClear();
  });

  it("should fetch data", async () => {
    mockFetchForecastData.mockResolvedValue(weatherData);
    const { result } = renderHookWithClient(() =>
      useWeatherQuery(minskCityData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(weatherData);
  });

  it("should handle API errors", async () => {
    const error = new AppError(
      "FORECAST_FAILED",
      "Server is temporarily unavailable...",
    );
    mockFetchForecastData.mockRejectedValue(error);

    const { result } = renderHookWithClient(() =>
      useWeatherQuery(minskCityData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
    expect((result.current.error as AppError).code).toBe("FORECAST_FAILED");
    expect(mockFetchForecastData).toHaveBeenCalled();
  });

  it("should handle network errors", async () => {
    const error = new AppError(
      "UNKNOWN_ERROR",
      "Check your network connection...",
    );
    mockFetchForecastData.mockRejectedValue(error);

    const { result } = renderHookWithClient(() =>
      useWeatherQuery(minskCityData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as AppError).code).toBe("UNKNOWN_ERROR");
    expect(mockFetchForecastData).toHaveBeenCalled();
  });

  it("shouldn't fetch when city is not found", async () => {
    const notFoundCityData: CityData = {
      status: "not-found",
      city: "nonExist123",
    };
    const { result } = renderHookWithClient(() =>
      useWeatherQuery(notFoundCityData, DEFAULT_UNITS),
    );

    expect(mockFetchForecastData).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("should handle abort signals", async () => {
    const abortError = new Error("AbortError");
    abortError.name = "AbortError";
    mockFetchForecastData.mockRejectedValue(abortError);

    const { result } = renderHookWithClient(() =>
      useWeatherQuery(minskCityData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(abortError);
  });
});

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
});

function renderHookWithClient<T>(hook: () => T) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
  return renderHook(hook, { wrapper });
}
