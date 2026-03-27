export default function TodayWeatherSkeleton() {
  return (
    <div
      className="flex flex-col items-center justify-center sm:p-8 md:p-10 rounded-2xl h-70 overflow-hidden
      mb-8 bg-[hsl(243,27%,20%)]/70 border border-white/10 animate-pulse"
    >
      <div className="flex h-5 justify-center items-end mb-3 gap-3 w-3/5 sm:w-1/2">
        <div className="bg-white animate-pulse rounded-full h-3 w-3"></div>
        <div className="bg-white animate-pulse [animation-delay:0.3s] rounded-full h-3 w-3 mb-2"></div>
        <div className="bg-white animate-pulse [animation-delay:0.6s] rounded-full h-3 w-3"></div>
      </div>
      <div className="text-lg animate-pulse text-white/80">Loading...</div>
    </div>
  );
}
