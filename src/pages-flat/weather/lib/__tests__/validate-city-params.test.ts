import { type WeatherParams } from "../utils"
import { validateCityParams } from "../validate-city-params"

// --- 1. mocks ---
const redirect = vi.hoisted(() => vi.fn())
vi.mock("next/navigation", () => ({ redirect }))

const { mockGetHeaders } = vi.hoisted(() => ({
  mockGetHeaders: vi.fn().mockReturnValue(null),
}))
vi.mock("next/headers", () => ({
  headers: async () => ({ get: mockGetHeaders }),
}))

const getCachedGeoData = vi.hoisted(() => vi.fn())
vi.mock("../geo-cache", () => ({ getCachedGeoData }))

const findMatch = vi.hoisted(() => vi.fn())
vi.mock("../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils")>()
  return { ...actual, findMatch }
})

// --- 2. helpers ---
const berlinGeoResult = {
  status: "found" as const,
  region: "State of Berlin",
  city: "Berlin",
  country: "Germany",
  code: "PPLC",
  lat: 52.52437,
  lon: 13.41053,
}

const berlinParams: WeatherParams = {
  region: "State of Berlin",
  city: "Berlin",
  country: "Germany",
  code: "PPLC",
  lat: "52.52437",
  lon: "13.41053",
}

const emptyGeoData = { results: [{}] }

// --- 3. tests ---
describe("WeatherPage utils", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getCachedGeoData.mockResolvedValue(emptyGeoData)
    findMatch.mockReturnValue(berlinGeoResult)
    mockGetHeaders.mockReturnValue(null)
  })

  it("should return redirect status when no params", async () => {
    expect(await validateCityParams({ city: "", lat: undefined, lon: undefined })).toEqual({
      status: "redirect" as const,
      url: "/weather?city=Berlin&region=State+of+berlin&country=Germany&code=PPLC&lat=52.52437&lon=13.41053",
    })
  })

  it("should return not-found when geo returns no results", async () => {
    getCachedGeoData.mockResolvedValue({ results: [] })

    const result = await validateCityParams({ city: "unknown_city" })

    expect(result).toEqual({ status: "not-found", city: "unknown_city" })
    expect(redirect).not.toHaveBeenCalled()
  })

  it("should return not-found when geo returns null", async () => {
    getCachedGeoData.mockResolvedValue(null)

    const result = await validateCityParams({ city: "unknown_city" })

    expect(result).toEqual({ status: "not-found", city: "unknown_city" })
    expect(redirect).not.toHaveBeenCalled()
  })

  it("should return not-found when findMatch returns invalid data", async () => {
    findMatch.mockReturnValue(null)

    const result = await validateCityParams({ city: "Berlin" })

    expect(result).toEqual({ status: "not-found", city: "Berlin" })
    expect(redirect).not.toHaveBeenCalled()
  })

  it("should return city data when params are valid", async () => {
    const result = await validateCityParams(berlinParams)

    expect(result).toEqual(berlinGeoResult)
    expect(redirect).not.toHaveBeenCalled()
  })

  describe("redirect", () => {
    const cases = [
      {
        name: "no coords",
        params: { city: "Berlin", region: "State of Berlin", code: "PPLC", country: "Germany" },
      },
      {
        name: "no country",
        params: {
          city: "Berlin",
          region: "State of Berlin",
          code: "PPLC",
          lat: "52.52437",
          lon: "13.41053",
        },
      },
      {
        name: "no code",
        params: {
          city: "Berlin",
          region: "State of Berlin",
          country: "Germany",
          lat: "52.52437",
          lon: "13.41053",
        },
      },
      {
        name: "only city",
        params: { city: "Berlin" },
      },
    ]

    test.each(cases)("should return redirect status when $name", async ({ params }) => {
      const result = await validateCityParams(params as WeatherParams)

      expect(result).toMatchObject({
        status: "redirect",
        url: expect.stringContaining("/weather?city=Berlin"),
      })
    })
  })

  it("should return redirect status and strip extra params", async () => {
    const result = await validateCityParams({ ...berlinParams, extra: "123" } as WeatherParams)

    expect(result).toMatchObject({
      status: "redirect",
      url: expect.stringContaining("/weather?city=Berlin"),
    })
    expect(result).not.toEqual(expect.stringContaining("extra"))
  })

  it("should return redirect status with corrected params when region and coords are wrong", async () => {
    const result = await validateCityParams({ ...berlinParams, region: "123", lat: "0", lon: "0" })

    expect(result.status).toBe("redirect")

    if (result.status !== "redirect") throw new Error("Expected status to be redirect")

    expect(result.url).toContain("/weather")

    const urlObj = new URL(result.url, "http://localhost")
    const params = Object.fromEntries(urlObj.searchParams.entries())

    expect(params).toEqual(
      expect.objectContaining({
        city: "Berlin",
        region: "State of Berlin",
        lat: "52.52437",
        lon: "13.41053",
      }),
    )
  })

  it("should successfully determine city from Vercel IP headers when no params provided", async () => {
    mockGetHeaders.mockImplementation((key: string) => {
      const headersMap: Record<string, string> = {
        "x-vercel-ip-city": "Berlin",
        "x-vercel-ip-latitude": "52.52437",
        "x-vercel-ip-longitude": "13.41053",
        "x-vercel-ip-country": "Germany",
        "x-vercel-ip-country-region": "State of Berlin",
      }
      return headersMap[key] || null
    })

    const result = await validateCityParams({ city: "", lat: undefined, lon: undefined })

    expect(result).toEqual({
      status: "redirect",
      url: "/weather?city=Berlin&region=State+of+Berlin&country=Germany&code=PPLC&lat=52.52437&lon=13.41053",
    })
  })
})
