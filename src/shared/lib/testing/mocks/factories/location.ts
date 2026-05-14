import type { Geo, GeoItem } from "../../../../types/geo/geo.types"

export const createGeoData = (overrides: Partial<GeoItem> = {}): Geo => {
  return {
    results: [
      ...Array(7).fill({ ...getBerlinGeo(), ...overrides }),
      { ...getUSBerlinGeo(), ...overrides },
    ],
  }
}

const getBerlinGeo = (): GeoItem => ({
  lat: 52.52437,
  lon: 13.41053,
  timezone: "Europe/Berlin",
  city: "Berlin",
  country: "Germany",
  region: "State of Berlin",
  code: "PPLC",
  id: 2950159,
})

const getUSBerlinGeo = (): GeoItem => ({
  city: "East Berlin",
  code: "PPL",
  country: "United States",
  id: 4557666,
  lat: 39.9376,
  lon: -76.97859,
  region: "Pennsylvania",
  timezone: "America/New_York",
})
