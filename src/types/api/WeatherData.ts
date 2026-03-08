export interface WeatherData {
  current: WeatherDataCurrent;
  hourly: WeatherDataHourly;
  daily: WeatherDataDaily;
  forecastUnits: WeatherDataUnits;
}

export interface WeatherDataUnits {
  temperature: "°C" | "°F";
  speed: "km/h" | "mp/h";
  precipitation: "mm" | "inch";
}

export interface WeatherDataCurrent {
  apparent_temperature: number;
  city: string;
  country: string;
  interval: number;
  precipitation: number;
  relative_humidity_2m: number;
  temperature_2m: number;
  time: string;
  weather_code: number;
  wind_speed_10m: number;
  latitude: number;
  longitude: number;
}

export interface WeatherDataHourly {
  temperature_2m: number[];
  time: string[];
  weather_code: number[];
}

export interface WeatherDataDaily {
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  time: string[];
  weather_code: number[];
}
