export interface GeoItem {
  city: string
  lat: number
  lon: number
  id: number
  region?: string | undefined
  code?: string | undefined
  country?: string | undefined
  timezone?: string | undefined
}

export interface Geo {
  results: GeoItem[]
}
