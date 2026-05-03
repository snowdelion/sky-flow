import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSettingsStore } from "@/entities/settings";
import { type WeatherHourly, groupByDay } from "@/entities/weather";
import { useDeviceType } from "@/shared/lib";

export function useHourlyForecast(hourlyData: WeatherHourly | undefined) {
  const selectedDayIndex = useSettingsStore((s) => s.selectedDayIndex);
  const setSelectedDayIndex = useSettingsStore((s) => s.setSelectedDayIndex);
  const hourFormat = useSettingsStore((s) => s.units.timeUnit);

  const hoursRef = useRef<HTMLUListElement>(null);

  const days = useMemo(() => {
    if (!hourlyData) return [];
    return groupByDay(hourlyData, { hourFormat, dayFormat: "dddd" })
      .filter((day) => day.hours.length === 24)
      .slice(0, 7);
  }, [hourlyData, hourFormat]);

  const formattedDates = useMemo(
    () => days.map(({ date }) => dayjs(date).format("DD MMM")),
    [days],
  );

  const hours = useMemo(
    () => days[selectedDayIndex]?.hours ?? [],
    [days, selectedDayIndex],
  );

  const handleChangeDay = useCallback(
    (index: number) => {
      setSelectedDayIndex(index);
      if (hoursRef.current) hoursRef.current?.scrollTo({ top: 0 });
    },
    [setSelectedDayIndex],
  );

  const [isHourlyOpen, setIsHourlyOpen] = useState<boolean>(true);
  const { isDesk } = useDeviceType();

  useEffect(() => {
    if (isDesk && !isHourlyOpen) setIsHourlyOpen(true);
  }, [isDesk, isHourlyOpen]);

  return useMemo(
    () => ({
      selectedDay: days[selectedDayIndex],
      hoursRef,
      days,
      hours,
      handleChangeDay,
      hourFormat,
      selectedDayIndex,
      setSelectedDayIndex,
      isHourlyOpen,
      setIsHourlyOpen,
      isDesk,
      formattedDates,
    }),
    [
      hoursRef,
      days,
      hours,
      handleChangeDay,
      hourFormat,
      selectedDayIndex,
      setSelectedDayIndex,
      isHourlyOpen,
      setIsHourlyOpen,
      isDesk,
      formattedDates,
    ],
  );
}
