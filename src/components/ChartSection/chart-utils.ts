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
