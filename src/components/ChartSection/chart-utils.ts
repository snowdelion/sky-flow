function generateTicks(min: number, max: number): number[] {
  const ticks = [];
  const start = Math.floor(min / 2) * 2;
  const end = Math.ceil(max / 2) * 2;

  const diff = end - start;
  let step = 1;

  if (diff > 20) step = 5;
  else if (diff > 10) step = 2;

  for (let i = start; i <= end; i += step) {
    ticks.push(i);
  }
  return ticks;
}

export function getTicks(chartData: { temp: number }[]): number[] {
  if (!chartData || chartData.length === 0) return [0, 10, 20, 30];

  return generateTicks(
    Math.min(...chartData.map((item) => item.temp)) - 3,
    Math.max(...chartData.map((item) => item.temp)) + 3,
  );
}

export const getAspect = (isM: boolean, isT: boolean): number => {
  if (isM) return 21 / 14;
  if (isT) return 21 / 10.5;
  return 21 / 8.75;
};

export function getXTickFormatter(
  value: string,
  data: {
    currentChartTab: string;
    isDesk: boolean;
    isSmallDesk: boolean;
    hourUnit: "12" | "24";
  },
): string {
  const { currentChartTab, isDesk, isSmallDesk, hourUnit } = data;
  if (currentChartTab === "daily") return value;
  if (!isDesk || isSmallDesk) {
    if (hourUnit === "12") {
      return value.replace(" AM", "A").replace(" PM", "P");
    } else {
      return +value.replace(":00", "").replace(":00", "") + "h";
    }
  } else {
    if (hourUnit === "12") {
      return value.replace(" AM", "AM").replace(" PM", "PM");
    } else {
      return value.replace(":00", ":00").replace(":00", ":00");
    }
  }
}
