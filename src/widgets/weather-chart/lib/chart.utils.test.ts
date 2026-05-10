import {
  generateTicks,
  getAspect,
  getTicks,
  getXTickFormatter,
} from "./chart.utils";

describe("chart-utils", () => {
  describe("generateTicks", () => {
    test.each([
      { min: 0, max: 5, expected: 1 },
      { min: 0, max: 14, expected: 2 },
      { min: 0, max: 22, expected: 5 },
    ])(
      "should return 1, 2 or 5 step depending on diff",
      ({ min, max, expected }) => {
        const result = generateTicks(min, max);
        expect(result[1] - result[0]).toBe(expected);
      },
    );
  });

  describe("getTicks", () => {
    test.each([
      {
        data: [{ temp: 0 }, { temp: 2 }, { temp: 4 }],
        expected: [-4, -2, 0, 2, 4, 6, 8],
      },
      { data: null, expected: [0, 10, 20, 30] },
    ])(
      "should get chart ticks and handle missing data",
      ({ data, expected }) => {
        expect(getTicks(data)).toEqual(expected);
      },
    );
  });

  describe("getAspect", () => {
    test.each([
      { isM: true, isT: false, expected: 21 / 16 },
      { isM: false, isT: true, expected: 21 / 11 },
      { isM: false, isT: false, expected: 21 / 9 },
    ])(
      "should return expected for every device type",
      ({ isM, isT, expected }) => {
        expect(getAspect(isM, isT)).toBe(expected);
      },
    );
  });

  describe("getXTickFormatter", () => {
    test.each([
      {
        value: "12 AM",
        data: {
          currentChartTab: "hourly",
          isDesk: false,
          isSmallDesk: true,
          hourUnit: "12" as "12" | "24",
        },
        expected: "12A",
      },
      {
        value: "16:00",
        data: {
          currentChartTab: "hourly",
          isDesk: true,
          isSmallDesk: false,
          hourUnit: "24" as "12" | "24",
        },
        expected: "16:00",
      },
    ])(
      "should return expected for 12/24 hour format",
      ({ value, data, expected }) => {
        expect(getXTickFormatter(value, data)).toBe(expected);
      },
    );
  });
});
