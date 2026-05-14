import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { WeatherDaily, WeatherHourly } from "@/entities/weather"
import { useChart } from "../../model/useChart"
import { Chart } from "../Chart"

// --- 1. mocks ---
vi.mock("../../model/useChart", () => ({
  useChart: vi.fn(),
}))
vi.mock("../ChartSkeleton", () => ({
  ChartSkeleton: () => <div data-testid="chart-skeleton" />,
}))
vi.mock("../ChartTabs", () => ({
  ChartTabs: ({ setCurrentChartTab }: { setCurrentChartTab: (value: string) => void }) => (
    <button onClick={() => setCurrentChartTab("hourly")}>Hourly</button>
  ),
}))
vi.mock("../ChartView", () => ({
  ChartView: () => <div data-testid="chart-view" />,
}))

// --- 2. tests ---
describe("Chart", () => {
  const devices = {
    isMobile: false,
    isTablet: false,
    isDesk: true,
    isSmallDesk: false,
  }
  const daily = {
    temperatureMax: [2, 3],
    temperatureMin: [1, 2],
  } as WeatherDaily
  const hourly = {
    temperature: [1, 2],
  } as WeatherHourly

  beforeEach(() => {
    vi.mocked(useChart).mockReturnValue({
      currentChartTab: "daily",
      setCurrentChartTab: vi.fn(),
      isResizing: false,
      activeData: [],
      formatters: {},
    } as unknown as ReturnType<typeof useChart>)
  })

  it("should show skeleton when isPending", () => {
    render(<Chart dailyData={daily} hourlyData={hourly} isPending={true} devices={devices} />)
    expect(screen.getByTestId("chart-skeleton")).toBeInTheDocument()
    expect(screen.queryByTestId("chart-view")).not.toBeInTheDocument()
  })

  it("should show skeleton when data is missing", () => {
    const { rerender } = render(
      <Chart dailyData={undefined} hourlyData={hourly} isPending={false} devices={devices} />,
    )
    expect(screen.getByTestId("chart-skeleton")).toBeInTheDocument()

    rerender(<Chart dailyData={daily} hourlyData={undefined} isPending={false} devices={devices} />)
    expect(screen.getByTestId("chart-skeleton")).toBeInTheDocument()
  })

  it("should render tabs and view when data is loaded", () => {
    render(<Chart dailyData={daily} hourlyData={hourly} isPending={false} devices={devices} />)

    expect(screen.getByTestId("chart-view")).toBeInTheDocument()
    expect(screen.getByText(/hourly/i)).toBeInTheDocument()
  })

  it("should call setCurrentChartTab when tab is changes", async () => {
    const setCurrentChartTab = vi.fn()
    vi.mocked(useChart).mockReturnValue({
      currentChartTab: "daily",
      setCurrentChartTab,
      isResizing: false,
      activeData: [],
      formatters: {},
    } as unknown as ReturnType<typeof useChart>)
    render(<Chart dailyData={daily} hourlyData={hourly} isPending={false} devices={devices} />)

    const hourlyTab = screen.getByText(/hourly/i)
    await userEvent.setup().click(hourlyTab)
    expect(setCurrentChartTab).toHaveBeenCalledWith("hourly")
  })
})
