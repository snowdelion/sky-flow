import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";

export interface WeatherChartProps {
  dailyData: WeatherDataDaily;
  hourlyData: WeatherDataHourly;
  currentChartTab: string;
}
