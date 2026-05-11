import { AppError } from "../config/app-error";
import { ERROR_CODES, type ErrorCode } from "../config/error-codes";
import { throwResponseErrors } from "./error-handler";

export async function request({
  url,
  timeout = 8000,
  errorCode,
  signal,
}: RequestProps) {
  const timeoutSignal = AbortSignal.timeout(timeout);

  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  try {
    const response = await fetch(url, { signal: combinedSignal });

    if (!response.ok) {
      if (response.status === 499)
        throw new DOMException("Aborted", "AbortError");

      throwResponseErrors(response.status, errorCode);
    }

    return { data: await response.json(), status: response.status };
  } catch (error) {
    const isTimeout =
      (error instanceof Error || error instanceof DOMException) &&
      error.name === "TimeoutError";
    const isAbort =
      (error instanceof Error || error instanceof DOMException) &&
      error.name === "AbortError";

    if (isTimeout || isAbort) {
      if (signal?.aborted) throw error;

      throw new AppError(
        ERROR_CODES.TIMEOUT,
        "Check your network connection...",
      );
    }

    throw error;
  }
}

type RequestProps = {
  url: string;
  timeout?: number;
  errorCode?: ErrorCode;
  signal?: AbortSignal;
};
