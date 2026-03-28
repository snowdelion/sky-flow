import { useMemo } from "react";

import { useDeviceType } from "@/shared/lib/useDeviceType";

export function useResponsiveHourlyData<
  T extends { hour: string; temp: number }[],
>(data: T): T {
  const { isDesk, isTablet, isMobile } = useDeviceType();

  return useMemo(() => {
    if (isDesk) return data;

    if (isMobile) return data.filter((_, index) => index % 4 === 0) as T;

    if (isTablet) return data.filter((_, index) => index % 2 === 0) as T;

    return data;
  }, [data, isMobile, isTablet, isDesk]);
}
