import { useMediaQuery } from "react-responsive";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useSettingsStore } from "@/stores/useSettingsStore";
import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";

import { getAspect, getTicks } from "./chart-utils";
import { useChartData, useResponsiveHourlyData } from "./hooks";

export interface WeatherChartProps {
  dailyData: WeatherDataDaily;
  hourlyData: WeatherDataHourly;
  currentTab: string;
}

export function WeatherChart({
  dailyData,
  hourlyData,
  currentTab,
}: WeatherChartProps) {
  const { getChartDailyData, getChartHourlyData } = useChartData();
  const tempUnit = useSettingsStore((state) => state.units.temperature);
  const currentUnit = tempUnit === "celsius" ? "°C" : "°F";

  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ maxWidth: 768 });
  const isDesk = useMediaQuery({ minWidth: 1025 });

  const chartDailyData = getChartDailyData(dailyData);
  const chartHourlyData = useResponsiveHourlyData(
    getChartHourlyData(hourlyData),
  );

  const dailyTicks = getTicks(chartDailyData);
  const hourlyTicks = getTicks(chartHourlyData);

  return (
    <ResponsiveContainer width="100%" aspect={getAspect(isMobile, isTablet)}>
      <AreaChart
        data={currentTab === "daily" ? chartDailyData : chartHourlyData}
        margin={{
          top: 10,
          right: isMobile ? 10 : 30,
          left: isMobile ? -25 : 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray={"7 7"}
          vertical={false}
          stroke="#ffffff30"
        />

        <XAxis
          dataKey={currentTab === "daily" ? "day" : "hour"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#94a3b8" }}
          interval={0}
          dy={10}
          tickFormatter={(value) => {
            if (isDesk) return value.replace(" AM", "AM").replace(" PM", "PM");
            if (!isDesk) return value.replace(" AM", "A").replace(" PM", "P");
          }}
        />
        <YAxis
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
