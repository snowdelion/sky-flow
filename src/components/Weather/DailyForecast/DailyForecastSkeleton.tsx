export default function DailyForecastSkeleton() {
  return (
    <>
      <h3 className="text-xl font-medium tracking-wide mb-5 text-white/70 animate-pulse">
        Daily forecast
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.25 xl:gap-3">
        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div
            key={index}
            className="bg-[hsl(243,27%,20%)] animate-pulse border border-white/10 hover:opacity-75 transition duration-75 rounded-xl
            h-37.5 w-full flex-1
            sm:h-39.5
            md:h-37.5"
          />
        ))}
      </div>
    </>
  );
}
