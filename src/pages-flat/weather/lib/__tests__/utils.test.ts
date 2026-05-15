import { FoundCity, type Geo, type GeoItem } from "@/shared/types"
import {
  createSearchParams,
  findMatch,
  needsRedirectCheck,
  type WeatherParams,
  getCityDataFromIP,
} from "../utils"

// --- 1. mocks ---
const headers = vi.hoisted(() => vi.fn())
vi.mock("next/headers", () => ({ headers }))

const berlin: GeoItem = {
  id: 1,
  city: "Berlin",
  region: "Berlin",
  country: "Germany",
  code: "TT",
  lat: 52.52,
  lon: 13.405,
}

const paris: GeoItem = {
  id: 2,
  city: "Paris",
  region: "France",
  country: "France",
  code: "TT",
  lat: 48.8566,
  lon: 2.3522,
}

const tokyo: GeoItem = {
  id: 3,
  city: "Tokyo",
  region: "Tokyo",
  country: "Japan",
  code: "TT",
  lat: 35.6895,
  lon: 139.6917,
}

const geoData: Geo = { results: [berlin, paris, tokyo] }

const makeHeadersList = (values: Record<string, string | null>) => ({
  get: (key: string) => values[key] ?? null,
})

// --- 2. tests ---
describe("getCityDataFromIP", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns all fields when all headers are present", async () => {
    headers.mockResolvedValue(
      makeHeadersList({
        "x-vercel-ip-latitude": "54.6872",
        "x-vercel-ip-longitude": "25.2797",
        "x-vercel-ip-city": "Berlin",
        "x-vercel-ip-country": "Germany",
        "x-vercel-ip-country-region": "Berlin",
      }),
    )

    const result = await getCityDataFromIP()

    expect(result).toEqual({
      lat: "54.6872",
      lon: "25.2797",
      city: "Berlin",
      country: "Germany",
      region: "Berlin",
    })
  })

  it("returns undefined for missing headers", async () => {
    headers.mockResolvedValue(makeHeadersList({}))

    const result = await getCityDataFromIP()

    expect(result).toEqual({
      lat: undefined,
      lon: undefined,
      city: undefined,
      country: undefined,
      region: undefined,
    })
  })

  it("decodes URI-encoded city", async () => {
    headers.mockResolvedValue(
      makeHeadersList({
        "x-vercel-ip-city": "M%C3%BCnchen",
        "x-vercel-ip-country": null,
        "x-vercel-ip-country-region": null,
        "x-vercel-ip-latitude": null,
        "x-vercel-ip-longitude": null,
      }),
    )

    const result = await getCityDataFromIP()

    expect(result.city).toBe("München")
  })

  it("decodes URI-encoded country and region", async () => {
    headers.mockResolvedValue(
      makeHeadersList({
        "x-vercel-ip-city": null,
        "x-vercel-ip-country": "S%C3%B6dra",
        "x-vercel-ip-country-region": "V%C3%A4st",
        "x-vercel-ip-latitude": null,
        "x-vercel-ip-longitude": null,
      }),
    )

    const result = await getCityDataFromIP()

    expect(result.country).toBe("Södra")
    expect(result.region).toBe("Väst")
  })

  it("returns lat and lon as strings without decoding", async () => {
    headers.mockResolvedValue(
      makeHeadersList({
        "x-vercel-ip-latitude": "48.8566",
        "x-vercel-ip-longitude": "2.3522",
        "x-vercel-ip-city": null,
        "x-vercel-ip-country": null,
        "x-vercel-ip-country-region": null,
      }),
    )

    const result = await getCityDataFromIP()

    expect(result.lat).toBe("48.8566")
    expect(result.lon).toBe("2.3522")
    expect(result.city).toBeUndefined()
  })

  it("correctly handles partially filled headers", async () => {
    headers.mockResolvedValue(
      makeHeadersList({
        "x-vercel-ip-city": "Berlin",
        "x-vercel-ip-country": "TT",
        "x-vercel-ip-country-region": null,
        "x-vercel-ip-latitude": null,
        "x-vercel-ip-longitude": null,
      }),
    )

    const result = await getCityDataFromIP()

    expect(result.city).toBe("Berlin")
    expect(result.country).toBe("TT")
    expect(result.region).toBeUndefined()
    expect(result.lat).toBeUndefined()
    expect(result.lon).toBeUndefined()
  })
})

