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
} from "@/components/Weather/Search/hooks/useSearchHistory";
import type { HistoryItem } from "@/components/Weather/Search/types/history";
import { useSearchStore } from "@/stores/useSearchStore";
import { createCityData } from "@/testing/mocks/factories/cityData";
import { createHistoryCity } from "@/testing/mocks/factories/historyData";

import Search from "./Search";

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
  const { berlinCityData } = createCityData();
  const renderResult = renderWithClient(<Search cityData={berlinCityData} />);
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
describe("Search integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    recentStore.reset();
    favoriteStore.reset();
    testQueryClient.clear();
    useSearchStore.getState().reset();
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
        "/?city=Berlin&region=State+of+Berlin&country=Germany&code=PPLC&lat=52.52437&lon=13.41053",
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
          "/?city=Berlin&region=State+of+Berlin&country=Germany&code=PPLC&lat=52.52437&lon=13.41053",
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
          "/?city=Berlin&region=State+of+Berlin&country=Germany&code=PPLC&lat=52.52437&lon=13.41053",
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

  describe("focus/blur behavior", () => {
    it("should open and close dropdown when focused and clicked outside", async () => {
      const { user, input } = setup();

      await user.click(input);
      const listbox = screen.getByRole("listbox");
      await waitFor(() => expect(listbox).toBeInTheDocument());
      expect(input).toHaveFocus();

      await user.click(document.body);
      await waitFor(() => expect(listbox).not.toBeInTheDocument());
    });

    it("shouldn't close dropdown when clicking inside", async () => {
      const {
        user,
        input,
        findTab,
        findOption,
        getIcon,
        setRecentItem,
        setFavoritesItem,
      } = setup();
      setRecentItem();
      setFavoritesItem();

      await user.click(input);

      const listbox = screen.getByRole("listbox");
      const recentOption = await findOption("Berlin, Germany");
      const toggleIcon = getIcon(recentOption, /toggle favorite/i);

      await user.click(toggleIcon);
      await waitFor(() => expect(listbox).toBeInTheDocument());
      expect(input).not.toHaveFocus();

      const favoritesTab = await findTab(/favorites searches/i);
      await user.click(favoritesTab);
      await waitFor(() => expect(listbox).toBeInTheDocument());
      expect(input).not.toHaveFocus();

      const favoriteOption = await findOption("Berlin, Germany");
      const removeFavoriteIcon = getIcon(
        favoriteOption,
        /remove from favorites/i,
      );
      await user.click(removeFavoriteIcon);
      await waitFor(() => expect(listbox).toBeInTheDocument());
      expect(input).not.toHaveFocus();
    });

    it("should blur on key down 'Escape'", async () => {
      const { user, input, findTab } = setup();

      await user.click(input);
      const listbox = screen.getByRole("listbox");

      const favoritesTab = await findTab(/favorites searches/i);
      await user.click(favoritesTab);

      await waitFor(() => expect(listbox).toBeInTheDocument());
      expect(listbox).toHaveFocus();

      await user.keyboard("{Escape}");
      await waitFor(() => expect(listbox).not.toBeInTheDocument());
      expect(listbox).not.toHaveFocus();
    });

    it("should hide kayboard on mobile after clicking inside", async () => {
      const touchStart = "ontouchstart" in window;
      if (!touchStart)
        Object.defineProperty(window, "ontouchstart", { value: true });

      const { user, input, findOption, getIcon, setRecentItem } = setup();

      setRecentItem();
      await user.click(input);

      const cityOption = await findOption("Berlin, Germany");
      const removeIcon = getIcon(cityOption, /remove from history/i);

      await waitFor(() => expect(input).toHaveFocus());
      await user.click(removeIcon);
      await waitFor(() => expect(input).not.toHaveFocus());

      if (!touchStart)
        Object.defineProperty(window, "ontouchstart", { value: false });
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
