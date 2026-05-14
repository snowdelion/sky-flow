import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ChartTabs } from "../ChartTabs"

describe("ChartTabs", () => {
  const tabData = ["Daily", "Hourly"]
  const setCurrentChartTab = vi.fn()

  it("should render all tabs from tabData", () => {
    render(
      <ChartTabs
        tabData={tabData}
        currentChartTab="daily"
        setCurrentChartTab={setCurrentChartTab}
      />,
    )

    expect(screen.getByText("Daily")).toBeInTheDocument()
    expect(screen.getByText("Hourly")).toBeInTheDocument()
    expect(screen.getAllByRole("tab")).toHaveLength(2)
  })

  it("should call setCurrentChartTab with lowercase value on click", async () => {
    render(
      <ChartTabs
        tabData={tabData}
        currentChartTab="daily"
        setCurrentChartTab={setCurrentChartTab}
      />,
    )

    const hourlyTab = screen.getByRole("tab", { name: /hourly chart/i })
    await userEvent.setup().click(hourlyTab)
    expect(setCurrentChartTab).toHaveBeenCalledWith("hourly")
  })
})
