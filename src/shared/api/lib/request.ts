import { type ErrorCode } from "../config/error-codes";
import { handleApiError, throwResponseErrors } from "./error-handler";

export async function request({
  url,
  timeout = 8000,
  errorCode,
  signal,
}: RequestProps) {
  const timeoutSignal = AbortSignal.timeout(timeout);

  const combinedSignal = !!signal
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
    handleApiError(error, errorCode, { isExternalSignal: !!signal });
  }
}

type RequestProps = {
  url: string;
  timeout?: number;
  errorCode?: ErrorCode;
  signal?: AbortSignal;
};
