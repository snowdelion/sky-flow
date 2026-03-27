import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearchStore } from "@/stores/useSearchStore";
import { createCityData } from "@/testing/mocks/factories/cityData";
import { createGeoData } from "@/testing/mocks/factories/location";
import { getSearchMocks } from "@/testing/mocks/useSearchMocks";

import { useSearchActions } from "./useSearchActions";

import "@testing-library/jest-dom";

// --- 1. mocks ---
vi.mock("next/navigation", async () => {
  const mocks = getSearchMocks();
  return {
    useRouter: () => mocks.navigation.routerModule(),
    usePathname: mocks.navigation.pathnameModule.usePathname,
    useSearchParams: mocks.navigation.searchParamsModule.useSearchParams,
  };
});
vi.mock(
  "@/components/Weather/Search/hooks/useSearchHistory",
  () => getSearchMocks().hooks.historyModule,
);
vi.mock("@/services/fetchGeoData", () => getSearchMocks().services.geoModule);

// --- 2. tests ---
describe("useSearchActions", () => {
  let inputElement: HTMLInputElement;
  const mocks = getSearchMocks();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.services.mockFetchGeoData.mockClear();
    mocks.navigation.mockPush.mockClear();

    inputElement = document.createElement("input");
    inputElement.setAttribute("aria-label", "search");
    document.body.appendChild(inputElement);

    act(() => {
      useSearchStore.getState().reset();
    });
  });

  afterAll(() => {
    document.body.removeChild(inputElement);
  });

  it("should change active tab", () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    act(() => result.current.handleChangeTab("favorites"));
    expect(useSearchStore.getState().currentTab).toBe("favorites");

    act(() => result.current.handleChangeTab("recent"));
    expect(useSearchStore.getState().currentTab).toBe("recent");
  });

  it("should handling keydown", () => {
    const { result } = renderHookWithClient(() => useSearchActions());
    const mockRef = { current: inputElement };

    const enterEvent = {
      key: "Enter",
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    const escapeEvent = {
      key: "Escape",
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;
    inputElement.focus();

    act(() => useSearchStore.getState().setInputValue("Berlin"));
    expect(useSearchStore.getState().inputValue).toBe("Berlin");

    act(() => result.current.handleKeydown(escapeEvent, mockRef));
    expect(useSearchStore.getState().inputValue).toBe("Berlin");
    expect(document.activeElement).not.toBe(inputElement);

    inputElement.focus();

    act(() => result.current.handleKeydown(enterEvent, mockRef));
    expect(useSearchStore.getState().inputValue).toBe("");
    expect(document.activeElement).not.toBe(inputElement);
  });

  it("should change URL", async () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    const { minskCityData } = createCityData();

    act(() =>
      result.current.searchSelectedCity(minskCityData, {
        current: inputElement,
      }),
    );

    await waitFor(() => {
      expect(mocks.navigation.mockPush).toHaveBeenCalledTimes(1);
      expect(mocks.navigation.mockPush).toHaveBeenCalledWith(
        expect.stringContaining(
          "/?city=Minsk&region=Minsk+City&country=Belarus&code=PPLC&lat=53.9&lon=27.56667",
        ),
      );
      expect(mocks.navigation.mockPush).toHaveBeenCalledTimes(1);
      expect(mocks.hooks.mockAddCity).toHaveBeenCalledTimes(1);
      expect(mocks.hooks.mockAddCity).toHaveBeenCalledWith(minskCityData);
    });

    expect(useSearchStore.getState().inputValue).toBe("");
  });

  it("should find first city from input", async () => {
    const geoData = createGeoData();

    mocks.services.mockFetchGeoData.mockResolvedValue(geoData);
    const { result } = renderHookWithClient(() => useSearchActions());

    await act(async () => await result.current.searchCityWithName("Berlin"));
  });

  it("shouldn't navigate when input is empty", async () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    await act(() => result.current.searchCityWithName(""));
    expect(mocks.navigation.mockPush).not.toHaveBeenCalled();
  });
});

// --- 3. render with client
const testQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

function renderHookWithClient<T>(hook: () => T) {
  const queryClient = testQueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(hook, { wrapper });
}
