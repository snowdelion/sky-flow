"use client";
import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

export function useDeviceType() {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 768 });
  const isDesk = useMediaQuery({ minWidth: 1024 });
  const isSmallDesk = useMediaQuery({ minWidth: 1024, maxWidth: 1150 });
  const isDesktopXl = useMediaQuery({ minWidth: 1280 });

  return useMemo(
    () => ({
      isMobile,
      isTablet,
      isDesk,
      isSmallDesk,
      isDesktopXl,
    }),
    [isMobile, isTablet, isDesk, isSmallDesk, isDesktopXl],
  );
}
