import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  favoriteStore,
  recentStore,
} from "@/components/SearchSection/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";
import type { HistoryItem } from "@/types/history";
import type { CityData } from "@/types/location";

import SearchSection from "./SearchSection";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/image", () => ({
  default: (props: Partial<React.ImgHTMLAttributes<HTMLImageElement>>) => (
    <img
      {...props}
      alt={props.alt}
      src={props.src}
      width={props.width || 5}
      height={props.height || 5}
    />
  ),
}));

const mockFetchForecastData = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchforecastData", () => ({
  fetchforecastData: mockFetchForecastData,
}));

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithClient = (element: React.ReactElement) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
  return render(element, { wrapper });
};

//
describe("SearchSection integration", () => {
  let user: ReturnType<typeof userEvent.setup>;
  let mockData: HistoryItem[];
  let cityData: CityData;

  beforeEach(() => {
    window.localStorage.clear();
    recentStore.reset();
    favoriteStore.reset();

    testQueryClient.clear();
    vi.clearAllMocks();
    mockFetchForecastData.mockClear();
    mockPush.mockClear();

    mockFetchForecastData.mockResolvedValue({
      current: {
        city: "Berlin",
        country: "Germany",
        latitude: 52.52437,
        longitude: 13.41053,
      },
      daily: {
        temperature_2m_max: [-2],
      },
      hourly: {
        temperature_2m: [-2],
      },
      forecastUnits: {
        temperature: "celsius",
      },
    });

    user = userEvent.setup();

    mockData = [
      {
        id: "warsaw-poland",
        city: "Warsaw",
        country: "Poland",
        isFavorite: false,
        timestamp: 1,
        latitude: 52.22977,
        longitude: 21.01178,
      },
      {
        id: "berlin-germany",
        city: "Berlin",
        country: "Germany",
        isFavorite: false,
        timestamp: 2,
        latitude: 52.52437,
        longitude: 13.41053,
      },
      {
        id: "minsk-belarus",
        city: "Minsk",
        country: "Belarus",
        isFavorite: false,
        timestamp: 3,
        latitude: 53.9,
        longitude: 27.56667,
      },
    ];

    cityData = {
      city: "Minsk",
      country: "Belarus",
      lat: 12,
      lon: 34,
    };
  });

  it("should update URL with city name", async () => {
    renderWithClient(<SearchSection cityData={cityData} />);
    const input = screen.getByPlaceholderText("Search for a place...");

    const { result } = renderHook(() => useSearchStore());
    act(() => result.current.reset());

    await user.type(input, "Berlin{enter}");
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(
          "city=Berlin&country=Germany&lat=52.52437&lon=13.41053",
        ),
      ),
    );
  });

  it("should navigate from recent list", async () => {
    window.localStorage.setItem("weather-recent", JSON.stringify(mockData));
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={cityData} />);
    const input = screen.getByPlaceholderText(/search for a place/i);
    await user.click(input);

    const cityOption = await screen.findByRole("option", {
      name: "Berlin, Germany",
    });
    const cityLink = within(cityOption).getByRole("button", {
      name: "Select Berlin, Germany",
    });
    await user.click(cityLink);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(
          "city=Berlin&country=Germany&lat=52.52437&lon=13.41053",
        ),
      ),
    );
  });

  it("should navigate from favorites list", async () => {
    window.localStorage.setItem("weather-favorite", JSON.stringify(mockData));
    act(() => {
      favoriteStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={cityData} />);
    await waitFor(() => useSearchStore.setState({ isOpen: true }));

    const favoritesTab = await screen.findByRole("tab", {
      name: /favorites searches/i,
    });
    await user.click(favoritesTab);
    expect(useSearchStore.getState().currentTab).toBe("favorites");

    const cityOption = await screen.findByRole("option", {
      name: "Berlin, Germany",
    });
    const cityLink = within(cityOption).getByLabelText(
      "Select Berlin, Germany",
    );
    await user.click(cityLink);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(
          "city=Berlin&country=Germany&lat=52.52437&lon=13.41053",
        ),
      ),
    );
  });

  it("should toggle favorites in recent tab", async () => {
    window.localStorage.setItem("weather-recent", JSON.stringify(mockData));
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={cityData} />);
    await waitFor(() => useSearchStore.setState({ isOpen: true }));

    const cityOption = screen.getByRole("option", { name: "Berlin, Germany" });
    const favoriteIcon = within(cityOption).getByLabelText(/toggle favorite/i);

    await user.click(favoriteIcon);
    await waitFor(() => {
      const currentFavorite = favoriteStore.getSnapshot();
      expect(currentFavorite.length).toBe(1);
      expect(currentFavorite[0].isFavorite).toBe(true);

      const hasCity = currentFavorite.some((item) => /berlin/i.test(item.city));
      expect(hasCity).toBe(true);
    });

    await user.click(favoriteIcon);
    await waitFor(() => {
      const currentFavorite = favoriteStore.getSnapshot();
      expect(currentFavorite.length).toBe(0);

      const hasCity = currentFavorite.some((item) => /berlin/i.test(item.city));
      expect(hasCity).toBe(false);
    });
  });

  it("should remove city from recent", async () => {
    window.localStorage.setItem("weather-recent", JSON.stringify(mockData));
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={cityData} />);
    await waitFor(() => useSearchStore.setState({ isOpen: true }));

    const cityOption = screen.getByRole("option", { name: "Berlin, Germany" });
    const removeCity =
      within(cityOption).getByLabelText(/remove from history/i);

    await user.click(removeCity);

    await waitFor(() => {
      const currentRecent = recentStore.getSnapshot();
      expect(currentRecent.length).toBe(2);
      const hasCity = currentRecent.some((item) => /berlin/i.test(item.city));
      expect(hasCity).toBe(false);
      expect(screen.queryByText("Berlin, Germany")).not.toBeInTheDocument();
    });
  });

  it("should remove city from favorites", async () => {
    window.localStorage.setItem("weather-favorite", JSON.stringify(mockData));
    act(() => {
      favoriteStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={cityData} />);
    await waitFor(() =>
      useSearchStore.setState({ isOpen: true, currentTab: "favorites" }),
    );

    const cityOption = screen.getByRole("option", { name: "Berlin, Germany" });
    const favoriteIcon = within(cityOption).getByLabelText(
      /remove from favorites/i,
    );

    await user.click(favoriteIcon);
    await waitFor(() => {
      const currentFavorites = favoriteStore.getSnapshot();
      expect(currentFavorites.length).toBe(2);

      const hasCity = currentFavorites.some((item) =>
        /berlin/i.test(item.city),
      );
      expect(hasCity).toBe(false);
    });
  });
});
