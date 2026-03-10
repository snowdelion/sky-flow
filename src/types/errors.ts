export class AppError extends Error {
  constructor(
    public code: "GEOCODING_FAILED" | "FORECAST_FAILED" | "UNKNOWN_ERROR",
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
