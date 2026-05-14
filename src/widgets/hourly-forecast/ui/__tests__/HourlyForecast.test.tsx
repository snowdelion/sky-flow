import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { WeatherHourly, WeatherUnits } from "@/entities/weather"
import { useHourlyForecast } from "../../model/useHourlyForecast"
import { HourlyForecast } from "../HourlyForecast"

// --- 1. mocks ---
vi.mock("../../model/useHourlyForecast", () => ({
  useHourlyForecast: vi.fn(),
}))

vi.mock("../HourlyItem", () => ({
  default: () => <li data-testid="hour-item" />,
}))
vi.mock("../DaySelector", () => ({
  DaySelector: () => <div data-testid="day-selector" />,
}))
vi.mock("../HourlyForecastSkeleton", () => ({
  HourlyForecastSkeleton: () => <div data-testid="hourly-skeleton" />,
}))

// --- 2. tests ---
describe("HourlyForecast", () => {
  const setIsHourlyOpen = vi.fn()

  beforeEach(() => {
    vi.mocked(useHourlyForecast).mockReturnValue({
      hours: [{ hour: "12 AM", temp: 2 }],
      isHourlyOpen: true,
      setIsHourlyOpen,
      isDesk: false,
      selectedDay: { date: "2026-04-04" },
    } as unknown as ReturnType<typeof useHourlyForecast>)
  })

  it("should render skeleton when isPending is true", () => {
    render(<HourlyForecast isPending={true} />)

    expect(screen.getByTestId("hourly-skeleton")).toBeInTheDocument()
  })

  it("should toggle forecast visibility on header click", async () => {
    render(
      <HourlyForecast
        isPending={false}
        hourlyData={{} as WeatherHourly}
        forecastUnits={{} as WeatherUnits}
      />,
    )

    const header = screen.getByText(/hourly forecast/i)
    await userEvent.setup().click(header)
    expect(setIsHourlyOpen).toHaveBeenCalled()
  })

  it("should render the list of hours when isHourlyOpen is true", () => {
    render(
      <HourlyForecast
        isPending={false}
        hourlyData={{} as WeatherHourly}
        forecastUnits={{} as WeatherUnits}
      />,
    )

    expect(screen.getAllByTestId("hour-item")).toHaveLength(1)
  })
})
