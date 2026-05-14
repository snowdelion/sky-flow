import { act, renderHook } from "@testing-library/react"
import { useChartResize } from "../useChartResize"

describe("useChartResize", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should initially return false", () => {
    const { result } = renderHook(() => useChartResize())
    expect(result.current).toBe(false)
  })

  it("should set isResizing to true when window resizes", () => {
    const { result } = renderHook(() => useChartResize())
    act(() => window.dispatchEvent(new Event("resize")))
    expect(result.current).toBe(true)
  })

  it("should set isResizing to false after delay", () => {
    const delay = 150
    const { result } = renderHook(() => useChartResize(delay))

    act(() => window.dispatchEvent(new Event("resize")))
    expect(result.current).toBe(true)

    act(() => vi.advanceTimersByTime(delay))
    expect(result.current).toBe(false)
  })
})
