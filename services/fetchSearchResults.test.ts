import { fetchSearchResults } from "./fetchSearchResults";

describe("fetchSearchResults", () => {
  it("should fetch city with search result", async () => {
    const result = await fetchSearchResults("Minsk");

    expect(result[0].city).toBe("Minsk");
    expect(result[0].country).toBe("Belarus");
    expect(result[0].latitude).toBe(53.9);
    expect(result[0].longitude).toBe(27.56667);

    expect(result[1].city).toBe("Minsk");
    expect(result[1].country).toBe("Russia");
    expect(result[1].latitude).toBe(57.0989);
    expect(result[1].longitude).toBe(93.33372);
  });
});
