import type { checkRatelimit as CheckRatelimitType } from "../ratelimit";

// --- 1. mocks ---
const mockLimit = vi.fn();
vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: vi.fn().mockReturnValue({}) },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow = vi.fn();
    limit = mockLimit;
  },
}));

vi.mock("server-only", () => ({}));

// --- 2. setup ---
let checkRatelimit: typeof CheckRatelimitType;

beforeAll(async () => {
  const actual = await import("../ratelimit");
  checkRatelimit = actual.checkRatelimit;
});

beforeEach(() => {
  vi.clearAllMocks();
});

const createResult = (
  success: boolean,
  limit: number,
  remaining: number,
  reset: number = Date.now() + 10_000,
) => ({
  success,
  limit,
  remaining,
  reset,
  pending: Promise.resolve(),
});

const passAll = (limit = 10, remaining = 9) =>
  mockLimit.mockResolvedValue(createResult(true, limit, remaining));

// --- 3. tests ---
describe("checkRatelimit", () => {
  it("should return success when all limiters pass", async () => {
    passAll();
    const result = await checkRatelimit("1.1.1.1");
    expect(result.success).toBe(true);
  });

  it("should return long-term result when all pass", async () => {
    mockLimit
      .mockResolvedValueOnce(createResult(true, 5, 4))
      .mockResolvedValueOnce(createResult(true, 10, 9))
      .mockResolvedValueOnce(createResult(true, 50, 47));

    const result = await checkRatelimit("1.1.1.1");
    expect(result.limit).toBe(50);
    expect(result.remaining).toBe(47);
  });

  it("should return blocked result when short-term fails", async () => {
    mockLimit
      .mockResolvedValueOnce(createResult(false, 5, 0))
      .mockResolvedValueOnce(createResult(true, 10, 9))
      .mockResolvedValueOnce(createResult(true, 50, 49));

    const result = await checkRatelimit("1.1.1.1");
    expect(result.success).toBe(false);
    expect(result.limit).toBe(5);
    expect(result.remaining).toBe(0);
  });

  it("should return blocked result when medium-term fails", async () => {
    mockLimit
      .mockResolvedValueOnce(createResult(true, 5, 4))
      .mockResolvedValueOnce(createResult(false, 10, 0))
      .mockResolvedValueOnce(createResult(true, 50, 49));

    const result = await checkRatelimit("1.1.1.1");
    expect(result.success).toBe(false);
    expect(result.limit).toBe(10);
  });

  it("should return blocked result when long-term fails", async () => {
    mockLimit
      .mockResolvedValueOnce(createResult(true, 5, 4))
      .mockResolvedValueOnce(createResult(true, 10, 9))
      .mockResolvedValueOnce(createResult(false, 50, 0));

    const result = await checkRatelimit("1.1.1.1");
    expect(result.success).toBe(false);
    expect(result.limit).toBe(50);
  });

  it("should return first blocked limiter when multiple fail", async () => {
    mockLimit
      .mockResolvedValueOnce(createResult(false, 5, 0))
      .mockResolvedValueOnce(createResult(false, 10, 0))
      .mockResolvedValueOnce(createResult(false, 50, 0));

    const result = await checkRatelimit("1.1.1.1");
    expect(result.success).toBe(false);
    expect(result.limit).toBe(5);
  });

  it("should call limit with correct identifier", async () => {
    passAll();
    await checkRatelimit("2.2.2.2");
    expect(mockLimit).toHaveBeenCalledTimes(3);
    expect(mockLimit).toHaveBeenCalledWith("2.2.2.2");
  });

  it("should always call all three limiters", async () => {
    passAll();
    await checkRatelimit("1.1.1.1");
    expect(mockLimit).toHaveBeenCalledTimes(3);
  });
});
