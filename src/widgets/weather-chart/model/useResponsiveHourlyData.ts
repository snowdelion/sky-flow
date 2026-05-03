import { useMemo } from "react";
import { useDeviceType } from "@/shared/lib/useDeviceType";

export function useResponsiveHourlyData(
  data: { hour: string; temp: number }[],
) {
  const { isDesk, isTablet, isMobile } = useDeviceType();

  return useMemo(() => {
    if (isDesk) return data;

    if (isMobile) return data.filter((_, index) => index % 4 === 0);

    if (isTablet) return data.filter((_, index) => index % 2 === 0);

    return data;
  }, [data, isMobile, isTablet, isDesk]);
}
