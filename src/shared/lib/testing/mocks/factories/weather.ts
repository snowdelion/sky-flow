import type {
  Weather,
  WeatherCurrent,
  WeatherDaily,
  WeatherHourly,
  WeatherUnits,
} from "@/entities/weather";

// --- 1.1 weather data factories ---
export const createWeatherData = (
  overrides: Partial<Weather> = {},
): Weather => {
  return {
    ...getWeatherData(),
    ...overrides,
  };
};

// --- 1.2 weather data item ---
const getWeatherData = (): Weather => {
  return {
    current: {
      ...getCurrentWeather(),
    },
    daily: {
      ...getDailyData(),
    },
    hourly: {
      ...getHourlyData(),
    },
    forecastUnits: {
      ...getUnits(),
    },
  };
};

// --- 2.1 daily/hourly data factories ---
export const createForecastData = (
  overrides: WeatherOverrides = {},
): WeatherDataMocks => {
  return {
    dailyData: {
      ...getDailyData(),
      ...overrides.daily,
    } as WeatherDaily,

    hourlyData: {
      ...getHourlyData(),
      ...overrides.hourly,
    } as WeatherHourly,
  };
};

// --- 2.2 daily/hourly data items ---
const getDailyData = (): WeatherDaily => ({
  temperatureMin: Array.from({ length: 8 }, (_, i) => i),
  temperatureMax: Array.from({ length: 8 }, (_, i) => i + 2),
  feelsLikeMin: Array.from({ length: 8 }, (_, i) => i),
  feelsLikeMax: Array.from({ length: 8 }, (_, i) => i + 2),
  time: Array.from(
    { length: 8 },
    (_, i) => `2026-03-${(i + 1).toString().padStart(2, "0")}`,
  ),
  weatherCode: Array.from({ length: 8 }, (_, i) => i),
});

const getHourlyData = (): WeatherHourly => ({
  temperature: [
    ...Array.from({ length: 24 }, (_, i) => i),
    ...Array.from({ length: 24 }, (_, i) => i + 1),
  ],
  time: [
    ...Array.from(
      { length: 24 },
      (_, i) => `2026-03-01T${i.toString().padStart(2, "0")}:00Z`,
    ),
    ...Array.from(
      { length: 24 },
      (_, i) => `2026-03-02T${i.toString().padStart(2, "0")}:00Z`,
    ),
  ],
  weatherCode: [...Array(24).fill(0), ...Array(24).fill(1)],
});

// --- 3.1 current weather factory ---
export const createCurrentWeather = (
  overrides: Partial<WeatherCurrent> = {},
): WeatherCurrent => {
  return {
    ...getCurrentWeather(),
    ...overrides,
  };
};

// --- 3.2 current weather item ---
const getCurrentWeather = (): WeatherCurrent => ({
  feelsLike: -4,
  city: "Berlin",
  country: "Germany",
  region: "State of Berlin",
  code: "PPLC",
  lat: 52.52437,
  lon: 13.41053,
  precipitation: 0,
  humidity: 40,
  temperature: -2,
  time: "2026-03-01T14:00Z",
  weatherCode: 3,
  speed: 10,
});

// --- 4.1 forecast units factory
export const createForecastUnits = (
  overrides: Partial<WeatherUnits> = {},
): WeatherUnits => {
  return {
    ...getUnits(),
    ...overrides,
  };
};

// --- 4.2 forecast units item ---
const getUnits = (): WeatherUnits => ({
  precipitationUnit: "mm",
  speedUnit: "km/h",
  temperatureUnit: "°C",
});

interface WeatherOverrides {
  daily?: Partial<WeatherDaily>;
  hourly?: Partial<WeatherHourly>;
}

interface WeatherDataMocks {
  dailyData: WeatherDaily;
  hourlyData: WeatherHourly;
}
