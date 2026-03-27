export default function DetailsSkeleton() {
  return (
    <div className="mb-10 grid grid-cols-2 sm:flex gap-3 xl:gap-4 animate-pulse">
      {["Feels Like", "Humidity", "Wind", "Precipitation" as const].map(
        (value, index) => (
          <div
            key={index}
            className="bg-[hsl(243,27%,20%)] max-w-full rounded-xl border border-white/10 flex-1
            pt-4 pl-4 h-23.5
            sm:pt-4 sm:pl-4 sm:h-25.5
            lg:pt-5 lg:pl-3.5 lg:h-28.5
            xl:pl-5"
          >
            <div className="text-white/70 text-base sm:text-lg mb-3 sm:mb-4 lg:mb-3.5 w-1/2 whitespace-nowrap">
              {value}
            </div>
            <div
              className="bg-[hsl(243,23%,30%)] rounded-md mb-2
              h-5 w-1/3
              sm:h-4 sm:rounded-sm
              md:h-6 md:w-1/2
              lg:h-5
              xl:h-6"
            ></div>
          </div>
        ),
      )}
    </div>
  );
}
