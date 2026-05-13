import dynamic from "next/dynamic"
import { ChartSkeleton } from "./ui/ChartSkeleton"

export const ChartClient = dynamic(() => import("./ui/Chart").then((mod) => mod.Chart), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})

export { ChartClient as Chart }
