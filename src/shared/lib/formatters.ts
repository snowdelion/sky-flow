import dayjs from "dayjs";

export function formatDayOfWeek(
  date: Date,
  dayFormat: string = "dddd",
): string {
  return dayjs(date).format(dayFormat);
}

export function formatHourOfDay(date: Date, format: "12" | "24"): string {
  if (format === "12") {
    return dayjs(date).format("h A");
  } else {
    return dayjs(date).format("HH:mm");
  }
}

export function getHourNumber(hour: string): number | undefined {
  if (hour.includes("AM")) {
    if (parseInt(hour) === 12) return 0;
    return parseInt(hour);
  } else if (hour.includes("PM")) {
    if (parseInt(hour) === 12) return 12;
    return parseInt(hour) + 12;
  }
}

export function capitalizeString(value: string): string {
  return value[0].toUpperCase() + value.slice(1).toLowerCase();
}
