import { Header } from "@/widgets/header";
import { Search } from "@/features/search-city";
import { verifyAndGetCityData } from "../lib/utils";
import { PageClient } from "./WeatherPageClient";

export async function WeatherPage({ searchParams }: SearchParams) {
  const params = await searchParams;
  const cityData = await verifyAndGetCityData(params);

  return (
    <div
      className={
        cityData.status === "found" ? "min-h-dvh" : "h-dvh overflow-hidden"
      }
    >
      <Header />

      <main className="px-4 py-8 md:px-6 lg:px-8 mx-auto">
        <Search cityData={cityData} />
        <PageClient cityData={cityData} />
      </main>
    </div>
  );
}

export async function generateMetadata({ searchParams }: SearchParams) {
  try {
    const { city, lat, lon } = await searchParams;

    if (!city) return { title: "SkyFlow" };
    if (city && (!lat || !lon)) return { title: "SkyFlow - Not found" };

    return { title: `SkyFlow - ${city}` };
  } catch {
    return { title: "SkyFlow" };
  }
}

interface SearchParams {
  searchParams: Promise<{
    city?: string;
    country?: string;
    region?: string;
    lat?: string;
    lon?: string;
  }>;
}
