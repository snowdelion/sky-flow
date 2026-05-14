import { render, screen } from "@testing-library/react"
import dayjs from "dayjs"
import type { WeatherUnits } from "@/entities/weather"
import { createWeatherData } from "@/shared/lib/testing"
import { Today } from "./Today"

// --- 1. mocks ---
vi.mock("@/entities/weather", async () => {
  const actual = await vi.importActual("@/entities/weather")
  return {
    ...actual,
    WeatherIcon: () => <div data-testid="weather-icon" />,
  }
})

vi.mock("./TodaySkeleton", () => ({
  TodaySkeleton: () => <div data-testid="today-skeleton" />,
}))

// --- 2. tests ---
describe("Today", () => {
  const currentData = createWeatherData().current
  const units: WeatherUnits = {
    temperatureUnit: "°C",
    speedUnit: "km/h",
    precipitationUnit: "mm",
  }

  it("should render correctly with weather current data", () => {
    render(<Today currentData={currentData} forecastUnits={units} isPending={false} />)

    const city = new RegExp(currentData.city, "i")
    expect(screen.getByText(city)).toBeInTheDocument()

    const formattedDate = dayjs(currentData.time).format("dddd, MMM D, YYYY")
    expect(screen.getByText(formattedDate)).toBeInTheDocument()
    expect(screen.getByText(Math.round(currentData.temperature).toString())).toBeInTheDocument()
    expect(screen.getByText("°C")).toBeInTheDocument()
    expect(screen.getByTestId("weather-icon")).toBeInTheDocument()
  })

  it("should render skeleton when currentData is missing", () => {
    render(<Today currentData={undefined} isPending={false} />)

    expect(screen.getByTestId("today-skeleton")).toBeInTheDocument()
  })
})
