type AppErrorCode =
  | "GEOCODING_FAILED"
  | "FORECAST_FAILED"
  | "UNKNOWN_ERROR"
  | "VALIDATION_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
