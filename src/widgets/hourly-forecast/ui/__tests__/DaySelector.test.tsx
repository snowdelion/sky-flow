import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { DailyForecast } from "@/entities/weather"
import { DaySelector } from "../DaySelector"

// --- 1. mocks ---
vi.mock("@/entities/location", () => ({
  useSearchStore: vi.fn((s) => s({ setIsOpen: vi.fn() })),
}))

vi.mock("@/shared/lib/hooks/usePreventScroll.ts", () => ({
  usePreventScroll: vi.fn(),
}))

// --- 2. tests ---
describe("DaySelector", () => {
  const days = [
    { dayName: "Saturday", weatherCode: 0, tempMax: 1, tempMin: 2 },
    { dayName: "Sunday", weatherCode: 1, tempMax: 3, tempMin: 4 },
  ]
  const formattedDates = ["Mar 1", "Mar 2"]
  const handleChangeDay = vi.fn()
  const setIsHourlyOpen = vi.fn()
  const user = userEvent.setup()

  const defaultProps = {
    days: days as unknown as DailyForecast[],
    selectedDayIndex: 0,
    handleChangeDay,
    setIsHourlyOpen,
    formattedDates,
  }

  it("should render current selected day", () => {
    render(<DaySelector {...defaultProps} />)

    expect(screen.getByText("Saturday")).toBeInTheDocument()
  })

  it("should open options and call handleChangeDay", async () => {
    render(<DaySelector {...defaultProps} />)

    const button = screen.getByRole("button")
    await user.click(button)

    const options = screen.getAllByRole("option")
    expect(options).toHaveLength(2)
    expect(screen.getByText("(Mar 2)")).toBeInTheDocument()

    await user.click(options[1])
    expect(handleChangeDay).toHaveBeenCalledWith(1)
  })

  it("should call setIsHourlyOpen when button is clicked", async () => {
    render(<DaySelector {...defaultProps} />)

    const button = screen.getByRole("button")
    await user.click(button)
    expect(setIsHourlyOpen).toHaveBeenCalledWith(true)
  })
})
