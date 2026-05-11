import {
  capitalizeString,
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
});
