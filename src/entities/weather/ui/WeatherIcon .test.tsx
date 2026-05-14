import { render, screen } from "@testing-library/react"
import { WEATHER_ASSETS } from "../assets"
import { WeatherIcon } from "./WeatherIcon"

vi.mock("next/image", () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className: string }) => (
    <img src={src} alt={alt} className={className} data-testid="weather-icon" />
  ),
}))

describe("WeatherIcon", () => {
  it.each([
    [0, WEATHER_ASSETS.weather.sunny],
    [3, WEATHER_ASSETS.weather.overcast],
    [95, WEATHER_ASSETS.weather.storm],
    [999, WEATHER_ASSETS.weather.sunny],
  ])("should render correct src for code $i", (code, expectedSrc) => {
    render(<WeatherIcon code={code} />)
    const icon = screen.getByTestId("weather-icon")

    expect(icon).toHaveAttribute("src", expectedSrc)
  })

  it("should pass extra props", () => {
    render(<WeatherIcon code={0} className="class" />)

    const icon = screen.getByTestId("weather-icon")
    expect(icon).toHaveAttribute("class")
  })
})
