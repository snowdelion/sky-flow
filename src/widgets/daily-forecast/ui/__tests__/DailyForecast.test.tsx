import { render, screen } from "@testing-library/react"
import type { WeatherDaily } from "@/entities/weather"
import { useDailyForecast } from "../../model/useDailyForecast"
import { DailyForecast } from "../DailyForecast"

// --- 1. mocks ---
vi.mock("../../model/useDailyForecast", () => ({
  useDailyForecast: vi.fn(),
}))
vi.mock("../DailyItem", () => ({
  DailyItem: ({ index }: { index: number }) => <li data-testid="daily-item">Day {index}</li>,
}))
vi.mock("../DailyForecastSkeleton", () => ({
  DailyForecastSkeleton: () => <div data-testid="daily-skeleton" />,
}))

// --- 2. tests ---
describe("DailyForecast", () => {
  beforeEach(() => {
    vi.mocked(useDailyForecast).mockReturnValue({
      formattedDays: [],
      changeDayIndex: vi.fn(),
    })
  })

  it("should show skeleton shen isPending is true", () => {
    render(<DailyForecast isPending={true} dailyData={{} as WeatherDaily} />)

    expect(screen.getByTestId("daily-skeleton")).toBeInTheDocument()
  })

  it("should render correct number of DailyItems", () => {
    vi.mocked(useDailyForecast).mockReturnValue({
      formattedDays: Array.from({ length: 7 }, (_, i) => ({
        date: `2026-04-${i + 1}`,
      })),
      changeDayIndex: vi.fn(),
    } as unknown as ReturnType<typeof useDailyForecast>)
    render(<DailyForecast isPending={false} dailyData={{} as WeatherDaily} />)

    expect(screen.getByText(/daily forecast/i)).toBeInTheDocument()
    const items = screen.getAllByTestId("daily-item")
    expect(items).toHaveLength(7)
  })

  it("should show skeleton when dailyData is missing", () => {
    render(<DailyForecast isPending={false} dailyData={undefined} />)

    expect(screen.getByTestId("daily-skeleton")).toBeInTheDocument()
  })
})
