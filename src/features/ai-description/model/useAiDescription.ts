import { useCompletion } from "@ai-sdk/react";
import { useCallback, useMemo, useState } from "react";
import { AppError } from "@/shared/api";
import { parseErrorCode } from "./parseErrorCode";
import { type AiErrorCode, AiRequestsSchema, type RequestData } from "./types";

const ERROR_MESSAGES: Record<AiErrorCode, string> = {
  RATE_LIMIT_EXCEEDED: "Too many requests.",
  INVALID_REQUEST_DATA: "Invalid request data.",
  SERVICE_UNAVAILABLE: "AI service is unavailable.",
};

export function useAiDescription(aiRequestData: RequestData | null) {
  const [selectedTab, setSelectedTab] = useState<"weather" | "location" | null>(
    null,
  );
  const [validationError, setValidationError] = useState<AppError | null>(null);

  const { completion, complete, isLoading, error, stop } = useCompletion({
    api: "/api/ai",
  });

  const handleTabSelect = useCallback(
    async (tab: "weather" | "location") => {
      if (!aiRequestData) return;
      setValidationError(null);
      stop();
      setSelectedTab(tab);

      const validation = AiRequestsSchema.safeParse({
        ...aiRequestData,
        option: tab,
      });

      if (!validation.success) {
        setValidationError(
          new AppError(
            "INVALID_REQUEST_DATA",
            ERROR_MESSAGES.INVALID_REQUEST_DATA,
          ),
        );
        return;
      }

      await complete("", { body: validation.data });
    },
    [aiRequestData, stop, complete],
  );

  const resolvedError = useMemo(() => {
    if (validationError) return validationError;
    if (!error) return null;

    const code = parseErrorCode(error);

    return new AppError(code, ERROR_MESSAGES[code]);
  }, [validationError, error]);

  return useMemo(
    () => ({
      selectedTab,
      handleTabSelect,
      setSelectedTab,
      completion,
      isLoading,
      error: resolvedError,
    }),
    [
      selectedTab,
      handleTabSelect,
      setSelectedTab,
      completion,
      isLoading,
      resolvedError,
    ],
  );
}
