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

const fetchForecastData = vi.hoisted(() => vi.fn());
vi.mock("@/entities/weather/api/weather.api", () => ({
  fetchForecastData,
}));

// --- 2. tests ---
describe("useWeatherQuery", () => {
  const { minskCityData } = createCityData();
  const weatherData = createWeatherData();

  beforeEach(() => {
    vi.clearAllMocks();
    testQueryClient.clear();
    fetchForecastData.mockClear();
  });

  it("should fetch data", async () => {
    fetchForecastData.mockResolvedValue(weatherData);
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
    fetchForecastData.mockRejectedValue(error);

    const { result } = renderHookWithClient(() =>
      useWeatherQuery(minskCityData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
    expect((result.current.error as AppError).code).toBe("FORECAST_FAILED");
    expect(fetchForecastData).toHaveBeenCalled();
  });

  it("should handle network errors", async () => {
    const error = new AppError(
      "UNKNOWN_ERROR",
      "Check your network connection...",
    );
    fetchForecastData.mockRejectedValue(error);

    const { result } = renderHookWithClient(() =>
      useWeatherQuery(minskCityData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as AppError).code).toBe("UNKNOWN_ERROR");
    expect(fetchForecastData).toHaveBeenCalled();
  });

  it("shouldn't fetch when city is not found", async () => {
    const notFoundCityData: CityData = {
      status: "not-found",
      city: "nonExist123",
    };
    const { result } = renderHookWithClient(() =>
      useWeatherQuery(notFoundCityData, DEFAULT_UNITS),
    );

    expect(fetchForecastData).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("should handle abort signals", async () => {
    const abortError = new Error("AbortError");
    abortError.name = "AbortError";
    fetchForecastData.mockRejectedValue(abortError);

    const { result } = renderHookWithClient(() =>
      useWeatherQuery(minskCityData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(abortError);
  });

  it("should handle error state", async () => {
    fetchForecastData.mockRejectedValue(
      new AppError("UNKNOWN_ERROR", "Network error"),
    );
    const { result } = renderHookWithClient(() =>
      useWeatherQuery(minskCityData, DEFAULT_UNITS),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as AppError).code).toBe("UNKNOWN_ERROR");
  });

  it("shouldn't run query when city isFoundCity is false", () => {
    const notFoundCity: CityData = { status: "not-found", city: "Unknown" };
    const { result } = renderHookWithClient(() =>
      useWeatherQuery(notFoundCity, DEFAULT_UNITS),
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.isEnabled).toBe(false);
    expect(fetchForecastData).not.toHaveBeenCalled();
  });

  it("should pass combined signal to fetchForecastData", async () => {
    fetchForecastData.mockResolvedValue(weatherData);

    renderHookWithClient(() => useWeatherQuery(minskCityData, DEFAULT_UNITS));

    await waitFor(() => expect(fetchForecastData).toHaveBeenCalled());

    const call = fetchForecastData.mock.calls[0];
    expect(call[2]).toBeInstanceOf(AbortSignal);
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
