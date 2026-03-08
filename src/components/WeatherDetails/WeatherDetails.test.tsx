import { render, screen, within } from "@testing-library/react";

import {
  createCurrentWeatherMocks,
  createForecastUnits,
} from "@/testing/mocks/factories/weather";

import WeatherDetails from "./WeatherDetails";

// --- 1. setup ---
const setup = (units = createForecastUnits()) => {
  const currentWeather = createCurrentWeatherMocks();
  render(<WeatherDetails currentData={currentWeather} forecastUnits={units} />);

  return {
    list: screen.getByRole("list"),
    getItem: (name: RegExp) => screen.getByRole("listitem", { name }),
    allItems: within(screen.getByRole("list")).getAllByRole("listitem"),
  };
};

// --- 2. tests ---
describe("WeatherDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should format default details and have 4 items", () => {
    const { getItem, allItems } = setup();

    expect(allItems).toHaveLength(4);
    expect(getItem(/feels like/i)).toHaveTextContent("°C");
    expect(getItem(/wind/i)).toHaveTextContent("km/h");
    expect(getItem(/precipitation/i)).toHaveTextContent("mm");
  });

  it("should format changed details", () => {
    const { getItem } = setup({
      precipitation: "inch",
      speed: "mp/h",
      temperature: "°F",
    });

    expect(getItem(/feels like/i)).toHaveTextContent("°F");
    expect(getItem(/wind/i)).toHaveTextContent("mp/h");
    expect(getItem(/precipitation/i)).toHaveTextContent("inch");
  });
});
