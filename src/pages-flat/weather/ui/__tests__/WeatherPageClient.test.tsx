import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { CityData } from "@/shared/types";
import { useWeatherPage } from "../../model/useWeatherPage";
import { PageClient } from "../WeatherPageClient";

// --- 1. mocks ---
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: vi.fn(),
}));
vi.mock("../../model/useWeatherPage", () => ({
  useWeatherPage: vi.fn(),
}));
vi.mock("@/widgets/weather-today", () => ({
  Today: () => <div data-testid="today" />,
}));
vi.mock("@/widgets/weather-details", () => ({
  Details: () => <div data-testid="details" />,
}));
vi.mock("@/widgets/daily-forecast", () => ({
  DailyForecast: () => <div data-testid="daily" />,
}));
vi.mock("@/widgets/hourly-forecast", () => ({
  HourlyForecast: () => <div data-testid="hourly" />,
}));
vi.mock("@/widgets/weather-chart", () => ({
  Chart: () => <div data-testid="chart" />,
}));
vi.mock("@/features/search-city", () => ({
  SearchError: ({ message }: { message: string }) => (
    <div>Error: {message}</div>
  ),
}));
vi.mock(import("@/shared/ui"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    NetworkError: ({ message }: { message: string }) => (
      <div>Network: {message}</div>
    ),
  };
});

// --- 2. tests ---
describe("WeatherPageClient", () => {
  const cityData = { status: "found", city: "Warsaw" } as CityData;
  type WeatherPageReturn = ReturnType<typeof useWeatherPage>;

  it("should show SearchError when city status is 'not-found'", () => {
    const notFoundCity = { status: "not-found", city: "Unknown" } as CityData;
    vi.mocked(useWeatherPage).mockReturnValue({
      isPending: false,
    } as WeatherPageReturn);
    renderWithClient(<PageClient cityData={notFoundCity} />);

    expect(screen.getByText("Error: Unknown"));
  });

  it("should show NetworkError", () => {
    vi.mocked(useWeatherPage).mockReturnValue({
      isError: true,
      error: { code: "FORECAST_FAILED", message: "API error" },
      isPending: false,
    } as unknown as WeatherPageReturn);
    renderWithClient(<PageClient cityData={cityData} />);

    expect(screen.getByText("Network: API error")).toBeInTheDocument();
  });

  it("should renderWithClient widgets when data is loaded", () => {
    vi.mocked(useWeatherPage).mockReturnValue({
      data: { current: {}, daily: {}, hourly: {}, forecastUnits: {} },
      isPending: false,
      isError: false,
      devices: {},
    } as WeatherPageReturn);
    renderWithClient(<PageClient cityData={cityData} />);

    expect(screen.getByTestId("today")).toBeInTheDocument();
    expect(screen.getByTestId("details")).toBeInTheDocument();
    expect(screen.getByTestId("daily")).toBeInTheDocument();
    expect(screen.getByTestId("hourly")).toBeInTheDocument();
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};
