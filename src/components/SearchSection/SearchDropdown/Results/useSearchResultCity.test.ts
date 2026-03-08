import { act, renderHook } from "@testing-library/react";

import overcastIcon from "@/../public/icons/icon-overcast.webp";
import { createResultsMocks } from "@/testing/mocks/factories/search";

import { useSearchResultCity } from "./useSearchResultCity";

// --- 1. mocks ---
const searchSelectedCity = vi.hoisted(() => vi.fn());
vi.mock("@/components/SearchSection/hooks/useSearchActions", () => ({
  useSearchActions: () => ({ searchSelectedCity }),
}));

// --- 2. tests ---
describe("useSearchResultCity", () => {
  const [searchResult] = createResultsMocks();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call searchSelectedCity when handleClick is triggered", () => {
    const { result } = renderHook(() => useSearchResultCity(searchResult));

    act(() => result.current.handleClick());

    expect(searchSelectedCity).toHaveBeenCalledTimes(1);
    expect(searchSelectedCity).toHaveBeenCalledWith({
      status: "found",
      city: "Berlin",
      country: "Germany",
      lat: 52.52437,
      lon: 13.41053,
    });
  });

  it("should get correct icon", () => {
    const { result } = renderHook(() => useSearchResultCity(searchResult));
    expect(result.current.icon).toBe(overcastIcon);
  });
});
