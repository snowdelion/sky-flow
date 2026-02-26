import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getAspect, getXTickFormatter } from "./chart-utils";
import { useWeatherChartLogic } from "./hooks";
import { useDeviceType } from "./hooks/useDeviceType";
import type { WeatherChartProps } from "./WeatherChart.types";

export function WeatherChart({
  dailyData,
  hourlyData,
  currentTab,
}: WeatherChartProps) {
  const { isMobile, isTablet, isDesk, isSmallDesk } = useDeviceType();
  const {
    hourUnit,
    currentUnit,
    chartDailyData,
    chartHourlyData,
    dailyTicks,
    hourlyTicks,
  } = useWeatherChartLogic(dailyData, hourlyData);

  return (
    <ResponsiveContainer width="100%" aspect={getAspect(isMobile, isTablet)}>
      <AreaChart
        tabIndex={-1}
        data={currentTab === "daily" ? chartDailyData : chartHourlyData}
        margin={{
          top: 10,
          right: isMobile ? 10 : 30,
          left: isMobile ? -25 : 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          tabIndex={-1}
          strokeDasharray={"7 7"}
          vertical={false}
          stroke="#ffffff30"
        />

        <XAxis
          tabIndex={-1}
          dataKey={currentTab === "daily" ? "day" : "hour"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#94a3b8" }}
          interval={0}
          dy={10}
          dx={-5}
          tickFormatter={(value) => {
            if (currentTab === "daily") {
              if (isMobile) return value.slice(0, 2);
              if (isTablet) return value.slice(0, 3);
              return value;
            }
            getXTickFormatter(value, {
              currentTab,
              isDesk,
              isSmallDesk,
              hourUnit,
            });
          }}
        />
        <YAxis
          tabIndex={-1}
          dataKey="temp"
          unit={currentUnit}
          fontSize={12}
          ticks={currentTab === "daily" ? dailyTicks : hourlyTicks}
          interval={currentTab === "daily" ? 0 : 1}
          tickLine={false}
          axisLine={false}
          domain={
            currentTab === "daily"
              ? [dailyTicks[0], dailyTicks[dailyTicks.length - 1]]
              : [hourlyTicks[0], hourlyTicks[hourlyTicks.length - 1]]
          }
        />

        <Tooltip
          contentStyle={{
            background: "hsl(243,27%,20%)",
            borderRadius: "8px",
            border: "1px solid #ffffff20",
            boxShadow: "0 4px 4px 1px rgb(0,0,0,0.3)",
            color: "#fff",
          }}
          itemStyle={{ color: "hsl(233,100%,70%)" }}
          labelStyle={{ marginBottom: "4px", fontWeight: "bold" }}
          isAnimationActive={false}
          cursor={{
            stroke: "#ffffff20",
            strokeWidth: 2,
            strokeDasharray: "10 10",
          }}
          formatter={(value) => [`${value}${currentUnit}`, "Temperature"]}
        />

        <Area
          tabIndex={-1}
          type="monotone"
          name="Temperature"
          dataKey="temp"
          stroke="hsl(233,100%,70%)"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorTemp)"
          baseValue="dataMin"
          dot={{
            r: 4,
            fill: "hsl(233,100%,70%)",
            strokeWidth: 1,
            stroke: "#1e293b",
          }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "#1e293b" }}
          isAnimationActive={false}
        />

        <defs>
          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="65%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="98%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
}
