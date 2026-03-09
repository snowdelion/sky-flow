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
import { createCityDataMocks } from "@/testing/mocks/factories/cityData";
import { createHistoryCity } from "@/testing/mocks/factories/historyData";
import type { HistoryItem } from "@/types/history";

import SearchSection from "./SearchSection";

// --- 1. mocks ---
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/image", async () => {
  const actual = await vi.importActual("@/testing/mocks/next/image");
  return { default: actual.default };
});

// --- 2. setup ---
const setup = () => {
  const historyData = createHistoryCity();

  const setRecentItem = (data: HistoryItem[] = historyData) =>
    act(() => recentStore.update(data));
  const setFavoritesItem = (data: HistoryItem[] = historyData) =>
    act(() => favoriteStore.update(data));
  const user = userEvent.setup();
  const { berlinCityData } = createCityDataMocks();
  const renderResult = renderWithClient(
    <SearchSection cityData={berlinCityData} />,
  );
  const input = screen.getByPlaceholderText(/search for a place\.\.\./i);

  return {
    ...renderResult,
    user,
    historyData,
    berlinCityData,
    input,

    setRecentItem,
    setFavoritesItem,

    findOption: (name: string) => screen.findByRole("option", { name }),
    findTab: (name: RegExp) => screen.findByRole("tab", { name }),
    getLink: (option: HTMLElement, name: RegExp) =>
      within(option).getByRole("button", { name }),

    getIcon: (option: HTMLElement, name: RegExp) =>
      within(option).getByLabelText(name),
  };
};

// --- 3. tests ---
describe("SearchSection integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    recentStore.reset();
    favoriteStore.reset();
    testQueryClient.clear();
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  it("should update URL with city name", async () => {
    const { user, input } = setup();

    const { result } = renderHook(() => useSearchStore());
    act(() => result.current.reset());

    await user.type(input, "Berlin{enter}");
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        "/?city=Berlin&country=Germany&lat=52.52437&lon=13.41053",
      ),
    );
  });

  it("should navigate from recent list", async () => {
    const { setRecentItem, user, input, findOption, getLink } = setup();
    setRecentItem();

    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });

    await user.click(input);

    const cityOption = await findOption("Berlin, Germany");
    const cityLink = getLink(cityOption, /select berlin, germany/i);

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
    const { setFavoritesItem, findTab, findOption, user, getLink } = setup();
    setFavoritesItem();
    act(() => {
      favoriteStore.reset();
      useSearchStore.getState().reset();
    });
    await act(async () => await useSearchStore.setState({ isOpen: true }));

    const favoritesTab = await findTab(/favorites searches/i);
    await user.click(favoritesTab);
    expect(useSearchStore.getState().currentTab).toBe("favorites");

    const cityOption = await findOption("Berlin, Germany");
    const cityLink = getLink(cityOption, /select berlin, germany/i);
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
    const { setRecentItem, findOption, getIcon, user } = setup();
    setRecentItem();
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    await act(async () => await useSearchStore.setState({ isOpen: true }));

    const cityOption = await findOption("Berlin, Germany");
    const favoriteIcon = getIcon(cityOption, /toggle favorite/i);

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
    const { setRecentItem, findOption, getIcon, user } = setup();
    setRecentItem();
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    await act(async () => await useSearchStore.setState({ isOpen: true }));

    const cityOption = await findOption("Berlin, Germany");
    const removeCity = getIcon(cityOption, /remove from history/i);

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
    const { setFavoritesItem, findOption, getIcon, user } = setup();
    act(() => {
      favoriteStore.reset();
      useSearchStore.getState().reset();
    });
    setFavoritesItem();
    await act(
      async () =>
        await useSearchStore.setState({
          isOpen: true,
          currentTab: "favorites",
        }),
    );

    const cityOption = await findOption("Berlin, Germany");
    const favoriteIcon = getIcon(cityOption, /remove from favorites/i);

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

// --- 4. render with client ---
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
