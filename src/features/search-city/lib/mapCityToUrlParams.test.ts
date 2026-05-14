import { createCityData } from "@/shared/lib/testing"
import type { CityData } from "@/shared/types"
import { mapCityToUrlParams } from "./mapCityToUrlParams"

describe("mapCityToUrlParams", () => {
  it("should create all params", () => {
    const { berlinCityData } = createCityData()
    const result = mapCityToUrlParams(berlinCityData)

    expect(result.toString()).toBe(
      "city=Berlin&region=State+of+Berlin&country=Germany&code=PPLC&lat=52.52437&lon=13.41053",
    )
  })

  it("should create only city param", () => {
    const city: CityData = { status: "not-found", city: "123" }
    const result = mapCityToUrlParams(city)

    expect(result.toString()).toBe("city=123")
  })
})
