import type { ZodType } from "zod"
import { type ErrorCode } from "../config/error-codes"
import { handleApiError, throwResponseErrors } from "./error-handler"

export async function request<T>({
  url,
  timeout = 8000,
  schema,
  errorCode,
  signal,
  fetchInit = {},
}: RequestProps<T>): Promise<{ data: T; status: number }> {
  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => timeoutController.abort(), timeout)
  const combinedSignal = !!signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal

  const restFetchInit = { ...fetchInit }
  const mergedHeaders = new Headers(restFetchInit.headers)
  delete restFetchInit.signal

  try {
    const response = await fetch(url, {
      ...restFetchInit,
      signal: combinedSignal,
      headers: mergedHeaders,
    })

    if (!response.ok) {
      if (response.status === 499) throw new DOMException("Aborted", "AbortError")

      throwResponseErrors(response.status, errorCode)
    }

    const rawData = await response.json()
    const data = schema ? schema.parse(rawData) : rawData

    return { data, status: response.status }
  } catch (error) {
    const isTimeout = timeoutController.signal.aborted && (!signal || !signal.aborted)
    if (isTimeout) throw new DOMException("Timed out", "TimeoutError")

    throw handleApiError(error, errorCode, { isExternalSignal: !!signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

type RequestProps<T> = {
  url: string
  schema?: ZodType<T>
  timeout?: number
  errorCode?: ErrorCode
  signal?: AbortSignal
  fetchInit?: RequestInit
}
