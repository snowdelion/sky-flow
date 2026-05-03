import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useChartResize(delay: number = 150) {
  const [isResizing, setIsResizing] = useState(false);
  const debouncingReset = useDebouncedCallback(
    () => setIsResizing(false),
    delay,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsResizing(true);
      debouncingReset();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [debouncingReset]);

  return isResizing;
}
