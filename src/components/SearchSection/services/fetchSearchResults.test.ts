import { createResultsMocks } from "@/testing/mocks/factories/search";

import { fetchSearchResults } from "./fetchSearchResults";

describe("fetchSearchResults", () => {
  it("should fetch city with search result", async () => {
    const [searchResults] = createResultsMocks();
    const result = await fetchSearchResults("Berlin");

    expect(result[0]).toEqual(searchResults[0]);

    expect(result.at(-1)).toEqual(searchResults.at(-1));
  });

  it("should return empty array if no results", async () => {
    const results = await fetchSearchResults("notFound123");

    expect(results).toEqual([]);
  });
});
