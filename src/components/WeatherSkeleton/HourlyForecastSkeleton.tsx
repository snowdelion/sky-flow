import Image from "next/image";

import dropdownIcon from "@/../public/icons/icon-dropdown.svg";

export default function HourlyForecastSkeleton() {
  return (
    <div
      className="lg:max-h-166 rounded-2xl border bg-[hsl(243,27%,20%)] border-white/10 sticky animate-pulse
      w-full h-full p-5
      sm:px-6 sm:py-7
      md:max-w-full
      lg:w-96"
    >
      <div className="mt-px lg:mt-0 mb-6.5 sm:mb-6.25 lg:mb-6 pr-px flex mx-1.5 gap-4 lg:gap-3 xl:gap-4 sm:flex-row justify-between items-center lg:h-10.5">
        <h3 className="text-[0.95rem] sm:text-lg md:text-xl lg:text-lg xl:text-xl font-bold tracking-wider lg:tracking-wide whitespace-nowrap text-white/50">
          Hourly forecast
        </h3>
        <button className="flex items-center justify-center gap-1 sm:gap-2 focus:outline-none bg-[hsl(243,23%,30%)] border border-white/10 hover:opacity-80 px-3 sm:px-5 py-2 rounded-lg transition-opacity">
          <span className="text-xs sm:text-base text-white/70">-</span>
          <Image
            src={dropdownIcon}
            alt="Dropdown"
            className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mt-0.5 opacity-70"
          />
        </button>
      </div>

      <div className="space-y-2.5 sm:space-y-3 lg:space-y-3.5 pr-2 max-h-136 px-1 overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[hsl(243,23%,24%)] hover:opacity-75 px-3 py-2 lg:py-2.25 rounded-lg border border-white/10 animate-pulse
                h-14.5 lg:h-15 w-full"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10"></div>
              <span className="font-medium"></span>
            </div>
            <span className="text-xl font-bold"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
