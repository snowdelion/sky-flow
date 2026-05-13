export interface HourlyItem {
  hour: string
  temp: number
  weatherCode: number
}

export interface DailyForecast {
  date: string
  dayName: string
  hours: HourlyItem[]
}

export interface format {
  hourFormat: "12" | "24"
  dayFormat: "dd" | "ddd" | "dddd"
}
