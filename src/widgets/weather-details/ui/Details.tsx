"use client"
import { useMemo } from "react"
import type { WeatherCurrent, WeatherUnits } from "@/entities/weather"
import { DetailsSkeleton } from "./DetailsSkeleton"

export function Details({ currentData, forecastUnits, isPending }: DetailsProps) {
  const details = useMemo(() => {
    if (!currentData || !forecastUnits) return []
    return formatDetails(currentData, forecastUnits)
  }, [currentData, forecastUnits])

  return (
    <section aria-label="Details" className="mb-10">
      <h2 className="sr-only">Weather Details</h2>

      {isPending || !currentData || !forecastUnits ? (
        <DetailsSkeleton />
      ) : (
        <ul role="list" className="grid grid-cols-2 sm:grid-cols-4 gap-3 xl:gap-4">
          {details.map(({ title, value, unit }) => (
            <li
              key={title}
              role="listitem"
              aria-label={title}
              className="bg-[hsl(243,27%,20%)] flex flex-col gap-2 hover:opacity-75 transition duration-75 p-4 lg:py-5 lg:px-3.5 xl:p-5 lg:h-28.5 rounded-xl border border-white/10"
            >
              <p className="text-white/70 text-base sm:text-lg">{title}</p>

              <p
                className={`flex items-center font-light text-xl sm:text-2xl xl:text-3xl whitespace-nowrap ${unit.length > 1 ? "gap-1 sm:gap-1.5 md:gap-2" : "gap-0"}`}
              >
                <span>{value}</span>
                <span>{unit}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

const formatDetails = (data: WeatherCurrent, units: WeatherUnits) => {
  const { feelsLike, humidity, speed, precipitation } = data

  const currentToFixed = units.precipitationUnit === "mm" ? 1 : 3
  const currentPrecipUnit = units.precipitationUnit === "mm" ? "mm" : "in"

  return [
    {
      title: "Feels Like",
      value: Math.round(feelsLike),
      unit: "°",
    },
    {
      title: "Humidity",
      value: humidity.toString(),
      unit: "%",
    },
    {
      title: "Wind",
      value: Math.round(speed).toString(),
      unit: units.speedUnit,
    },
    {
      title: "Precipitation",
      value: precipitation.toFixed(precipitation === 0 ? 0 : currentToFixed).toString(),
      unit: currentPrecipUnit,
    },
  ]
}

interface DetailsProps {
  currentData?: WeatherCurrent
  forecastUnits?: WeatherUnits
  isPending: boolean
}
