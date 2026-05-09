import { AppError } from "./app-error";
import { ERROR_CODES, type ErrorCode } from "./error-codes";
import { throwResponseErrors } from "./error-handler";

describe("throwResponseErrors", () => {
  const cases: TestCase[] = [
    {
      status: 400,
      code: ERROR_CODES.GEOCODING,
      message: "Invalid search query...",
    },
    {
      status: 403,
      code: ERROR_CODES.GEOCODING,
      message: "API authentication failed. Try again later...",
    },
    {
      status: 429,
      code: ERROR_CODES.GEOCODING,
      message: "Too many requests. Wait a moment and try again...",
    },
    {
      status: 500,
      code: ERROR_CODES.GEOCODING,
      message: "Service is temporarily unavailable. Try again later...",
    },
    {
      status: 1000,
      code: ERROR_CODES.GEOCODING,
      message: "Failed to fetch data (status: 1000).",
    },

    {
      status: 400,
      code: ERROR_CODES.FORECAST,
      message: "Invalid search query...",
    },
    {
      status: 403,
      code: ERROR_CODES.FORECAST,
      message: "API authentication failed. Try again later...",
    },
    {
      status: 429,
      code: ERROR_CODES.FORECAST,
      message: "Too many requests. Wait a moment and try again...",
    },
    {
      status: 500,
      code: ERROR_CODES.FORECAST,
      message: "Service is temporarily unavailable. Try again later...",
    },
    {
      status: 1000,
      code: ERROR_CODES.FORECAST,
      message: "Failed to fetch data (status: 1000).",
    },
  ];

  test.each(cases)(
    "should throw correct errors",
    ({ status, code, message }) => {
      expect.assertions(3);

      try {
        throwResponseErrors(status, code);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe(message);
        expect((error as AppError).code).toBe(code);
      }
    },
  );
});

interface TestCase {
  status: number;
  code: ErrorCode;
  message: string;
}
