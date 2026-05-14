import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DailyItem } from "../DailyItem"

// --- 1. mocks ---
vi.mock("@/entities/weather", () => ({
  WeatherIcon: ({ code }: { code: number }) => <div data-testid="weather-icon" data-code={code} />,
}))

describe("DailyItem", () => {
  const day = {
    day: "Sunday",
    weatherCode: 0,
    temp: "2°",
    feelsLike: "4°",
    date: "2026-04-04",
  }
  const changeDayIndex = vi.fn()

  it("should render day, temperature and feelsLike correctly", () => {
    render(<DailyItem formattedDay={day} changeDayIndex={changeDayIndex} index={1} />)

    expect(screen.getByText("Sunday")).toBeInTheDocument()
    expect(screen.getByText("2°")).toBeInTheDocument()
    expect(screen.getByText("4°")).toBeInTheDocument()
    expect(screen.getByTestId("weather-icon")).toHaveAttribute("data-code", "0")
  })

  it("should call changeDayIndex with correct index", async () => {
    render(<DailyItem formattedDay={day} changeDayIndex={changeDayIndex} index={1} />)

    const listItem = screen.getByRole("listitem")
    await userEvent.setup().click(listItem)

    expect(changeDayIndex).toHaveBeenCalledTimes(1)
    expect(changeDayIndex).toHaveBeenCalledWith(1)
  })
})
