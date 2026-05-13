import { memo, useCallback, useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ValueType } from "recharts/types/component/DefaultTooltipContent"
import {
  AREA_DOT,
  ARIA_ACTIVE_DOT,
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_CURSOR,
  X_AXIS_TICK,
} from "../lib/constants"

export const ChartView = memo(function ChartView({
  activeData,
  formatters,
  isMobile,
}: ChartViewProps) {
  const chartMargin = useMemo(
    () => ({
      top: 10,
      right: isMobile ? 10 : 30,
      left: isMobile ? -25 : 0,
      bottom: 0,
    }),
    [isMobile],
  )

  const tooltipFormatter = useCallback(
    (value: ValueType | undefined) => {
      const numValue = typeof value === "number" ? value : 0
      return [`${numValue}${formatters.currentUnit}`, "Temperature"]
    },
    [formatters.currentUnit],
  )

  return (
    <ResponsiveContainer
      width="100%"
      minHeight={200}
      aspect={formatters.aspect}
      initialDimension={{ width: 1, height: 1 }}
    >
      <AreaChart data={activeData} margin={chartMargin}>
        <CartesianGrid strokeDasharray={"7 7"} vertical={false} stroke="#ffffff30" />

        <XAxis
          dataKey={formatters.dataKey}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={X_AXIS_TICK}
          interval={0}
          dy={10}
          dx={-5}
          tickFormatter={formatters.handleXAxisTickFormat}
        />
        <YAxis
          dataKey="temp"
          unit={formatters.currentUnit}
          fontSize={12}
          ticks={formatters.yTicks}
          interval={0}
          tickLine={false}
          axisLine={false}
          domain={formatters.yDomain}
        />

        <Tooltip
          contentStyle={TOOLTIP_CONTENT_STYLE}
          itemStyle={{ color: "hsl(233,100%,70%)" }}
          labelStyle={{ marginBottom: "4px", fontWeight: "bold" }}
          isAnimationActive={false}
          cursor={TOOLTIP_CURSOR}
          formatter={tooltipFormatter}
        />

        <Area
          type="monotone"
          name="Temperature"
          dataKey="temp"
          stroke="hsl(233,100%,70%)"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorTemp)"
          baseValue="dataMin"
          dot={AREA_DOT}
          activeDot={ARIA_ACTIVE_DOT}
          isAnimationActive={false}
        />

        <ChartGradient />
      </AreaChart>
    </ResponsiveContainer>
  )
})

const ChartGradient = memo(function ChartGradient() {
  return (
    <defs>
      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="65%" stopColor="#3b82f6" stopOpacity={0.2} />
        <stop offset="98%" stopColor="#3b82f6" stopOpacity={0} />
      </linearGradient>
    </defs>
  )
})

interface ChartViewProps {
  activeData: ActiveData
  formatters: {
    handleXAxisTickFormat: (value: string) => string
    yTicks: number[]
    yDomain: number[]
    currentUnit: string
    dataKey: string
    aspect: number
  }
  isMobile: boolean
}

type ActiveData = {
  temp: number
  day?: string
  hour?: string
}[]
