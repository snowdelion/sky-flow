const STEPS = [1, 2, 5];

export function generateTicks(min: number, max: number) {
  const avg = max - min;
  const rawStep = avg / 8;
  const step = STEPS.find((item) => item >= rawStep) ?? STEPS[STEPS.length - 1];

  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;

  const ticks = [];
  for (let i = start; i <= end; i += step) {
    ticks.push(i);
  }
  return ticks;
}

export function getTicks(chartData: { temp: number }[] | null | undefined) {
  if (!chartData || chartData.length === 0) return [0, 10, 20, 30];

  const dataMin = Math.min(...chartData.map((item) => item.temp));
  const dataMax = Math.max(...chartData.map((item) => item.temp));
  return generateTicks(dataMin - 3, dataMax + 3);
}

export const getAspect = (isM?: boolean, isT?: boolean) => {
  if (isM) return 21 / 16;
  if (isT) return 21 / 11;
  return 21 / 9;
};

export function getXTickFormatter(
  value: string,
  data: {
    currentChartTab: string;
    isDesk: boolean;
    isSmallDesk: boolean;
    hourUnit: "12" | "24";
  },
) {
  const { currentChartTab, isDesk, isSmallDesk, hourUnit } = data;
  if (currentChartTab === "daily") return value;

  if (!isDesk || isSmallDesk) {
    if (hourUnit === "12") {
      return value.replace(" AM", "A").replace(" PM", "P");
    }
    return +value.split(":")[0] + "h";
  }

  if (hourUnit === "12") return value.replace(" AM", "AM").replace(" PM", "PM");

  return value;
}
