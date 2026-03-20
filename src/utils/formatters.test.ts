import { createCityData } from "@/testing/mocks/factories/cityData";

import {
  capitalizeString,
  formatCityDisplay,
  formatDayOfWeek,
  formatHourOfDay,
  getHourNumber,
} from "./formatters";

describe("formatters", () => {
  const mockDate = new Date("2026-02-21T12:00:00");

  describe("formatDayOfWeek", () => {
    it("should format day of week", () => {
      expect(formatDayOfWeek(mockDate, "dddd")).toBe("Saturday");
    });
  });

  describe("formatHourOfDay", () => {
    it("should format hour of day", () => {
      expect(formatHourOfDay(mockDate, "12")).toBe("12 PM");
    });

    describe("getHourNumber", () => {
      it("should get hour number", () => {
        expect(getHourNumber("12 AM")).toBe(0);
        expect(getHourNumber("12 PM")).toBe(12);
        expect(getHourNumber("1 PM")).toBe(13);
        expect(getHourNumber("11 PM")).toBe(23);
      });
    });

    describe("capitalizeString", () => {
      it("should capitalize any string", () => {
        expect(capitalizeString("london")).toBe("London");
        expect(capitalizeString("LONDON")).toBe("London");
      });
    });

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
  });
});
