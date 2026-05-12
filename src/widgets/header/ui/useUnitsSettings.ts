import { startTransition, useCallback, useMemo, useRef } from "react";
import { useSettingsStore } from "@/entities/settings";
import type { WeatherUnits } from "@/entities/weather";
import { usePreventScroll } from "@/shared/lib";

export function useUnitsSettings() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const units = useSettingsStore((state) => state.units);
  const setUnits = useSettingsStore((state) => state.setUnits);
  const reset = useSettingsStore((state) => state.reset);

  const handleSetUnit = useCallback(
    (unitKey: keyof WeatherUnits, value: string) =>
      startTransition(() => setUnits({ [unitKey]: value })),
    [setUnits],
  );

  const handleReset = useCallback(
    () => startTransition(() => reset()),
    [reset],
  );

  usePreventScroll(buttonRef);

  return useMemo(
    () => ({ buttonRef, handleReset, handleSetUnit, units }),
    [handleReset, handleSetUnit, units],
  );
}
