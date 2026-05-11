import type { ZodType } from "zod";
import { type ErrorCode } from "../config/error-codes";
import { handleApiError, throwResponseErrors } from "./error-handler";

export async function request<T>({
  url,
  timeout = 8000,
  schema,
  errorCode,
  signal,
}: RequestProps<T>): Promise<{ data: T; status: number }> {
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

    const rawData = await response.json();
    const data = schema ? schema.parse(rawData) : rawData;

    return { data, status: response.status };
  } catch (error) {
    handleApiError(error, errorCode, { isExternalSignal: !!signal });
  }
}

type RequestProps<T> = {
  url: string;
  schema?: ZodType<T>;
  timeout?: number;
  errorCode?: ErrorCode;
  signal?: AbortSignal;
};
