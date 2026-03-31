import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearchStore } from "@/entities/location";
import { createCityData } from "@/shared/lib/testing";
import { createGeoData } from "@/shared/lib/testing";

import { useSearchActions } from "./use-search";

import "@testing-library/jest-dom";

// --- 1. mocks ---
const { mocks } = vi.hoisted(() => {
  const push = vi.fn();
  const addCity = vi.fn();
  const fetchGeoData = vi.fn();

  return {
    mocks: {
      navigation: {
        push,
        routerModule: () => ({ push: push }),
        pathnameModule: { usePathname: vi.fn(() => "/") },
        searchParamsModule: {
          useSearchParams: vi.fn(() => new URLSearchParams()),
        },
      },
      hooks: {
        addCity,
        historyModule: { useSearchHistory: () => ({ addCity }) },
      },
      services: {
        fetchGeoData,
        geoModule: { fetchGeoData },
      },
    },
  };
});
vi.mock("next/navigation", async () => {
  return {
    useRouter: () => mocks.navigation.routerModule(),
    usePathname: mocks.navigation.pathnameModule.usePathname,
    useSearchParams: mocks.navigation.searchParamsModule.useSearchParams,
  };
});
vi.mock(
  "@/entities/location/model/useSearchHistory",
  () => mocks.hooks.historyModule,
);
vi.mock("@/entities/location/api/location.api", () => mocks.services.geoModule);

// --- 2. tests ---
describe("useSearchActions", () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.services.fetchGeoData.mockClear();
    mocks.navigation.push.mockClear();
    mocks.hooks.addCity.mockClear();

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
      expect(mocks.navigation.push).toHaveBeenCalledTimes(1);
      expect(mocks.navigation.push).toHaveBeenCalledWith(
        expect.stringContaining(
          "/?city=Minsk&region=Minsk+City&country=Belarus&code=PPLC&lat=53.9&lon=27.56667",
        ),
      );
      expect(mocks.navigation.push).toHaveBeenCalledTimes(1);
      expect(mocks.hooks.addCity).toHaveBeenCalledTimes(1);
      expect(mocks.hooks.addCity).toHaveBeenCalledWith(minskCityData);
    });

    expect(useSearchStore.getState().inputValue).toBe("");
  });

  it("should find first city from input", async () => {
    const geoData = createGeoData();

    mocks.services.fetchGeoData.mockResolvedValue(geoData);
    const { result } = renderHookWithClient(() => useSearchActions());

    await act(async () => await result.current.searchCityWithName("Berlin"));
  });

  it("shouldn't navigate when input is empty", async () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    await act(() => result.current.searchCityWithName(""));
    expect(mocks.navigation.push).not.toHaveBeenCalled();
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
