import { act, renderHook } from "@testing-library/react";

import { useSearchStore } from "@/stores/useSearchStore";
import { createCityData } from "@/testing/mocks/factories/cityData";

import { useSyncSearch } from "./useSyncSearch";

// --- 1. mocks ---
const mockAddCity = vi.fn();
vi.mock("@/components/Weather/Search/hooks/useSearchHistory", () => ({
  useSearchHistory: vi.fn(() => ({
    addCity: mockAddCity,
  })),
}));

// --- 2. tests ---
describe("useSyncSearch", () => {
  const mockSetIsOpen = vi.fn();
  const { minskCityData } = createCityData();

  beforeEach(() => {
    vi.clearAllMocks();
    act(() => useSearchStore.setState({ _hasHydrated: false }));

    vi.spyOn(useSearchStore.getState(), "setIsOpen").mockImplementation(
      mockSetIsOpen,
    );
  });

  it("shouldn't call addCity if hydrated false", () => {
    renderHook(() => useSyncSearch(minskCityData));

    expect(mockAddCity).not.toHaveBeenCalled();
  });

  it("should call addCity 1 time after hydration", async () => {
    const setIsOpen = useSearchStore.getState().setIsOpen;

    const { rerender } = renderHook(({ city }) => useSyncSearch(city), {
      initialProps: { city: minskCityData },
    });

    await act(() => useSearchStore.setState({ _hasHydrated: true }));
    rerender({ city: minskCityData });

    expect(mockAddCity).toHaveBeenCalledTimes(1);
    expect(mockAddCity).toHaveBeenCalledWith(minskCityData);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
