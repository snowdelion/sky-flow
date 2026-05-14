import { render, screen } from "@testing-library/react"
import HourlyItem from "../HourlyItem"

// --- 1, mocks ---
vi.mock("@/entities/weather", () => ({
  WeatherIcon: ({ code }: { code: number }) => <div data-testid="weather-icon" data-code={code} />,
}))
vi.mock("../HourDisplay", () => ({
  HourDisplay: ({ hourItem, hourFormat }: { hourItem: string; hourFormat: "12" | "24" }) => (
    <div data-testid="hour-display">
      {hourItem} ({hourFormat})
    </div>
  ),
}))

// --- 2. tests ---
describe("HourlyItem", () => {
  const hour = {
    hour: "2026-04-04T12:00",
    temp: 1.49,
    weatherCode: 0,
  }

  it("should format temperature to one decimal place", () => {
    render(<HourlyItem hour={hour} hourFormat="12" tempUnit="°C" />)

    expect(screen.getByText("1.5")).toBeInTheDocument()
    expect(screen.getByText("°C")).toBeInTheDocument()
  })

  it("should pass correct props to WeatherIcon and HourDisplay", () => {
    render(<HourlyItem hour={hour} hourFormat="24" tempUnit="°F" />)

    const icon = screen.getByTestId("weather-icon")
    const display = screen.getByTestId("hour-display")

    expect(icon).toHaveAttribute("data-code", "0")
    expect(display).toHaveTextContent("2026-04-04T12:00 (24)")
  })
})
