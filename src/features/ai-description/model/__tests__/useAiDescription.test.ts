import { useCompletion } from "@ai-sdk/react";
import { act, renderHook } from "@testing-library/react";
import { useAiDescription } from "../useAiDescription";

// --- 1. mocks ---
vi.mock("@ai-sdk/react");

const complete = vi.fn();
const stop = vi.fn();

const mockUseCompletion = (overrides = {}) =>
  vi.mocked(useCompletion).mockReturnValue({
    completion: "",
    complete,
    isLoading: false,
    error: undefined,
    stop,
    ...overrides,
  } as unknown as ReturnType<typeof useCompletion>);

const VALID_DATA = {
  option: "weather" as const,
  city: "Warsaw",
  country: "Poland",
  lat: 52.2,
  lon: 21.2,
  temperature: 10,
  condition: "sunny",
};

// --- 2. tests ---
beforeEach(() => {
  vi.clearAllMocks();
  mockUseCompletion();
});

describe("useAiDescription", () => {
  it("nothing should happen when aiRequestData is null", async () => {
    const { result } = renderHook(() => useAiDescription(null));

    await act(() => result.current.handleTabSelect("weather"));
    expect(complete).not.toHaveBeenCalled();
  });

  it("should stop before complete", async () => {
    const callOrder: string[] = [];
    stop.mockImplementation(() => callOrder.push("stop"));
    complete.mockImplementation(() => callOrder.push("complete"));

    const { result } = renderHook(() => useAiDescription(VALID_DATA));
    await act(() => result.current.handleTabSelect("weather"));
    expect(callOrder).toEqual(["stop", "complete"]);
  });

  it("should set selectedTab to clicked tab", async () => {
    const { result } = renderHook(() => useAiDescription(VALID_DATA));
    await act(() => result.current.handleTabSelect("location"));
    expect(result.current.selectedTab).toBe("location");
  });

  it("should call complete with correct body", async () => {
    const { result } = renderHook(() => useAiDescription(VALID_DATA));
    await act(() => result.current.handleTabSelect("weather"));

    expect(complete).toHaveBeenCalledWith("", {
      body: { ...VALID_DATA, option: "weather" },
    });
  });

  describe("ratelimitError", () => {
    it("should be null when there is no error", () => {
      mockUseCompletion({ error: null });
      const { result } = renderHook(() => useAiDescription(VALID_DATA));
      expect(result.current.error).toBeNull();
    });

    it("should be null when error is not 429", () => {
      mockUseCompletion({ error: new Error("Internal server error") });
      const { result } = renderHook(() => useAiDescription(VALID_DATA));
      expect(result.current.error?.code).toBe("SERVICE_UNAVAILABLE");
    });

    it("should return AppError when error message includes 429", () => {
      mockUseCompletion({ error: new Error("429 error") });
      const { result } = renderHook(() => useAiDescription(VALID_DATA));
      expect(result.current.error?.code).toBe("RATE_LIMIT_EXCEEDED");
    });

    it("should return AppError when error message includes 'Too many requests'", () => {
      mockUseCompletion({ error: new Error("Too many requests") });
      const { result } = renderHook(() => useAiDescription(VALID_DATA));
      expect(result.current.error?.code).toBe("RATE_LIMIT_EXCEEDED");
    });
  });

  describe("loading and completion state", () => {
    it("should reflect isLoading from useCompletion", () => {
      mockUseCompletion({ isLoading: true });
      const { result } = renderHook(() => useAiDescription(VALID_DATA));
      expect(result.current.isLoading).toBe(true);
    });

    it("should reflect completion text from useCompletion", () => {
      mockUseCompletion({ completion: "Warsaw is sunny today" });
      const { result } = renderHook(() => useAiDescription(VALID_DATA));
      expect(result.current.completion).toBe("Warsaw is sunny today");
    });
  });
});
