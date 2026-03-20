import type {
  WeatherData,
  WeatherDataCurrent,
  WeatherDataDaily,
  WeatherDataHourly,
  WeatherDataUnits,
} from "@/types/api/WeatherData";

// --- 1.1 weather data factories ---
export const createWeatherData = (
  overrides: Partial<WeatherData> = {},
): WeatherData => {
  return {
    ...getWeatherData(),
    ...overrides,
  };
};

// --- 1.2 weather data item ---
const getWeatherData = (): WeatherData => {
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
    } as WeatherDataDaily,

    hourlyData: {
      ...getHourlyData(),
      ...overrides.hourly,
    } as WeatherDataHourly,
  };
};

// --- 2.2 daily/hourly data items ---
const getDailyData = (): WeatherDataDaily => ({
  temperature_2m_min: Array.from({ length: 8 }, (_, i) => i),
  temperature_2m_max: Array.from({ length: 8 }, (_, i) => i + 2),
  apparent_temperature_min: Array.from({ length: 8 }, (_, i) => i),
  apparent_temperature_max: Array.from({ length: 8 }, (_, i) => i + 2),
  time: Array.from(
    { length: 8 },
    (_, i) => `2026-03-${(i + 1).toString().padStart(2, "0")}`,
  ),
  weather_code: Array.from({ length: 8 }, (_, i) => i),
});

const getHourlyData = (): WeatherDataHourly => ({
  temperature_2m: [
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
  weather_code: [...Array(24).fill(0), ...Array(24).fill(1)],
});

// --- 3.1 current weather factory ---
export const createCurrentWeather = (
  overrides: Partial<WeatherDataCurrent> = {},
): WeatherDataCurrent => {
  return {
    ...getCurrentWeather(),
    ...overrides,
  };
};

// --- 3.2 current weather item ---
const getCurrentWeather = (): WeatherDataCurrent => ({
  apparent_temperature: -4,
  city: "Berlin",
  country: "Germany",
  region: "State of Berlin",
  code: "PPLC",
  latitude: 52.52437,
  longitude: 13.41053,
  precipitation: 0,
  relative_humidity_2m: 40,
  temperature_2m: -2,
  time: "2026-03-01T14:00Z",
  weather_code: 3,
  wind_speed_10m: 10,
});

// --- 4.1 forecast units factory
export const createForecastUnits = (
  overrides: Partial<WeatherDataUnits> = {},
): WeatherDataUnits => {
  return {
    ...getUnits(),
    ...overrides,
  };
};

// --- 4.2 forecast units item ---
const getUnits = (): WeatherDataUnits => ({
  precipitation: "mm",
  speed: "km/h",
  temperature: "°C",
});

interface WeatherOverrides {
  daily?: Partial<WeatherDataDaily>;
  hourly?: Partial<WeatherDataHourly>;
}

interface WeatherDataMocks {
  dailyData: WeatherDataDaily;
  hourlyData: WeatherDataHourly;
}
