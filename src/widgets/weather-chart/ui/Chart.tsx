import type { WeatherDaily, WeatherHourly } from "@/entities/weather"
import { useChart } from "../model/useChart"
import { ChartSkeleton } from "./ChartSkeleton"
import { ChartTabs } from "./ChartTabs"
import { ChartView } from "./ChartView"

export function Chart({ dailyData, hourlyData, isPending, devices }: ChartProps) {
  const { currentChartTab, setCurrentChartTab, isResizing, activeData, formatters } = useChart(
    dailyData,
    hourlyData,
  )

  return (
    <section className="overflow-hidden w-full">
      {isPending || !dailyData || !hourlyData || isResizing ? (
        <ChartSkeleton isMobile={devices.isMobile} isTablet={devices.isTablet} />
      ) : (
        <div className="relative flex flex-col gap-5 w-full max-w-100 sm:max-w-184 md:max-w-full xl:max-w-304 min-h-70 h-auto mx-auto bg-[hsl(243,27%,20%)] px-4 pb-4 pt-2 rounded-xl border border-white/10 items-center">
          <ChartTabs
            tabData={TAB_DATA}
            currentChartTab={currentChartTab}
            setCurrentChartTab={setCurrentChartTab}
          />

          <div className="relative w-full min-h-50 chart-no-focus">
            <ChartView
              activeData={activeData}
              formatters={formatters}
              isMobile={devices.isMobile}
            />
          </div>
        </div>
      )}
    </section>
  )
}

const TAB_DATA = ["Daily", "Hourly"]

export interface ChartProps {
  dailyData?: WeatherDaily
  hourlyData?: WeatherHourly
  isPending: boolean
  devices: {
    isDesk: boolean
    isMobile: boolean
    isSmallDesk: boolean
    isTablet: boolean
  }
}
