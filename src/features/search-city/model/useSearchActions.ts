"use client"
import { usePathname, useRouter } from "next/navigation"
import { RefObject, startTransition, useCallback, useMemo } from "react"
import { useSearchHistory, useSearchStore } from "@/entities/location"
import { type CityData, isFoundCity } from "@/shared/types"
import { mapCityToUrlParams } from "../lib/mapCityToUrlParams"
import { useSearchCity } from "./useSearchCity"

export function useSearchActions() {
  const setInputValue = useSearchStore((s) => s.setInputValue)
  const setIsOpen = useSearchStore((s) => s.setIsOpen)
  const inputValue = useSearchStore((s) => s.inputValue)

  const { addCity } = useSearchHistory()
  const router = useRouter()
  const pathname = usePathname()

  const searchSelectedCity = useCallback(
    (cityData: CityData, inputRef?: RefObject<HTMLInputElement | null>) => {
      inputRef?.current?.blur()
      setIsOpen(false)
      setInputValue("")

      const params = mapCityToUrlParams(cityData)
      if (isFoundCity(cityData)) addCity(cityData)

      startTransition(() => router.push(`${pathname}?${params.toString()}`))
    },
    [addCity, pathname, router, setInputValue, setIsOpen],
  )

  const { refetch } = useSearchCity()
  const searchCityWithName = useCallback(
    async (city: string) => {
      const targetCity = city.trim().toLowerCase()
      if (!targetCity) return

      const { data: geoData } = await refetch()

      if (!geoData || geoData.results.length === 0) {
        searchSelectedCity({ status: "not-found", city: inputValue })
        return
      }

      searchSelectedCity({
        status: "found",
        city: geoData.results[0].city,
        country: geoData.results?.[0]?.country,
        region: geoData.results?.[0]?.region,
        code: geoData.results?.[0]?.code,
        lat: geoData.results[0].lat,
        lon: geoData.results[0].lon,
      })
    },
    [searchSelectedCity, inputValue, refetch],
  )

  return useMemo(
    () => ({
      searchSelectedCity,
      searchCityWithName,
    }),
    [searchSelectedCity, searchCityWithName],
  )
}
