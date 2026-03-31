import { createCityData } from "@/shared/lib/testing";

import { formatCityDisplay } from "./formatCityDisplay";

describe("formatCityDisplay", () => {
  const { berlinCityData } = createCityData();

  const cases = [
    {
      name: "city, country when regular city (PPLC/PPLA)",
      cityData: berlinCityData,
      expected: "Berlin, Germany",
    },
    {
      name: "only city when PCLI(country) code",
      cityData: {
        status: "found" as const,
        city: "Germany",
        code: "PCLI",
        country: "Germany",
        lat: 51.5,
        lon: 10.5,
        region: undefined,
      },
      expected: "Germany",
    },
    {
      name: "city, region, country",
      cityData: {
        status: "found" as const,
        city: "Berlin",
        code: "PPL",
        country: "United States",
        lat: 44.46867,
        lon: -71.18508,
        region: "New Hampshire",
      },
      expected: "Berlin, New Hampshire, United States",
    },
    {
      name: "only city when region, code and country undefined",
      cityData: {
        status: "found" as const,
        city: "antarctica island",
        lat: -180,
        lon: 180,
      },
      expected: "antarctica island",
    },
  ];

  test.each(cases)("should format $name", ({ cityData, expected }) => {
    expect(formatCityDisplay(cityData)).toBe(expected);
  });
});
