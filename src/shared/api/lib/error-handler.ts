import { ZodError } from "zod";
import { AppError } from "../config/app-error";
import type { ErrorCode } from "../config/error-codes";
import { ERROR_CODES } from "../config/error-codes";

export function handleApiError(
  error: unknown,
  errorCode: ErrorCode = ERROR_CODES.UNKNOWN,
  { isExternalSignal = false }: { isExternalSignal?: boolean } = {},
): never {
  if (error instanceof ZodError) throwZodErrors(error);
  if (error instanceof AppError) throw error;

  const isError = error instanceof Error || error instanceof DOMException;

  if (isError) {
    const isTimeout =
      error.name === "TimeoutError" ||
      (error.name === "AbortError" && !isExternalSignal);

    const isExternalAbort = error.name === "AbortError" && isExternalSignal;

    if (isExternalAbort) throw error;
    if (isTimeout)
      throw new AppError(
        ERROR_CODES.TIMEOUT,
        "Check your network connection...",
      );

    const messages = [/failed to fetch/i, /network/i, /load/i, /connection/i];
    const isNetworkError = messages.some((msg) =>
      msg.test(error.message.toLowerCase()),
    );

    if (isNetworkError)
      throw new AppError(
        ERROR_CODES.NETWORK,
        "Check your network connection...",
      );

    throw new AppError(errorCode, error.message);
  }

  throw new AppError(errorCode, "Unexpected error...");
}

const ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid search query...",
  401: "API authentication failed. Try again later...",
  403: "API authentication failed. Try again later...",
  429: "Too many requests. Wait a moment and try again...",
};

export function throwResponseErrors(
  status: number,
  errorCode: ErrorCode = ERROR_CODES.UNKNOWN,
) {
  if (status >= 500 && status <= 504)
    throw new AppError(
      errorCode,
      "Service is temporarily unavailable. Try again later...",
    );

  const message =
    ERROR_MESSAGES[status] ?? `Failed to fetch data (status: ${status}).`;
  throw new AppError(errorCode, message);
}

function throwZodErrors(error: ZodError) {
  const issue = error.issues[0];
  const message = `${issue.path.join(".")}: ${issue.message}`.replace(
    /invalid input: /i,
    "",
  );
  throw new AppError(
    ERROR_CODES.VALIDATION,
    `Data validation failed: ${message}`,
  );
}
