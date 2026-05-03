export const createChartData = () => ({
  dailyChartData: getDailyChartData(),
  hourlyChartData: getHourlyChartData(),
});

const getDailyChartData = () => [
  ...Array(6).fill({
    day: "Saturday",
    temp: 0,
  }),
  {
    day: "Sunday",
    temp: 1,
  },
];

const getHourlyChartData = () => [
  ...Array(23).fill({
    hour: "1 PM",
    temp: 0,
  }),
  {
    hour: "2 PM",
    temp: 1,
  },
];
