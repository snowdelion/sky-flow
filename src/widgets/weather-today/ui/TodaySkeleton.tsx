export function TodaySkeleton() {
  return (
    <div className="relative flex flex-col sm:flex-row justify-between items-center gap-2 px-6 py-2 md:px-8 h-55 animate-pulse">
      {/* name and date */}
      <div className="flex flex-1 flex-col items-center sm:items-start text-center sm:text-left gap-3">
        <div className="h-7 w-48 sm:h-8 sm:w-60 bg-white/20 rounded-lg" />
        <div className="h-5 w-32 sm:h-6 sm:w-40 bg-white/10 rounded-lg" />
      </div>

      {/* icon and temperature */}
      <div className="flex flex-1 items-center justify-center sm:justify-end gap-12 w-full sm:w-auto">
        <div className="w-14 h-14 sm:w-18 sm:h-18 bg-white/15 rounded-full" />

        <div className="flex items-center gap-1 sm:gap-3">
          <div className="h-10 w-16 sm:h-18 sm:w-20 bg-white/20 rounded-lg" />
          <div className="h-6 w-6 mb-7 sm:h-8 sm:w-8 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
