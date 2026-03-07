import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

export function useDeviceType(): UseDeviceTypeReturn {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 768 });
  const isDesk = useMediaQuery({ minWidth: 1024 });
  const isSmallDesk = useMediaQuery({ minWidth: 1024, maxWidth: 1150 });

  return useMemo(
    () => ({
      isMobile,
      isTablet,
      isDesk,
      isSmallDesk,
    }),
    [isMobile, isTablet, isDesk, isSmallDesk],
  );
}

interface UseDeviceTypeReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesk: boolean;
  isSmallDesk: boolean;
}
