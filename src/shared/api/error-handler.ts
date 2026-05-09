import { ZodError } from "zod";
import { AppError } from "./app-error";
import type { ErrorCode } from "./error-codes";
import { ERROR_CODES } from "./error-codes";

export function handleApiError(
  error: unknown,
  errorCode: ErrorCode = ERROR_CODES.UNKNOWN,
) {
  if (error instanceof Error && error.name === "AbortError") throw error;
  if (error instanceof ZodError) throwZodErrors(error);
  if (error instanceof AppError) throw error;

  const message =
    error instanceof Error ? error.message : "Unexpected error...";
  throw new AppError(errorCode, message);
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
