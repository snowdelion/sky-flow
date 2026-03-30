export interface WeatherUnits {
  temperatureUnit: "°C" | "°F";
  speedUnit: "km/h" | "mp/h";
  precipitationUnit: "inch" | "mm";
}

export interface WeatherCurrent {
  feelsLike: number;
  precipitation: number;
  humidity: number;
  temperature: number;
  time: string;
  weatherCode: number;
  speed: number;
  city: string;
  region?: string;
  code?: string;
  country?: string;
  lat: number;
  lon: number;
}

export interface WeatherHourly {
  temperature: number[];
  time: string[];
  weatherCode: number[];
}

export interface WeatherDaily {
  feelsLikeMax: number[];
  feelsLikeMin: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  time: string[];
  weatherCode: number[];
}

export interface Weather {
  current: WeatherCurrent;
  hourly: WeatherHourly;
  daily: WeatherDaily;
  forecastUnits: WeatherUnits;
}
