import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import type { WeatherData } from "@/types/api/WeatherData";
import { AppError } from "@/types/errors";
import type { CityData } from "@/types/location";

import { useWeatherQuery } from "./useWeatherQuery";

const mockFetchForecastData = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchForecastData", () => ({
  fetchForecastData: mockFetchForecastData,
}));

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

describe("useWeatherQuery", () => {
  let cityData: CityData;
  let mockWeatherData: WeatherData;

  beforeEach(() => {
    vi.clearAllMocks();
    testQueryClient.clear();
    mockFetchForecastData.mockClear();

    cityData = {
      lat: 53.9,
      lon: 27.56667,
      city: "Minsk",
      country: "Belarus",
    };

    mockWeatherData = {
      current: {
        city: "Minsk",
        country: "Belarus",
      },
      daily: {
        temperature_2m_max: [-2],
      },
      hourly: {
        temperature_2m: [-2],
      },
      forecastUnits: {
        temperature: "°C",
      },
    } as WeatherData;
  });

  it("should fetch data", async () => {
    mockFetchForecastData.mockResolvedValue(mockWeatherData);
    const { result } = renderHookWithClient(() => useWeatherQuery(cityData));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockWeatherData);
  });

  it("shouldn't retry when not found or aborted", async () => {
    const notFoundError = new AppError(
      "GEOCODING_FAILED",
      `City ${cityData.city} not found...`,
    );
    mockFetchForecastData.mockRejectedValue(notFoundError);

    const { result } = renderHookWithClient(() => useWeatherQuery(cityData));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(notFoundError);
    expect((result.current.error as AppError).code).toBe("GEOCODING_FAILED");

    expect(result.current.failureCount).toBe(1);
    expect(mockFetchForecastData).toHaveBeenCalledTimes(1);
  });
});
