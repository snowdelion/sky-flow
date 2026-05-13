import { getBaseUrl } from "../getBaseUrl"

describe("getBaseUrl", () => {
  const originalWindow = global.window

  afterEach(() => {
    global.window = originalWindow
    delete process.env.NEXT_PUBLIC_SITE_URL
  })

  it('should return "" in browser env', () => {
    expect(getBaseUrl()).toBe("")
  })

  it("should return NEXT_PUBLIC_SITE_URL on server when env is set", () => {
    // @ts-expect-error test
    delete global.window
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"

    expect(getBaseUrl()).toBe("https://example.com")
  })

  it("should return fallback localhost on server when env is not set", () => {
    // @ts-expect-error test
    delete global.window

    expect(getBaseUrl()).toBe("http://localhost:3000")
  })
})
