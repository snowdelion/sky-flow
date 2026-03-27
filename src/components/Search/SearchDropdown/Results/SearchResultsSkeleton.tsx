import { useDeviceType } from "@/hooks/useDeviceType";

export function SearchResultsSkeleton() {
  const { isDesktopXl } = useDeviceType();
  const skeletonResults = isDesktopXl
    ? [0, 1, 2, 3, 4, 5, 6, 7]
    : [0, 1, 2, 3, 4];

  return (
    <div
      role="listbox"
      onMouseDown={(e) => e.preventDefault()}
      className="absolute -left-5 top-5 sm:top-6 right-0 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-10 mt-1"
    >
      <ul className="space-y-3 mt-4 mb-3 flex flex-col justify-center">
        {skeletonResults.map((index) => (
          <li
            key={index}
            className="bg-[hsl(243,23%,24%)] h-12 mx-2 sm:mx-4 lg:mx-5 animate-pulse p-1 rounded-lg border border-white/10 flex items-center justify-between"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className="flex items-center w-6 h-6 md:w-8 md:h-8">
              <div className="bg-[hsl(243,23%,30%)] ml-1 p-3 md:р-5 rounded-full" />
              <div className="bg-[hsl(243,23%,30%)] ml-3 px-10 sm:px-15 h-5 rounded-md" />
            </div>

            <div className="bg-[hsl(243,23%,30%)] mr-1 px-6 h-5 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}
