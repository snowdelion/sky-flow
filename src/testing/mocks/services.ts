import type { Mock } from "vitest";

export const createMockServices = (): ServiceMocks => {
  const mockFetchGeoData = vi.fn();
  const mockFetchForecastData = vi.fn();
  const mockFetchSearchResults = vi.fn();

  return {
    mockFetchGeoData,
    mockFetchForecastData,
    mockFetchSearchResults,
    geoModule: { fetchGeoData: mockFetchGeoData },
    forecastModule: { fetchForecastData: mockFetchForecastData },
    searchModule: { fetchSearchResults: mockFetchSearchResults },
  };
};

export interface ServiceMocks {
  mockFetchGeoData: Mock;
  mockFetchForecastData: Mock;
  mockFetchSearchResults: Mock;
  geoModule: {
    fetchGeoData: Mock;
  };
  forecastModule: {
    fetchForecastData: Mock;
  };
  searchModule: {
    fetchSearchResults: Mock;
  };
}
