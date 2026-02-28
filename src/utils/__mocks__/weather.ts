export const calculateAverageTemps = vi.fn(() => -3);

export const groupByDay = vi.fn(() => [
  { hours: [{ hour: "12:00", temp: -2 }] },
  { hours: [{ hour: "14:00", temp: -2 }] },
]);
