import { act, renderHook } from "@testing-library/react";

import sunnyIcon from "@/../public/icons/icon-sunny.webp";
import { createCityData } from "@/testing/mocks/factories/cityData";
import { createResultsMocks } from "@/testing/mocks/factories/search";

import { useSearchResultCity } from "./useSearchResultCity";

// --- 1. mocks ---
const searchSelectedCity = vi.hoisted(() =>
  vi.fn((_, inputRef) => {
    inputRef?.current?.blur();
  }),
);
vi.mock("@/components/Weather/Search/hooks/useSearchActions", () => ({
  useSearchActions: () => ({ searchSelectedCity }),
}));

// --- 2. tests ---
describe("useSearchResultCity", () => {
  let inputElement: HTMLInputElement;
  let inputRef: React.RefObject<HTMLInputElement>;
  const [[searchResult]] = createResultsMocks();
  const { berlinCityData } = createCityData();

  beforeEach(() => {
    vi.clearAllMocks();
    inputElement = document.createElement("input");
    inputElement.setAttribute("aria-label", "search");
    document.body.appendChild(inputElement);
    inputRef = { current: inputElement } as React.RefObject<HTMLInputElement>;
  });

  afterEach(() => {
    document.body.removeChild(inputElement);
  });

  it("should call searchSelectedCity when handleClick is triggered", () => {
    const { result } = renderHook(() =>
      useSearchResultCity(searchResult, inputRef),
    );

    act(() => result.current.handleClick());

    expect(searchSelectedCity).toHaveBeenCalledTimes(1);
    expect(searchSelectedCity).toHaveBeenCalledWith(berlinCityData, inputRef);
  });

  it("should get correct icon", () => {
    const { result } = renderHook(() =>
      useSearchResultCity(searchResult, inputRef),
    );
    expect(result.current.icon).toBe(sunnyIcon);
  });

  it("should blur the input when handleClick is triggered", () => {
    inputElement.focus();
    expect(document.activeElement).toBe(inputElement);

    const { result } = renderHook(() =>
      useSearchResultCity(searchResult, inputRef),
    );

    act(() => result.current.handleClick());

    expect(document.activeElement).toBe(document.body);
  });
});
