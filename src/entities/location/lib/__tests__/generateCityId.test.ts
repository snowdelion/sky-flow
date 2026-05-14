import { generateCityId } from "../generateCityId"

describe("generateCityId", () => {
  it("should generate id with only city (country)", () => {
    expect(generateCityId("Germany")).toBe("germany")
  })

  it("should generate id with city and country", () => {
    expect(generateCityId("Berlin", undefined, "Germany")).toBe("berlin-germany")
  })

  it("should generate id with city, region and country", () => {
    expect(generateCityId("Berlin", "New Hampshire", "United States")).toBe(
      "berlin-new-hampshire-united-states",
    )
  })

  it("should handle spaces correctly", () => {
    expect(generateCityId("Berlin", "New   Hampshire", "United   States")).toBe(
      "berlin-new-hampshire-united-states",
    )
  })

  it("should generate id with city and region", () => {
    expect(generateCityId("Berlin", "New Hampshire", undefined)).toBe("berlin-new-hampshire")
  })
})
