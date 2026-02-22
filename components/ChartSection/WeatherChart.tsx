import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";
import { calculateAverageTemps } from "@/utils/calculateAverageTemps";
import { formatDayOfWeek } from "@/utils/formatDay";
import groupByDay from "@/utils/groupByDay";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface WeatherChartProps {
  dailyData: WeatherDataDaily;
  hourlyData: WeatherDataHourly;
  currentTab: "daily" | "hourly";
}

export function WeatherChart({
  dailyData,
  hourlyData,
  currentTab,
}: WeatherChartProps) {
  const chartDailyData = dailyData.time.map((time, index) => {
    const min = dailyData.temperature_2m_min[index];
    const max = dailyData.temperature_2m_max[index];
    const date = new Date(time);
    return {
      day: formatDayOfWeek(date),
      temp: calculateAverageTemps(min, max),
    };
  });

  const filteredDays = groupByDay(hourlyData);
  console.log(filteredDays);

  const chartHourlyData = filteredDays[1].hours.map((item, index) => {
    return {
      hour: item.hour,
      temp: item.temp,
    };
  });

  const generateTicks = (min: number, max: number) => {
    const ticks = [];
    for (let i = Math.floor(min); i <= Math.ceil(max); i++) {
      ticks.push(i);
    }
    return ticks;
  };

  const dailyTicks = generateTicks(
    Math.min(...chartDailyData.map((item) => item.temp)) - 3,
    Math.max(...chartDailyData.map((item) => item.temp)) + 3,
  );

  const hourlyTicks = generateTicks(
    Math.min(...chartHourlyData.map((item) => item.temp)) - 3,
    Math.max(...chartHourlyData.map((item) => item.temp)) + 3,
  );

  return (
    <ResponsiveContainer>
      <AreaChart
        data={currentTab === "daily" ? chartDailyData : chartHourlyData}
        margin={{ top: 5, right: 50, left: 0, bottom: 0 }}
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
          dy={10}
        />
        <YAxis
          dataKey="temp"
          unit="°C"
          fontSize={12}
          ticks={currentTab === "daily" ? dailyTicks : hourlyTicks}
          interval={currentTab === "daily" ? 1 : 0}
          tickLine={false}
          axisLine={false}
          domain={
            currentTab === "daily"
              ? ["dataMin - 3", "dataMax + 3"]
              : ["auto", "auto"]
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
          formatter={(value) => [`${value}°C`, "Temperature"]}
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