describe("createSearchParams", () => {
  it("sets required params city, lat, lon", () => {
    const params = createSearchParams(berlin as unknown as FoundCity)
    expect(params.get("city")).toBe("Berlin")
    expect(params.get("lat")).toBe("52.52")
    expect(params.get("lon")).toBe("13.405")
  })

  it("sets optional region, country, code when present", () => {
    const params = createSearchParams(berlin as unknown as FoundCity)
    expect(params.get("region")).toBe("Berlin")
    expect(params.get("country")).toBe("Germany")
    expect(params.get("code")).toBe("TT")
  })

  it("omits optional params when undefined", () => {
    const minimal = { city: "Nowhere", lat: 0, lon: 0 } as FoundCity
    const params = createSearchParams(minimal)
    expect(params.has("region")).toBe(false)
    expect(params.has("country")).toBe(false)
    expect(params.has("code")).toBe(false)
  })

  it("converts numeric lat/lon to strings", () => {
    const params = createSearchParams({ city: "Berlin", lat: 52, lon: 13 } as FoundCity)
    expect(params.get("lat")).toBe("52")
    expect(params.get("lon")).toBe("13")
  })
})

describe("findMatch", () => {
  describe("lat/lon matching", () => {
    it("returns the item whose lat/lon match exactly", () => {
      const result = findMatch(geoData, { lat: "48.8566", lon: "2.3522" })
      expect(result.city).toBe("Paris")
    })

    it("falls through to region/country when coords don't match any item", () => {
      const result = findMatch(geoData, { lat: "0", lon: "0", country: "Japan" })
      expect(result.city).toBe("Tokyo")
    })

    it("ignores lat/lon when they are NaN", () => {
      const result = findMatch(geoData, { lat: "abc", lon: "xyz", region: "Berlin" })
      expect(result.city).toBe("Berlin")
    })

    it("ignores lat out of range (-90, 90)", () => {
      const result = findMatch(geoData, { lat: "91", lon: "0", country: "France" })
      expect(result.city).toBe("Paris")
    })

    it("ignores lon out of range (-180, 180)", () => {
      const result = findMatch(geoData, { lat: "0", lon: "181", country: "Germany" })
      expect(result.city).toBe("Berlin")
    })
  })

  describe("region/country matching", () => {
    it("matches by region (case-insensitive)", () => {
      const result = findMatch(geoData, { region: "FRANCE" })
      expect(result.city).toBe("Paris")
    })

    it("matches by country (case-insensitive)", () => {
      const result = findMatch(geoData, { country: "GERMANY" })
      expect(result.city).toBe("Berlin")
    })

    it("returns match when either region or country matches", () => {
      const result = findMatch(geoData, { region: "unknown", country: "Japan" })
      expect(result.city).toBe("Tokyo")
    })
  })

  describe("fallback to first result", () => {
    it("returns first result when query has no lat/lon/region/country", () => {
      const result = findMatch(geoData, {})
      expect(result.city).toBe("Berlin")
    })

    it("returns first result when nothing matches", () => {
      const result = findMatch(geoData, { region: "Warsaw", country: "Poland" })
      expect(result.city).toBe("Berlin")
    })
  })

  describe("returned shape", () => {
    it("always includes status: 'found'", () => {
      const result = findMatch(geoData, {})
      expect(result.status).toBe("found")
    })

    it("includes all city fields", () => {
      const result = findMatch(geoData, { country: "France" })
      expect(result).toMatchObject({
        status: "found",
        city: "Paris",
        region: "France",
        country: "France",
        code: "TT",
        lat: 48.8566,
        lon: 2.3522,
      })
    })
  })
})

describe("needsRedirectCheck", () => {
  const data: FoundCity = {
    status: "found",
    city: "Berlin",
    region: "Berlin",
    country: "Germany",
    code: "TT",
    lat: 52.52,
    lon: 13.405,
  }

  const matchingParams: WeatherParams = {
    city: "Berlin",
    region: "Berlin",
    country: "Germany",
    code: "TT",
    lat: "52.52",
    lon: "13.405",
  }

  const cases = [
    ["exact match", matchingParams, false],
    ["unknown extra key", { ...matchingParams, foo: "bar" }, true],
    ["lat differs", { ...matchingParams, lat: "99" }, true],
    ["lon differs", { ...matchingParams, lon: "99" }, true],
    ["region differs", { ...matchingParams, region: "Bavaria" }, true],
    ["country differs", { ...matchingParams, country: "Austria" }, true],
    ["code differs", { ...matchingParams, code: "AT" }, true],
    ["missing optional param (region)", { ...matchingParams, region: undefined }, true],
    ["float-string precision handles", matchingParams, false],
  ] as const

  it.each(cases)("should return %s when %s", (_, customParams, expected) => {
    expect(needsRedirectCheck(customParams, data)).toBe(expected)
  })
})
