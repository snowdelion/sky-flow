import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useShallow } from "zustand/shallow";

import { useDeviceType } from "@/hooks/useDeviceType";
import { useSettingsStore } from "@/stores/useSettingsStore";
import type { WeatherDataHourly } from "@/types/api/WeatherData";
import type { DailyForecast, HourlyItem } from "@/types/weather";
import { groupByDay } from "@/utils/weather";

export function useHourlyForecast(
  hourlyData: WeatherDataHourly,
): UseHourlyForecastReturn {
  const { selectedDayIndex, setSelectedDayIndex, hourFormat } =
    useSettingsStore(
      useShallow((state) => ({
        selectedDayIndex: state.selectedDayIndex,
        setSelectedDayIndex: state.setSelectedDayIndex,
        hourFormat: state.units.time,
      })),
    );

  const hoursRef = useRef<HTMLUListElement>(null);

  const days = useMemo(
    () =>
      groupByDay(hourlyData, { hourFormat, dayFormat: "dddd" })
        .filter((day) => day.hours.length === 24)
        .slice(0, 7),
    [hourlyData, hourFormat],
  );

  const selectedDay = days[selectedDayIndex] || {
    date: "",
    dayName: "",
    hours: [],
  };

  const hours = selectedDay.hours;

  const handleChangeDay = useCallback(
    (index: number): void => {
      setSelectedDayIndex(index);
      hoursRef.current?.scrollTo({ top: 0 });
    },
    [setSelectedDayIndex],
  );

  const [isHourlyOpen, setIsHourlyOpen] = useState<boolean>(true);
  const { isDesk } = useDeviceType();

  useEffect(() => {
    if (isDesk && !isHourlyOpen) setIsHourlyOpen(true);
  }, [isDesk, isHourlyOpen]);

  return {
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
  };
}

interface UseHourlyForecastReturn {
  hoursRef: RefObject<HTMLUListElement | null>;
  days: DailyForecast[];
  hours: HourlyItem[];
  handleChangeDay: (index: number) => void;
  hourFormat: "12" | "24";
  selectedDayIndex: number;
  setSelectedDayIndex: (day: number) => void;
  isHourlyOpen: boolean;
  setIsHourlyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesk: boolean;
}
