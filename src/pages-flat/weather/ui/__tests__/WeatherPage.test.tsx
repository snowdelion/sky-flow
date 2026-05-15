import { render, screen } from "@testing-library/react"
import type { CityData } from "@/shared/types"
import { validateCityParams } from "../../lib/validate-city-params"
import { generateMetadata, WeatherPage } from "../WeatherPage"

// --- 1. mocks ---
vi.mock("../../lib/utils", () => ({
  validateCityParams: vi.fn(),
}))

vi.mock("../../lib/validate-city-params", () => ({ validateCityParams: vi.fn() }))

vi.mock("@/widgets/header", () => ({
  Header: () => <header data-testid="header" />,
}))

vi.mock("@/features/search-city", () => ({
  Search: () => <div data-testid="search" />,
}))

vi.mock("../WeatherPageClient", () => ({
  PageClient: () => <div data-testid="page-client" />,
}))

// --- 2. tests ---
describe("WeatherPage component", () => {
  it("should verify city data and render content", async () => {
    const searchParams = Promise.resolve({
      city: "Warsaw",
      lat: "10",
      lon: "20",
    })
    const data = { status: "found", city: "Warsaw", lat: 10, lon: 20 }
    vi.mocked(validateCityParams).mockResolvedValue(data as CityData)

    const jsx = await WeatherPage({ searchParams })
    render(jsx)

    expect(validateCityParams).toHaveBeenCalledWith({
      city: "Warsaw",
      lat: "10",
      lon: "20",
    })
    expect(screen.getByTestId("header")).toBeInTheDocument()
    expect(screen.getByTestId("search")).toBeInTheDocument()
    expect(screen.getByTestId("page-client")).toBeInTheDocument()
  })
})

describe("generateMetadata", () => {
  it("should return city name in title", async () => {
    const cityData = { city: "Warsaw", lat: "10", lon: "20" }
    const metadata = await generateMetadata({
      searchParams: Promise.resolve(cityData),
    })

    expect(metadata.title).toBe("SkyFlow - Warsaw")
  })

  it("should return default title if no city", async () => {
    const metadata = await generateMetadata({
      searchParams: Promise.resolve({}),
    })

    expect(metadata.title).toBe("SkyFlow")
  })

  it("should return 'not found' when coords is missing", async () => {
    const metadata = await generateMetadata({
      searchParams: Promise.resolve({ city: "Unknown" }),
    })

    expect(metadata.title).toBe("SkyFlow - Not found")
  })
})
