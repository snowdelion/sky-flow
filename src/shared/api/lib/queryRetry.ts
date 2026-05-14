export const queryRetry = (failureCount: number, error: unknown, expectedCount = 2) => {
  const isAborted =
    (error instanceof Error && error.name === "AbortError") ||
    (error instanceof DOMException && error.name === "AbortError")

  if (isAborted) return false

  return failureCount < expectedCount
}
