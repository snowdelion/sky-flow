import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { type SearchResult } from "@/entities/weather"
import { useSearchResultCity } from "../../../../model/useSearchResultCity"
import { SearchResultCity } from "../SearchResultCity"

// --- 1. mocks ---
vi.mock("../../../../model/useSearchResultCity", () => ({
  useSearchResultCity: vi.fn(),
}))

vi.mock("@/entities/weather", () => ({
  WeatherIcon: ({ code }: { code: number }) => <div data-testid="weather-icon" data-code={code} />,
}))

// --- 2. tests ---
describe("SearchResultCity integration", () => {
  const data = { id: 1, city: "Berlin" }
  const inputRef = { current: null }
  const user = userEvent.setup()
  type SearchResultCityReturn = ReturnType<typeof useSearchResultCity>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render city info correctly", () => {
    vi.mocked(useSearchResultCity).mockReturnValue({
      displayName: "Berlin, Germany",
      temperature: 10,
      temperatureUnit: "°C",
      weatherCode: 0,
      handleClick: vi.fn(),
    } as unknown as SearchResultCityReturn)
    render(<SearchResultCity data={data as SearchResult} inputRef={inputRef} />)

    expect(screen.getByText("Berlin, Germany")).toBeInTheDocument()
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("°C")).toBeInTheDocument()

    const icon = screen.getByTestId("weather-icon")
    expect(icon).toHaveAttribute("data-code", "0")
  })

  it("should call handleClick when button is clicked", async () => {
    const handleClick = vi.fn()
    vi.mocked(useSearchResultCity).mockReturnValue({
      displayName: "Berlin, Germany",
      temperature: 10,
      temperatureUnit: "°C",
      weatherCode: 0,
      handleClick: handleClick,
    } as unknown as SearchResultCityReturn)
    render(<SearchResultCity data={data as SearchResult} inputRef={inputRef} />)

    const link = screen.getByRole("button")
    await user.click(link)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
