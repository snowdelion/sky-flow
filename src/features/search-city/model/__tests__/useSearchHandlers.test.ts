import { act, renderHook, waitFor } from "@testing-library/react";
import { useSearchStore } from "@/entities/location";
import { useSearchHandlers } from "../useSearchHandlers";

const push = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: vi.fn(),
}));
const useGeoQuery = vi.hoisted(() => vi.fn());
vi.mock("@/entities/location", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/location")>();
  return {
    ...actual,
    useGeoQuery,
  };
});

describe("useSearchHandlers", () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    vi.clearAllMocks();
    useGeoQuery.mockReturnValue({
      refetch: vi.fn().mockReturnValue({ data: { results: [] } }),
      geoData: undefined,
    });

    inputElement = document.createElement("input");
    inputElement.setAttribute("aria-label", "search");
    document.body.appendChild(inputElement);

    useSearchStore.getState().reset();
  });

  afterEach(() => {
    document.body.removeChild(inputElement);
  });

  it("should change active tab", () => {
    const { result } = renderHook(() => useSearchHandlers());

    act(() => result.current.handleChangeTab("favorites"));
    expect(useSearchStore.getState().currentTab).toBe("favorites");

    act(() => result.current.handleChangeTab("recent"));
    expect(useSearchStore.getState().currentTab).toBe("recent");
  });

  it("should handling keydown", async () => {
    const { result } = renderHook(() => useSearchHandlers());
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
    await waitFor(() => expect(useSearchStore.getState().inputValue).toBe(""));
    expect(document.activeElement).not.toBe(inputElement);
  });

  it("should handle submit", async () => {
    useGeoQuery.mockReturnValue({
      refetch: vi.fn().mockReturnValue({ data: { results: [] } }),
      geoData: { results: [] },
    });
    const { result } = renderHook(() => useSearchHandlers());

    act(() => useSearchStore.getState().setInputValue("Warsaw"));

    const submitEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>;

    act(() => result.current.handleSubmit(submitEvent));

    expect(submitEvent.preventDefault).toHaveBeenCalled();
    await waitFor(() => expect(useSearchStore.getState().inputValue).toBe(""));
  });

  it("should handle input change", () => {
    const { result } = renderHook(() => useSearchHandlers());

    const changeEvent = {
      target: { value: "Warsaw" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => result.current.handleChangeInput(changeEvent));

    expect(useSearchStore.getState().inputValue).toBe("Warsaw");
    expect(useSearchStore.getState().isOpen).toBe(true);
  });
});
