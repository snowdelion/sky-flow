import { redirect } from "next/navigation"
import { Header } from "@/widgets/header"
import { Search, SearchError } from "@/features/search-city"
import { validateCityParams } from "../lib/validate-city-params"
import { PageClient } from "./WeatherPageClient"

export async function WeatherPage({ searchParams }: SearchParams) {
  const params = await searchParams
  const cityData = await validateCityParams(params)

  if (cityData?.status === "redirect") redirect(cityData.url)

  return (
    <div className={cityData.status === "found" ? "min-h-dvh" : "h-dvh overflow-hidden"}>
      <Header />

      <main className="px-4 py-8 md:px-6 lg:px-8 mx-auto">
        <Search cityData={cityData} />

        {cityData.status === "found" ? (
          <PageClient cityData={cityData} />
        ) : (
          <SearchError message={cityData.city} />
        )}
      </main>
    </div>
  )
}

export async function generateMetadata({ searchParams }: SearchParams) {
  try {
    const { city, lat, lon } = await searchParams

    if (!city) return { title: "SkyFlow" }
    if (city && (!lat || !lon)) return { title: "SkyFlow - Not found" }

    return { title: `SkyFlow - ${city}` }
  } catch {
    return { title: "SkyFlow" }
  }
}

interface SearchParams {
  searchParams: Promise<{
    city?: string
    country?: string
    region?: string
    lat?: string
    lon?: string
  }>
}
