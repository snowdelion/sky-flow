import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

export function useResponsiveHourlyData<
  T extends { hour: string; temp: number }[],
>(data: T): T {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  return useMemo(() => {
    if (isDesktop) return data;

    if (isTablet) return data.filter((_, index) => index % 2 === 0) as T;

    if (isMobile) return data.filter((_, index) => index % 4 === 0) as T;

    return data;
  }, [data, isMobile, isTablet, isDesktop]);
}
