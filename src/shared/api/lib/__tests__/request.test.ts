import type { NextResponse } from "next/server";
import { ERROR_CODES } from "../../server";
import { request } from "../request";

describe("request", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should show original AbortError when response is 499 and signal is aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 499,
    } as NextResponse);

    await expect(
      request({ url: "/fetch", signal: controller.signal }),
    ).rejects.toThrow(DOMException);
  });

  it("should throw AppError timeout when fetch times out and no external signal", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(
      Object.assign(new Error("Timeout"), { name: "TimeoutError" }),
    );

    await expect(
      request({ url: "/fetch", timeout: 8000 }),
    ).rejects.toMatchObject({ code: ERROR_CODES.TIMEOUT });
  });

  it("should throw AppError timeout when AbortError without external signal", async () => {
    vi.spyOn(AbortSignal, "timeout").mockReturnValue({
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as AbortSignal);

    vi.spyOn(global, "fetch").mockRejectedValueOnce(
      new DOMException("Aborted", "AbortError"),
    );

    await expect(request({ url: "/fetch" })).rejects.toMatchObject({
      code: ERROR_CODES.TIMEOUT,
    });
  });
});
