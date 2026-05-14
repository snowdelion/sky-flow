export function ChartTabs({ tabData, currentChartTab, setCurrentChartTab }: ChartTabsProps) {
  return (
    <ul role="tablist" className="flex justify-between w-full items-center mt-5">
      {tabData.map((tab, index) => (
        <li
          key={`${tab}-${index}`}
          role="tab"
          aria-selected={currentChartTab === tab.toLowerCase()}
          aria-label={`${tab} chart`}
          onClick={() => setCurrentChartTab(tab.toLowerCase())}
          className="flex-1 gap-1.5 transition relative cursor-pointer hover:opacity-80 flex items-center h-full justify-center mx-auto text-xl font-bold tracking-wider rounded-xl"
        >
          <span
            className={`
              text-sm sm:text-lg lg:text-xl whitespace-nowrap border-b-2 pb-3 px-5 sm:px-6 md:px-10
               ${
                 currentChartTab === tab.toLowerCase()
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
  )
}

interface ChartTabsProps {
  tabData: string[]
  currentChartTab: string
  setCurrentChartTab: React.Dispatch<React.SetStateAction<string>>
}
