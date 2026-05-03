export const createMockServices = () => {
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
