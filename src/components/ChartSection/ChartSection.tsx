import { useState } from "react";

import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";

import { WeatherChart } from "./WeatherChart";

export interface ChartSectionProps {
  dailyData: WeatherDataDaily;
  hourlyData: WeatherDataHourly;
}

export function ChartSection({ dailyData, hourlyData }: ChartSectionProps) {
  const [currentTab, setCurrentTab] = useState("daily");
  const tabData = ["Daily", "Hourly"];

  return (
    <section className="flex flex-col gap-5 w-full h-150 xl:max-w-304 mx-auto bg-[hsl(243,27%,20%)]  p-4 rounded-xl border border-white/10 items-center overflow-hidden">
      {/* daily/hourly tabs */}
      <ul
        role="tablist"
        className="flex justify-between w-full items-center mt-5"
      >
        {tabData.map((tab, index) => (
          <li
            key={`${tab}-${index}`}
            role="tab"
            aria-selected={currentTab === tab.toLowerCase()}
            aria-label={`${tab} chart`}
            onClick={() => setCurrentTab(tab.toLowerCase())}
            className={`flex-1 gap-1.5 transition relative cursor-pointer hover:opacity-80 flex items-center h-full justify-center mx-auto text-xl font-bold tracking-wider rounded-xl`}
          >
            <span
              className={`
              text-sm sm:text-lg lg:text-xl whitespace-nowrap border-b-2 pb-3 px-10
               ${
                 currentTab === tab.toLowerCase()
                   ? "text-[hsl(233,100%,70%)] border-b-2 border-[hsl(233,100%,70%)]"
                   : "text-white border-white/70"
               }
            `}
            >
              {tab}
            </span>
          </li>
        ))}
      </ul>

      {/* chart */}
      <div className="w-full h-full">
        <WeatherChart
          currentTab={currentTab}
          dailyData={dailyData}
          hourlyData={hourlyData}
        />
      </div>
    </section>
  );
}
