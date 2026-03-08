import { act, renderHook } from "@testing-library/react";

import sunnyIcon from "@/../public/icons/icon-sunny.webp";
import { createCityDataMocks } from "@/testing/mocks/factories/cityData";
import { createResultsMocks } from "@/testing/mocks/factories/search";

import { useSearchResultCity } from "./useSearchResultCity";

// --- 1. mocks ---
const searchSelectedCity = vi.hoisted(() => vi.fn());
vi.mock("@/components/SearchSection/hooks/useSearchActions", () => ({
  useSearchActions: () => ({ searchSelectedCity }),
}));

// --- 2. tests ---
describe("useSearchResultCity", () => {
  const [[searchResult]] = createResultsMocks();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call searchSelectedCity when handleClick is triggered", () => {
    const { berlinCityData } = createCityDataMocks();
    const { result } = renderHook(() => useSearchResultCity(searchResult));

    act(() => result.current.handleClick());

    expect(searchSelectedCity).toHaveBeenCalledTimes(1);
    expect(searchSelectedCity).toHaveBeenCalledWith(berlinCityData);
  });

  it("should get correct icon", () => {
    const { result } = renderHook(() => useSearchResultCity(searchResult));
    expect(result.current.icon).toBe(sunnyIcon);
  });
});
