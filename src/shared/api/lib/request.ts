import { AppError } from "../config/app-error";
import { ERROR_CODES, type ErrorCode } from "../config/error-codes";
import { throwResponseErrors } from "./error-handler";

export async function request({
  url,
  timeout = 8000,
  errorCode,
  signal,
}: RequestProps) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeout);

  const combinedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch(url, { signal: combinedSignal });
    if (!response.ok) throwResponseErrors(response.status, errorCode);

    return { data: await response.json(), status: response.status };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      if (signal?.aborted) throw error;
      throw new AppError(
        ERROR_CODES.TIMEOUT,
        "Check your network connection...",
      );
    }

    throw error;
  } finally {
    clearTimeout(timerId);
  }
}

type RequestProps = {
  url: string;
  timeout?: number;
  errorCode?: ErrorCode;
  signal?: AbortSignal;
};
